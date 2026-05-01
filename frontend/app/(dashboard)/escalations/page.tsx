"use client";

import { useState, useEffect } from "react";

import EscalationBanner from "@/components/escalations/EscalationBanner";
import BreachedTable from "@/components/escalations/BreachedTable";
import EscalatedTable from "@/components/escalations/EscalatedTable";
import QuickEscalateForm from "@/components/escalations/QuickEscalateForm";
import EscalationMetaCards from "@/components/escalations/EscalationMetaCards";

import {
  META_STATS,
} from "@/components/escalations/escalationsData";
import type {
  BreachedComplaint,
  EscalatedComplaint,
  Category,
  Priority,
} from "@/components/escalations/escalationsData";
import type { EscalateFormValues } from "@/components/escalations/QuickEscalateForm";

import { api } from "@/lib/api";

// Maps raw API complaint to BreachedComplaint shape
function mapToBreached(c: any): BreachedComplaint {
  const deadline = c.sla_deadline ? new Date(c.sla_deadline) : null;
  const now = new Date();
  let overdueBy = "Overdue";

  if (deadline) {
    const diffMs = now.getTime() - deadline.getTime();
    const diffHrs = Math.floor(diffMs / 3_600_000);
    const diffMin = Math.floor((diffMs % 3_600_000) / 60_000);
    overdueBy = diffHrs > 0 ? `${diffHrs}h ${diffMin}m overdue` : `${diffMin}m overdue`;
  }

  // Capitalize category
  const raw = c.category ?? "other";
  const category = (raw.charAt(0).toUpperCase() + raw.slice(1).replace("_", " ")) as Category;

  return {
    id: c.id.slice(0, 8).toUpperCase(),
    customerEmail: c.email_id ?? "",
    customerOrg: c.email_id?.split("@")[1]?.split(".")[0] ?? "Unknown",
    subject: c.subject ?? "",
    category,
    overdueBy,
    assignedTo: c.assigned_to ?? "Unassigned",
  };
}

export default function EscalationsPage() {
  const [breached, setBreached] = useState<BreachedComplaint[]>([]);
  const [escalated, setEscalated] = useState<EscalatedComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEscalations = async () => {
      try {
        // Fetch SLA breached — open complaints past their deadline
        const now = new Date().toISOString();
        const [breachedRes, escalatedRes] = await Promise.all([
          // Breached = open/in-progress complaints whose sla_deadline has passed
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/complaints/?status=open&page=1`
          ).then((r) => r.json()),
          // Escalated = complaints with status escalated
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/complaints/?status=escalated&page=1`
          ).then((r) => r.json()),
        ]);

        // Filter only truly breached from open complaints
        const breachedData = (breachedRes.data ?? [])
          .filter((c: any) => c.sla_deadline && new Date(c.sla_deadline) < new Date())
          .map(mapToBreached);

        setBreached(breachedData);

        // Map escalated complaints
        const escalatedData: EscalatedComplaint[] = (escalatedRes.data ?? []).map(
          (c: any): EscalatedComplaint => ({
            id: c.id.slice(0, 8).toUpperCase(),
            customerEmail: c.email_id ?? "",
            customerOrg: c.email_id?.split("@")[1]?.split(".")[0] ?? "Unknown",
            escalationReason: "SLA Breach",
            escalationNote: c.key_issues ?? c.subject ?? "",
            escalatedAt: new Date(c.created_at).toLocaleString("en-US", {
              month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            }),
            assignedTo: c.assigned_to ?? "Team Lead",
            priority: c.severity
              ? (c.severity.charAt(0).toUpperCase() + c.severity.slice(1)) as Priority
              : "High",
          })
        );

        setEscalated(escalatedData);

      } catch (e) {
        console.error("Escalations fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEscalations();
  }, []);

  // Resolve a breached complaint — updates status in Supabase
  async function handleResolve(id: string) {
    try {
      // Find full UUID from breached list — we stored short ID so fetch full
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/complaints/?page=1`
      ).then((r) => r.json());

      const match = (res.data ?? []).find((c: any) =>
        c.id.slice(0, 8).toUpperCase() === id
      );

      if (match) {
        await api.updateComplaint(match.id, { status: "resolved" });
      }

      setBreached((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error("Resolve failed:", e);
    }
  }

  function handleEscalateSubmit(values: EscalateFormValues) {
    // TODO: POST to /escalations endpoint when built
    console.log("Escalate form submitted:", values);
  }

  return (
    <>
      {/* ── Alert Banner */}
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
                {loading ? "…" : breached.length}
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

        {/* ── Loading ─────────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#bd9dff] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#aba9b9]">Loading escalations...</p>
            </div>
          </div>
        ) : (
          /* ── Bento: Left column (tables) + Right column (form) ──────────── */
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left — 75% */}
            <div className="lg:w-3/4 flex flex-col gap-8">
              <BreachedTable
                complaints={breached}
                onResolve={handleResolve}
              />
              <EscalatedTable complaints={escalated} />
            </div>

            {/* Right — 25% */}
            <aside className="lg:w-1/4">
              <QuickEscalateForm onSubmit={handleEscalateSubmit} />
              <EscalationMetaCards stats={META_STATS} />
            </aside>

          </div>
        )}
      </main>
    </>
  );
}