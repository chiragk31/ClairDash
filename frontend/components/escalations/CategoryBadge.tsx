// ─── CategoryBadge ────────────────────────────────────────────────────────────

import type { Category } from "./escalationsData";

const CATEGORY_STYLES: Record<Category, string> = {
  Technical:        "bg-[#45455b]/30 text-[#e2e0fc]",
  Billing:          "bg-[#bd9dff]/10 text-[#bd9dff]",
  Delivery:         "bg-emerald-500/10 text-emerald-400",
  "Product Quality": "bg-orange-500/10 text-orange-400",
  Other:            "bg-[#1e1e2d] text-[#aba9b9]",
};

interface CategoryBadgeProps {
  category: Category;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${CATEGORY_STYLES[category]}`}
    >
      {category}
    </span>
  );
}
