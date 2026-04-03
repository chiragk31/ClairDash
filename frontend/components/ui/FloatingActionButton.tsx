"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloatingActionButtonProps {
  /** Icon name (Material Symbol) */
  icon?: string;
  /** Accessible label */
  label?: string;
  onClick?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FloatingActionButton({
  icon = "add",
  label = "New complaint",
  onClick,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        id="fab-new-complaint"
        aria-label={label}
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8a4cfc] to-[#bd9dff] text-[#3c0089] shadow-xl shadow-[#bd9dff]/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-300">
          {icon}
        </span>
      </button>
    </div>
  );
}
