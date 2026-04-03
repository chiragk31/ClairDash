"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

// ─── Navigation Config ────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",   href: "/",             icon: "dashboard" },
  { label: "Complaints",  href: "/complaints",   icon: "forum" },
  { label: "Analytics",   href: "/analytics",    icon: "analytics" },
  { label: "Escalations", href: "/escalations",  icon: "priority_high" },
  { label: "Settings",    href: "/settings",     icon: "settings" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-[#0d0d18] z-50 flex flex-col py-8 border-r border-[#474754]/10 shadow-2xl shadow-black/50">

      {/* Brand */}
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold text-[#e9e6f7] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8a4cfc] to-[#bd9dff] flex items-center justify-center text-[#3c0089] shrink-0">
            <span className="material-symbols-outlined material-symbols-filled text-lg">
              shield_person
            </span>
          </div>
          ClairDash
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-[#aba9b9] mt-2 font-bold opacity-50">
          Customer Ops
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          // Root "/" must be an exact match; all other routes use startsWith
          // so that /complaints/[id] also highlights the Complaints link.
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl",
                isActive
                  ? "text-violet-400 border-r-2 border-violet-500 bg-gradient-to-r from-violet-500/10 to-transparent"
                  : "text-[#aba9b9] hover:text-[#e9e6f7] hover:bg-[#181826]",
              ].join(" ")}
            >
              <span
                className={`material-symbols-outlined ${isActive ? "material-symbols-filled" : ""}`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="px-6 mt-auto">
        <div className="p-4 rounded-2xl bg-[#12121e] border border-[#474754]/10">
          <p className="text-xs text-[#aba9b9]">System Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">
              All Systems Go
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
