import type { HeatmapRow } from "./analyticsData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeatmapGridProps {
  rows: HeatmapRow[];
  days: readonly string[];
}

// ─── Intensity → opacity mapping ──────────────────────────────────────────────
// Values are 0–100; we map them to 4 opacity steps to match the design legend.

function intensityToOpacity(value: number): string {
  if (value >= 80) return "1";
  if (value >= 55) return "0.6";
  if (value >= 30) return "0.3";
  if (value >= 15) return "0.15";
  return "0.08";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeatmapGrid({ rows, days }: HeatmapGridProps) {
  return (
    <section className="bg-[#181826] p-8 rounded-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h4 className="text-lg font-bold text-[#e9e6f7]">Root Cause Heatmap</h4>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold text-[#aba9b9]">
          <span>Low Volume</span>
          <div className="flex gap-1">
            {["0.08", "0.3", "0.6", "1"].map((op) => (
              <div
                key={op}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: `rgba(189, 157, 255, ${op})` }}
              />
            ))}
          </div>
          <span>High Volume</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div
            className="grid mb-4"
            style={{ gridTemplateColumns: "140px repeat(7, 1fr)" }}
          >
            <div />
            {days.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] uppercase font-bold tracking-widest text-[#aba9b9]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Data rows */}
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.category}
                className="grid items-center gap-3"
                style={{ gridTemplateColumns: "140px repeat(7, 1fr)" }}
              >
                <span className="text-xs font-semibold text-[#e9e6f7]">
                  {row.category}
                </span>
                {row.values.map((val, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg cursor-help hover:ring-2 ring-[#bd9dff] transition-all"
                    style={{
                      backgroundColor: `rgba(189, 157, 255, ${intensityToOpacity(val)})`,
                    }}
                    title={`${row.category} – ${days[i]}: ${val} cases`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
