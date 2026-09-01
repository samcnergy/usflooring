"use client";

import { useActionState, useState } from "react";
import type { CampaignFormState } from "./actions";

type Props = {
  action: (prev: CampaignFormState, fd: FormData) => Promise<CampaignFormState>;
  defaults?: {
    name?: string; subject?: string; body?: string;
    promoDetails?: string; promoCode?: string; expiresAt?: string;
  };
  submitLabel?: string;
};

const LABEL_CLS = "block text-sm font-medium text-marble-700 mb-1";
const INPUT_CLS = "w-full rounded border border-marble-300 px-3 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500";

export default function CampaignForm({ action, defaults = {}, submitLabel = "Save draft" }: Props) {
  const [state, dispatch] = useActionState(action, null);
  const err = (state && !state.ok && state.errors) ? state.errors : {};
  const [previewOpen, setPreviewOpen] = useState(false);
  const [body, setBody] = useState(defaults.body ?? "");

  return (
    <div className="space-y-8 max-w-2xl">
      {state && !state.ok && state.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{state.message}</p>
      )}

      <form action={dispatch} className="space-y-6">
        {/* Internal name */}
        <div>
          <label className={LABEL_CLS}>Campaign name (internal) *</label>
          <input name="name" type="text" defaultValue={defaults.name ?? ""} required placeholder="e.g. Summer 2026 Vinyl Sale" className={INPUT_CLS} />
          <p className="text-xs text-marble-500 mt-1">Only visible to admins — not sent to customers.</p>
          {err.name && <p className="text-xs text-red-600 mt-1">{err.name}</p>}
        </div>

        {/* Subject */}
        <div>
          <label className={LABEL_CLS}>Email subject line *</label>
          <input name="subject" type="text" defaultValue={defaults.subject ?? ""} required placeholder="e.g. Exclusive Summer Deals from U.S. Floor" className={INPUT_CLS} />
          {err.subject && <p className="text-xs text-red-600 mt-1">{err.subject}</p>}
        </div>

        {/* Body */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={LABEL_CLS.replace("mb-1", "")}>Email body *</label>
            <button type="button" onClick={() => setPreviewOpen(!previewOpen)} className="text-xs text-brand-600 hover:underline">
              {previewOpen ? "Hide preview" : "Preview"}
            </button>
          </div>
          <textarea
            name="body"
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            placeholder={"Dear {{firstName}},\n\nWe have an exciting offer for you...\n\nUse {{firstName}} to personalize each email with the customer's first name."}
            className={INPUT_CLS}
          />
          <p className="text-xs text-marble-500 mt-1">
            Use <code className="bg-marble-100 px-1 rounded">{"{{firstName}}"}</code> to insert the customer&apos;s first name.
          </p>
          {err.body && <p className="text-xs text-red-600 mt-1">{err.body}</p>}
        </div>

        {/* Preview */}
        {previewOpen && (
          <div className="rounded-lg border border-marble-200 overflow-hidden">
            <div className="bg-marble-50 px-4 py-2 text-xs font-medium text-marble-600 uppercase tracking-wide border-b border-marble-200">
              Preview (as it will appear to customers)
            </div>
            <div className="p-4 bg-white">
              <div className="bg-[#1a1a2e] rounded-t-lg px-6 py-4">
                <p className="text-white font-bold text-base">U.S. Floor, Kitchen &amp; Bath</p>
              </div>
              <div className="border-x border-marble-200 px-6 py-5">
                {body.split("\n").map((line, i) => (
                  <p key={i} className="text-sm text-marble-700 mb-2 leading-relaxed">
                    {line.replace(/\{\{firstName\}\}/gi, "Maria") || <>&nbsp;</>}
                  </p>
                ))}
              </div>
              <div className="bg-marble-50 border border-marble-200 rounded-b-lg px-6 py-3">
                <p className="text-xs text-marble-500">U.S. Floor, Kitchen &amp; Bath · Orange County, CA</p>
              </div>
            </div>
          </div>
        )}

        {/* Promo section */}
        <fieldset className="rounded-lg border border-marble-200 p-4 space-y-4">
          <legend className="text-sm font-semibold text-marble-800 px-1">Promotion (optional)</legend>

          <div>
            <label className={LABEL_CLS}>Offer description</label>
            <input name="promoDetails" type="text" defaultValue={defaults.promoDetails ?? ""} placeholder="e.g. 15% off all vinyl flooring" className={INPUT_CLS} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Promo code</label>
              <input name="promoCode" type="text" defaultValue={defaults.promoCode ?? ""} placeholder="e.g. SUMMER26" className={`${INPUT_CLS} uppercase`} />
            </div>
            <div>
              <label className={LABEL_CLS}>Offer expires</label>
              <input name="expiresAt" type="date" defaultValue={defaults.expiresAt ?? ""} className={INPUT_CLS} />
            </div>
          </div>
        </fieldset>

        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-6 h-9 text-sm"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
