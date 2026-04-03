// ─── Analytics Summary Stat Card ─────────────────────────────────────────────

interface AnalyticsStatCardProps {
  icon:         string;
  iconColor:    string;
  glowColor:    string;
  label:        string;
  value:        string | number;
  unit?:        string;
  trend?:       number | null;
  trendDir?:    "up" | "down";
  /** Optional SVG ring to render in place of trend (for SLA) */
  ringPercent?: number;
}

export default function AnalyticsStatCard({
  icon,
  iconColor,
  glowColor,
  label,
  value,
  unit,
  trend,
  trendDir,
  ringPercent,
}: AnalyticsStatCardProps) {
  const trendColor =
    trendDir === "down" ? "text-emerald-400" : "text-emerald-400"; // both green in the design
  const trendIcon  = trendDir === "down" ? "trending_down" : "trending_up";

  // SVG ring constants
  const R = 28;
  const CIRC = 2 * Math.PI * R;
  const offset = ringPercent !== undefined ? CIRC * (1 - ringPercent / 100) : 0;

  return (
    <div className="bg-[#181826] p-6 rounded-2xl relative overflow-hidden group">
      {/* Glow blob */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 blur-2xl transition-opacity"
        style={{ backgroundColor: glowColor, opacity: 0.05 }}
      />

      <p className="text-[#aba9b9] text-sm font-medium mb-4 flex items-center gap-2">
        <span className={`material-symbols-outlined text-sm ${iconColor}`}>{icon}</span>
        {label}
      </p>

      <div className="flex items-end justify-between">
        <h3 className="text-4xl font-black tracking-tight text-[#e9e6f7]">
          {value}
          {unit && <span className="text-xl text-[#aba9b9] ml-1">{unit}</span>}
        </h3>

        {/* Trend badge */}
        {trend !== null && trend !== undefined && !ringPercent && (
          <div className={`text-sm font-bold flex items-center ${trendColor}`}>
            <span className="material-symbols-outlined text-sm mr-1">{trendIcon}</span>
            {Math.abs(trend)}{trendDir === "down" ? "%" : ""}
          </div>
        )}

        {/* SVG ring (SLA card) */}
        {ringPercent !== undefined && (
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r={R} fill="transparent" stroke="#1e1e2d" strokeWidth="6" />
              <circle
                cx="32" cy="32" r={R}
                fill="transparent"
                stroke="#bd9dff"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                className="transition-all duration-1000"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
