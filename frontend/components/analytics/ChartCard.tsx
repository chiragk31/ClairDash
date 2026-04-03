// ─── Re-usable card wrapper that gives all charts a consistent look ───────────

interface ChartCardProps {
  title: string;
  /** Optional icon name (material symbols) shown in the action slot  */
  actionIcon?: string;
  onAction?: () => void;
  height?: string;   // Tailwind height class, default "h-[400px]"
  children: React.ReactNode;
}

export default function ChartCard({
  title,
  actionIcon,
  onAction,
  height = "h-[400px]",
  children,
}: ChartCardProps) {
  return (
    <div
      className={`bg-[#181826] p-8 rounded-3xl ${height} flex flex-col shadow-xl`}
    >
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h4 className="text-lg font-bold text-[#e9e6f7]">{title}</h4>
        {actionIcon && (
          <button onClick={onAction} className="text-[#aba9b9] hover:text-[#e9e6f7] transition-colors">
            <span className="material-symbols-outlined">{actionIcon}</span>
          </button>
        )}
      </div>
      <div className="flex-1 min-h-0 w-full h-full relative">{children}</div>
    </div>
  );
}
