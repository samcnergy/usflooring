"use client";

import { useActionState, useState } from "react";
import { logOutreachAction, logMaterialSendAction, type LogState } from "../../actions";

const INPUT_CLS = "w-full rounded border border-marble-300 px-3 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500";
const LABEL_CLS = "block text-xs font-medium text-marble-600 mb-1 uppercase tracking-wide";

const today = () => new Date().toISOString().split("T")[0];

export function LogOutreachForm({ contactId }: { contactId: string }) {
  const action = logOutreachAction.bind(null, contactId);
  const [state, dispatch] = useActionState(action, null);
  const [open, setOpen] = useState(false);
  const err = (state && !state.ok && state.errors) ? state.errors : {};

  if (state?.ok && open) setOpen(false);

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-4 h-8 text-sm"
        >
          + Log contact
        </button>
      ) : (
        <form action={dispatch} className="rounded-lg border border-marble-200 bg-marble-50 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-marble-900">Log outreach</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Date *</label>
              <input name="date" type="date" defaultValue={today()} required className={INPUT_CLS} />
              {err.date && <p className="text-xs text-red-600 mt-1">{err.date}</p>}
            </div>
            <div>
              <label className={LABEL_CLS}>Method *</label>
              <select name="method" className={INPUT_CLS}>
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="text">Text</option>
                <option value="inPerson">In person</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Outcome / notes</label>
            <input name="outcome" type="text" placeholder="e.g. Left voicemail, interested in vinyl" className={INPUT_CLS} />
          </div>

          <div>
            <label className={LABEL_CLS}>Additional notes</label>
            <textarea name="notes" rows={2} className={INPUT_CLS} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Next follow-up</label>
              <input name="nextFollowUp" type="date" className={INPUT_CLS} />
            </div>
            <div>
              <label className={LABEL_CLS}>Update status</label>
              <select name="status" className={INPUT_CLS}>
                <option value="">— keep current —</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="notInterested">Not interested</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </div>

          {state && !state.ok && state.message && (
            <p className="text-xs text-red-600">{state.message}</p>
          )}

          <div className="flex gap-2">
            <button type="submit" className="rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-4 h-8 text-sm">
              Save
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded border border-marble-300 text-marble-600 hover:bg-marble-100 font-medium px-4 h-8 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}
      {state?.ok && (
        <p className="text-xs text-green-600 mt-2">Outreach logged.</p>
      )}
    </div>
  );
}

export function LogMaterialForm({ contactId }: { contactId: string }) {
  const action = logMaterialSendAction.bind(null, contactId);
  const [state, dispatch] = useActionState(action, null);
  const [open, setOpen] = useState(false);
  const err = (state && !state.ok && state.errors) ? state.errors : {};

  if (state?.ok && open) setOpen(false);

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded border border-marble-300 hover:bg-marble-50 text-marble-700 font-medium px-4 h-8 text-sm"
        >
          + Log material sent
        </button>
      ) : (
        <form action={dispatch} className="rounded-lg border border-marble-200 bg-marble-50 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-marble-900">Log material sent</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Date *</label>
              <input name="date" type="date" defaultValue={today()} required className={INPUT_CLS} />
              {err.date && <p className="text-xs text-red-600 mt-1">{err.date}</p>}
            </div>
            <div>
              <label className={LABEL_CLS}>What was sent *</label>
              <input name="description" type="text" placeholder="e.g. Spring promo flyer, Vinyl catalog PDF" required className={INPUT_CLS} />
              {err.description && <p className="text-xs text-red-600 mt-1">{err.description}</p>}
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Link (optional)</label>
            <input name="url" type="url" placeholder="https://drive.google.com/…" className={INPUT_CLS} />
            {err.url && <p className="text-xs text-red-600 mt-1">{err.url}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>Notes</label>
            <input name="notes" type="text" placeholder="Any additional context" className={INPUT_CLS} />
          </div>

          {state && !state.ok && state.message && (
            <p className="text-xs text-red-600">{state.message}</p>
          )}

          <div className="flex gap-2">
            <button type="submit" className="rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-4 h-8 text-sm">
              Save
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded border border-marble-300 text-marble-600 hover:bg-marble-100 font-medium px-4 h-8 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}
      {state?.ok && (
        <p className="text-xs text-green-600 mt-2">Logged.</p>
      )}
    </div>
  );
}
