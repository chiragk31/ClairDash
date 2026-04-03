"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  showing: number;
  total: number;
  onPageChange?: (page: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pagination({
  currentPage,
  totalPages,
  showing,
  total,
  onPageChange,
}: PaginationProps) {
  // Build visible page numbers (always show up to 3 around current)
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className="bg-[#12121e]/30 p-4 flex items-center justify-between border-t border-[#474754]/10">
      {/* Count */}
      <p className="text-xs text-[#aba9b9]">
        Showing{" "}
        <span className="font-bold text-[#e9e6f7]">{showing}</span> of{" "}
        <span className="font-bold text-[#e9e6f7]">{total}</span> open tickets
      </p>

      {/* Page buttons */}
      <div className="flex gap-2">
        {/* Prev */}
        <button
          id="pagination-prev"
          disabled={currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Previous page"
          className="w-8 h-8 rounded-lg bg-[#181826] flex items-center justify-center text-[#e9e6f7] hover:bg-[#2b2a3c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        {/* Numbered pages */}
        {pages.map((page) => (
          <button
            key={page}
            id={`pagination-page-${page}`}
            onClick={() => onPageChange?.(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
              currentPage === page
                ? "bg-[#bd9dff] text-[#3c0089]"
                : "bg-[#181826] text-[#e9e6f7] hover:bg-[#2b2a3c]"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          id="pagination-next"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Next page"
          className="w-8 h-8 rounded-lg bg-[#181826] flex items-center justify-center text-[#e9e6f7] hover:bg-[#2b2a3c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
