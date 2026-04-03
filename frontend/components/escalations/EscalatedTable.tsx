// ─── EscalatedTable ───────────────────────────────────────────────────────────
// Escalated complaints with priority, reason, assignment, and View action.

import Link from "next/link";
import type { EscalatedComplaint } from "./escalationsData";
import PriorityBadge from "./PriorityBadge";

interface EscalatedTableProps {
  complaints: EscalatedComplaint[];
}

const HEADERS = [
  "Complaint ID",
  "Customer",
  "Escalation Reason",
  "Escalated At",
  "Priority",
  { label: "Action", right: true },
] as const;

export default function EscalatedTable({ complaints }: EscalatedTableProps) {
  return (
    <section className="bg-[#181826] rounded-xl overflow-hidden shadow-2xl relative">
      {/* Pink accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fe81a4]" />

      {/* Header */}
      <div className="px-6 py-5 border-b border-[#474754]/10 flex justify-between items-center bg-[#1e1e2d]/50">
        <h2 className="text-lg font-bold text-[#e9e6f7] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ff97b2] text-xl">priority_high</span>
          Escalated Complaints
        </h2>
        <span className="px-2 py-0.5 rounded bg-[#ff97b2]/10 text-[#ff97b2] text-[10px] font-bold uppercase border border-[#ff97b2]/20">
          VIP Priority
        </span>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-[#12121e]">
            <tr>
              {HEADERS.map((h) => {
                const label = typeof h === "string" ? h : h.label;
                const right = typeof h !== "string" && h.right;
                return (
                  <th
                    key={label}
                    className={`px-6 py-4 text-xs font-bold text-[#aba9b9] uppercase tracking-wider ${right ? "text-right" : ""}`}
                  >
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#474754]/10">
            {complaints.map((c) => (
              <tr key={c.id} className="hover:bg-[#2b2a3c]/30 transition-colors">
                {/* ID */}
                <td className="px-6 py-5">
                  <span className="font-mono text-[#bd9dff] font-bold">#{c.id}</span>
                </td>

                {/* Customer */}
                <td className="px-6 py-5">
                  <div className="text-sm font-semibold text-[#e9e6f7]">{c.customerEmail}</div>
                  <div className="text-[10px] text-[#aba9b9] uppercase font-medium">
                    {c.customerOrg}
                  </div>
                </td>

                {/* Reason */}
                <td className="px-6 py-5">
                  <div className="text-sm text-[#e9e6f7] italic">"{c.escalationReason}"</div>
                  <div className="text-[10px] text-[#aba9b9] mt-0.5 max-w-[180px] truncate">
                    {c.escalationNote}
                  </div>
                </td>

                {/* Time + assignee */}
                <td className="px-6 py-5">
                  <div className="text-xs text-[#e9e6f7]">{c.escalatedAt}</div>
                  <div className="text-[10px] text-[#aba9b9]">To: {c.assignedTo}</div>
                </td>

                {/* Priority */}
                <td className="px-6 py-5">
                  <PriorityBadge priority={c.priority} />
                </td>

                {/* Action */}
                <td className="px-6 py-5 text-right">
                  <Link
                    href={`/complaints/${c.id}`}
                    id={`view-${c.id}`}
                    className="bg-[#bd9dff]/10 text-[#bd9dff] hover:bg-[#bd9dff] hover:text-[#3c0089] transition-all px-4 py-1.5 rounded-lg text-xs font-bold border border-[#bd9dff]/20 inline-block"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
