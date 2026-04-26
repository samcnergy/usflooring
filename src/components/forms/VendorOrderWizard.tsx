"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, inputCls, requiredInputCls } from "./Field";
import type { CreateVendorState } from "./VendorOrderWizard.shared";

// Re-export for client-side import convenience. Server components MUST
// import from "./VendorOrderWizard.shared" directly.
export type { CreateVendorState } from "./VendorOrderWizard.shared";

type MaterialOption = {
  id: string;
  lineNumber: number;
  millStyle: string | null;
  color: string | null;
  size: string | null;
};

type Props = {
  defaultVendorName: string;
  defaultPoSuggestion: string;
  materials: MaterialOption[];
  action: (prev: CreateVendorState, formData: FormData) => Promise<CreateVendorState>;
  cancelHref: string;
};

export function VendorOrderWizard({
  defaultVendorName,
  defaultPoSuggestion,
  materials,
  action,
  cancelHref,
}: Props) {
  const [state, formAction, pending] = useActionState<CreateVendorState, FormData>(action, null);
  const errs = state && !state.ok ? state.errors ?? {} : {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state && !state.ok && state.message ? (
        <p className="text-sm text-danger bg-marble-100 border border-danger rounded px-3 py-2" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="bg-marble-100 border border-marble-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Vendor name" htmlFor="vendorName" required hint="A new Vendor record is auto-created on first use." error={errs.vendorName}>
          <input id="vendorName" name="vendorName" required defaultValue={defaultVendorName} className={requiredInputCls} />
        </Field>
        <Field label="P.O. #" htmlFor="poNumber" required error={errs.poNumber}>
          <input id="poNumber" name="poNumber" required defaultValue={defaultPoSuggestion} className={requiredInputCls} />
        </Field>
        <Field label="Sidemark" htmlFor="sidemark">
          <input id="sidemark" name="sidemark" className={inputCls} />
        </Field>
        <Field label="Fax / e-mail date" htmlFor="faxEmailDate">
          <input type="date" id="faxEmailDate" name="faxEmailDate" className={inputCls} />
        </Field>
        <Field label="Will-call date" htmlFor="willCallDate">
          <input type="date" id="willCallDate" name="willCallDate" className={inputCls} />
        </Field>
        <Field label="Delivery date" htmlFor="deliveryDate">
          <input type="date" id="deliveryDate" name="deliveryDate" className={inputCls} />
        </Field>
        <Field label="Delivery address" htmlFor="deliveryAddress" className="sm:col-span-2">
          <input id="deliveryAddress" name="deliveryAddress" className={inputCls} />
        </Field>
      </div>

      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">
          Material lines on this PO {errs.materialLineIds ? <span className="text-danger">— {errs.materialLineIds}</span> : null}
        </legend>
        {materials.length === 0 ? (
          <p className="text-sm text-marble-700">
            No material lines on this order yet. Add some on the Work Order tab first.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {materials.map((m) => (
              <li key={m.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="materialLineIds"
                  value={m.id}
                  defaultChecked
                  className="mt-1 rounded border-marble-200"
                />
                <div className="text-sm">
                  <p className="text-marble-900 font-medium">Line {m.lineNumber}: {m.millStyle ?? "—"}</p>
                  <p className="text-marble-700 text-xs">
                    {m.color ?? "—"} · {m.size ?? "—"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <div className="flex items-center justify-end gap-3">
        <Link
          href={cancelHref}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending || materials.length === 0}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] disabled:opacity-50 disabled:pointer-events-none"
        >
          {pending ? "Creating…" : "Create PO"}
        </button>
      </div>
    </form>
  );
}
