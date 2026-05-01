"use client";

import { useState, useEffect, useCallback } from "react";

import FilterBar from "@/components/dashboard/FilterBar";
import ComplaintTable, { type Ticket } from "@/components/dashboard/ComplaintTable";
import Pagination from "@/components/dashboard/Pagination";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { api, mapComplaint } from "@/lib/api";

const PAGE_SIZE = 15;

export default function ComplaintsListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "", category: "", severity: "", sentiment: "", status: "",
  });

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getComplaints({ ...filters, page: currentPage });
      setTickets((res.data ?? []).map(mapComplaint));
      setTotal(res.total ?? 0);
      setTotalPages(res.total_pages ?? 1);
    } catch (e) {
      console.error("Failed to fetch complaints:", e);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleFilterChange = (key: string, value: string) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, search: query }));
  };

  return (
    <>
      <main className="p-8 space-y-6 max-w-[1600px] mx-auto w-full">

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-black text-[#e9e6f7] tracking-tight">
            Complaints
          </h1>
          <p className="text-sm text-[#aba9b9] mt-1">
            {loading
              ? "Loading..."
              : `${total} total complaints — filter, assign, and resolve.`}
          </p>
        </div>

        {/* Inbox */}
        <section
          aria-label="Complaints inbox"
          className="bg-[#181826] rounded-3xl overflow-hidden shadow-2xl"
        >
          <FilterBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
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
                <p className="text-[#aba9b9] mt-2 font-bold">No complaints found</p>
                <p className="text-sm text-[#474754] mt-1">Try adjusting your filters</p>
              </div>
            </div>
          ) : (
            <ComplaintTable tickets={tickets} />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            showing={tickets.length}
            total={total}
            onPageChange={(page) => { setCurrentPage(page); }}
          />
        </section>
      </main>

      <FloatingActionButton
        icon="add"
        label="Create new complaint"
        onClick={() => console.log("Open new complaint form")}
      />
    </>
  );
}