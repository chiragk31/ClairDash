import type { TopIssue, IssueSeverity } from "./analyticsData";

// ─── Severity badge config ─────────────────────────────────────────────────────

const SEV_CONFIG: Record<IssueSeverity, { dot: string; text: string }> = {
  Critical: { dot: "bg-[#ff6e84]", text: "text-[#ff6e84]" },
  High:     { dot: "bg-[#ff97b2]", text: "text-[#ff97b2]" },
  Medium:   { dot: "bg-[#bd9dff]", text: "text-[#bd9dff]" },
  Low:      { dot: "bg-emerald-400", text: "text-emerald-400" },
};

// ─── Props ─────────────────────────────────────────────────────────────────────

interface TopIssuesTableProps {
  issues: TopIssue[];
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function TopIssuesTable({ issues }: TopIssuesTableProps) {
  return (
    <section className="bg-[#181826] rounded-3xl overflow-hidden">
      <div className="px-8 pt-8 pb-4">
        <h4 className="text-lg font-bold text-[#e9e6f7]">Top Issues This Week</h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e1e2d]/50 text-[10px] uppercase font-bold tracking-widest text-[#aba9b9]">
              {["Key Issue", "Count", "Avg Severity", "Trend"].map((col) => (
                <th key={col} className="px-8 py-4">{col}</th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#474754]/10">
            {issues.map((issue) => {
              const sev      = SEV_CONFIG[issue.severity];
              const isUp     = issue.trendDir === "up";
              const trendClr = isUp ? "text-[#ff6e84]" : "text-emerald-400";
              const trendIco = isUp ? "trending_up"    : "trending_down";

              return (
                <tr key={issue.name} className="hover:bg-[#2b2a3c]/30 transition-colors">
                  <td className="px-8 py-5 text-sm font-semibold text-[#e9e6f7]">
                    {issue.name}
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-[#e9e6f7]">
                    {issue.count.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${sev.dot}`} />
                      <span className={`text-xs font-bold ${sev.text}`}>{issue.severity}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`flex items-center gap-1 text-xs font-bold ${trendClr}`}>
                      <span className="material-symbols-outlined text-sm">{trendIco}</span>
                      {issue.trendPct}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
