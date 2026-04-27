"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CarpetType, ExclusionType, InclusionType, InstallMethod, LineCategory, RoomName, SubfloorType, UnitOfMeasure } from "@prisma/client";
import { Field, inputCls, requiredInputCls, requiredSelectCls, selectCls } from "./Field";
import { centsToDollarString } from "@/lib/money";
import { ROOMS } from "@/lib/rooms";
import { LINE_CATEGORIES, lineCategoryLabel } from "@/lib/line-categories";
import { UNITS } from "@/lib/units";
import { INCLUSION_CHIPS, EXCLUSION_CHIPS } from "@/lib/inclusions";
import {
  emptyLineItem, cryptoRandomKey,
  type AreaGroupFormValue, type LineItemFormValue,
  type FloorConditionFormValue, type MoldingsFormValue, type FixturesFormValue, type OtherInstructionsFormValue,
  type OrderInitialValues, type ActionState,
  type SalespersonOption, type AdvSourceOption,
} from "./InvoiceForm.shared";

export type { OrderInitialValues, ActionState } from "./InvoiceForm.shared";
export { emptyInitialValues, orderToInitial } from "./InvoiceForm.shared";

const CARPET_TYPES: { value: CarpetType; label: string }[] = [
  { value: CarpetType.plush, label: "Plush" },
  { value: CarpetType.berber, label: "Berber" },
  { value: CarpetType.glueDown, label: "Glue Down" },
  { value: CarpetType.plushWP, label: "Plush W/P" },
  { value: CarpetType.berberWP, label: "Berber W/P" },
];

const INSTALL_CATEGORIES = new Set<LineCategory>([
  LineCategory.vinyl, LineCategory.wood,
]);

