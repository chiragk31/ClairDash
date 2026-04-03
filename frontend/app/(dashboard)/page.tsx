"use client";

import { useState } from "react";

import StatCard, { type StatCardProps } from "@/components/dashboard/StatCard";
import FilterBar from "@/components/dashboard/FilterBar";
import ComplaintTable, { type Ticket } from "@/components/dashboard/ComplaintTable";
import Pagination from "@/components/dashboard/Pagination";
import FloatingActionButton from "@/components/ui/FloatingActionButton";

// ─── Static Data (replace with API calls / server component fetching) ─────────

const STAT_CARDS: StatCardProps[] = [
  {
    title: "Total Complaints",
    value: "1,284",
    trendIcon: "trending_up",
    badge: "+12.4%",
    bgIcon: "inbox",
    variant: "default",
  },
  {
    title: "Open Tickets",
    value: "432",
    trendIcon: "hourglass_empty",
    badge: "High Load",
    bgIcon: "pending",
    variant: "warning",
  },
  {
    title: "Resolved Today",
    value: "89",
    trendIcon: "check_circle",
    badge: "Target Met",
    bgIcon: "task_alt",
    variant: "success",
  },
  {
    title: "SLA Breached",
    value: "12",
    trendIcon: "dangerous",
    badge: "Action Req",
    bgIcon: "warning",
    variant: "danger",
  },
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: "#CD-9281",
    senderEmail: "sarah.j@techcorp.io",
    senderTier: "Enterprise Tier",
    subject: "Critical system outage during migration...",
    category: "Technical",
    severity: "critical",
    sentiment: "angry",
    status: "open",
    slaDeadline: "00:14:22",
    slaProgress: 80,
    assignee: {
      name: "Jordan Blake",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBJoG8M655JWDXBaB_V7Ra-t5vhQZr6O5haqEjW4Zi4a7oHKPUk8UpZUZbYW0htI1Y0Kfy20LiSr9QGtQKuZcInCIEMV3aW7p0KPuQdeqDzNQyxQyHGI_2vxstuMYrpXJr77n7WKcgQ5LtB-EzZH0WVX1XcJn5oEwjT9Yda2Y5NxPygoQMB9UMGaWnQDdpEztvLniTHS-5gpzaXGAPCatN--LRA6Lirxkoqgn3vGqjDImMuw8U9dNOaCTkHSlI04yvW4po7qIjPx2lb",
    },
  },
  {
    id: "#CD-9275",
    senderEmail: "mike.ross@pearson.com",
    senderTier: "Basic Plan",
    subject: "Duplicate billing charges on monthly...",
    category: "Billing",
    severity: "high",
    sentiment: "negative",
    status: "in_progress",
    slaDeadline: "04:45:00",
    slaProgress: 33,
    assignee: { name: "AM" },
  },
  {
    id: "#CD-9122",
    senderEmail: "emma.v@creative.net",
    senderTier: "Pro Plan",
    subject: "Question about integration webhooks...",
    category: "API Support",
    severity: "low",
    sentiment: "positive",
    status: "resolved",
    slaDeadline: "completed",
    slaProgress: 100,
    assignee: {
      name: "Priya Shah",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDquHxXjnQVc7hfoChBnvuh8buGTDt_ZMZZbeLnQFdstvnSTXbUlzeW6hue_ClfMwsF5kZkhrkjz9bpnAqklel1hFSojZK5L5EmL7HRFvtQ12hNko4Q_7Y4X-cfPvPX5ri_sc3ZL6RvTRpSbd4CRBGCH3OpA-HExLpNiu93NPLGMPHgXzTlE_-_Att8ip7XM8mf2eE7uF6QnCbQrn8JUduI0Yb_qhOZc2YYR88ab1KF3fGe84oWemmRNoqAZrEpnh7ClJYW8QwANnmM",
    },
  },
];

const PAGE_SIZE = 15;
const TOTAL_OPEN = 432;
const TOTAL_PAGES = Math.ceil(TOTAL_OPEN / PAGE_SIZE);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">

        {/* ── Hero Stats Row ──────────────────────────────────────────────── */}
        <section aria-label="Key metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STAT_CARDS.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* ── Complaint Inbox ─────────────────────────────────────────────── */}
        <section
          aria-label="Complaint inbox"
          className="bg-[#181826] rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Filter bar */}
          <FilterBar />

          {/* Table */}
          <ComplaintTable tickets={MOCK_TICKETS} />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            showing={PAGE_SIZE}
            total={TOTAL_OPEN}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon="add"
        label="Create new complaint"
        onClick={() => console.log("Open new complaint form")}
      />
    </>
  );
}
