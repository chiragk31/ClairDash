"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import ComplaintHeader from "@/components/complaint/ComplaintHeader";
import OriginalMessage from "@/components/complaint/OriginalMessage";
import CommunicationThread from "@/components/complaint/CommunicationThread";
import AIResponseDraft from "@/components/complaint/AIResponseDraft";
import AIAnalysisCard from "@/components/complaint/AIAnalysisCard";
import SLATracker from "@/components/complaint/SLATracker";
import ComplaintSettings from "@/components/complaint/ComplaintSettings";
import SimilarCases from "@/components/complaint/SimilarCases";

import type { ThreadMessage } from "@/components/complaint/CommunicationThread";
import type { SimilarCase } from "@/components/complaint/SimilarCases";
import type { Agent } from "@/components/complaint/ComplaintSettings";

import { api } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ComplaintDetailPage({ params }: Props) {
  const { id } = use(params);

  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const data = await api.getComplaintById(id);
        setComplaint(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    await api.updateComplaint(id, { status });
    setComplaint((prev: any) => ({ ...prev, status }));
  };

  const handleAgentChange = async (agentId: string) => {
    await api.updateComplaint(id, { assigned_to: agentId });
    setComplaint((prev: any) => ({ ...prev, assigned_to: agentId }));
  };

  const handleEscalate = () => console.log("Escalated", id);
  const handleRegenerate = () => console.log("Regenerate draft");
  const handleSend = (msg: string) => console.log("Send →", msg);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#bd9dff] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#aba9b9]">Loading complaint...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !complaint) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center">
          <p className="text-[#ff6e84] font-bold">Complaint not found</p>
          <p className="text-sm text-[#aba9b9] mt-1">{error}</p>
          <Link
            href="/complaints"
            className="mt-4 inline-block px-4 py-2 bg-[#bd9dff]/10 text-[#bd9dff] rounded-lg text-sm font-bold hover:bg-[#bd9dff]/20 transition-colors"
          >
            Back to Inbox
          </Link>
        </div>
      </div>
    );
  }

  // ── Map API data to component props ───────────────────────────────────────
  const now = new Date();
  const deadline = complaint.sla_deadline ? new Date(complaint.sla_deadline) : null;
  const created = new Date(complaint.created_at);

  const slaProgress = deadline
    ? Math.min(100, Math.round(((now.getTime() - created.getTime()) / (deadline.getTime() - created.getTime())) * 100))
    : 0;

  const slaTimeRemaining = deadline
    ? (() => {
      const diff = deadline.getTime() - now.getTime();
      if (diff <= 0) return "BREACHED";
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    })()
    : "N/A";

  const slaDeadlineFormatted = deadline
    ? deadline.toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
    : "N/A";

  const createdAtFormatted = new Date(complaint.created_at).toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const similarCases: SimilarCase[] = (complaint.similar_complaints ?? []).map(
    (s: any) => ({
      id: s.related_complaint_id,
      ticketId: `#${s.related_complaint_id.slice(0, 8).toUpperCase()}`,
      matchPercent: Math.round(s.similarity_score * 100),
      summary: "Related complaint — click to view",
    })
  );

  const agents: Agent[] = [
    { id: "alex", name: "Alex Rivera" },
    { id: "sarah", name: "Sarah Chen" },
    { id: "james", name: "James Wilson" },
  ];

  const keyIssues = complaint.key_issues
    ? [{ icon: "error", iconColor: "text-[#ff97b2]", text: complaint.key_issues }]
    : [];

  return (
    <main className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      {/* Back nav */}
      <div className="mb-6">
        <Link
          href="/complaints"
          className="inline-flex items-center text-[#aba9b9] hover:text-[#bd9dff] transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined mr-2 text-lg">arrow_back</span>
          Back to Inbox
        </Link>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-12 gap-8">

        {/* ── Left Column ────────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          <ComplaintHeader
            ticketId={`#${complaint.id.slice(0, 8).toUpperCase()}`}
            title={complaint.subject}
            createdAt={createdAtFormatted}
            senderName={complaint.email_id.split("@")[0]}
            senderEmail={complaint.email_id}
            senderInitials={complaint.email_id.slice(0, 2).toUpperCase()}
          />

          <OriginalMessage message={complaint.body} />

          <CommunicationThread messages={[]} />

          <AIResponseDraft
            initialDraft={complaint.draft_response ?? ""}
            onRegenerate={handleRegenerate}
            onSend={handleSend}
          />
        </div>

        {/* ── Right Column ───────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <AIAnalysisCard
            category={complaint.category ?? "general"}
            severity={complaint.severity ?? "medium"}
            sentiment={complaint.sentiment ?? "neutral"}
            keyIssues={keyIssues}
          />

          <SLATracker
            progressPercent={slaProgress}
            timeRemaining={slaTimeRemaining}
            deadline={slaDeadlineFormatted}
          />

          <ComplaintSettings
            currentStatus={complaint.status ?? "open"}
            agents={agents}
            currentAgentId={complaint.assigned_to ?? ""}
            channel={complaint.channel ?? "email"}
            onStatusChange={handleStatusChange}
            onAgentChange={handleAgentChange}
            onEscalate={handleEscalate}
          />

          <SimilarCases cases={similarCases} />
        </div>
      </div>
    </main>
  );
}