// Room names that have a countable quantity field
const COUNTABLE_ROOMS = new Set(
  ROOMS.filter((r) => r.countable).map((r) => r.value)
);

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
  const [areaGroups, setAreaGroups] = useState<AreaGroupFormValue[]>(initial.areaGroups);
  const [inclusions, setInclusions] = useState<Set<InclusionType>>(new Set(initial.inclusions));
  const [exclusions, setExclusions] = useState<Set<ExclusionType>>(new Set(initial.exclusions));
  const [inclusionNotes, setInclusionNotes] = useState<string[]>(initial.inclusionNotes);
  const [exclusionNotes, setExclusionNotes] = useState<string[]>(initial.exclusionNotes);
  const [floorCond, setFloorCond] = useState<FloorConditionFormValue>(initial.floorCondition);
  const [moldings, setMoldings] = useState<MoldingsFormValue>(initial.moldings);
  const [fixtures, setFixtures] = useState<FixturesFormValue>(initial.fixtures);
  const [otherInstr, setOtherInstr] = useState<OtherInstructionsFormValue>(initial.otherInstructions);

  const errs = state && !state.ok ? state.errors ?? {} : {};
  const fieldErr = (k: string) => errs[k];

  const allLineItems = areaGroups.flatMap((g) => g.lineItems);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Salesperson */}
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

      {/* Section 2 — Sold To / Ship To */}
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

      {/* Section 3 — Area Groups */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-brand-700">Areas &amp; Line Items</p>
        </div>
        <input type="hidden" name="ag_count" value={areaGroups.length} />
        {areaGroups.map((group, i) => (
          <AreaGroupCard
            key={group.key}
            groupIndex={i}
            value={group}
            onChange={(updated) =>
              setAreaGroups((prev) => prev.map((g, j) => (j === i ? updated : g)))
            }
            onRemove={
              areaGroups.length > 1
                ? () => setAreaGroups((prev) => prev.filter((_, j) => j !== i))
                : undefined
            }
          />
        ))}
        <button
          type="button"
          onClick={() =>
            setAreaGroups((prev) => [
              ...prev,
              { key: cryptoRandomKey(), room: "", quantity: "", notes: "", lineItems: [emptyLineItem()] },
            ])
          }
          className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium text-sm self-start"
        >
          + Add Area
        </button>
      </div>

      {/* Section 4 — Includes / Excludes */}
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

      {/* ─── INTERNAL SECTIONS — Work Order only, not printed on invoice ─── */}
      <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-1">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide px-3 pt-2 pb-1">
          Work Order — internal use only (not printed on invoice)
        </p>

        {/* Floor Condition */}
        <fieldset className="bg-white border border-amber-200 rounded-lg p-4 m-2">
          <legend className="px-2 text-sm font-semibold text-amber-800">Floor Condition</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-marble-700 mb-1">Subfloor</label>
              <select
                name="oi_subfloorType"
                value={floorCond.subfloorType}
                onChange={(e) => setFloorCond((f) => ({ ...f, subfloorType: e.target.value as "" | SubfloorType }))}
                className="bg-marble-50 border border-marble-200 rounded px-2 py-1 text-sm text-marble-900"
              >
                <option value="">—</option>
                <option value="wood">Wood</option>
                <option value="concrete">Concrete</option>
                <option value="softConcrete">Soft Concrete</option>
                <option value="other">Other</option>
              </select>
            </div>
            <YesNoField
              label="Install Subfloor"
              name="oi_installSubfloor"
              value={floorCond.installSubfloor}
              onChange={(v) => setFloorCond((f) => ({ ...f, installSubfloor: v as "" | "yes" | "no" }))}
            />
            <YesNoField
              label="Pull Old Floor"
              name="oi_pullOldFloor"
              value={floorCond.pullOldFloor}
              onChange={(v) => setFloorCond((f) => ({ ...f, pullOldFloor: v as "" | "yes" | "no" }))}
            />
            <div>
              <label className="block text-xs text-marble-700 mb-1">Installation Method</label>
              <select
                name="oi_installMethod"
                value={floorCond.installMethod}
                onChange={(e) => setFloorCond((f) => ({ ...f, installMethod: e.target.value as "" | InstallMethod }))}
                className="bg-marble-50 border border-marble-200 rounded px-2 py-1 text-sm text-marble-900"
              >
                <option value="">—</option>
                <option value="glueDown">Glue Down</option>
                <option value="nailDown">Nail Down</option>
                <option value="click">Click</option>
                <option value="clip">Clip</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-marble-700 mb-1">Special Instructions</label>
              <textarea
                name="oi_specialInstructions"
                value={floorCond.specialInstructions}
                onChange={(e) => setFloorCond((f) => ({ ...f, specialInstructions: e.target.value }))}
                rows={2}
                className="w-full bg-marble-50 border border-marble-200 rounded px-2 py-1 text-sm text-marble-900"
              />
            </div>
          </div>
        </fieldset>

        {/* Moldings */}
        <fieldset className="bg-white border border-amber-200 rounded-lg p-4 m-2">
          <legend className="px-2 text-sm font-semibold text-amber-800">Moldings</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex flex-col gap-2">
              <MoldCheckbox
                name="moldingsRemoveReplace" label="Remove and replace existing"
                checked={moldings.removeReplace}
                onChange={(v) => setMoldings((m) => ({ ...m, removeReplace: v }))}
              />
              <MoldCheckbox
                name="mold_baseShoe" label="Base Shoes"
                checked={moldings.baseShoe}
                onChange={(v) => setMoldings((m) => ({ ...m, baseShoe: v }))}
              />
              <MoldCheckbox
                name="mold_baseboard" label="Baseboard"
                checked={moldings.baseboard}
                onChange={(v) => setMoldings((m) => ({ ...m, baseboard: v }))}
              />
              <MoldCheckbox
                name="mold_rubberCover4in" label='4" Rubber Cover'
                checked={moldings.rubberCover4in}
                onChange={(v) => setMoldings((m) => ({ ...m, rubberCover4in: v }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {([
                ["mold_quarterRound", "1/4 Round", "quarterRound"],
                ["mold_wallBase", "Wall Base", "wallBase"],
                ["mold_filmOnly", "Film Only", "filmOnly"],
                ["mold_filmAndFoam", "Film & Foam", "filmAndFoam"],
                ["mold_endMolding", "End Molding", "endMolding"],
                ["mold_stairNosing", "Stair Nosing", "stairNosing"],
                ["mold_tMolding", "T-Molding", "tMolding"],
                ["mold_reducer", "Reducer", "reducer"],
              ] as [string, string, keyof MoldingsFormValue][]).map(([name, label, key]) => (
                <div key={name} className="flex items-center gap-1">
                  <label className="text-xs text-marble-700 w-24 shrink-0">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={moldings[key] as string}
                    onChange={(e) => setMoldings((m) => ({ ...m, [key]: e.target.value }))}
                    placeholder="LF"
                    className="w-16 bg-marble-50 border border-marble-200 rounded px-2 py-0.5 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Fixtures */}
        <fieldset className="bg-white border border-amber-200 rounded-lg p-4 m-2">
          <legend className="px-2 text-sm font-semibold text-amber-800">Fixtures</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {([
              ["fix_stove", "Stove", "stove"],
              ["fix_fridge", "Ref", "fridge"],
              ["fix_washer", "Washer", "washer"],
              ["fix_dryer", "Dryer", "dryer"],
              ["fix_waterbed", "Waterbed", "waterbed"],
              ["fix_piano", "Piano", "piano"],
              ["fix_organ", "Organ", "organ"],
              ["fix_tablesChairs", "Tables & Chairs", "tablesChairs"],
            ] as [string, string, keyof FixturesFormValue][]).map(([name, label, key]) => (
              <label key={name} className="flex items-center gap-2 text-sm text-marble-900 bg-marble-50 border border-marble-200 rounded p-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={fixtures[key] as boolean}
                  onChange={(e) => setFixtures((f) => ({ ...f, [key]: e.target.checked }))}
                  className="rounded border-marble-300"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Other Instructions */}
        <fieldset className="bg-white border border-amber-200 rounded-lg p-4 m-2">
          <legend className="px-2 text-sm font-semibold text-amber-800">Other Instructions</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <YesNoField
              label="Remove Old Carpet & Pad"
              name="oi_removeOldCarpetAndPad"
              value={otherInstr.removeOldCarpetAndPad}
              onChange={(v) => setOtherInstr((o) => ({ ...o, removeOldCarpetAndPad: v as "" | "yes" | "no" }))}
            />
            <YesNoField
              label="Remove Old Tack Strip"
              name="oi_removeOldTagStrip"
              value={otherInstr.removeOldTagStrip}
              onChange={(v) => setOtherInstr((o) => ({ ...o, removeOldTagStrip: v as "" | "yes" | "no" }))}
            />
            <div className="flex items-end gap-3">
              <YesNoField
                label="Steps"
                name="oi_hasSteps"
                value={otherInstr.hasSteps}
                onChange={(v) => setOtherInstr((o) => ({ ...o, hasSteps: v as "" | "yes" | "no" }))}
              />
              {otherInstr.hasSteps === "yes" ? (
                <div className="flex items-center gap-1 pb-1">
                  <label className="text-xs text-marble-700 whitespace-nowrap"># steps</label>
                  <input
                    type="number"
                    name="oi_numSteps"
                    value={otherInstr.numSteps}
                    onChange={(e) => setOtherInstr((o) => ({ ...o, numSteps: e.target.value }))}
                    min={1}
                    className="w-16 bg-marble-50 border border-marble-200 rounded px-2 py-1 text-xs"
                  />
                </div>
              ) : null}
            </div>
            <div>
              <label className="block text-xs text-marble-700 mb-1">New Tack Strip</label>
              <select
                name="oi_newTackStripType"
                value={otherInstr.newTackStripType}
                onChange={(e) => setOtherInstr((o) => ({ ...o, newTackStripType: e.target.value as "" | "wood" | "concrete" }))}
                className="bg-marble-50 border border-marble-200 rounded px-2 py-1 text-sm text-marble-900"
              >
                <option value="">—</option>
                <option value="wood">Wood</option>
                <option value="concrete">Concrete</option>
              </select>
            </div>
            <YesNoField
              label="Empty House"
              name="oi_emptyHouse"
              value={otherInstr.emptyHouse}
              onChange={(v) => setOtherInstr((o) => ({ ...o, emptyHouse: v as "" | "yes" | "no" }))}
            />
            <YesNoField
              label="Heavy Furniture"
              name="oi_heavyFurniture"
              value={otherInstr.heavyFurniture}
              onChange={(v) => setOtherInstr((o) => ({ ...o, heavyFurniture: v as "" | "yes" | "no" }))}
            />
          </div>
        </fieldset>
      </div>

      {/* Section 5 — Remarks + Totals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-marble-100 border border-marble-200 rounded-lg p-4 flex flex-col gap-4">
          <Field label="Remarks" htmlFor="remarks">
            <textarea id="remarks" name="remarks" rows={4} defaultValue={initial.remarks} className={inputCls} />
          </Field>
          <Field label="Deposit notes" htmlFor="depositInstructions" hint="e.g. Customer to bring deposit on 8-19-24">
            <textarea id="depositInstructions" name="depositInstructions" rows={2} defaultValue={initial.depositInstructions} className={inputCls} />
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
        <Totals initial={initial} lineItems={allLineItems} />
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

// ---------- AreaGroupCard ----------

function AreaGroupCard({
  groupIndex,
  value,
  onChange,
  onRemove,
}: {
  groupIndex: number;
  value: AreaGroupFormValue;
  onChange: (updated: AreaGroupFormValue) => void;
  onRemove?: () => void;
}) {
  const isCountable = value.room ? COUNTABLE_ROOMS.has(value.room as RoomName) : false;

  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg p-4">
      {/* Header row: area dropdown, qty, notes, remove button */}
      <div className="flex flex-wrap gap-3 items-end mb-3">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-marble-700 mb-1">Area</label>
          <select
            value={value.room}
            onChange={(e) => onChange({ ...value, room: e.target.value as RoomName | "", quantity: "", notes: "" })}
            className="w-full bg-white border border-marble-200 rounded px-2 py-1.5 text-sm text-marble-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
          >
            <option value="">— No specific area —</option>
            {ROOMS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <input type="hidden" name={`ag_${groupIndex}_room`} value={value.room} />
        </div>
        {isCountable ? (
          <div className="w-20">
            <label className="block text-xs text-marble-700 mb-1">Qty</label>
            <input
              type="number"
              value={value.quantity}
              onChange={(e) => onChange({ ...value, quantity: e.target.value })}
              min={1}
              placeholder="#"
              className="w-full bg-white border border-marble-200 rounded px-2 py-1.5 text-sm text-marble-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
            />
          </div>
        ) : null}
        <input type="hidden" name={`ag_${groupIndex}_quantity`} value={value.quantity} />
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-marble-700 mb-1">Notes</label>
          <input
            type="text"
            value={value.notes}
            onChange={(e) => onChange({ ...value, notes: e.target.value })}
            placeholder="optional note"
            className="w-full bg-white border border-marble-200 rounded px-2 py-1.5 text-sm text-marble-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
          />
        </div>
        <input type="hidden" name={`ag_${groupIndex}_notes`} value={value.notes} />
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove area group"
            className="text-marble-700 hover:text-danger text-sm px-2 py-1.5 mb-0.5"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Line items for this area group */}
      <input type="hidden" name={`ag_${groupIndex}_li_count`} value={value.lineItems.length} />
      {value.lineItems.map((li, j) => (
        <LineItemRow
          key={li.key}
          groupIndex={groupIndex}
          liIndex={j}
          value={li}
          onChange={(next) =>
            onChange({
              ...value,
              lineItems: value.lineItems.map((x, k) => (k === j ? next : x)),
            })
          }
          onRemove={() =>
            onChange({
              ...value,
              lineItems: value.lineItems.filter((_, k) => k !== j),
            })
          }
        />
      ))}
      <button
        type="button"
        onClick={() =>
          onChange({ ...value, lineItems: [...value.lineItems, emptyLineItem()] })
        }
        className="mt-3 inline-flex items-center justify-center min-h-9 px-3 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium text-xs"
      >
        + Add line item
      </button>
    </div>
  );
}

// ---------- Sub-components ----------

function MoldCheckbox({ name, label, checked, onChange }: {
  name: string; label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-marble-900">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-marble-300"
      />
      {label}
    </label>
  );
}

function YesNoField({ label, name, value, onChange }: {
  label: string; name: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-marble-700 mb-1">{label}</label>
      <div className="flex gap-3">
        {(["yes", "no"] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-1 text-sm text-marble-900 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="accent-brand-700"
            />
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </label>
        ))}
        {value ? (
          <button type="button" onClick={() => onChange("")} className="text-xs text-marble-500 hover:text-marble-700">clear</button>
        ) : null}
      </div>
    </div>
  );
}

function formatAccounting(raw: string): string {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (!cleaned) return "";
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return raw;
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function LineItemRow({
  groupIndex, liIndex, value, onChange, onRemove,
}: {
  groupIndex: number;
  liIndex: number;
  value: LineItemFormValue;
  onChange: (next: LineItemFormValue) => void;
  onRemove: () => void;
}) {
  const prefix = `ag_${groupIndex}_li_${liIndex}`;
  const cellInput = "w-full bg-white border border-marble-200 rounded px-2 py-1 text-marble-900 text-xs focus:outline-none focus:ring-1 focus:ring-brand-700";

  const qty = Number((value.quantity || "0").replace(/[,\s]/g, ""));
  const price = Number((value.unitPriceCents || "0").replace(/[$,\s]/g, ""));
  const lineTotalCents =
    Number.isFinite(qty) && Number.isFinite(price) ? Math.round(qty * price * 100) : 0;

  const isCarpet = value.category === LineCategory.carpet;
  const hasInstallMethod = value.category ? INSTALL_CATEGORIES.has(value.category as LineCategory) : false;
  const isShower = value.category === LineCategory.shower;
  const isWood = value.category === LineCategory.wood;
  const isCounterTop = value.category === LineCategory.counterTop;

  return (
    <div className="border-t border-marble-200 first:border-t-0 py-3">
      {/* Main row */}
      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-12 sm:col-span-2">
          <label className="block text-xs text-marble-700 mb-1">Category</label>
          <select
            name={`${prefix}_category`}
            value={value.category}
            onChange={(e) => onChange({
              ...value,
              category: e.target.value as LineCategory,
              carpetType: "", pad: "", lineInstallMethod: "",
              showerWallSqft: "", showerWallMaterial: "", showerPan: "", showerPanMaterial: "",
              showerSoapBoxMaterial: "", showerBench: "", bathroomFloorSqft: "", bathroomFloorMaterial: "",
              showerSchluterSize: "", showerSchluterColor: "", showerGroutColor: "",
              showerTileVertical: "", showerTileHorizontal: "",
              woodWhiteRisers: "", woodMoistureBarrier: "", counterTopSeal: "",
            })}
            className={cellInput}
          >
            <option value="">—</option>
            {LINE_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
          </select>
        </div>
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-xs text-marble-700 mb-1">{isCarpet ? "Mill" : "Brand"}</label>
          <input type="text" name={`${prefix}_brand`} value={value.brand} onChange={(e) => onChange({ ...value, brand: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-xs text-marble-700 mb-1">Style</label>
          <input type="text" name={`${prefix}_style`} value={value.style} onChange={(e) => onChange({ ...value, style: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-xs text-marble-700 mb-1">Color</label>
          <input type="text" name={`${prefix}_color`} value={value.color} onChange={(e) => onChange({ ...value, color: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-3 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">Size</label>
          <input type="text" name={`${prefix}_sizeSpec`} value={value.sizeSpec} onChange={(e) => onChange({ ...value, sizeSpec: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-3 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">{isCarpet ? "Ref #" : "SKU"}</label>
          <input type="text" name={`${prefix}_sku`} value={value.sku} onChange={(e) => onChange({ ...value, sku: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">Qty</label>
          <input type="text" inputMode="decimal" name={`${prefix}_quantity`} value={value.quantity} onChange={(e) => onChange({ ...value, quantity: e.target.value })} className={`${cellInput} text-right tabular-money`} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">Unit</label>
          <select name={`${prefix}_unit`} value={value.unit} onChange={(e) => onChange({ ...value, unit: e.target.value as UnitOfMeasure })} className={cellInput}>
            <option value="">—</option>
            {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.short}</option>))}
          </select>
        </div>
        <div className="col-span-3 sm:col-span-1">
          <label className="block text-xs text-marble-700 mb-1">Unit $</label>
          <input
            type="text" inputMode="decimal"
            name={`${prefix}_unitPriceCents`}
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
          <input type="text" name={`${prefix}_notes`} value={value.notes} onChange={(e) => onChange({ ...value, notes: e.target.value })} className={cellInput} />
        </div>
        <div className="col-span-12 sm:col-span-1 flex sm:justify-end">
          <button type="button" onClick={onRemove} aria-label="Remove line item" className="text-marble-700 hover:text-danger text-sm px-2 py-1">
            ✕
          </button>
        </div>
      </div>

      {/* Category-specific extras row */}
      {(isCarpet || hasInstallMethod) ? (
        <div className="mt-2 flex flex-wrap gap-4 pl-1">
          {isCarpet ? (
            <>
              <div className="flex items-center gap-1">
                <label className="text-xs text-marble-700 whitespace-nowrap">Type</label>
                <select
                  name={`${prefix}_carpetType`}
                  value={value.carpetType}
                  onChange={(e) => onChange({ ...value, carpetType: e.target.value as CarpetType })}
                  className="bg-white border border-marble-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
                >
                  <option value="">— Type —</option>
                  {CARPET_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <label className="text-xs text-marble-700 whitespace-nowrap">Pad</label>
                <input
                  type="text"
                  name={`${prefix}_pad`}
                  value={value.pad}
                  onChange={(e) => onChange({ ...value, pad: e.target.value })}
                  placeholder="Pad spec"
                  className="bg-white border border-marble-200 rounded px-2 py-1 text-xs text-marble-900 w-36 focus:outline-none focus:ring-1 focus:ring-brand-700"
                />
              </div>
            </>
          ) : null}
          {hasInstallMethod ? (
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Install Method</label>
              <select
                name={`${prefix}_lineInstallMethod`}
                value={value.lineInstallMethod}
                onChange={(e) => onChange({ ...value, lineInstallMethod: e.target.value as InstallMethod })}
                className="bg-white border border-marble-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              >
                <option value="">— Method —</option>
                <option value="glueDown">Glue Down</option>
                <option value="nailDown">Nail Down</option>
                <option value="click">Click</option>
              </select>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Shower Specification — installer instructions only */}
      {isShower ? (
        <div className="border border-amber-200 rounded p-2 bg-amber-50 mt-2">
          <p className="text-xs font-semibold text-amber-700 mb-2">Shower Specification — (installer instructions only)</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {/* Row 1: shower wall sqft + material */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Shower wall sqft</label>
              <input
                type="number" step="any"
                name={`${prefix}_showerWallSqft`}
                value={value.showerWallSqft}
                onChange={(e) => onChange({ ...value, showerWallSqft: e.target.value })}
                className="w-20 bg-white border border-amber-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Wall material</label>
              <input
                type="text"
                name={`${prefix}_showerWallMaterial`}
                value={value.showerWallMaterial}
                onChange={(e) => onChange({ ...value, showerWallMaterial: e.target.value })}
                className="w-32 bg-white border border-amber-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            {/* Row 2: shower pan + pan material */}
            <LineYesNo
              label="Shower pan" name={`${prefix}_showerPan`}
              value={value.showerPan}
              onChange={(v) => onChange({ ...value, showerPan: v as "" | "yes" | "no" })}
            />
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Pan material</label>
              <input
                type="text"
                name={`${prefix}_showerPanMaterial`}
                value={value.showerPanMaterial}
                onChange={(e) => onChange({ ...value, showerPanMaterial: e.target.value })}
                className="w-32 bg-white border border-amber-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            {/* Row 3: soap box + bench */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Soap box material</label>
              <input
                type="text"
                name={`${prefix}_showerSoapBoxMaterial`}
                value={value.showerSoapBoxMaterial}
                onChange={(e) => onChange({ ...value, showerSoapBoxMaterial: e.target.value })}
                className="w-32 bg-white border border-amber-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <LineYesNo
              label="Bench" name={`${prefix}_showerBench`}
              value={value.showerBench}
              onChange={(v) => onChange({ ...value, showerBench: v as "" | "yes" | "no" })}
            />
            {/* Row 4: bathroom floor sqft + material */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Bath floor sqft</label>
              <input
                type="number" step="any"
                name={`${prefix}_bathroomFloorSqft`}
                value={value.bathroomFloorSqft}
                onChange={(e) => onChange({ ...value, bathroomFloorSqft: e.target.value })}
                className="w-20 bg-white border border-amber-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Floor material</label>
              <input
                type="text"
                name={`${prefix}_bathroomFloorMaterial`}
                value={value.bathroomFloorMaterial}
                onChange={(e) => onChange({ ...value, bathroomFloorMaterial: e.target.value })}
                className="w-32 bg-white border border-amber-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            {/* Row 5: schluter size + color */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Schluter size</label>
              <input
                type="text"
                name={`${prefix}_showerSchluterSize`}
                value={value.showerSchluterSize}
                onChange={(e) => onChange({ ...value, showerSchluterSize: e.target.value })}
                className="w-24 bg-white border border-amber-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Schluter color</label>
              <input
                type="text"
                name={`${prefix}_showerSchluterColor`}
                value={value.showerSchluterColor}
                onChange={(e) => onChange({ ...value, showerSchluterColor: e.target.value })}
                className="w-24 bg-white border border-amber-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            {/* Row 6: grout color + tile orientation */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-marble-700 whitespace-nowrap">Grout color</label>
              <input
                type="text"
                name={`${prefix}_showerGroutColor`}
                value={value.showerGroutColor}
                onChange={(e) => onChange({ ...value, showerGroutColor: e.target.value })}
                className="w-28 bg-white border border-amber-200 rounded px-2 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-marble-700 whitespace-nowrap">Tile installation:</span>
              <LineYesNo
                label="Vertical" name={`${prefix}_showerTileVertical`}
                value={value.showerTileVertical}
                onChange={(v) => onChange({ ...value, showerTileVertical: v as "" | "yes" | "no" })}
              />
              <LineYesNo
                label="Horizontal" name={`${prefix}_showerTileHorizontal`}
                value={value.showerTileHorizontal}
                onChange={(v) => onChange({ ...value, showerTileHorizontal: v as "" | "yes" | "no" })}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Wood Specification — installer instructions only */}
      {isWood ? (
        <div className="border border-amber-200 rounded p-2 bg-amber-50 mt-2">
          <p className="text-xs font-semibold text-amber-700 mb-2">Wood Specification — (installer instructions only)</p>
          <div className="flex flex-wrap gap-4">
            <LineYesNo
              label="White Risers" name={`${prefix}_woodWhiteRisers`}
              value={value.woodWhiteRisers}
              onChange={(v) => onChange({ ...value, woodWhiteRisers: v as "" | "yes" | "no" })}
            />
            <LineYesNo
              label="Moisture Barrier" name={`${prefix}_woodMoistureBarrier`}
              value={value.woodMoistureBarrier}
              onChange={(v) => onChange({ ...value, woodMoistureBarrier: v as "" | "yes" | "no" })}
            />
          </div>
        </div>
      ) : null}

      {/* Counter Top Specification — installer instructions only */}
      {isCounterTop ? (
        <div className="border border-amber-200 rounded p-2 bg-amber-50 mt-2">
          <p className="text-xs font-semibold text-amber-700 mb-2">Counter Top Specification — (installer instructions only)</p>
          <div className="flex flex-wrap gap-4">
            <LineYesNo
              label="Seal" name={`${prefix}_counterTopSeal`}
              value={value.counterTopSeal}
              onChange={(v) => onChange({ ...value, counterTopSeal: v as "" | "yes" | "no" })}
            />
          </div>
        </div>
      ) : null}

      {/* Hidden fields for category-specific extras (ensure they submit even when empty) */}
      {!isCarpet ? (
        <>
          <input type="hidden" name={`${prefix}_carpetType`} value="" />
          <input type="hidden" name={`${prefix}_pad`} value="" />
        </>
      ) : null}
      {!hasInstallMethod ? (
        <input type="hidden" name={`${prefix}_lineInstallMethod`} value="" />
      ) : null}
      {/* Hidden fields for unused category-specific installer fields */}
      {!isShower ? (
        <>
          <input type="hidden" name={`${prefix}_showerWallSqft`} value="" />
          <input type="hidden" name={`${prefix}_showerWallMaterial`} value="" />
          <input type="hidden" name={`${prefix}_showerPan`} value="" />
          <input type="hidden" name={`${prefix}_showerPanMaterial`} value="" />
          <input type="hidden" name={`${prefix}_showerSoapBoxMaterial`} value="" />
          <input type="hidden" name={`${prefix}_showerBench`} value="" />
          <input type="hidden" name={`${prefix}_bathroomFloorSqft`} value="" />
          <input type="hidden" name={`${prefix}_bathroomFloorMaterial`} value="" />
          <input type="hidden" name={`${prefix}_showerSchluterSize`} value="" />
          <input type="hidden" name={`${prefix}_showerSchluterColor`} value="" />
          <input type="hidden" name={`${prefix}_showerGroutColor`} value="" />
          <input type="hidden" name={`${prefix}_showerTileVertical`} value="" />
          <input type="hidden" name={`${prefix}_showerTileHorizontal`} value="" />
        </>
      ) : null}
      {!isWood ? (
        <>
          <input type="hidden" name={`${prefix}_woodWhiteRisers`} value="" />
          <input type="hidden" name={`${prefix}_woodMoistureBarrier`} value="" />
        </>
      ) : null}
      {!isCounterTop ? (
        <input type="hidden" name={`${prefix}_counterTopSeal`} value="" />
      ) : null}
    </div>
  );
}

// ---------- Inline yes/no for line item rows ----------
function LineYesNo({ label, name, value, onChange }: {
  label: string; name: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-marble-700 whitespace-nowrap">{label}</span>
      <label className="flex items-center gap-0.5 text-xs text-marble-900 cursor-pointer">
        <input
          type="radio" name={name} value="yes"
          checked={value === "yes"}
          onChange={() => onChange("yes")}
          className="accent-brand-700"
        />
        Yes
      </label>
      <label className="flex items-center gap-0.5 text-xs text-marble-900 cursor-pointer">
        <input
          type="radio" name={name} value="no"
          checked={value === "no"}
          onChange={() => onChange("no")}
          className="accent-brand-700"
        />
        No
      </label>
      {value ? (
        <button type="button" onClick={() => onChange("")} className="text-xs text-marble-400 hover:text-marble-600">×</button>
      ) : null}
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
            id="taxPercent" name="taxPercent" type="text" inputMode="decimal"
            value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)}
            placeholder="7.75" className={`${inputCls} text-right tabular-money`}
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
          id="depositCents" name="depositCents" type="text" inputMode="decimal"
          value={deposit} onChange={(e) => setDeposit(e.target.value)}
          onBlur={(e) => setDeposit(formatAccounting(e.target.value))}
          placeholder="0.00" className={`${inputCls} text-right tabular-money`}
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
