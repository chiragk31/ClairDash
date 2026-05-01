"use client";

import { useState, useEffect } from "react";

import StatCard, { type StatCardProps } from "@/components/dashboard/StatCard";
import FilterBar from "@/components/dashboard/FilterBar";
import ComplaintTable, { type Ticket } from "@/components/dashboard/ComplaintTable";
import Pagination from "@/components/dashboard/Pagination";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { api, mapComplaint } from "@/lib/api";

const PAGE_SIZE = 15;

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingTable, setLoadingTable] = useState(true);
  const [filters, setFilters] = useState({
    search: "", category: "", severity: "", sentiment: "", status: "",
  });
  const [statCards, setStatCards] = useState<StatCardProps[]>([
    { title: "Total Complaints", value: "—", trendIcon: "trending_up", badge: "Loading", bgIcon: "inbox", variant: "default" },
    { title: "Open Tickets", value: "—", trendIcon: "hourglass_empty", badge: "Loading", bgIcon: "pending", variant: "warning" },
    { title: "Resolved", value: "—", trendIcon: "check_circle", badge: "Loading", bgIcon: "task_alt", variant: "success" },
    { title: "SLA Breached", value: "—", trendIcon: "dangerous", badge: "Loading", bgIcon: "warning", variant: "danger" },
  ]);

  // Fetch KPI stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const s = await api.getStats();
        setStatCards([
          {
            title: "Total Complaints",
            value: s.total?.toLocaleString() ?? "0",
            trendIcon: "trending_up",
            badge: "All time",
            bgIcon: "inbox",
            variant: "default",
          },
          {
            title: "Open Tickets",
            value: s.open?.toLocaleString() ?? "0",
            trendIcon: "hourglass_empty",
            badge: s.open > 50 ? "High Load" : "Normal",
            bgIcon: "pending",
            variant: "warning",
          },
          {
            title: "Resolved",
            value: s.resolved?.toLocaleString() ?? "0",
            trendIcon: "check_circle",
            badge: "All time",
            bgIcon: "task_alt",
            variant: "success",
          },
          {
            title: "SLA Breached",
            value: s.sla_breached?.toLocaleString() ?? "0",
            trendIcon: "dangerous",
            badge: s.sla_breached > 0 ? "Action Req" : "All Clear",
            bgIcon: "warning",
            variant: s.sla_breached > 0 ? "danger" : "success",
          },
        ]);
      } catch (e) {
        console.error("Failed to fetch stats:", e);
      }
    };
    fetchStats();
  }, []);

  // Fetch complaints table

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoadingTable(true);
      try {
        const res = await api.getComplaints({ ...filters, page: currentPage });
        setTickets((res.data ?? []).map(mapComplaint));
        setTotal(res.total ?? 0);
        setTotalPages(res.total_pages ?? 1);
      } catch (e) {
        console.error("Failed to fetch complaints:", e);
      } finally {
        setLoadingTable(false);
      }
    };
    fetchComplaints();
  }, [currentPage, filters]);

  return (
    <>
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">

        {/* ── Hero Stats Row ──────────────────────────────────────────────── */}
        <section aria-label="Key metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => (
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
          {/* Filter bar */}
          <FilterBar
            onSearch={(query) => {
              setCurrentPage(1);
              setFilters((prev) => ({ ...prev, search: query }));
            }}
            onFilterChange={(key, value) => {
              setCurrentPage(1);
              setFilters((prev) => ({ ...prev, [key]: value }));
            }}
          />

          {/* Table */}
          {loadingTable ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#bd9dff] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#aba9b9]">Loading complaints...</p>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-[#474754]">inbox</span>
                <p className="text-[#aba9b9] mt-2 font-bold">No complaints yet</p>
              </div>
            </div>
          ) : (
            <ComplaintTable tickets={tickets} />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            showing={tickets.length}
            total={total}
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