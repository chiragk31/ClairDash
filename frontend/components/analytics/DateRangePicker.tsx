"use client";

// ─── Date Range Picker placeholder ──────────────────────────────────────────
// TODO: Replace with a real date-picker such as react-day-picker or shadcn/ui
//       Calendar when the date-filtered API is ready.

interface DateRangePickerProps {
  label?:    string;
  onSelect?: (range: { from: string; to: string }) => void;
}

export default function DateRangePicker({
  label   = "Last 30 Days",
  onSelect,
}: DateRangePickerProps) {
  return (
    <button
      id="date-range-picker"
      onClick={() => onSelect?.({ from: "", to: "" })}
      className="bg-[#181826] px-4 py-2 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-[#2b2a3c] transition-colors text-[#e9e6f7]"
    >
      <span className="material-symbols-outlined text-[#bd9dff] text-sm">
        calendar_today
      </span>
      <span className="text-sm font-medium">{label}</span>
      <span className="material-symbols-outlined text-[#aba9b9] text-sm">
        expand_more
      </span>
    </button>
  );
}
