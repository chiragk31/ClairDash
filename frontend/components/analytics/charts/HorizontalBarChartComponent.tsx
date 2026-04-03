// ─── Horizontal progress-bar sentiment display ────────────────────────────────
// Not using Recharts here — the design calls for custom labelled bars with
// emojis, which are faster and cleaner as CSS than as SVG chart bars.

export interface HorizontalBarItem {
  label: string;
  emoji: string;
  value: number;   // 0-100
  color: string;
}

interface HorizontalBarChartComponentProps {
  data: HorizontalBarItem[];
}

export default function HorizontalBarChartComponent({
  data,
}: HorizontalBarChartComponentProps) {
  return (
    <div className="space-y-6 h-full flex flex-col justify-center">
      {data.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-[#e9e6f7]">
            <span className="flex items-center gap-2">
              {item.label}
              <span>{item.emoji}</span>
            </span>
            <span className="font-bold">{item.value}%</span>
          </div>
          <div className="h-2 w-full bg-[#1e1e2d] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${item.value}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
