"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ExclusionType, InclusionType, LineCategory, RoomName, UnitOfMeasure } from "@prisma/client";
import { Field, inputCls, requiredInputCls, requiredSelectCls, selectCls } from "./Field";
import { centsToDollarString } from "@/lib/money";
import { ROOMS } from "@/lib/rooms";
import { LINE_CATEGORIES, lineCategoryLabel } from "@/lib/line-categories";
import { UNITS } from "@/lib/units";
import { INCLUSION_CHIPS, EXCLUSION_CHIPS } from "@/lib/inclusions";
import {
  emptyLineItem, type LineItemFormValue,
  type OrderInitialValues, type ActionState,
  type SalespersonOption, type AdvSourceOption,
} from "./InvoiceForm.shared";

export type { OrderInitialValues, ActionState } from "./InvoiceForm.shared";
export { emptyInitialValues, orderToInitial } from "./InvoiceForm.shared";

type Props = {
  initial: OrderInitialValues;
  salespeople: SalespersonOption[];
  advertisingSources: AdvSourceOption[];
  lockSalesperson?: boolean;
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
  const [siteSame, setSiteSame] = useState(initial.jobSiteSameAsBilling);
  const [rooms, setRooms] = useState(initial.rooms);
  const [lineItems, setLineItems] = useState<LineItemFormValue[]>(initial.lineItems);
  const [inclusions, setInclusions] = useState<Set<InclusionType>>(new Set(initial.inclusions));
  const [exclusions, setExclusions] = useState<Set<ExclusionType>>(new Set(initial.exclusions));
  const [inclusionNotes, setInclusionNotes] = useState<string[]>(initial.inclusionNotes);
  const [exclusionNotes, setExclusionNotes] = useState<string[]>(initial.exclusionNotes);

  const errs = state && !state.ok ? state.errors ?? {} : {};
  const fieldErr = (k: string) => errs[k];

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Salesperson — sticky required first field */}
      <div className="sticky top-0 z-10 bg-marble-50 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-0 sm:static border-b border-marble-200 sm:border-0">
        <Field label="Salesperson" htmlFor="salespersonId" required error={fieldErr("salespersonId")}>
          <select
            id="salespersonId" name="salespersonId" defaultValue={initial.salespersonId}
            required disabled={lockSalesperson} className={requiredSelectCls}
          >
            <option value="">— Choose salesperson —</option>
            {salespeople.map((s) => (<option key={s.id} value={s.id}>{s.fullName}</option>))}
          </select>
        </Field>
      </div>

      {state && !state.ok && state.message ? (
        <p className="text-sm text-danger bg-marble-100 border border-danger rounded px-3 py-2" role="alert">
          {state.message}
        </p>
      ) : null}

      {/* Section 1 — Header */}
      <div className="bg-marble-100 border border-marble-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Date of sale" htmlFor="dateOfSale">
          <input type="date" id="dateOfSale" name="dateOfSale" defaultValue={initial.dateOfSale} className={inputCls} />
        </Field>
        <Field label="Invoice #" htmlFor="invoiceNumberDisplay" hint={initial.invoiceNumber ? undefined : "Assigned on save"}>
          <input id="invoiceNumberDisplay" type="text" value={initial.invoiceNumber ?? "— pending —"} disabled className={`${inputCls} text-marble-700 tabular-money`} />
        </Field>
        <Field label="Adv. source" htmlFor="advertisingSourceId">
          <select id="advertisingSourceId" name="advertisingSourceId" defaultValue={initial.advertisingSourceId ?? ""} className={selectCls}>
            <option value="">— None —</option>
            {advertisingSources.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
          </select>
        </Field>
      </div>

      {/* Section 2 — Sold To / Ship To / Job Site */}
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

      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">Ship to</legend>
        <label className="flex items-center gap-2 text-sm text-marble-700 mb-3">
          <input type="checkbox" name="sameAsSoldTo" checked={sameAs} onChange={(e) => setSameAs(e.target.checked)} className="rounded border-marble-200" />
          Same as sold to
        </label>
        {!sameAs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First name" htmlFor="shipFirstName"><input id="shipFirstName" name="shipFirstName" defaultValue={initial.shipFirstName} className={inputCls} /></Field>
            <Field label="Last name" htmlFor="shipLastName"><input id="shipLastName" name="shipLastName" defaultValue={initial.shipLastName} className={inputCls} /></Field>
            <Field label="Address" htmlFor="shipAddressLine1" className="sm:col-span-2"><input id="shipAddressLine1" name="shipAddressLine1" defaultValue={initial.shipAddressLine1} className={inputCls} /></Field>
            <Field label="City" htmlFor="shipCity"><input id="shipCity" name="shipCity" defaultValue={initial.shipCity} className={inputCls} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="State" htmlFor="shipState"><input id="shipState" name="shipState" maxLength={2} defaultValue={initial.shipState} className={inputCls} /></Field>
              <Field label="Zip" htmlFor="shipZip"><input id="shipZip" name="shipZip" defaultValue={initial.shipZip} className={inputCls} /></Field>
            </div>
            <Field label="Phone" htmlFor="shipPhone"><input id="shipPhone" name="shipPhone" defaultValue={initial.shipPhone} className={inputCls} /></Field>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">Job site</legend>
        <Field label="Deposit notes" htmlFor="depositInstructions" hint="e.g. Customer to bring deposit on 8-19-24" className="mb-3">
          <textarea id="depositInstructions" name="depositInstructions" rows={2} defaultValue={initial.depositInstructions} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-marble-700 mb-3">
          <input type="checkbox" name="jobSiteSameAsBilling" checked={siteSame} onChange={(e) => setSiteSame(e.target.checked)} className="rounded border-marble-200" />
          Same as billing
        </label>
        {!siteSame ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Address" htmlFor="jobSiteAddressLine1" className="sm:col-span-2"><input id="jobSiteAddressLine1" name="jobSiteAddressLine1" defaultValue={initial.jobSiteAddressLine1} className={inputCls} /></Field>
            <Field label="City" htmlFor="jobSiteCity"><input id="jobSiteCity" name="jobSiteCity" defaultValue={initial.jobSiteCity} className={inputCls} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="State" htmlFor="jobSiteState"><input id="jobSiteState" name="jobSiteState" maxLength={2} defaultValue={initial.jobSiteState} className={inputCls} /></Field>
              <Field label="Zip" htmlFor="jobSiteZip"><input id="jobSiteZip" name="jobSiteZip" defaultValue={initial.jobSiteZip} className={inputCls} /></Field>
            </div>
            <Field label="Site contact name" htmlFor="siteContactName"><input id="siteContactName" name="siteContactName" defaultValue={initial.siteContactName} className={inputCls} /></Field>
            <Field label="Site contact phone" htmlFor="siteContactPhone"><input id="siteContactPhone" name="siteContactPhone" defaultValue={initial.siteContactPhone} className={inputCls} /></Field>
            <Field label="Access instructions" htmlFor="accessInstructions" hint="e.g. Ask for Irwin, side gate, lockbox 1234" className="sm:col-span-2">
              <textarea id="accessInstructions" name="accessInstructions" rows={2} defaultValue={initial.accessInstructions} className={inputCls} />
            </Field>
          </div>
        ) : null}
      </fieldset>

      {/* Section 3 — Rooms involved */}
      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">Rooms involved</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ROOMS.map((spec) => {
            const value = rooms.find((r) => r.room === spec.value)!;
            return (
              <RoomCheckbox
                key={spec.value}
                spec={spec}
                value={value}
                onChange={(updates) =>
                  setRooms((prev) => prev.map((r) => (r.room === spec.value ? { ...r, ...updates } : r)))
                }
              />
            );
          })}
        </div>
      </fieldset>

      {/* Section 4 — Line items */}
      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">Line items</legend>
        <input type="hidden" name="li_count" value={lineItems.length} />
        {lineItems.map((li, i) => (
          <LineItemRow
            key={li.key}
            index={i}
            value={li}
            onChange={(next) => setLineItems((prev) => prev.map((x, j) => (j === i ? next : x)))}
            onRemove={() => setLineItems((prev) => prev.filter((_, j) => j !== i))}
          />
        ))}
        <button
          type="button"
          onClick={() => setLineItems((prev) => [...prev, emptyLineItem()])}
          className="mt-3 inline-flex items-center justify-center min-h-11 px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium text-sm"
        >
          + Add line item
        </button>
      </fieldset>

      {/* Section 5 — Includes / Excludes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChipsPanel
          title="Price includes"
          chips={INCLUSION_CHIPS}
          selected={inclusions}
          onToggle={(t) => setInclusions((s) => {
            const next = new Set(s);
            if (next.has(t as InclusionType)) next.delete(t as InclusionType);
            else next.add(t as InclusionType);
            return next;
          })}
          customNotes={inclusionNotes}
          setCustomNotes={setInclusionNotes}
          chipPrefix="inc_"
          customPrefix="inc_custom_"
        />
        <ChipsPanel
          title="Not included"
          chips={EXCLUSION_CHIPS}
          selected={exclusions}
          onToggle={(t) => setExclusions((s) => {
            const next = new Set(s);
            if (next.has(t as ExclusionType)) next.delete(t as ExclusionType);
            else next.add(t as ExclusionType);
            return next;
          })}
          customNotes={exclusionNotes}
          setCustomNotes={setExclusionNotes}
          chipPrefix="exc_"
          customPrefix="exc_custom_"
          muted
        />
      </div>

      {/* Section 6 — Remarks + Section 7 — Totals */}
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
            <textarea id="remarks" name="remarks" rows={4} defaultValue={initial.remarks} className={inputCls} />
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
        <Totals initial={initial} lineItems={lineItems} />
      </div>

      <div className="flex items-center justify-end gap-3 pb-12">
        <Link href={cancelHref} className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium">Cancel</Link>
        <button type="submit" disabled={pending} className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] disabled:opacity-50 disabled:pointer-events-none">
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

