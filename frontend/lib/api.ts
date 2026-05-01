const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Valid status values matching ComplaintTable statusConfig keys exactly
type TicketStatus = "open" | "in_progress" | "resolved" | "escalated";

function normalizeStatus(status: string | undefined): TicketStatus {
    switch (status) {
        case "in-progress":
        case "in_progress": return "in_progress";
        case "resolved": return "resolved";
        case "escalated": return "escalated";
        case "open": return "open";
        default: return "open"; // safe fallback — never crashes
    }
}

// Maps API response to your Ticket type
export function mapComplaint(c: any) {
    const now = new Date();
    const deadline = c.sla_deadline ? new Date(c.sla_deadline) : null;

    let slaDeadline: string = "completed";
    let slaProgress = 100;

    if (c.status !== "resolved" && deadline) {
        const created = new Date(c.created_at);
        const total = deadline.getTime() - created.getTime();
        const elapsed = now.getTime() - created.getTime();
        slaProgress = Math.min(100, Math.round((elapsed / total) * 100));

        const diffMs = deadline.getTime() - now.getTime();
        if (diffMs <= 0) {
            slaDeadline = "BREACHED";
        } else {
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            slaDeadline = diffHrs > 0 ? `${diffHrs}h ${diffMins}m left` : `${diffMins}m left`;
        }
    }

    return {
        id: c.id ?? "",
        senderEmail: c.email_id ?? "",
        senderTier: c.channel ?? "email",
        subject: c.subject ?? "",
        category: c.category ?? "general",
        severity: c.severity ?? "medium",
        sentiment: c.sentiment ?? "neutral",
        status: normalizeStatus(c.status),  // safe — never undefined
        slaDeadline,
        slaProgress,
        assignee: c.assigned_to ? { name: c.assigned_to } : undefined,
    };
}

export const api = {

    getComplaints: async (filters?: {
        status?: string;
        category?: string;
        severity?: string;
        sentiment?: string;
        search?: string;
        page?: number;
    }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append("status", filters.status);
        if (filters?.category) params.append("category", filters.category);
        if (filters?.severity) params.append("severity", filters.severity);
        if (filters?.sentiment) params.append("sentiment", filters.sentiment);
        if (filters?.search) params.append("search", filters.search);
        if (filters?.page) params.append("page", filters.page.toString());

        const res = await fetch(`${BASE_URL}/complaints/?${params}`);
        if (!res.ok) throw new Error("Failed to fetch complaints");
        return res.json();
    },

    getComplaintById: async (id: string) => {
        const res = await fetch(`${BASE_URL}/complaints/${id}`);
        if (!res.ok) throw new Error("Complaint not found");
        return res.json();
    },

    getStats: async () => {
        const res = await fetch(`${BASE_URL}/complaints/stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
    },

    getAnalytics: async () => {
        const res = await fetch(`${BASE_URL}/complaints/analytics/summary`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
    },

    updateComplaint: async (id: string, updates: Record<string, string>) => {
        const res = await fetch(`${BASE_URL}/complaints/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        return res.json();
    },
};