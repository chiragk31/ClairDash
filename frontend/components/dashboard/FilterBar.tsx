"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (key: string, value: string) => void;
}

// ─── Filter Definitions ───────────────────────────────────────────────────────

const CATEGORY_OPTIONS: FilterOption[] = [
  { value: "", label: "Category" },
  { value: "billing", label: "Billing" },
  { value: "technical", label: "Technical" },
  { value: "shipping", label: "Shipping" },
  { value: "api", label: "API Support" },
];

const SEVERITY_OPTIONS: FilterOption[] = [
  { value: "", label: "Severity" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const SENTIMENT_OPTIONS: FilterOption[] = [
  { value: "", label: "Sentiment" },
  { value: "angry", label: "Angry" },
  { value: "negative", label: "Negative" },
  { value: "neutral", label: "Neutral" },
  { value: "positive", label: "Positive" },
];

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "Status" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "escalated", label: "Escalated" },
];

// ─── Sub-component: select ────────────────────────────────────────────────────

function FilterSelect({
  id,
  options,
  onChange,
}: {
  id: string;
  options: FilterOption[];
  onChange?: (value: string) => void;
}) {
  return (
    <select
      id={id}
      onChange={(e) => onChange?.(e.target.value)}
      className="bg-[#181826] border border-[#474754]/20 rounded-xl text-sm py-2.5 px-4 text-[#e9e6f7] focus:ring-1 focus:ring-[#bd9dff] focus:outline-none min-w-[140px] cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FilterBar({ onSearch, onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    onSearch?.(val);
  };

  return (
    <div className="bg-[#1e1e2d]/50 p-6 flex flex-wrap items-center gap-4 border-b border-[#474754]/10">

      {/* Search Input */}
      <div className="flex-1 min-w-[300px] relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#aba9b9]">
          <span className="material-symbols-outlined text-lg">filter_list</span>
        </span>
        <input
          id="complaint-search"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by ID, email or subject..."
          className="w-full bg-[#181826] border border-[#474754]/20 rounded-xl pl-10 text-sm py-2.5 text-[#e9e6f7] placeholder:text-[#aba9b9]/60 focus:ring-1 focus:ring-[#bd9dff] focus:outline-none"
        />
      </div>

      {/* Filter Selects */}
      <div className="flex gap-3 flex-wrap">
        <FilterSelect
          id="filter-category"
          options={CATEGORY_OPTIONS}
          onChange={(v) => onFilterChange?.("category", v)}
        />
        <FilterSelect
          id="filter-severity"
          options={SEVERITY_OPTIONS}
          onChange={(v) => onFilterChange?.("severity", v)}
        />
        <FilterSelect
          id="filter-sentiment"
          options={SENTIMENT_OPTIONS}
          onChange={(v) => onFilterChange?.("sentiment", v)}
        />
        <FilterSelect
          id="filter-status"
          options={STATUS_OPTIONS}
          onChange={(v) => onFilterChange?.("status", v)}
        />

        <button
          id="advanced-filter-btn"
          className="bg-[#2b2a3c] hover:bg-[#242434] transition-colors px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold text-[#e9e6f7]"
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          Advanced
        </button>
      </div>
    </div>
  );
}
