// ─── EscalationBanner ─────────────────────────────────────────────────────────
// Full-width alert shown when SLA breaches exceed zero.

interface EscalationBannerProps {
  breachCount: number;
}

export default function EscalationBanner({ breachCount }: EscalationBannerProps) {
  if (breachCount === 0) return null;

  return (
    <div className="bg-[#a70138]/20 border-b border-[#a70138]/30 px-6 py-4 flex items-center gap-4">
      <span
        className="material-symbols-outlined text-[#ff6e84]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        warning
      </span>
      <p className="text-[#e9e6f7] font-medium text-sm tracking-wide uppercase">
        {breachCount} complaint{breachCount !== 1 ? "s" : ""} have breached SLA — immediate action
        required
      </p>
    </div>
  );
}
