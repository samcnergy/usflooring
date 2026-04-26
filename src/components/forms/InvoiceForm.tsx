"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Field, inputCls, requiredInputCls, requiredSelectCls, selectCls } from "./Field";
import { ORDER_AREAS } from "@/lib/order-areas";
import { centsToDollarString } from "@/lib/money";

type SalespersonOption = { id: string; fullName: string };
type AdvSourceOption = { id: string; name: string };

export type OrderInitialValues = {
  id?: string;
  invoiceNumber?: number;
  salespersonId: string;
  advertisingSourceId: string | null;
  dateOfSale: string;          // yyyy-mm-dd
  firstName: string;
  lastName: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  phoneHome: string;
  phoneWork: string;
  phoneExt: string;
  email: string;
  sameAsSoldTo: boolean;
  shipFirstName: string;
  shipLastName: string;
  shipAddressLine1: string;
  shipCity: string;
  shipState: string;
  shipZip: string;
  shipPhone: string;
  hasCabinet: boolean;
  hasCarpet: boolean;
  hasVinyl: boolean;
  hasWood: boolean;
  hasCeramic: boolean;
  hasCounterTop: boolean;
  hasFireplace: boolean;
  hasShower: boolean;
  areas: { areaName: string; quantity: string; description: string; lineTotal: string }[];
  taxCents: string;
  depositCents: string;
  basedOn: string;
  remarks: string;
  balanceTerm: "" | "cash" | "cod" | "finance";
};

export const emptyInitialValues = (defaultSalespersonId: string): OrderInitialValues => ({
  salespersonId: defaultSalespersonId,
  advertisingSourceId: null,
  dateOfSale: new Date().toISOString().slice(0, 10),
  firstName: "", lastName: "", addressLine1: "",
  city: "", state: "CA", zip: "",
  phoneHome: "", phoneWork: "", phoneExt: "", email: "",
  sameAsSoldTo: true,
  shipFirstName: "", shipLastName: "", shipAddressLine1: "",
  shipCity: "", shipState: "CA", shipZip: "", shipPhone: "",
  hasCabinet: false, hasCarpet: false, hasVinyl: false, hasWood: false,
  hasCeramic: false, hasCounterTop: false, hasFireplace: false, hasShower: false,
  areas: ORDER_AREAS.map((a) => ({
    areaName: a.value, quantity: "", description: "", lineTotal: "",
  })),
  taxCents: "", depositCents: "",
  basedOn: "", remarks: "", balanceTerm: "",
});

export function orderToInitial(order: {
  id: string;
  invoiceNumber: number;
  salespersonId: string;
  advertisingSourceId: string | null;
  dateOfSale: Date;
  hasCabinet: boolean; hasCarpet: boolean; hasVinyl: boolean; hasWood: boolean;
  hasCeramic: boolean; hasCounterTop: boolean; hasFireplace: boolean; hasShower: boolean;
  taxCents: number; depositCents: number;
  basedOn: string | null; remarks: string | null; balanceTerm: "cash" | "cod" | "finance" | null;
  customer: {
    firstName: string; lastName: string; addressLine1: string; city: string; state: string; zip: string;
    phoneHome: string | null; phoneWork: string | null; phoneExt: string | null; email: string | null;
    shipFirstName: string | null; shipLastName: string | null; shipAddressLine1: string | null;
    shipCity: string | null; shipState: string | null; shipZip: string | null; shipPhone: string | null;
  };
  areas: { areaName: string; quantity: number | null; description: string | null; lineTotalCents: number }[];
}): OrderInitialValues {
  const ship = order.customer;
  const same =
    ship.shipFirstName === order.customer.firstName &&
    ship.shipLastName  === order.customer.lastName  &&
    ship.shipAddressLine1 === order.customer.addressLine1;
  const moneyToInput = (cents: number) => (cents ? (cents / 100).toFixed(2) : "");
  return {
    id: order.id,
    invoiceNumber: order.invoiceNumber,
    salespersonId: order.salespersonId,
    advertisingSourceId: order.advertisingSourceId,
    dateOfSale: order.dateOfSale.toISOString().slice(0, 10),
    firstName: order.customer.firstName,
    lastName:  order.customer.lastName,
    addressLine1: order.customer.addressLine1,
    city:  order.customer.city,
    state: order.customer.state,
    zip:   order.customer.zip,
    phoneHome: order.customer.phoneHome ?? "",
    phoneWork: order.customer.phoneWork ?? "",
    phoneExt:  order.customer.phoneExt  ?? "",
    email:     order.customer.email     ?? "",
    sameAsSoldTo: same,
    shipFirstName: order.customer.shipFirstName ?? "",
    shipLastName:  order.customer.shipLastName  ?? "",
    shipAddressLine1: order.customer.shipAddressLine1 ?? "",
    shipCity:  order.customer.shipCity  ?? "",
    shipState: order.customer.shipState ?? "CA",
    shipZip:   order.customer.shipZip   ?? "",
    shipPhone: order.customer.shipPhone ?? "",
    hasCabinet: order.hasCabinet, hasCarpet: order.hasCarpet, hasVinyl: order.hasVinyl,
    hasWood: order.hasWood, hasCeramic: order.hasCeramic, hasCounterTop: order.hasCounterTop,
    hasFireplace: order.hasFireplace, hasShower: order.hasShower,
    areas: ORDER_AREAS.map((spec) => {
      const a = order.areas.find((x) => x.areaName === spec.value);
      return {
        areaName: spec.value,
        quantity: a?.quantity != null ? String(a.quantity) : "",
        description: a?.description ?? "",
        lineTotal: a ? moneyToInput(a.lineTotalCents) : "",
      };
    }),
    taxCents:     moneyToInput(order.taxCents),
    depositCents: moneyToInput(order.depositCents),
    basedOn:     order.basedOn ?? "",
    remarks:     order.remarks ?? "",
    balanceTerm: order.balanceTerm ?? "",
  };
}

