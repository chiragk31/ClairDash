"use client";

// ─── Escalations Page ─────────────────────────────────────────────────────────
// Route: /escalations
// Layout (Sidebar + Navbar) handled by app/(dashboard)/layout.tsx — not included here.
// TODO: Replace mock data imports with server-side fetch() calls when API is ready.

import { useState } from "react";

import EscalationBanner    from "@/components/escalations/EscalationBanner";
import BreachedTable       from "@/components/escalations/BreachedTable";
import EscalatedTable      from "@/components/escalations/EscalatedTable";
import QuickEscalateForm   from "@/components/escalations/QuickEscalateForm";
import EscalationMetaCards from "@/components/escalations/EscalationMetaCards";

import {
  breachedComplaints,
  escalatedComplaints,
  META_STATS,
} from "@/components/escalations/escalationsData";
import type { EscalateFormValues } from "@/components/escalations/QuickEscalateForm";

export default function EscalationsPage() {
  // Local state — in production these would be server-fetched and mutated via Server Actions
  const [breached, setBreached] = useState(breachedComplaints);

  // ── Handlers ── (replace with Server Actions / API calls)
  function handleResolve(id: string) {
    // TODO: await resolveComplaint(id);
    setBreached((prev) => prev.filter((c) => c.id !== id));
  }

  function handleEscalateSubmit(values: EscalateFormValues) {
    // TODO: await createEscalation(values);
    console.log("Escalate form submitted:", values);
  }

  return (
    <>
      {/* ── Alert Banner (outside main padding) */}
      <EscalationBanner breachCount={breached.length} />

      <main className="p-8 max-w-[1600px] mx-auto w-full">
        {/* ── Page Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-[#e9e6f7] tracking-tight">
              Escalations
            </h1>
            {breached.length > 0 && (
              <span className="bg-[#ff6e84] px-2.5 py-0.5 rounded-full text-[#490013] font-bold text-sm">
                {breached.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              id="export-report-btn"
              className="bg-[#242434] text-[#e9e6f7] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#2b2a3c] transition-all"
            >
              Export Report
            </button>
            <button
              id="audit-trail-btn"
              className="bg-gradient-to-br from-[#8a4cfc] to-[#bd9dff] text-[#2e006c] px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-[#bd9dff]/20"
            >
              Audit Trail
            </button>
          </div>
        </div>

        {/* ── Bento: Left column (tables) + Right column (form) ──────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left — 75% */}
          <div className="lg:w-3/4 flex flex-col gap-8">
            <BreachedTable
              complaints={breached}
              onResolve={handleResolve}
            />
            <EscalatedTable complaints={escalatedComplaints} />
          </div>

          {/* Right — 25% */}
          <aside className="lg:w-1/4">
            <QuickEscalateForm onSubmit={handleEscalateSubmit} />
            <EscalationMetaCards stats={META_STATS} />
          </aside>

        </div>
      </main>
    </>
  );
}
