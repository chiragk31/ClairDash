"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DonutSlice {
  name:  string;
  value: number;
  color: string;
}

interface DonutChartComponentProps {
  data:          DonutSlice[];
  /** Label in the center hole */
  centerLabel?:  string;
  centerValue?:  string | number;
  innerRadius?:  number;
  outerRadius?:  number;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2b2a3c] border border-[#474754]/20 rounded-xl px-4 py-2 shadow-xl text-xs">
      <p className="font-bold text-[#e9e6f7]">{payload[0].name}</p>
      <p className="text-[#bd9dff]">{payload[0].value}%</p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DonutChartComponent({
  data,
  centerLabel = "Total",
  centerValue,
  innerRadius = 70,
  outerRadius = 100,
}: DonutChartComponentProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((slice, i) => (
              <Cell key={i} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center text overlay */}
      {centerValue !== undefined && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-black text-[#e9e6f7]">
            {centerValue.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#aba9b9] uppercase font-bold tracking-widest">
            {centerLabel}
          </p>
        </div>
      )}
    </div>
  );
}
