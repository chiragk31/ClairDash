// ─── Types ────────────────────────────────────────────────────────────────────

export interface SLATrackerProps {
  /** 0-100 percentage elapsed */
  progressPercent: number;
  /** Human-readable time remaining, e.g. "4h 12m" */
  timeRemaining: string;
  /** Full deadline string, e.g. "Dec 15, 15:45" */
  deadline: string;
}

// ─── SVG ring constants ───────────────────────────────────────────────────────

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 251.2

// ─── Component ────────────────────────────────────────────────────────────────

export default function SLATracker({
  progressPercent,
  timeRemaining,
  deadline,
}: SLATrackerProps) {
  const offset = CIRCUMFERENCE * (1 - progressPercent / 100);

  return (
    <section className="bg-[#181826] p-6 rounded-xl border border-[#474754]/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#aba9b9]">
          SLA Compliance
        </h3>
        <span className="text-[10px] bg-[#d73357]/20 text-[#ff6e84] px-2 py-0.5 rounded-full font-bold">
          Priority Target
        </span>
      </div>

      <div className="flex items-center justify-around">
        {/* Circular progress ring */}
        <div className="relative flex items-center justify-center">
          <svg
            className="w-24 h-24 -rotate-90"
            viewBox="0 0 96 96"
            aria-label={`SLA ${progressPercent}% elapsed`}
          >
            {/* Track */}
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="transparent"
              stroke="#1e1e2d"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="transparent"
              stroke="#8a4cfc"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute text-lg font-bold text-[#e9e6f7]">
            {progressPercent}%
          </span>
        </div>

        {/* Time info */}
        <div className="space-y-1">
          <p className="text-2xl font-black text-[#e9e6f7] tracking-tighter">
            {timeRemaining}
          </p>
          <p className="text-xs text-[#aba9b9]">Until SLA breach</p>
          <p className="text-[10px] text-[#aba9b9] font-mono mt-2">
            Deadline: {deadline}
          </p>
        </div>
      </div>
    </section>
  );
}