// ---------- Sub-components ----------

function RoomCheckbox({
  spec,
  value,
  onChange,
}: {
  spec: { value: RoomName; label: string; countable: boolean };
  value: { room: RoomName; on: boolean; quantity: string; notes: string };
  onChange: (updates: Partial<{ on: boolean; quantity: string; notes: string }>) => void;
}) {
  const [showNote, setShowNote] = useState(!!value.notes);
  return (
    <div className="bg-white border border-marble-200 rounded p-2">
      <label className="flex items-center gap-2 text-sm text-marble-900">
        <input
          type="checkbox"
          name={`room_${spec.value}_on`}
          checked={value.on}
          onChange={(e) => onChange({ on: e.target.checked })}
          className="rounded border-marble-200"
        />
        {spec.label}
      </label>
      {value.on && spec.countable ? (
        <input
          type="number"
          name={`room_${spec.value}_quantity`}
          value={value.quantity}
          onChange={(e) => onChange({ quantity: e.target.value })}
          placeholder="#"
          className="mt-1 w-16 bg-white border border-marble-200 rounded px-2 py-0.5 text-marble-900 text-xs"
          min={1}
        />
      ) : null}
      {value.on ? (
        <>
          {!showNote ? (
            <button type="button" onClick={() => setShowNote(true)} className="block mt-1 text-xs text-brand-700 hover:underline">
              + note
            </button>
          ) : (
            <input
              type="text"
              name={`room_${spec.value}_notes`}
              value={value.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="note"
              className="mt-1 w-full bg-white border border-marble-200 rounded px-2 py-0.5 text-marble-900 text-xs"
              autoFocus
            />
          )}
        </>
      ) : null}
    </div>
  );
}

/** Format a money string in accounting style: "1234.5" → "1,234.50". Empty
 *  / non-numeric strings pass through unchanged so the user can still
 *  delete + retype. */
function formatAccounting(raw: string): string {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (!cleaned) return "";
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return raw;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function LineItemRow({
  index, value, onChange, onRemove,
}: {
  index: number;
  value: LineItemFormValue;
  onChange: (next: LineItemFormValue) => void;
  onRemove: () => void;
}) {
  const cellInput = "w-full bg-white border border-marble-200 rounded px-2 py-1 text-marble-900 text-xs focus:outline-none focus:ring-1 focus:ring-brand-700";

  // Live line total. Quantity is a unit count; price is in dollars (user-typed).
  // centsToDollarString takes cents, so multiply by 100 once at the end.
  const qty = Number((value.quantity || "0").replace(/[,\s]/g, ""));
  const price = Number((value.unitPriceCents || "0").replace(/[$,\s]/g, ""));
  const lineTotalCents =
    Number.isFinite(qty) && Number.isFinite(price) ? Math.round(qty * price * 100) : 0;

  return (
    <div className="border-t border-marble-200 first:border-t-0 py-3">
      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-12 sm:col-span-2">
          <label className="block text-xs text-marble-700 mb-1">Category</label>
          <select
            name={`li_${index}_category`}
            value={value.category}
            onChange={(e) => onChange({ ...value, category: e.target.value as LineCategory })}
            className={cellInput}
          >
            <option value="">—</option>
            {LINE_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
          </select>
        </div>
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-xs text-marble-700 mb-1">Brand</label>
          <input type="text" name={`li_${index}_brand`} value={value.brand} onChange={(e) => onChange({ ...value, brand: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-xs text-marble-700 mb-1">Style</label>
          <input type="text" name={`li_${index}_style`} value={value.style} onChange={(e) => onChange({ ...value, style: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-xs text-marble-700 mb-1">Color</label>
          <input type="text" name={`li_${index}_color`} value={value.color} onChange={(e) => onChange({ ...value, color: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-3 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">Size</label>
          <input type="text" name={`li_${index}_sizeSpec`} value={value.sizeSpec} onChange={(e) => onChange({ ...value, sizeSpec: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-3 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">SKU</label>
          <input type="text" name={`li_${index}_sku`} value={value.sku} onChange={(e) => onChange({ ...value, sku: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">Qty</label>
          <input type="text" inputMode="decimal" name={`li_${index}_quantity`} value={value.quantity} onChange={(e) => onChange({ ...value, quantity: e.target.value })} className={`${cellInput} text-right tabular-money`} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">Unit</label>
          <select name={`li_${index}_unit`} value={value.unit} onChange={(e) => onChange({ ...value, unit: e.target.value as UnitOfMeasure })} className={cellInput}>
            <option value="">—</option>
            {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.short}</option>))}
          </select>
        </div>
        <div className="col-span-3 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">Unit $</label>
          <input
            type="text"
            inputMode="decimal"
            name={`li_${index}_unitPriceCents`}
            value={value.unitPriceCents}
            onChange={(e) => onChange({ ...value, unitPriceCents: e.target.value })}
            onBlur={(e) => onChange({ ...value, unitPriceCents: formatAccounting(e.target.value) })}
            className={`${cellInput} text-right tabular-money`}
          />
        </div>
        <div className="col-span-3 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">Total</label>
          <p className="text-xs text-marble-900 tabular-money font-medium px-2 py-1 text-right">
            {centsToDollarString(lineTotalCents)}
          </p>
        </div>
        <div className="col-span-12 sm:col-span-3">
          <label className="block text-xs text-marble-700 mb-1">Notes</label>
          <input type="text" name={`li_${index}_notes`} value={value.notes} onChange={(e) => onChange({ ...value, notes: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-12 sm:col-span-1 flex sm:justify-end">
          <button type="button" onClick={onRemove} aria-label="Remove line item" className="text-marble-700 hover:text-danger text-sm px-2 py-1">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

function ChipsPanel<T extends string>({
  title, chips, selected, onToggle, customNotes, setCustomNotes,
  chipPrefix, customPrefix, muted,
}: {
  title: string;
  chips: { value: T; label: string }[];
  selected: Set<T>;
  onToggle: (v: T) => void;
  customNotes: string[];
  setCustomNotes: (next: string[]) => void;
  chipPrefix: string;
  customPrefix: string;
  muted?: boolean;
}) {
  return (
    <fieldset className={`border rounded-lg p-4 ${muted ? "bg-marble-100/60 border-marble-200" : "bg-marble-100 border-marble-200"}`}>
      <legend className={`px-2 text-sm font-semibold ${muted ? "text-marble-700" : "text-brand-700"}`}>{title}</legend>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const active = selected.has(c.value);
          return (
            <label key={c.value} className="cursor-pointer">
              <input
                type="checkbox"
                name={`${chipPrefix}${c.value}`}
                checked={active}
                onChange={() => onToggle(c.value)}
                className="sr-only peer"
              />
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${active
                  ? "bg-brand-700 text-white border-brand-700"
                  : "bg-white text-marble-700 border-marble-200 hover:border-brand-700"}`}>
                {c.label}
              </span>
            </label>
          );
        })}
      </div>
      {customNotes.length > 0 ? (
        <div className="mt-3 flex flex-col gap-2">
          {customNotes.map((note, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                name={`${customPrefix}${i}`}
                value={note}
                onChange={(e) => setCustomNotes(customNotes.map((n, j) => (j === i ? e.target.value : n)))}
                placeholder="Custom note"
                className="flex-1 bg-white border border-marble-200 rounded px-2 py-1 text-xs"
              />
              <button type="button" onClick={() => setCustomNotes(customNotes.filter((_, j) => j !== i))} className="text-marble-700 hover:text-danger text-sm">✕</button>
            </div>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setCustomNotes([...customNotes, ""])}
        className="mt-2 text-xs text-brand-700 hover:underline"
      >
        + Add custom
      </button>
    </fieldset>
  );
}

function Totals({
  initial, lineItems,
}: {
  initial: OrderInitialValues;
  lineItems: LineItemFormValue[];
}) {
  const [taxPercent, setTaxPercent] = useState(initial.taxPercent);
  const [deposit, setDeposit] = useState(initial.depositCents);

  const subtotalCents = lineItems.reduce((acc, li) => {
    const q = Number((li.quantity || "0").replace(/[,\s]/g, ""));
    const p = Number((li.unitPriceCents || "0").replace(/[$,\s]/g, ""));
    if (Number.isFinite(q) && Number.isFinite(p)) return acc + Math.round(q * p * 100);
    return acc;
  }, 0);
  const pctNum = Number((taxPercent || "0").replace(/[%\s]/g, ""));
  const depositCents = Math.round(Number((deposit || "0").replace(/[$,\s]/g, "")) * 100);
  const taxCents = Math.round((subtotalCents * pctNum) / 100);
  const totalCents = subtotalCents + taxCents;
  const balanceCents = totalCents - depositCents;

  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg p-4 flex flex-col gap-3">
      <input type="hidden" name="pricingMode" value="itemized" />
      <Row label="Sub-total" value={centsToDollarString(subtotalCents)} />
      <div className="grid grid-cols-2 gap-3 items-end">
        <Field label="Tax %" htmlFor="taxPercent" hint="Default 7.75%">
          <input
            id="taxPercent"
            name="taxPercent"
            type="text"
            inputMode="decimal"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
            placeholder="7.75"
            className={`${inputCls} text-right tabular-money`}
          />
        </Field>
        <div className="pb-2">
          <p className="text-xs text-marble-700">Tax amount</p>
          <p className="text-marble-900 tabular-money font-medium text-right pr-2">{centsToDollarString(taxCents)}</p>
        </div>
      </div>
      <Row label="Total" value={centsToDollarString(totalCents)} bold />
      <Field label="Deposit ($)" htmlFor="depositCents">
        <input
          id="depositCents"
          name="depositCents"
          type="text"
          inputMode="decimal"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          onBlur={(e) => setDeposit(formatAccounting(e.target.value))}
          placeholder="0.00"
          className={`${inputCls} text-right tabular-money`}
        />
      </Field>
      <Row label="Balance" value={centsToDollarString(balanceCents)} bold />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-marble-700">{label}</span>
      <span className={`tabular-money ${bold ? "text-marble-900 font-semibold" : "text-marble-900"}`}>{value}</span>
    </div>
  );
}
