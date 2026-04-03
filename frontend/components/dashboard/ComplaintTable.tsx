import Image from "next/image";
import Link  from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TicketSeverity = "critical" | "high" | "medium" | "low";
export type TicketSentiment = "angry" | "negative" | "neutral" | "positive";
export type TicketStatus = "open" | "in_progress" | "resolved" | "escalated";

export interface Assignee {
  /** Display name or initials (used as fallback) */
  name: string;
  /** Avatar image URL — if absent, initials are shown */
  avatarUrl?: string;
}

export interface Ticket {
  id: string;
  senderEmail: string;
  senderTier: string;
  subject: string;
  category: string;
  severity: TicketSeverity;
  sentiment: TicketSentiment;
  status: TicketStatus;
  slaDeadline: string | "completed";
  slaProgress: number; // 0–100
  assignee?: Assignee;
}

// ─── Badge Configs ────────────────────────────────────────────────────────────

const severityConfig: Record<TicketSeverity, { label: string; classes: string }> = {
  critical: { label: "Critical", classes: "bg-[#ff6e84]/10 text-[#ff6e84]" },
  high:     { label: "High",     classes: "bg-orange-500/10 text-orange-400" },
  medium:   { label: "Medium",   classes: "bg-yellow-500/10 text-yellow-400" },
  low:      { label: "Low",      classes: "bg-emerald-500/10 text-emerald-400" },
};

const sentimentConfig: Record<
  TicketSentiment,
  { emoji: string; label: string; classes: string }
> = {
  angry:    { emoji: "😡", label: "Angry",    classes: "bg-[#d73357]/10 text-[#f17799]" },
  negative: { emoji: "☹️", label: "Negative", classes: "bg-orange-400/10 text-orange-400" },
  neutral:  { emoji: "😐", label: "Neutral",  classes: "bg-[#474754]/20 text-[#aba9b9]" },
  positive: { emoji: "😊", label: "Positive", classes: "bg-emerald-400/10 text-emerald-400" },
};

const statusConfig: Record<
  TicketStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  open:        { label: "Open",        dotColor: "bg-blue-400",    textColor: "text-blue-400" },
  in_progress: { label: "In Progress", dotColor: "bg-orange-400",  textColor: "text-orange-400" },
  resolved:    { label: "Resolved",    dotColor: "bg-emerald-400", textColor: "text-emerald-400" },
  escalated:   { label: "Escalated",   dotColor: "bg-[#ff6e84]",   textColor: "text-[#ff6e84]" },
};

const slaProgressBarColor: Record<string, string> = {
  critical: "bg-[#ff6e84]",
  high:     "bg-orange-400",
  medium:   "bg-yellow-400",
  low:      "bg-emerald-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ComplaintTableProps {
  tickets: Ticket[];
}

export default function ComplaintTable({ tickets }: ComplaintTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#12121e]/30 text-[10px] uppercase tracking-widest text-[#aba9b9] font-black">
            {["ID", "Sender", "Subject", "Category", "Severity", "Sentiment", "Status", "SLA Deadline", "Assigned", "Actions"].map(
              (col) => (
                <th
                  key={col}
                  className={`px-6 py-5 ${col === "Severity" || col === "Sentiment" ? "text-center" : ""} ${col === "Actions" ? "text-right" : ""}`}
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#474754]/5">
          {tickets.map((ticket) => {
            const severity  = severityConfig[ticket.severity];
            const sentiment = sentimentConfig[ticket.sentiment];
            const status    = statusConfig[ticket.status];
            const slaBar    = slaProgressBarColor[ticket.severity] ?? "bg-[#bd9dff]";
            const isResolved = ticket.status === "resolved";

            return (
              <tr
                key={ticket.id}
                className={`hover:bg-[#242434]/30 transition-colors group ${isResolved ? "opacity-60 grayscale hover:opacity-100 hover:grayscale-0" : ""}`}
              >
                {/* ID */}
                <td className="px-6 py-4 text-xs font-mono text-[#bd9dff]">
                  {ticket.id}
                </td>

                {/* Sender */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#e9e6f7]">
                      {ticket.senderEmail}
                    </span>
                    <span className="text-[10px] text-[#aba9b9]">
                      {ticket.senderTier}
                    </span>
                  </div>
                </td>

                {/* Subject */}
                <td className="px-6 py-4 max-w-xs">
                  <span className="text-sm font-medium text-[#e9e6f7] block truncate">
                    {ticket.subject}
                  </span>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#242434] text-[#e9e6f7] uppercase tracking-tight">
                    {ticket.category}
                  </span>
                </td>

                {/* Severity */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${severity.classes}`}
                  >
                    {severity.label}
                  </span>
                </td>

                {/* Sentiment */}
                <td className="px-6 py-4 text-center">
                  <div
                    className={`inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded-full ${sentiment.classes}`}
                  >
                    <span className="text-xs">{sentiment.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      {sentiment.label}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                    <span
                      className={`text-[11px] font-bold uppercase tracking-tighter ${status.textColor}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </td>

                {/* SLA Deadline */}
                <td className="px-6 py-4">
                  {ticket.slaDeadline === "completed" ? (
                    <span className="text-[11px] font-bold text-emerald-400">
                      Completed
                    </span>
                  ) : (
                    <div className="flex flex-col">
                      <span
                        className={`text-[11px] font-black ${
                          ticket.severity === "critical"
                            ? "text-[#ff6e84]"
                            : "text-[#e9e6f7]"
                        }`}
                      >
                        {ticket.slaDeadline}
                      </span>
                      <div className="w-16 h-1 bg-[#12121e] rounded-full mt-1 overflow-hidden">
                        <div
                          className={`${slaBar} h-full`}
                          style={{ width: `${ticket.slaProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </td>

                {/* Assignee */}
                <td className="px-6 py-4">
                  {ticket.assignee?.avatarUrl ? (
                    <Image
                      src={ticket.assignee.avatarUrl}
                      alt={ticket.assignee.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full grayscale hover:grayscale-0 transition-all cursor-help border border-[#474754]/20"
                      title={ticket.assignee.name}
                    />
                  ) : ticket.assignee ? (
                    <div
                      className="w-6 h-6 rounded-full border border-dashed border-[#474754] flex items-center justify-center text-[10px] text-[#aba9b9]"
                      title={ticket.assignee.name}
                    >
                      {ticket.assignee.name.slice(0, 2).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-dashed border-[#474754] flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-[#aba9b9]">
                        person
                      </span>
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <Link
                    id={`view-ticket-${ticket.id.replace("#", "")}`}
                    href={`/complaints/${ticket.id.replace("#", "")}`}
                    className={`font-bold text-[10px] px-4 py-2 rounded-lg transition-all uppercase tracking-widest inline-block ${
                      isResolved
                        ? "bg-[#2b2a3c] text-[#e9e6f7] hover:bg-[#242434]"
                        : "bg-[#bd9dff]/10 text-[#bd9dff] hover:bg-[#bd9dff] hover:text-[#3c0089]"
                    }`}
                  >
                    {isResolved ? "History" : "View"}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
