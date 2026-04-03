"use client";

import Image from "next/image";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TopbarProps {
  /** Current user's display name */
  userName?: string;
  /** Current user's role / title */
  userRole?: string;
  /** URL for the user's avatar image */
  avatarUrl?: string;
  /** Number of unread notifications — 0 hides the badge */
  notificationCount?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Topbar({
  userName = "Alex Mercer",
  userRole = "Senior Agent",
  avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBRouO4HI-X-ESL6e5KF_NNt_UBC-3hVAbFve3LUVL03UDf_Urvcx_gA0YtthobgRfGy894Jw7inv1HFFMHoOVxG4epX1loby6tlxUcdoDzh2SjG2rFQqccj3v3UUe2OT2hhAxDY7eCWm60CV1knBGhrRSgVcvGBgfe2odcke_jf79ba62_io47zYET2kbu-8qcxKEvt78FWG5pBpMIJOFReXT4Ov0QJ1LC7w858NQa26vKp1exeTJQ3g6O-Rp8BkUry0T5lLN9A1KJ",
  notificationCount = 3,
}: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="w-full sticky top-0 z-40 bg-[#0d0d18]/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 border-b border-[#474754]/5">

      {/* Global Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#aba9b9]">
            <span className="material-symbols-outlined text-sm">search</span>
          </span>
          <input
            id="global-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#12121e] border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-[#bd9dff]/50 focus:outline-none transition-all placeholder:text-[#aba9b9]/50 text-[#e9e6f7]"
            placeholder="Global search..."
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-6">

        {/* Notifications */}
        <button
          id="notifications-btn"
          aria-label="View notifications"
          className="relative text-[#aba9b9] hover:text-violet-400 transition-colors"
        >
          <span className="material-symbols-outlined">notifications</span>
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#d73357] rounded-full ring-2 ring-[#0d0d18]" />
          )}
        </button>

        <div className="h-8 w-px bg-[#474754]/20" />

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#e9e6f7]">{userName}</p>
            <p className="text-[10px] text-[#aba9b9] font-medium">{userRole}</p>
          </div>
          <Image
            src={avatarUrl}
            alt={`${userName} avatar`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-[#8a4cfc]/20 group-hover:border-[#bd9dff] transition-all object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
}
