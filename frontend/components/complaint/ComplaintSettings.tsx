"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatusOption = "Open" | "Pending" | "Resolved";
export type ChannelType = "Email" | "Chat" | "Phone" | "API";

export interface Agent {
  id: string;
  name: string;
}

export interface ComplaintSettingsProps {
  currentStatus: StatusOption;
  agents: Agent[];
  currentAgentId: string;
  channel: ChannelType;
  onStatusChange?: (status: StatusOption) => void;
  onAgentChange?: (agentId: string) => void;
  onEscalate?: () => void;
}

// ─── Channel icon map ─────────────────────────────────────────────────────────

const CHANNEL_ICONS: Record<ChannelType, string> = {
  Email: "alternate_email",
  Chat:  "chat",
  Phone: "phone",
  API:   "api",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ComplaintSettings({
  currentStatus,
  agents,
  currentAgentId,
  channel,
  onStatusChange,
  onAgentChange,
  onEscalate,
}: ComplaintSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Settings card */}
      <section className="bg-[#181826] p-6 rounded-xl border border-[#474754]/10 space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#aba9b9]">
          Settings &amp; Ownership
        </h3>

        {/* Status */}
        <div>
          <label
            htmlFor="select-status"
            className="block text-[10px] font-bold text-[#aba9b9] uppercase mb-1.5"
          >
            Status
          </label>
          <div className="relative">
            <select
              id="select-status"
              defaultValue={currentStatus}
              onChange={(e) => onStatusChange?.(e.target.value as StatusOption)}
              className="w-full bg-[#12121e] border border-[#474754]/20 rounded-lg text-sm text-[#e9e6f7] py-2 px-3 appearance-none focus:ring-1 focus:ring-[#bd9dff] focus:outline-none"
            >
              {(["Open", "Pending", "Resolved"] as StatusOption[]).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-[#aba9b9]">
              expand_more
            </span>
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <label
            htmlFor="select-agent"
            className="block text-[10px] font-bold text-[#aba9b9] uppercase mb-1.5"
          >
            Assigned To
          </label>
          <div className="relative">
            <select
              id="select-agent"
              defaultValue={currentAgentId}
              onChange={(e) => onAgentChange?.(e.target.value)}
              className="w-full bg-[#12121e] border border-[#474754]/20 rounded-lg text-sm text-[#e9e6f7] py-2 px-3 appearance-none focus:ring-1 focus:ring-[#bd9dff] focus:outline-none"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-[#aba9b9]">
              expand_more
            </span>
          </div>
        </div>

        {/* Channel (read-only) */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs font-bold text-[#aba9b9] uppercase">Channel</span>
          <div className="flex items-center space-x-2 text-[#e9e6f7]">
            <span className="material-symbols-outlined text-sm">
              {CHANNEL_ICONS[channel]}
            </span>
            <span className="text-sm font-medium">{channel}</span>
          </div>
        </div>
      </section>

      {/* Escalate button */}
      <button
        id="escalate-btn"
        onClick={onEscalate}
        className="w-full py-4 bg-[#a70138]/20 hover:bg-[#a70138]/40 text-[#ff6e84] font-bold rounded-xl border border-[#ff6e84]/30 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
      >
        <span className="material-symbols-outlined">warning</span>
        <span>Escalate to Billing Lead</span>
      </button>
    </div>
  );
}
