"use client";

import Link from "next/link";

import ComplaintHeader    from "@/components/complaint/ComplaintHeader";
import OriginalMessage    from "@/components/complaint/OriginalMessage";
import CommunicationThread from "@/components/complaint/CommunicationThread";
import AIResponseDraft    from "@/components/complaint/AIResponseDraft";
import AIAnalysisCard     from "@/components/complaint/AIAnalysisCard";
import SLATracker         from "@/components/complaint/SLATracker";
import ComplaintSettings  from "@/components/complaint/ComplaintSettings";
import SimilarCases       from "@/components/complaint/SimilarCases";

import type { ThreadMessage }  from "@/components/complaint/CommunicationThread";
import type { SimilarCase }    from "@/components/complaint/SimilarCases";
import type { Agent }          from "@/components/complaint/ComplaintSettings";

// ─────────────────────────────────────────────────────────────────────────────
// Static mock data — replace with:
//   const complaint = await fetchComplaint(params.id)  (Server Component)
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_COMPLAINT = {
  ticketId:       "#CD-9275",
  title:          "Duplicate billing charges on monthly invoice",
  createdAt:      "Dec 14, 10:24 AM",
  senderName:     "Mike Ross",
  senderEmail:    "mike.ross@pearson.com",
  senderInitials: "MR",

  originalMessage:
    "Hi team, I noticed that I was charged twice for my 'Pro Plan' subscription on this month's invoice. One charge was on the 1st and another today on the 14th. This seems like a system error as my dashboard only shows one active subscription. Can you please look into this and issue a refund for the duplicate transaction as soon as possible? Thanks, Mike.",

  aiDraft:
    "Hi Mike, I'm sorry for the billing error you experienced. I've successfully verified the duplicate charge and have initiated a refund of $49.00 to your original payment method. You should see this reflect in your bank statement within 3-5 business days. Apologies for the inconvenience.",

  ai: {
    category:  "Billing",
    severity:  "High",
    sentiment: "Negative",
    keyIssues: [
      { icon: "error", iconColor: "text-[#ff97b2]", text: "Duplicate charge error in billing cycle" },
      { icon: "bolt",  iconColor: "text-[#bd9dff]", text: "Customer requesting immediate refund" },
      { icon: "info",  iconColor: "text-[#bd9dff]", text: "Likely subscription logic synchronization failure" },
    ],
  },

  sla: {
    progressPercent: 72,
    timeRemaining:   "4h 12m",
    deadline:        "Dec 15, 15:45",
  },

  agents: [
    { id: "alex",  name: "Alex Rivera" },
    { id: "sarah", name: "Sarah Chen" },
    { id: "james", name: "James Wilson" },
  ] satisfies Agent[],
  currentAgentId: "alex",
  currentStatus:  "Open" as const,
  channel:        "Email" as const,

  similarCases: [
    {
      id:           "CD-8812",
      ticketId:     "#CD-8812",
      matchPercent: 88,
      summary:      "Incorrect pro-rata calculation on plan upgrade...",
    },
    {
      id:           "CD-8745",
      ticketId:     "#CD-8745",
      matchPercent: 74,
      summary:      "Card charged after free trial cancellation...",
    },
  ] satisfies SimilarCase[],
};

const MOCK_THREAD: ThreadMessage[] = [
  {
    id:        "msg-1",
    role:      "customer",
    text:      "Is there any update on the refund? I haven't seen the credit in my account yet.",
    timestamp: "Dec 15, 09:15 AM",
  },
  {
    id:             "msg-2",
    role:           "agent",
    text:           "Hi Mike, I'm currently verifying the transaction IDs with our payment provider. It looks like a webhook latency issue. I'll have an update for you shortly.",
    timestamp:      "Dec 15, 11:30 AM",
    agentName:      "Alex R.",
    agentAvatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB37WCLFGtlbJkXdI7CE4zyiRqBm4zWKz_d4laOPxkl72579ONm41d6YQn6t_2JEiDOWqaNvtN454_OzkoVCxW86RtI9cpE5a-PDDZZlluBXR6P5YW9xBsxCSnYqRQTX0jVkfwoAEDTHpLZUwSvrPBG6byRi_VS6YVwA70W_SqazLpghSew7oeKI_XWT26T_K2oKrArGRLtA8oP0zMGG-K67O6NSoPKvUXI8WkcW1r1cZGKmdyIrZUJDlWx-hOUFix-_V1b8ptYWWwN",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  params: { id: string };
}

export default function ComplaintDetailPage({ params }: Props) {
  const c = MOCK_COMPLAINT;

  const handleStatusChange  = (status: string)  => console.log("Status →", status);
  const handleAgentChange   = (agentId: string)  => console.log("Agent →",  agentId);
  const handleEscalate      = ()                 => console.log("Escalated", params.id);
  const handleRegenerate    = ()                 => console.log("Regenerate draft");
  const handleSend          = (msg: string)      => console.log("Send →", msg);

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

        {/* ── Left Column (60%) ─────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          <ComplaintHeader
            ticketId={c.ticketId}
            title={c.title}
            createdAt={c.createdAt}
            senderName={c.senderName}
            senderEmail={c.senderEmail}
            senderInitials={c.senderInitials}
          />

          <OriginalMessage message={c.originalMessage} />

          <CommunicationThread messages={MOCK_THREAD} />

          <AIResponseDraft
            initialDraft={c.aiDraft}
            onRegenerate={handleRegenerate}
            onSend={handleSend}
          />
        </div>

        {/* ── Right Column (40%) ────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <AIAnalysisCard
            category={c.ai.category}
            severity={c.ai.severity}
            sentiment={c.ai.sentiment}
            keyIssues={c.ai.keyIssues}
          />

          <SLATracker
            progressPercent={c.sla.progressPercent}
            timeRemaining={c.sla.timeRemaining}
            deadline={c.sla.deadline}
          />

          <ComplaintSettings
            currentStatus={c.currentStatus}
            agents={c.agents}
            currentAgentId={c.currentAgentId}
            channel={c.channel}
            onStatusChange={handleStatusChange}
            onAgentChange={handleAgentChange}
            onEscalate={handleEscalate}
          />

          <SimilarCases cases={c.similarCases} />
        </div>
      </div>
    </main>
  );
}
