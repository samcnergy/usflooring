"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, inputCls, selectCls } from "./Field";

export type WorkOrderInitialValues = {
  availabilityDate: string;
  deliveryDate: string;
  installerName: string;
  installationDate: string;
  subfloorType: string;
  installSubfloor: string;
  pullOldFloor: string;
  oldFloorType: string;
  oldFloorSize: string;
  installMethod: string;
  carpetType: string;
  specialInstructions: string;
  materials: {
    lineNumber: number;
    millStyle: string; size: string; color: string; refNumber: string;
    pad: string; areas: string; vendorName: string;
    unitOfMeasure: string; quantity: string; unitPrice: string;
  }[];
};

const dateToInput = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");
const moneyToInput = (cents: number | null | undefined) => (cents ? (cents / 100).toFixed(2) : "");
const numToInput = (n: number | null | undefined) => (n != null ? String(n) : "");

export function workOrderToInitial(order: {
  availabilityDate: Date | null; deliveryDate: Date | null;
  installerName: string | null; installationDate: Date | null;
  subfloorType: string | null;
  installSubfloor: boolean | null; pullOldFloor: boolean | null;
  oldFloorType: string | null; oldFloorSize: string | null;
  installMethod: string | null; specialInstructions: string | null;
  materials: {
    lineNumber: number;
    millStyle: string | null; size: string | null; color: string | null;
    refNumber: string | null; pad: string | null; areas: string | null;
    vendorName: string | null; carpetType: string | null;
    unitOfMeasure: string | null; quantity: number | null;
    unitPriceCents: number | null;
  }[];
}): WorkOrderInitialValues {
  const carpetType = order.materials.find((m) => m.carpetType)?.carpetType ?? "";
  return {
    availabilityDate: dateToInput(order.availabilityDate),
    deliveryDate:     dateToInput(order.deliveryDate),
    installerName:    order.installerName ?? "",
    installationDate: dateToInput(order.installationDate),
    subfloorType:     order.subfloorType ?? "",
    installSubfloor:  order.installSubfloor === null ? "" : String(order.installSubfloor),
    pullOldFloor:     order.pullOldFloor === null ? "" : String(order.pullOldFloor),
    oldFloorType:     order.oldFloorType ?? "",
    oldFloorSize:     order.oldFloorSize ?? "",
    installMethod:    order.installMethod ?? "",
    carpetType,
    specialInstructions: order.specialInstructions ?? "",
    materials: [1, 2, 3, 4].map((n) => {
      const m = order.materials.find((x) => x.lineNumber === n);
      return {
        lineNumber: n,
        millStyle: m?.millStyle ?? "",
        size:      m?.size ?? "",
        color:     m?.color ?? "",
        refNumber: m?.refNumber ?? "",
        pad:       m?.pad ?? "",
        areas:     m?.areas ?? "",
        vendorName:    m?.vendorName ?? "",
        unitOfMeasure: m?.unitOfMeasure ?? "",
        quantity:      numToInput(m?.quantity),
        unitPrice:     moneyToInput(m?.unitPriceCents),
      };
    }),
  };
}

export type WorkOrderActionState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

type Props = {
  initial: WorkOrderInitialValues;
  action: (prev: WorkOrderActionState, formData: FormData) => Promise<WorkOrderActionState>;
  cancelHref: string;
};

