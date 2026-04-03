"use client";

// ─── QuickEscalateForm ────────────────────────────────────────────────────────
// Controlled form for manually escalating a complaint.
// TODO: Replace handleSubmit with a Server Action or API call.

import { useState } from "react";
import { ESCALATION_REASONS, PRIORITY_OPTIONS, ASSIGNEE_OPTIONS } from "./escalationsData";
import type { Priority } from "./escalationsData";

export interface EscalateFormValues {
  complaintId:      string;
  reason:           string;
  priority:         Priority;
  assignTo:         string;
  notes:            string;
}

const INITIAL: EscalateFormValues = {
  complaintId: "",
  reason:      ESCALATION_REASONS[0],
  priority:    "Critical",
  assignTo:    ASSIGNEE_OPTIONS[0],
  notes:       "",
};

interface QuickEscalateFormProps {
  /** Injected submit handler — wire to Server Action when ready */
  onSubmit?: (values: EscalateFormValues) => void;
}

export default function QuickEscalateForm({ onSubmit }: QuickEscalateFormProps) {
  const [form, setForm] = useState<EscalateFormValues>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: await escalateComplaint(form);
    onSubmit?.(form);
    setTimeout(() => {
      setForm(INITIAL);
      setSubmitting(false);
    }, 800);
  }

  const inputCls =
    "w-full bg-[#12121e] border-none rounded-lg text-sm text-[#e9e6f7] placeholder-[#474754] focus:ring-1 focus:ring-[#bd9dff] py-3 px-3 outline-none transition";

  return (
    <div className="bg-[#181826] rounded-xl overflow-hidden shadow-2xl border border-[#474754]/10 sticky top-24">
      {/* Panel header */}
      <div className="px-6 py-5 border-b border-[#474754]/10 bg-[#1e1e2d]/50">
        <h2 className="text-lg font-bold text-[#e9e6f7] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#bd9dff] text-xl">bolt</span>
          Quick Escalate
        </h2>
        <p className="text-xs text-[#aba9b9] mt-1">Manual elevation for critical issues</p>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Complaint ID */}
        <div>
          <label className="block text-xs font-bold text-[#aba9b9] uppercase mb-2">
            Complaint ID
          </label>
          <input
            id="escalate-complaint-id"
            name="complaintId"
            type="text"
            value={form.complaintId}
            onChange={handleChange}
            placeholder="e.g. #CD-XXXX"
            className={inputCls}
            required
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-bold text-[#aba9b9] uppercase mb-2">
            Escalation Reason
          </label>
          <select
            id="escalate-reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className={inputCls}
          >
            {ESCALATION_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Priority + Assign To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#aba9b9] uppercase mb-2">
              Priority
            </label>
            <select
              id="escalate-priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={inputCls}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#aba9b9] uppercase mb-2">
              Assign To
            </label>
            <select
              id="escalate-assign-to"
              name="assignTo"
              value={form.assignTo}
              onChange={handleChange}
              className={inputCls}
            >
              {ASSIGNEE_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-[#aba9b9] uppercase mb-2">
            Internal Notes
          </label>
          <textarea
            id="escalate-notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Brief context for the escalation..."
            className={inputCls}
          />
        </div>

        {/* Submit */}
        <button
          id="escalate-submit-btn"
          type="submit"
          disabled={submitting}
          className="w-full bg-[#ff6e84] text-[#490013] py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#ff6e84]/20 hover:bg-[#d73357] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Escalating…" : "Escalate Now"}
        </button>
      </form>
    </div>
  );
}
