// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComplaintHeaderProps {
  ticketId: string;
  title: string;
  createdAt: string;
  senderName: string;
  senderEmail: string;
  /** Two-letter initials shown when no avatar is available */
  senderInitials: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ComplaintHeader({
  ticketId,
  title,
  createdAt,
  senderName,
  senderEmail,
  senderInitials,
}: ComplaintHeaderProps) {
  return (
    <section className="bg-[#181826] p-6 rounded-xl shadow-lg border border-[#474754]/5">
      {/* Top row: ID + date */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-[#bd9dff]/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#bd9dff]">mail</span>
            </div>
            <span className="text-[#aba9b9] text-sm font-mono">{ticketId}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e9e6f7]">
            {title}
          </h1>
        </div>
        <p className="text-[#aba9b9] text-sm shrink-0 ml-4">{createdAt}</p>
      </div>

      {/* Sender info */}
      <div className="flex items-center space-x-3 pt-4 border-t border-[#474754]/10">
        <div className="w-8 h-8 rounded-full bg-[#45455b] flex items-center justify-center text-xs font-bold text-[#d0cee9] shrink-0">
          {senderInitials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#e9e6f7] leading-none">
            {senderName}
          </p>
          <p className="text-xs text-[#aba9b9] mt-0.5">{senderEmail}</p>
        </div>
      </div>
    </section>
  );
}
