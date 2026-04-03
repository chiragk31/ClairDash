// ─── Types ────────────────────────────────────────────────────────────────────

export type StatVariant = "default" | "warning" | "success" | "danger";

export interface StatCardProps {
  /** Card title shown as label */
  title: string;
  /** Primary numeric / string value */
  value: string | number;
  /** Material Symbol icon name for the trend indicator */
  trendIcon: string;
  /** Badge label shown alongside the value */
  badge: string;
  /** Background icon (decorative) */
  bgIcon: string;
  /** Controls color theming */
  variant?: StatVariant;
}

// ─── Variant Styles ───────────────────────────────────────────────────────────

const variantConfig: Record<
  StatVariant,
  { icon: string; value: string; badge: string }
> = {
  default: {
    icon: "text-[#bd9dff]",
    value: "text-[#e9e6f7]",
    badge: "text-emerald-400 bg-emerald-400/10",
  },
  warning: {
    icon: "text-orange-400",
    value: "text-[#e9e6f7]",
    badge: "text-orange-400 bg-orange-400/10",
  },
  success: {
    icon: "text-emerald-400",
    value: "text-[#e9e6f7]",
    badge: "text-emerald-400 bg-emerald-400/10",
  },
  danger: {
    icon: "text-[#ff6e84]",
    value: "text-[#ff6e84]",
    badge: "text-[#ff6e84] bg-[#ff6e84]/10",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatCard({
  title,
  value,
  trendIcon,
  badge,
  bgIcon,
  variant = "default",
}: StatCardProps) {
  const styles = variantConfig[variant];

  return (
    <div className="bg-[#12121e] p-6 rounded-2xl border border-[#474754]/5 hover:bg-[#181826] transition-all group relative overflow-hidden">

      {/* Decorative background icon */}
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none select-none">
        <span className="material-symbols-outlined text-8xl">{bgIcon}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#aba9b9]">
          {title}
        </p>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          {trendIcon}
        </span>
      </div>

      {/* Value + Badge */}
      <div className="flex items-end justify-between">
        <h3 className={`text-3xl font-black ${styles.value}`}>{value}</h3>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-lg ${styles.badge}`}
        >
          {badge}
        </span>
      </div>
    </div>
  );
}
