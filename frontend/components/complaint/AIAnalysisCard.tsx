// ─── Types ────────────────────────────────────────────────────────────────────

export interface KeyIssue {
  icon: string;
  iconColor: string;
  text: string;
}

export interface AIAnalysisCardProps {
  category: string;
  severity: string;
  sentiment: string;
  keyIssues: KeyIssue[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIAnalysisCard({
  category,
  severity,
  sentiment,
  keyIssues,
}: AIAnalysisCardProps) {
  return (
    <section className="bg-[#181826] p-6 rounded-xl border border-[#474754]/10">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#aba9b9] mb-4">
        AI Intelligence
      </h3>

      {/* Metric chips */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <MetricChip label="Category" value={category} valueColor="text-[#bd9dff]" />
        <MetricChip label="Severity"  value={severity}  valueColor="text-[#ff97b2]" />
        <MetricChip label="Sentiment" value={sentiment} valueColor="text-[#ff97b2]" />
      </div>

      {/* Key issues */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-[#aba9b9] uppercase tracking-tighter">
          Key Issues
        </p>
        <ul className="space-y-2">
          {keyIssues.map((issue, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span
                className={`material-symbols-outlined text-sm mt-0.5 ${issue.iconColor}`}
              >
                {issue.icon}
              </span>
              <span className="text-sm text-[#e9e6f7]">{issue.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Private sub-component ────────────────────────────────────────────────────

function MetricChip({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className="bg-[#1e1e2d] p-3 rounded-xl text-center border border-[#474754]/5">
      <p className="text-[10px] text-[#aba9b9] uppercase font-bold mb-1">{label}</p>
      <span className={`text-xs font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}
