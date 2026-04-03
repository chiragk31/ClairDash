// ─── Escalation Mock Data ─────────────────────────────────────────────────────
// TODO: Replace each export with an API fetch / server action when backend is ready.

export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Category = "Technical" | "Billing" | "Delivery" | "Product Quality" | "Other";

// ── SLA Breached ──────────────────────────────────────────────────────────────
export interface BreachedComplaint {
  id: string;
  customerEmail: string;
  customerOrg: string;
  subject: string;
  category: Category;
  overdueBy: string;
  assignedTo: string;
}

export const breachedComplaints: BreachedComplaint[] = [
  {
    id: "CD-9281",
    customerEmail: "sarah.j@techcorp.io",
    customerOrg: "TechCorp Enterprise",
    subject: "Critical system outage during migration",
    category: "Technical",
    overdueBy: "2.5h overdue",
    assignedTo: "Alex Rivera",
  },
  {
    id: "CD-9260",
    customerEmail: "linda.k@globalbank.com",
    customerOrg: "Global Bank Ltd",
    subject: "Payment gateway unresponsive since yesterday",
    category: "Billing",
    overdueBy: "1.2h overdue",
    assignedTo: "Priya Sharma",
  },
  {
    id: "CD-9244",
    customerEmail: "ops@logistixco.io",
    customerOrg: "LogistiX Co.",
    subject: "Shipment tracking API returning 503",
    category: "Technical",
    overdueBy: "45m overdue",
    assignedTo: "Unassigned",
  },
];

// ── Escalated Complaints ───────────────────────────────────────────────────────
export interface EscalatedComplaint {
  id: string;
  customerEmail: string;
  customerOrg: string;
  escalationReason: string;
  escalationNote: string;
  escalatedAt: string;
  assignedTo: string;
  priority: Priority;
}

export const escalatedComplaints: EscalatedComplaint[] = [
  {
    id: "CD-9275",
    customerEmail: "mike.ross@pearson.com",
    customerOrg: "Pearson Hardman",
    escalationReason: "VIP Customer",
    escalationNote: "Duplicate billing charges for Q4 invoices",
    escalatedAt: "Dec 15, 11:45 AM",
    assignedTo: "Marcus Vane",
    priority: "Critical",
  },
  {
    id: "CD-9268",
    customerEmail: "donna.paulsen@specter.com",
    customerOrg: "Specter & Litt",
    escalationReason: "Regulatory",
    escalationNote: "GDPR data export request overdue by 10 days",
    escalatedAt: "Dec 14, 09:30 AM",
    assignedTo: "Alex Rivera",
    priority: "High",
  },
  {
    id: "CD-9251",
    customerEmail: "harvey.s@specter.com",
    customerOrg: "Specter & Litt",
    escalationReason: "Customer Threat",
    escalationNote: "Customer threatening legal action over service outage",
    escalatedAt: "Dec 13, 02:15 PM",
    assignedTo: "Team Lead",
    priority: "Critical",
  },
];

// ── Quick Escalate Form Options ────────────────────────────────────────────────
export const ESCALATION_REASONS = [
  "SLA Breach",
  "Customer Threat",
  "Regulatory",
  "VIP Customer",
] as const;

export const PRIORITY_OPTIONS: Priority[] = ["Low", "Medium", "High", "Critical"];

export const ASSIGNEE_OPTIONS = ["Team Lead", "Manager", "Director"] as const;

// ── Meta Cards ─────────────────────────────────────────────────────────────────
export const META_STATS = {
  avgResolution: { value: "4h 12m", trend: "+14%", trendDir: "up" as const },
  vipActiveCases: { value: 12 },
};
