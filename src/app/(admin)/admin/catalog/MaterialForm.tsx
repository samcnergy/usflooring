"use client";

import { useActionState } from "react";
import type { CatalogState } from "./actions";

const CATEGORIES = [
  { value: "carpet", label: "Carpet" },
  { value: "vinyl", label: "Vinyl" },
  { value: "wood", label: "Wood" },
  { value: "ceramic", label: "Ceramic" },
  { value: "tile", label: "Tile" },
  { value: "stone", label: "Stone" },
  { value: "cabinet", label: "Cabinet" },
  { value: "counterTop", label: "Counter Top" },
  { value: "fireplace", label: "Fireplace" },
  { value: "shower", label: "Shower" },
  { value: "molding", label: "Molding" },
  { value: "labor", label: "Labor" },
  { value: "fixture", label: "Fixture" },
  { value: "other", label: "Other" },
];

const UNITS = [
  { value: "sqft", label: "sq ft" },
  { value: "sqyd", label: "sq yd" },
  { value: "slab", label: "slab" },
  { value: "box", label: "box" },
  { value: "piece", label: "piece" },
  { value: "linearFt", label: "linear ft" },
  { value: "each", label: "each" },
  { value: "hour", label: "hour" },
  { value: "lump", label: "lump sum" },
];

type Vendor = { id: string; name: string };

type DefaultValues = {
  name?: string;
  brand?: string;
  style?: string;
  color?: string;
  sizeSpec?: string;
  sku?: string;
  category?: string;
  defaultVendorId?: string;
  defaultUnit?: string;
  defaultUnitPriceCents?: number | null;
  defaultCostCents?: number | null;
  notes?: string;
};

type Props = {
  action: (prev: CatalogState, formData: FormData) => Promise<CatalogState>;
  vendors: Vendor[];
  defaultValues?: DefaultValues;
  defaultVendorId?: string;
  submitLabel?: string;
};

function centsToDisplay(cents: number | null | undefined): string {
  if (!cents && cents !== 0) return "";
  return (cents / 100).toFixed(2);
}

export function MaterialForm({ action, vendors, defaultValues = {}, defaultVendorId, submitLabel = "Save Product" }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const err = (field: string) => (state && !state.ok ? state.errors?.[field] : undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-2xl">
      {state && !state.ok && state.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{state.message}</p>
      )}

      {/* Identity */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide">Identity</h2>
        <Field label="Product Name *" name="name" defaultValue={defaultValues.name} error={err("name")} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand / Manufacturer" name="brand" defaultValue={defaultValues.brand} />
          <Field label="Style" name="style" defaultValue={defaultValues.style} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Color" name="color" defaultValue={defaultValues.color} />
          <Field label="Size / Spec" name="sizeSpec" defaultValue={defaultValues.sizeSpec} placeholder="e.g. 12×24, 3/8 inch" />
        </div>
        <Field label="Vendor SKU / Ref #" name="sku" defaultValue={defaultValues.sku} />
      </section>

      {/* Classification */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide">Classification</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-sm font-medium text-marble-900">Category *</label>
            <select
              id="category"
              name="category"
              defaultValue={defaultValues.category ?? ""}
              className={`rounded border px-2 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500 ${err("category") ? "border-red-400" : "border-marble-300"}`}
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {err("category") && <p className="text-xs text-red-600">{err("category")}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="defaultUnit" className="text-sm font-medium text-marble-900">Default Unit</label>
            <select
              id="defaultUnit"
              name="defaultUnit"
              defaultValue={defaultValues.defaultUnit ?? ""}
              className="rounded border border-marble-300 px-2 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">— none —</option>
              {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="defaultVendorId" className="text-sm font-medium text-marble-900">Vendor</label>
          <select
            id="defaultVendorId"
            name="defaultVendorId"
            defaultValue={defaultValues.defaultVendorId ?? defaultVendorId ?? ""}
            className="rounded border border-marble-300 px-2 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">— no vendor —</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
      </section>

      {/* Pricing (admin only — these values never go to salespeople) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide">Pricing (admin only)</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="defaultUnitPriceRaw" className="text-sm font-medium text-marble-900">Default Price (suggested)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marble-500 text-sm">$</span>
              <input
                id="defaultUnitPriceRaw"
                name="defaultUnitPriceRaw"
                type="number"
                step="0.01"
                min="0"
                defaultValue={centsToDisplay(defaultValues.defaultUnitPriceCents)}
                className="w-full rounded border border-marble-300 pl-7 pr-3 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-marble-500">Pre-fills the line item. Salesperson sets the final price.</p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="defaultCostRaw" className="text-sm font-medium text-marble-900">Cost (what we pay vendor)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marble-500 text-sm">$</span>
              <input
                id="defaultCostRaw"
                name="defaultCostRaw"
                type="number"
                step="0.01"
                min="0"
                defaultValue={centsToDisplay(defaultValues.defaultCostCents)}
                className="w-full rounded border border-marble-300 pl-7 pr-3 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-marble-500">Never shown to salespeople. Used for margin reporting.</p>
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide">Image / Spec Sheet</h2>
        <Field label="Image or Spec Sheet URL" name="imageUrl" type="url" placeholder="https://…" />
        <input type="hidden" name="imageSourceType" value="link" />
        <p className="text-xs text-marble-500">Paste a link to a product photo or PDF spec sheet. You can also upload files directly from the product detail page after saving.</p>
      </section>

      {/* Notes */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide">Notes</h2>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaultValues.notes}
          className="rounded border border-marble-300 px-3 py-2 text-sm text-marble-900 placeholder:text-marble-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Any internal notes about this product…"
        />
      </section>

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
