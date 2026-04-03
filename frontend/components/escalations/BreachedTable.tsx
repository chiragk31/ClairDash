// ─── BreachedTable ────────────────────────────────────────────────────────────
// Displays SLA-breached complaints. Resolve action fires an injectable callback.

import type { BreachedComplaint } from "./escalationsData";
import CategoryBadge from "./CategoryBadge";

interface BreachedTableProps {
  complaints: BreachedComplaint[];
  onResolve?: (id: string) => void;
}

const HEADERS = [
  "Complaint ID",
  "Customer",
  "Subject",
  "Category",
  "Breached By",
  { label: "Action", right: true },
] as const;

export default function BreachedTable({ complaints, onResolve }: BreachedTableProps) {
  return (
    <section className="bg-[#181826] rounded-xl overflow-hidden shadow-2xl relative">
      {/* Red accent bar on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff6e84]" />

      {/* Section header */}
      <div className="px-6 py-5 border-b border-[#474754]/10 flex justify-between items-center bg-[#1e1e2d]/50">
        <h2 className="text-lg font-bold text-[#e9e6f7] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ff6e84] text-xl">gavel</span>
          SLA Breached
        </h2>
        <span className="text-xs font-bold text-[#aba9b9] uppercase tracking-widest">
          Urgent Resolution Needed
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
              <tr key={c.id} className="hover:bg-[#2b2a3c]/30 transition-colors group">
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

                {/* Subject */}
                <td className="px-6 py-5">
                  <div className="text-sm text-[#e9e6f7] line-clamp-1 max-w-[200px]">
                    {c.subject}
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-5">
                  <CategoryBadge category={c.category} />
                </td>

                {/* Overdue */}
                <td className="px-6 py-5">
                  <span className="text-[#ff6e84] font-bold text-sm">{c.overdueBy}</span>
                  <div className="text-[10px] text-[#aba9b9] mt-0.5">
                    Assigned: {c.assignedTo}
                  </div>
                </td>

                {/* Action */}
                <td className="px-6 py-5 text-right">
                  <button
                    id={`resolve-${c.id}`}
                    onClick={() => onResolve?.(c.id)}
                    className="bg-[#ff6e84]/10 text-[#ff6e84] hover:bg-[#ff6e84] hover:text-[#490013] transition-all px-4 py-1.5 rounded-lg text-xs font-bold border border-[#ff6e84]/20"
                  >
                    Resolve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
