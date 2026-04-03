// ─── Types ────────────────────────────────────────────────────────────────────

export interface OriginalMessageProps {
  message: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OriginalMessage({ message }: OriginalMessageProps) {
  return (
    <section className="bg-[#12121e] p-6 rounded-xl border border-[#474754]/10 relative overflow-hidden">
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[#bd9dff]/40 rounded-l-xl" />

      <h3 className="text-xs font-bold uppercase tracking-widest text-[#aba9b9] mb-4">
        Original Message
      </h3>

      <p className="text-[#e9e6f7] leading-relaxed italic">&ldquo;{message}&rdquo;</p>
    </section>
  );
}
