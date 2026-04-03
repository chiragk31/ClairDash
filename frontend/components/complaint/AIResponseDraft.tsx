"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AIResponseDraftProps {
  initialDraft: string;
  onRegenerate?: () => void;
  onSend?: (message: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIResponseDraft({
  initialDraft,
  onRegenerate,
  onSend,
}: AIResponseDraftProps) {
  const [draft, setDraft] = useState(initialDraft);

  return (
    <section className="bg-[#2b2a3c]/40 backdrop-blur-md p-6 rounded-2xl border border-[#bd9dff]/20 shadow-2xl shadow-[#bd9dff]/5">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <span
          className="material-symbols-outlined text-[#bd9dff]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#bd9dff]">
          AI Draft Response
        </h3>
      </div>

      {/* Textarea */}
      <div className="bg-[#12121e] rounded-xl p-1 mb-4 border border-[#474754]/10">
        <textarea
          id="ai-draft-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Drafting response..."
          className="w-full bg-transparent border-none text-[#e9e6f7] text-sm focus:ring-0 focus:outline-none p-3 min-h-[120px] resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          id="regenerate-draft-btn"
          onClick={onRegenerate}
          className="px-4 py-2 text-xs font-bold text-[#aba9b9] border border-[#474754]/30 rounded-lg hover:bg-[#181826] transition-colors flex items-center"
        >
          <span className="material-symbols-outlined text-sm mr-2">refresh</span>
          Regenerate Draft
        </button>

        <button
          id="send-response-btn"
          onClick={() => onSend?.(draft)}
          className="px-6 py-2.5 bg-gradient-to-br from-[#8a4cfc] to-[#bd9dff] text-[#3c0089] font-bold rounded-lg shadow-lg shadow-[#bd9dff]/20 active:scale-95 transition-all text-sm flex items-center"
        >
          Edit &amp; Send
          <span className="material-symbols-outlined text-sm ml-2">send</span>
        </button>
      </div>
    </section>
  );
}