export type ActionState =
  | { ok: true; orderId: string }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

type Props = {
  initial: OrderInitialValues;
  salespeople: SalespersonOption[];
  advertisingSources: AdvSourceOption[];
  /** When true, the salesperson dropdown is disabled (sales-context only). */
  lockSalesperson?: boolean;
  /** Server action. Receives FormData; returns ActionState (the page redirects on success via the action). */
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  cancelHref: string;
};

export function InvoiceForm({
  initial,
  salespeople,
  advertisingSources,
  lockSalesperson,
  action,
  submitLabel,
  cancelHref,
}: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);
  const [sameAs, setSameAs] = useState(initial.sameAsSoldTo);

  const errs = state && !state.ok ? state.errors ?? {} : {};
  const fieldErr = (k: string) => errs[k];

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Salesperson — first field, sticky on mobile */}
      <div className="sticky top-0 z-10 bg-marble-50 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-0 sm:static border-b border-marble-200 sm:border-0">
        <Field
          label="Salesperson"
          htmlFor="salespersonId"
          required
          error={fieldErr("salespersonId")}
        >
          <select
            id="salespersonId"
            name="salespersonId"
            defaultValue={initial.salespersonId}
            required
            disabled={lockSalesperson}
            className={requiredSelectCls}
          >
            <option value="">— Choose salesperson —</option>
            {salespeople.map((s) => (
              <option key={s.id} value={s.id}>{s.fullName}</option>
            ))}
          </select>
        </Field>
      </div>

      {state && !state.ok && state.message ? (
        <p className="text-sm text-danger bg-marble-100 border border-danger rounded px-3 py-2" role="alert">
          {state.message}
        </p>
      ) : null}

      {/* Header card */}
      <div className="bg-marble-100 border border-marble-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Date of sale" htmlFor="dateOfSale">
          <input
            type="date"
            id="dateOfSale"
            name="dateOfSale"
            defaultValue={initial.dateOfSale}
            className={inputCls}
          />
        </Field>
        <Field label="Invoice #" htmlFor="invoiceNumberDisplay" hint={initial.invoiceNumber ? undefined : "Assigned on save"}>
          <input
            id="invoiceNumberDisplay"
            type="text"
            value={initial.invoiceNumber ?? "— pending —"}
            disabled
            className={`${inputCls} text-marble-700 tabular-money`}
          />
        </Field>
        <Field label="Adv. source" htmlFor="advertisingSourceId">
          <select
            id="advertisingSourceId"
            name="advertisingSourceId"
            defaultValue={initial.advertisingSourceId ?? ""}
            className={selectCls}
          >
            <option value="">— None —</option>
            {advertisingSources.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Sold to */}
      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">Sold to</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name" htmlFor="firstName" required error={fieldErr("firstName")}>
            <input id="firstName" name="firstName" required defaultValue={initial.firstName} className={requiredInputCls} />
          </Field>
          <Field label="Last name" htmlFor="lastName" required error={fieldErr("lastName")}>
            <input id="lastName" name="lastName" required defaultValue={initial.lastName} className={requiredInputCls} />
          </Field>
          <Field label="Address" htmlFor="addressLine1" required error={fieldErr("addressLine1")} className="sm:col-span-2">
            <input id="addressLine1" name="addressLine1" required defaultValue={initial.addressLine1} className={requiredInputCls} />
          </Field>
          <Field label="City" htmlFor="city" required error={fieldErr("city")}>
            <input id="city" name="city" required defaultValue={initial.city} className={requiredInputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="State" htmlFor="state">
              <input id="state" name="state" maxLength={2} defaultValue={initial.state} className={inputCls} />
            </Field>
            <Field label="Zip" htmlFor="zip" required error={fieldErr("zip")}>
              <input id="zip" name="zip" required defaultValue={initial.zip} className={requiredInputCls} />
            </Field>
          </div>
          <Field label="Phone (home)" htmlFor="phoneHome">
            <input id="phoneHome" name="phoneHome" defaultValue={initial.phoneHome} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone (work)" htmlFor="phoneWork">
              <input id="phoneWork" name="phoneWork" defaultValue={initial.phoneWork} className={inputCls} />
            </Field>
            <Field label="Ext." htmlFor="phoneExt">
              <input id="phoneExt" name="phoneExt" defaultValue={initial.phoneExt} className={inputCls} />
            </Field>
          </div>
          <Field label="Email" htmlFor="email" className="sm:col-span-2">
            <input type="email" id="email" name="email" defaultValue={initial.email} className={inputCls} />
          </Field>
        </div>
      </fieldset>

      {/* Ship to */}
      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">Ship to</legend>
        <label className="flex items-center gap-2 text-sm text-marble-700 mb-3">
          <input
            type="checkbox"
            name="sameAsSoldTo"
            checked={sameAs}
            onChange={(e) => setSameAs(e.target.checked)}
            className="rounded border-marble-200"
          />
          Same as sold to
        </label>
        {!sameAs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First name" htmlFor="shipFirstName">
              <input id="shipFirstName" name="shipFirstName" defaultValue={initial.shipFirstName} className={inputCls} />
            </Field>
            <Field label="Last name" htmlFor="shipLastName">
              <input id="shipLastName" name="shipLastName" defaultValue={initial.shipLastName} className={inputCls} />
            </Field>
            <Field label="Address" htmlFor="shipAddressLine1" className="sm:col-span-2">
              <input id="shipAddressLine1" name="shipAddressLine1" defaultValue={initial.shipAddressLine1} className={inputCls} />
            </Field>
            <Field label="City" htmlFor="shipCity">
              <input id="shipCity" name="shipCity" defaultValue={initial.shipCity} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="State" htmlFor="shipState">
                <input id="shipState" name="shipState" maxLength={2} defaultValue={initial.shipState} className={inputCls} />
              </Field>
              <Field label="Zip" htmlFor="shipZip">
                <input id="shipZip" name="shipZip" defaultValue={initial.shipZip} className={inputCls} />
              </Field>
            </div>
            <Field label="Phone" htmlFor="shipPhone">
              <input id="shipPhone" name="shipPhone" defaultValue={initial.shipPhone} className={inputCls} />
            </Field>
          </div>
        ) : null}
      </fieldset>

      {/* Categories */}
      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">Categories</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {([
            ["hasCabinet", "Cabinet"], ["hasCarpet", "Carpet"], ["hasVinyl", "Vinyl"],
            ["hasWood", "Wood"], ["hasCeramic", "Ceramic"], ["hasCounterTop", "Counter Top"],
            ["hasFireplace", "Fireplace"], ["hasShower", "Shower"],
          ] as const).map(([name, label]) => (
            <label key={name} className="flex items-center gap-2 text-sm text-marble-900">
              <input
                type="checkbox"
                name={name}
                defaultChecked={initial[name]}
                className="rounded border-marble-200"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Areas table */}
      <div className="border border-marble-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-marble-100 text-marble-900">
            <tr>
              <th className="text-left px-3 py-2 font-semibold w-40">Area</th>
              <th className="text-left px-3 py-2 font-semibold w-16">#</th>
              <th className="text-left px-3 py-2 font-semibold">Description</th>
              <th className="text-right px-3 py-2 font-semibold w-32">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {initial.areas.map((area, i) => {
              const spec = ORDER_AREAS.find((s) => s.value === area.areaName);
              return (
                <tr key={area.areaName} className="border-t border-marble-200">
                  <td className="px-3 py-1.5 text-marble-900">{spec?.label}</td>
                  <td className="px-3 py-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      name={`area_${area.areaName}_quantity`}
                      defaultValue={area.quantity}
                      className="w-full bg-white border border-marble-200 rounded px-2 py-1 text-marble-900 tabular-money focus:outline-none focus:ring-1 focus:ring-brand-700"
                    />
                  </td>
                  <td className="px-3 py-1">
                    <input
                      type="text"
                      name={`area_${area.areaName}_description`}
                      defaultValue={area.description}
                      className="w-full bg-white border border-marble-200 rounded px-2 py-1 text-marble-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
                    />
                  </td>
                  <td className="px-3 py-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      name={`area_${area.areaName}_lineTotal`}
                      defaultValue={area.lineTotal}
                      placeholder="0.00"
                      className="w-full bg-white border border-marble-200 rounded px-2 py-1 text-marble-900 text-right tabular-money focus:outline-none focus:ring-1 focus:ring-brand-700"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-marble-100 border border-marble-200 rounded-lg p-4 flex flex-col gap-4">
          <Field label="Based on" htmlFor="basedOn" hint="Square Yards / Square Feet / Total — subject to measurement">
            <select id="basedOn" name="basedOn" defaultValue={initial.basedOn} className={selectCls}>
              <option value="">—</option>
              <option value="Square Yards">Square Yards</option>
              <option value="Square Feet">Square Feet</option>
              <option value="Total">Total</option>
            </select>
          </Field>
          <Field label="Remarks" htmlFor="remarks">
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              defaultValue={initial.remarks}
              className={inputCls}
            />
          </Field>
          <Field label="Balance terms" htmlFor="balanceTerm">
            <select id="balanceTerm" name="balanceTerm" defaultValue={initial.balanceTerm} className={selectCls}>
              <option value="">—</option>
              <option value="cash">Cash</option>
              <option value="cod">C.O.D.</option>
              <option value="finance">Finance</option>
            </select>
          </Field>
        </div>
        <div className="bg-marble-100 border border-marble-200 rounded-lg p-4 flex flex-col gap-3">
          <Totals initial={initial} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-12">
        <Link
          href={cancelHref}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] disabled:opacity-50 disabled:pointer-events-none"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

// Totals card. Subtotal/Total/Balance live-update from the area inputs via a
// passive client computation; the server recomputes authoritatively on save.
function Totals({ initial }: { initial: OrderInitialValues }) {
  const [tax, setTax] = useState(initial.taxCents);
  const [deposit, setDeposit] = useState(initial.depositCents);
  const [, force] = useState(0);

  // Recompute on every render. Read live values from form inputs by name.
  const formEl = typeof document !== "undefined" ? document.querySelector("form") : null;
  let subtotal = 0;
  if (formEl) {
    for (const a of initial.areas) {
      const el = formEl.elements.namedItem(`area_${a.areaName}_lineTotal`) as HTMLInputElement | null;
      const v = el?.value ?? a.lineTotal;
      const n = Number((v || "0").replace(/[$,\s]/g, ""));
      if (Number.isFinite(n)) subtotal += n * 100;
    }
  } else {
    subtotal = initial.areas.reduce((s, a) => {
      const n = Number((a.lineTotal || "0").replace(/[$,\s]/g, ""));
      return s + (Number.isFinite(n) ? n * 100 : 0);
    }, 0);
  }
  const taxCents     = Math.round(Number((tax     || "0").replace(/[$,\s]/g, "")) * 100);
  const depositCents = Math.round(Number((deposit || "0").replace(/[$,\s]/g, "")) * 100);
  const totalCents = subtotal + (Number.isFinite(taxCents) ? taxCents : 0);
  const balanceCents = totalCents - (Number.isFinite(depositCents) ? depositCents : 0);

  return (
    <>
      <Row label="Sub-total" value={centsToDollarString(Math.round(subtotal))} />
      <Field label="Tax ($)" htmlFor="taxCents">
        <input
          id="taxCents"
          name="taxCents"
          type="text"
          inputMode="decimal"
          value={tax}
          onChange={(e) => { setTax(e.target.value); force((x) => x + 1); }}
          placeholder="0.00"
          className={`${inputCls} text-right tabular-money`}
        />
      </Field>
      <Row label="Total" value={centsToDollarString(totalCents)} bold />
      <Field label="Deposit ($)" htmlFor="depositCents">
        <input
          id="depositCents"
          name="depositCents"
          type="text"
          inputMode="decimal"
          value={deposit}
          onChange={(e) => { setDeposit(e.target.value); force((x) => x + 1); }}
          placeholder="0.00"
          className={`${inputCls} text-right tabular-money`}
        />
      </Field>
      <Row label="Balance" value={centsToDollarString(balanceCents)} bold />
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-marble-700">{label}</span>
      <span className={`tabular-money ${bold ? "text-marble-900 font-semibold" : "text-marble-900"}`}>
        {value}
      </span>
    </div>
  );
}
