"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, defs, linearGradient, stop, Area, AreaChart,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LineChartPoint {
  date:  string;
  count: number;
  /** Additional numeric series can be added as needed */
  [key: string]: string | number;
}

interface LineChartComponentProps {
  data:       LineChartPoint[];
  dataKey?:   string;   // defaults to "count"
  xAxisKey?:  string;   // defaults to "date"
  color?:     string;   // defaults to #8a4cfc
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2b2a3c] border border-[#474754]/20 rounded-xl px-4 py-2 shadow-xl text-xs">
      <p className="text-[#aba9b9] mb-1">{label}</p>
      <p className="font-bold text-[#bd9dff]">{payload[0].value} tickets</p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LineChartComponent({
  data,
  dataKey  = "count",
  xAxisKey = "date",
  color    = "#8a4cfc",
}: LineChartComponentProps) {
  const gradientId = "lineGradient";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0}   />
          </linearGradient>
        </defs>

        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: "#aba9b9", fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#aba9b9", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#474754", strokeWidth: 1 }} />

        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
