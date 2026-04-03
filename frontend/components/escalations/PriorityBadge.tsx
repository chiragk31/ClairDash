// ─── PriorityBadge ────────────────────────────────────────────────────────────

import type { Priority } from "./escalationsData";

const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: "bg-[#ff97b2]/15 text-[#ff97b2] border border-[#ff97b2]/30",
  High:     "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  Medium:   "bg-[#bd9dff]/15 text-[#bd9dff] border border-[#bd9dff]/30",
  Low:      "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
};

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}
