"use client";

import { useActionState } from "react";
import type { ContactFormState } from "./actions";

type Vendor = { id: string; name: string };
type Order  = { id: string; invoiceNumber: number; customer: { firstName: string; lastName: string } };

type ContactFormProps = {
  action: (prev: ContactFormState, fd: FormData) => Promise<ContactFormState>;
  sources: Vendor[];
  orders:  Order[];
  defaults?: {
    name?: string; phone?: string; email?: string; type?: string;
    status?: string; notes?: string; sourceId?: string; orderId?: string; nextFollowUp?: string;
  };
  submitLabel?: string;
};

const LABEL_CLS = "block text-sm font-medium text-marble-700 mb-1";
const INPUT_CLS = "w-full rounded border border-marble-300 px-3 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500";

export default function ContactForm({ action, sources, orders, defaults = {}, submitLabel = "Save contact" }: ContactFormProps) {
  const [state, dispatch] = useActionState(action, null);
  const err = (state && !state.ok && state.errors) ? state.errors : {};

  return (
    <form action={dispatch} className="space-y-6 max-w-xl">
      {state && !state.ok && state.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{state.message}</p>
      )}

      {/* Name */}
      <div>
        <label className={LABEL_CLS}>Name *</label>
        <input name="name" type="text" defaultValue={defaults.name ?? ""} required className={INPUT_CLS} />
        {err.name && <p className="text-xs text-red-600 mt-1">{err.name}</p>}
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Phone</label>
          <input name="phone" type="tel" defaultValue={defaults.phone ?? ""} className={INPUT_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS}>Email</label>
          <input name="email" type="email" defaultValue={defaults.email ?? ""} className={INPUT_CLS} />
          {err.email && <p className="text-xs text-red-600 mt-1">{err.email}</p>}
        </div>
      </div>

      {/* Type + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Contact type *</label>
          <select name="type" defaultValue={defaults.type ?? "coldContact"} className={INPUT_CLS}>
            <option value="pastCustomer">Past customer</option>
            <option value="lostLead">Lost lead</option>
            <option value="coldContact">Cold contact</option>
          </select>
        </div>
        <div>
          <label className={LABEL_CLS}>Status</label>
          <select name="status" defaultValue={defaults.status ?? "new"} className={INPUT_CLS}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="notInterested">Not interested</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* Ad Source */}
      <div>
        <label className={LABEL_CLS}>How did they find us?</label>
        <select name="sourceId" defaultValue={defaults.sourceId ?? ""} className={INPUT_CLS}>
          <option value="">Unknown / not specified</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Link to existing order */}
      {orders.length > 0 && (
        <div>
          <label className={LABEL_CLS}>Link to existing order (optional)</label>
          <select name="orderId" defaultValue={defaults.orderId ?? ""} className={INPUT_CLS}>
            <option value="">None</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.invoiceNumber} — {o.customer.firstName} {o.customer.lastName}
              </option>
            ))}
          </select>
          <p className="text-xs text-marble-500 mt-1">Link if this contact is a past customer or a quote that didn&apos;t convert.</p>
        </div>
      )}

      {/* Next follow-up */}
      <div>
        <label className={LABEL_CLS}>Next follow-up date</label>
        <input name="nextFollowUp" type="date" defaultValue={defaults.nextFollowUp ?? ""} className={INPUT_CLS} />
      </div>

      {/* Notes */}
      <div>
        <label className={LABEL_CLS}>Notes</label>
        <textarea name="notes" rows={3} defaultValue={defaults.notes ?? ""} className={INPUT_CLS} />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-6 h-9 text-sm"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
