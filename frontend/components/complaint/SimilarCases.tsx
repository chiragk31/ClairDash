import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SimilarCase {
  id: string;
  ticketId: string;
  summary: string;
  matchPercent: number;
  href?: string;
}

export interface SimilarCasesProps {
  cases: SimilarCase[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SimilarCases({ cases }: SimilarCasesProps) {
  return (
    <section className="bg-[#181826] p-6 rounded-xl border border-[#474754]/10">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#aba9b9] mb-4">
        Similar Cases
      </h3>

      <div className="space-y-3">
        {cases.map((c) => (
          <Link
            key={c.id}
            href={c.href ?? `/complaints/${c.id}`}
            className="group block bg-[#1e1e2d] p-3 rounded-xl border border-[#474754]/5 hover:border-[#bd9dff]/30 transition-all"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-mono text-[#e9e6f7]">{c.ticketId}</span>
              <span className="text-[10px] font-bold text-[#bd9dff] px-1.5 py-0.5 bg-[#bd9dff]/10 rounded">
                {c.matchPercent}% Match
              </span>
            </div>
            <p className="text-xs text-[#aba9b9] line-clamp-1">{c.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
