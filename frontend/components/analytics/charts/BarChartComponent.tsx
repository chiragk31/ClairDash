"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BarDataPoint {
  label: string;
  value: number;
  color: string;
}

interface BarChartComponentProps {
  data:      BarDataPoint[];
  dataKey?:  string;
  xAxisKey?: string;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2b2a3c] border border-[#474754]/20 rounded-xl px-4 py-2 shadow-xl text-xs">
      <p className="text-[#aba9b9] mb-1">{label}</p>
      <p className="font-bold" style={{ color: payload[0].fill }}>
        {payload[0].value}%
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BarChartComponent({
  data,
  dataKey  = "value",
  xAxisKey = "label",
}: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }} barCategoryGap="30%">
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: "#aba9b9", fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#aba9b9", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<BarTooltip />} cursor={{ fill: "#2b2a3c" }} />
        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