export function WorkOrderForm({ initial, action, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState<WorkOrderActionState, FormData>(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state && !state.ok && state.message ? (
        <p className="text-sm text-danger bg-marble-100 border border-danger rounded px-3 py-2" role="alert">
          {state.message}
        </p>
      ) : null}

      {/* Top metadata */}
      <div className="bg-marble-100 border border-marble-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Availability date" htmlFor="availabilityDate">
          <input type="date" id="availabilityDate" name="availabilityDate" defaultValue={initial.availabilityDate} className={inputCls} />
        </Field>
        <Field label="Delivery date" htmlFor="deliveryDate">
          <input type="date" id="deliveryDate" name="deliveryDate" defaultValue={initial.deliveryDate} className={inputCls} />
        </Field>
        <Field label="Installer" htmlFor="installerName">
          <input type="text" id="installerName" name="installerName" defaultValue={initial.installerName} className={inputCls} />
        </Field>
        <Field label="Installation date" htmlFor="installationDate">
          <input type="date" id="installationDate" name="installationDate" defaultValue={initial.installationDate} className={inputCls} />
        </Field>
      </div>

      {/* Material lines (1-4) */}
      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">Material Lines</legend>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-marble-700">
                <th className="px-2 pb-1">#</th>
                <th className="px-2 pb-1">Mil/Style</th>
                <th className="px-2 pb-1">Size</th>
                <th className="px-2 pb-1">Color</th>
                <th className="px-2 pb-1">Ref #</th>
                <th className="px-2 pb-1">Pad</th>
                <th className="px-2 pb-1">Areas</th>
                <th className="px-2 pb-1">Vendor</th>
                <th className="px-2 pb-1">UoM</th>
                <th className="px-2 pb-1">Qty</th>
                <th className="px-2 pb-1">Unit $</th>
              </tr>
            </thead>
            <tbody>
              {initial.materials.map((m) => (
                <tr key={m.lineNumber} className="border-t border-marble-200">
                  <td className="px-2 py-1 text-marble-900 font-medium">{m.lineNumber}</td>
                  <RowInput name={`mat_${m.lineNumber}_millStyle`} defaultValue={m.millStyle} />
                  <RowInput name={`mat_${m.lineNumber}_size`} defaultValue={m.size} />
                  <RowInput name={`mat_${m.lineNumber}_color`} defaultValue={m.color} />
                  <RowInput name={`mat_${m.lineNumber}_refNumber`} defaultValue={m.refNumber} />
                  <RowInput name={`mat_${m.lineNumber}_pad`} defaultValue={m.pad} />
                  <RowInput name={`mat_${m.lineNumber}_areas`} defaultValue={m.areas} />
                  <RowInput name={`mat_${m.lineNumber}_vendorName`} defaultValue={m.vendorName} />
                  <td className="px-2 py-1">
                    <select
                      name={`mat_${m.lineNumber}_unitOfMeasure`}
                      defaultValue={m.unitOfMeasure}
                      className="bg-white border border-marble-200 rounded px-1.5 py-1 text-marble-900 text-xs"
                    >
                      <option value="">—</option>
                      <option value="sqft">sqft</option>
                      <option value="sqyd">sqyd</option>
                      <option value="linft">linft</option>
                      <option value="each">each</option>
                    </select>
                  </td>
                  <RowInput name={`mat_${m.lineNumber}_quantity`} defaultValue={m.quantity} className="w-20 tabular-money text-right" inputMode="decimal" />
                  <RowInput name={`mat_${m.lineNumber}_unitPrice`} defaultValue={m.unitPrice} className="w-24 tabular-money text-right" inputMode="decimal" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Field label="Carpet type (applies to all carpet lines)" htmlFor="carpetType" className="mt-3">
          <select id="carpetType" name="carpetType" defaultValue={initial.carpetType} className={selectCls}>
            <option value="">—</option>
            <option value="plush">Plush</option>
            <option value="berber">Berber</option>
            <option value="glueDown">Glue Down</option>
            <option value="plushWP">Plush W/P</option>
            <option value="berberWP">Berber W/P</option>
          </select>
        </Field>
      </fieldset>

      {/* Floor condition + install method */}
      <fieldset className="bg-marble-100 border border-marble-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <legend className="px-2 text-sm font-semibold text-brand-700">Floor Condition &amp; Install</legend>
        <Field label="Subfloor type" htmlFor="subfloorType">
          <select id="subfloorType" name="subfloorType" defaultValue={initial.subfloorType} className={selectCls}>
            <option value="">—</option>
            <option value="wood">Wood</option>
            <option value="concrete">Concrete</option>
            <option value="softConcrete">Soft Concrete</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Install method" htmlFor="installMethod">
          <select id="installMethod" name="installMethod" defaultValue={initial.installMethod} className={selectCls}>
            <option value="">—</option>
            <option value="glueDown">Glue Down</option>
            <option value="nailDown">Nail Down</option>
            <option value="click">Click</option>
            <option value="clip">Clip</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Install subfloor" htmlFor="installSubfloor">
          <select id="installSubfloor" name="installSubfloor" defaultValue={initial.installSubfloor} className={selectCls}>
            <option value="">—</option><option value="false">No</option><option value="true">Yes</option>
          </select>
        </Field>
        <Field label="Pull old floor" htmlFor="pullOldFloor">
          <select id="pullOldFloor" name="pullOldFloor" defaultValue={initial.pullOldFloor} className={selectCls}>
            <option value="">—</option><option value="false">No</option><option value="true">Yes</option>
          </select>
        </Field>
        <Field label="Old floor type" htmlFor="oldFloorType">
          <input type="text" id="oldFloorType" name="oldFloorType" defaultValue={initial.oldFloorType} placeholder="tile / wood / vinyl / carpet…" className={inputCls} />
        </Field>
        <Field label="Old floor size" htmlFor="oldFloorSize">
          <input type="text" id="oldFloorSize" name="oldFloorSize" defaultValue={initial.oldFloorSize} className={inputCls} />
        </Field>
      </fieldset>

      <Field label="Special instructions" htmlFor="specialInstructions">
        <textarea
          id="specialInstructions"
          name="specialInstructions"
          rows={3}
          defaultValue={initial.specialInstructions}
          className={inputCls}
        />
      </Field>

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
          {pending ? "Saving…" : "Save work order"}
        </button>
      </div>
    </form>
  );
}

function RowInput(props: {
  name: string;
  defaultValue: string;
  className?: string;
  inputMode?: "decimal" | "numeric";
}) {
  return (
    <td className="px-2 py-1">
      <input
        type="text"
        inputMode={props.inputMode}
        name={props.name}
        defaultValue={props.defaultValue}
        className={`bg-white border border-marble-200 rounded px-1.5 py-1 text-marble-900 text-xs ${props.className ?? "w-32"}`}
      />
    </td>
  );
}
