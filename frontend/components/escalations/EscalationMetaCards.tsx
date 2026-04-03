// ─── EscalationMetaCards ──────────────────────────────────────────────────────
// Two supplemental stat cards shown below the Quick Escalate form.
// TODO: Fetch resolution time and VIP count from /api/meta/escalations

import type { META_STATS } from "./escalationsData";

type MetaStats = typeof META_STATS;

interface EscalationMetaCardsProps {
  stats: MetaStats;
}

export default function EscalationMetaCards({ stats }: EscalationMetaCardsProps) {
  return (
    <div className="mt-6 space-y-4">
      {/* Average Resolution */}
      <div className="p-4 rounded-xl bg-[#12121e] border border-[#474754]/10">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-[#e2e0fc] text-sm">timelapse</span>
          <span className="text-xs font-bold text-[#d4d2ed] uppercase tracking-tight">
            Average Resolution
          </span>
        </div>
        <div className="text-2xl font-black text-[#e9e6f7]">{stats.avgResolution.value}</div>
        <div className="text-[10px] text-[#aba9b9] mt-1 flex items-center gap-1">
          <span className="text-[#ff6e84]">{stats.avgResolution.trend}</span>
          <span>vs last week</span>
        </div>
      </div>

      {/* VIP Active Cases */}
      <div className="p-4 rounded-xl bg-[#12121e] border border-[#474754]/10">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="material-symbols-outlined text-[#bd9dff] text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            stars
          </span>
          <span className="text-xs font-bold text-[#b28cff] uppercase tracking-tight">
            VIP Active Cases
          </span>
        </div>
        <div className="text-2xl font-black text-[#e9e6f7]">{stats.vipActiveCases.value}</div>

        {/* Avatar stack placeholder */}
        <div className="flex mt-2 -space-x-2">
          {["V", "M", "P"].map((initials, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 border-[#0d0d18] bg-[#2b2a3c] flex items-center justify-center text-[8px] font-bold text-[#bd9dff] shrink-0"
            >
              {initials}
            </div>
          ))}
          <div className="w-6 h-6 rounded-full border-2 border-[#0d0d18] bg-[#2b2a3c] flex items-center justify-center text-[8px] font-bold text-[#aba9b9]">
            +{stats.vipActiveCases.value - 3}
          </div>
        </div>
      </div>
    </div>
  );
}
