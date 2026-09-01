"use client";

import { useActionState } from "react";
import type { VendorState } from "./actions";

type Props = {
  action: (prev: VendorState, formData: FormData) => Promise<VendorState>;
  defaultValues?: {
    name?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    notes?: string;
  };
  submitLabel?: string;
};

export function VendorForm({ action, defaultValues = {}, submitLabel = "Save Vendor" }: Props) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-xl">
      {state && !state.ok && state.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{state.message}</p>
      )}

      <Field label="Vendor Name *" name="name" defaultValue={defaultValues.name} error={state && !state.ok ? state.errors?.name : undefined} />
      <Field label="Contact Name" name="contactName" defaultValue={defaultValues.contactName} error={state && !state.ok ? state.errors?.contactName : undefined} />
      <Field label="Email" name="email" type="email" defaultValue={defaultValues.email} error={state && !state.ok ? state.errors?.email : undefined} />
      <Field label="Phone" name="phone" type="tel" defaultValue={defaultValues.phone} />
      <Field label="Address" name="address" defaultValue={defaultValues.address} />
      <Field label="Website" name="website" type="url" defaultValue={defaultValues.website} placeholder="https://" />

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-marble-900">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaultValues.notes}
          className="rounded border border-marble-300 px-3 py-2 text-sm text-marble-900 placeholder:text-marble-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 disabled:opacity-60 text-white font-medium px-5 h-10 text-sm"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label, name, type = "text", defaultValue, error, placeholder,
}: {
  label: string; name: string; type?: string; defaultValue?: string; error?: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-marble-900">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`rounded border px-3 py-2 text-sm text-marble-900 placeholder:text-marble-400 focus:outline-none focus:ring-2 focus:ring-brand-500 ${error ? "border-red-400" : "border-marble-300"}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
