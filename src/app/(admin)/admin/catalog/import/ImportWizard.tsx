"use client";

import { useState, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  parseFileAction,
  bulkImportMaterialsAction,
  type ParseResult,
  type ImportProduct,
} from "./actions";

// ─── Field definitions ────────────────────────────────────────────────────

const FIELD_OPTIONS = [
  { value: "", label: "— ignore —" },
  { value: "name", label: "Product Name*" },
  { value: "brand", label: "Brand" },
  { value: "style", label: "Style" },
  { value: "color", label: "Color" },
  { value: "sizeSpec", label: "Size / Spec" },
  { value: "sku", label: "SKU" },
  { value: "category", label: "Category" },
  { value: "unit", label: "Unit of Measure" },
  { value: "price", label: "Price (per unit)" },
  { value: "cost", label: "Cost (per unit)" },
  { value: "notes", label: "Notes" },
];

const CATEGORIES = [
  "carpet", "vinyl", "wood", "ceramic", "tile", "stone",
  "cabinet", "counterTop", "fireplace", "shower", "molding", "labor", "fixture", "other",
];

const UNITS = ["sqft", "sqyd", "slab", "box", "piece", "linearFt", "each", "hour", "lump"];

// Auto-detect which product field a column header corresponds to
function autoDetect(header: string): string {
  const h = header.toLowerCase().replace(/[^a-z0-9]/g, "");
  const patterns: Array<[string, string[]]> = [
    ["name",     ["name", "productname", "itemname", "description", "product", "item", "material"]],
    ["brand",    ["brand", "manufacturer", "mfg", "make", "vendor", "line"]],
    ["style",    ["style", "collection", "series", "pattern", "design"]],
    ["color",    ["color", "colour", "finish", "shade"]],
    ["sizeSpec", ["size", "dimension", "spec", "format", "width", "gauge", "thickness"]],
    ["sku",      ["sku", "model", "modelno", "itemno", "partno", "code", "productcode", "itemnumber"]],
    ["category", ["category", "type", "cat", "producttype", "group"]],
    ["unit",     ["unit", "uom", "unitmeasure", "unitofmeasure", "measure"]],
    ["price",    ["price", "msrp", "retailprice", "sellprice", "unitprice", "listprice", "saleprice"]],
    ["cost",     ["cost", "net", "dealercost", "ourcost", "purchaseprice", "buyprice", "invoiceprice"]],
    ["notes",    ["notes", "note", "comments", "remarks", "memo"]],
  ];
  for (const [field, keywords] of patterns) {
    if (keywords.some((k) => h.includes(k))) return field;
  }
  return "";
}

// Parse a string as a dollar amount → cents (returns null if not a number)
function parseCents(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "");
  const n = parseFloat(cleaned);
  if (isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}

// Apply column mapping to a raw row → ImportProduct draft
function applyMapping(
  row: string[],
  headers: string[],
  mapping: Record<number, string>
): Partial<ImportProduct> & { price: string; cost: string } {
  const out: Record<string, string> = { price: "", cost: "" };
  headers.forEach((_, i) => {
    const field = mapping[i];
    if (field && row[i] !== undefined) out[field] = row[i];
  });
  return out as unknown as Partial<ImportProduct> & { price: string; cost: string };
}

// ─── Editable product row type ────────────────────────────────────────────

type ProductDraft = {
  id: number;
  selected: boolean;
  name: string;
  brand: string;
  style: string;
  color: string;
  sizeSpec: string;
  sku: string;
  category: string;
  unit: string;
  price: string;
  cost: string;
  notes: string;
};

function draftFromProduct(p: Partial<ImportProduct> & { price?: string; cost?: string }, id: number): ProductDraft {
  return {
    id,
    selected: true,
    name: (p as Record<string, string>).name ?? "",
    brand: (p as Record<string, string>).brand ?? "",
    style: (p as Record<string, string>).style ?? "",
    color: (p as Record<string, string>).color ?? "",
    sizeSpec: (p as Record<string, string>).sizeSpec ?? "",
    sku: (p as Record<string, string>).sku ?? "",
    category: (p as Record<string, string>).category ?? "",
    unit: (p as Record<string, string>).unit ?? "",
    price: (p as Record<string, string>).price ?? "",
    cost: (p as Record<string, string>).cost ?? "",
    notes: (p as Record<string, string>).notes ?? "",
  };
}

function draftToProduct(d: ProductDraft): ImportProduct {
  return {
    name: d.name,
    brand: d.brand || undefined,
    style: d.style || undefined,
    color: d.color || undefined,
    sizeSpec: d.sizeSpec || undefined,
    sku: d.sku || undefined,
    category: d.category || undefined,
    unit: d.unit || undefined,
    priceCents: d.price ? parseCents(d.price) : null,
    costCents: d.cost ? parseCents(d.cost) : null,
    notes: d.notes || undefined,
  };
}

// ─── Shared input style ────────────────────────────────────────────────────

const INPUT_CLS = "w-full rounded border border-marble-300 px-1.5 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-brand-500";
const SELECT_CLS = "w-full rounded border border-marble-300 px-1.5 py-1 text-xs text-marble-900 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white";

// ─── Step 1: Upload ────────────────────────────────────────────────────────

function UploadStep({
  vendors,
  vendorId,
  setVendorId,
  onParsed,
}: {
  vendors: { id: string; name: string }[];
  vendorId: string;
  setVendorId: (id: string) => void;
  onParsed: (result: ParseResult) => void;
}) {
  const [, ] = useActionState(parseFileAction, null);
  const [isPending, startTransition] = useTransition();
  const [parseError, setParseError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vendorId) { setParseError("Please select a vendor first."); return; }
    setParseError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await parseFileAction(null, fd);
      if (result && result.ok) {
        onParsed(result);
      } else if (result && !result.ok) {
        setParseError(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-marble-700 mb-1">Vendor *</label>
        <select
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className="w-full rounded border border-marble-300 px-3 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          required
        >
          <option value="">Select vendor…</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-marble-700 mb-1">Product file *</label>
        <input
          type="file"
          name="file"
          accept=".xlsx,.xls,.csv,.pdf"
          required
          className="block w-full text-sm text-marble-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
        />
        <p className="mt-1 text-xs text-marble-500">Accepted: .xlsx, .csv, .pdf — max 10 MB</p>
      </div>

      {parseError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{parseError}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white font-medium px-6 h-9 text-sm"
      >
        {isPending ? "Parsing…" : "Parse File →"}
      </button>

    </form>
  );
}

// ─── Step 2a: Excel column mapping ────────────────────────────────────────

function ExcelMapStep({
  headers,
  rawRows,
  onMapped,
}: {
  headers: string[];
  rawRows: string[][];
  onMapped: (mapping: Record<number, string>) => void;
}) {
  const [mapping, setMapping] = useState<Record<number, string>>(() => {
    const m: Record<number, string> = {};
    headers.forEach((h, i) => { m[i] = autoDetect(h); });
    return m;
  });

  const preview = rawRows.slice(0, 5);
  const mappedFields = Object.values(mapping).filter(Boolean);
  const hasName = mappedFields.includes("name");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-marble-900 mb-1">Map columns</h2>
        <p className="text-sm text-marble-600">
          We detected {headers.length} columns and {rawRows.length} rows. Tell us what each column contains.
        </p>
      </div>

      {/* Mapping table */}
      <div className="overflow-x-auto rounded border border-marble-200">
        <table className="w-full text-sm">
          <thead className="bg-marble-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-marble-600 uppercase tracking-wide">Column header</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-marble-600 uppercase tracking-wide">Maps to field</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-marble-600 uppercase tracking-wide">Sample value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marble-100">
            {headers.map((h, i) => (
              <tr key={i} className={mapping[i] ? "" : "opacity-50"}>
                <td className="px-3 py-2 font-mono text-xs text-marble-800">{h || `Column ${i + 1}`}</td>
                <td className="px-3 py-2">
                  <select
                    value={mapping[i] ?? ""}
                    onChange={(e) => setMapping((m) => ({ ...m, [i]: e.target.value }))}
                    className="rounded border border-marble-300 px-2 py-1 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {FIELD_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-xs text-marble-600 font-mono truncate max-w-[200px]">
                  {rawRows[0]?.[i] || <span className="italic text-marble-400">empty</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div>
          <p className="text-xs font-medium text-marble-600 uppercase tracking-wide mb-2">Preview (first {preview.length} rows)</p>
          <div className="overflow-x-auto rounded border border-marble-200">
            <table className="w-full text-xs">
              <thead className="bg-marble-50">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className={`px-2 py-1.5 text-left font-medium ${mapping[i] ? "text-brand-700" : "text-marble-400"}`}>
                      {mapping[i] ? FIELD_OPTIONS.find(o => o.value === mapping[i])?.label ?? h : `(${h})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-marble-100">
                {preview.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-2 py-1 ${mapping[ci] ? "text-marble-800" : "text-marble-400"}`}>
                        {cell || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasName && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          Map at least one column to <strong>Product Name</strong> before continuing.
        </p>
      )}

      <button
        onClick={() => onMapped(mapping)}
        disabled={!hasName}
        className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white font-medium px-6 h-9 text-sm"
      >
        Review {rawRows.length} products →
      </button>
    </div>
  );
}

// ─── Step 2b: PDF review ───────────────────────────────────────────────────

function PdfReviewStep({
  lines,
  onReady,
}: {
  lines: string[];
  onReady: (drafts: ProductDraft[]) => void;
}) {
  const [drafts, setDrafts] = useState<ProductDraft[]>([]);
  const [nextId, setNextId] = useState(0);
  const [form, setForm] = useState<Omit<ProductDraft, "id" | "selected">>({
    name: "", brand: "", style: "", color: "", sizeSpec: "",
    sku: "", category: "", unit: "", price: "", cost: "", notes: "",
  });

  function addProduct() {
    if (!form.name.trim()) return;
    setDrafts((d) => [...d, { ...form, id: nextId, selected: true }]);
    setNextId((n) => n + 1);
    setForm({ name: "", brand: "", style: "", color: "", sizeSpec: "", sku: "", category: "", unit: "", price: "", cost: "", notes: "" });
  }

  function removeProduct(id: number) {
    setDrafts((d) => d.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-marble-900 mb-1">Review PDF content</h2>
        <p className="text-sm text-marble-600">
          We extracted {lines.length} lines of text. Use the extracted text as reference to add products below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extracted text panel */}
        <div>
          <p className="text-xs font-medium text-marble-600 uppercase tracking-wide mb-2">Extracted text</p>
          <div className="h-96 overflow-y-auto rounded border border-marble-200 bg-marble-50 p-3">
            {lines.map((line, i) => (
              <div key={i} className="text-xs text-marble-700 font-mono py-0.5 border-b border-marble-100 last:border-0">
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Add product form */}
        <div>
          <p className="text-xs font-medium text-marble-600 uppercase tracking-wide mb-2">Add product</p>
          <div className="space-y-2 rounded border border-marble-200 bg-white p-3">
            {(
              [
                ["name", "Product Name *"],
                ["brand", "Brand"],
                ["style", "Style"],
                ["color", "Color"],
                ["sizeSpec", "Size / Spec"],
                ["sku", "SKU"],
              ] as [keyof typeof form, string][]
            ).map(([field, label]) => (
              <div key={field}>
                <label className="block text-xs font-medium text-marble-600 mb-0.5">{label}</label>
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className={INPUT_CLS}
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-marble-600 mb-0.5">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={SELECT_CLS}>
                  <option value="">—</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c === "counterTop" ? "Counter Top" : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-marble-600 mb-0.5">Unit</label>
                <select value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} className={SELECT_CLS}>
                  <option value="">—</option>
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-marble-600 mb-0.5">Price ($)</label>
                <input type="text" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0.00" className={INPUT_CLS} />
              </div>
              <div>
                <label className="block text-xs font-medium text-marble-600 mb-0.5">Cost ($) — admin only</label>
                <input type="text" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} placeholder="0.00" className={INPUT_CLS} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-marble-600 mb-0.5">Notes</label>
              <input type="text" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={INPUT_CLS} />
            </div>

            <button
              type="button"
              onClick={addProduct}
              disabled={!form.name.trim()}
              className="w-full rounded bg-brand-500 hover:bg-brand-700 disabled:opacity-40 text-white text-sm font-medium py-1.5"
            >
              + Add to list
            </button>
          </div>
        </div>
      </div>

      {/* Added products list */}
      {drafts.length > 0 && (
        <div>
          <p className="text-xs font-medium text-marble-600 uppercase tracking-wide mb-2">{drafts.length} product{drafts.length !== 1 ? "s" : ""} ready to import</p>
          <div className="rounded border border-marble-200 divide-y divide-marble-100">
            {drafts.map((d) => (
              <div key={d.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-marble-900">{d.name}</span>
                  {(d.brand || d.style || d.color) && (
                    <span className="text-marble-500 ml-2">{[d.brand, d.style, d.color].filter(Boolean).join(" · ")}</span>
                  )}
                </div>
                {d.price && <span className="text-marble-600 text-xs">${d.price}</span>}
                <button onClick={() => removeProduct(d.id)} className="text-marble-400 hover:text-red-600 text-xs">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onReady(drafts)}
          disabled={drafts.length === 0}
          className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white font-medium px-6 h-9 text-sm"
        >
          Review {drafts.length} product{drafts.length !== 1 ? "s" : ""} →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Final review table ────────────────────────────────────────────

function ReviewStep({
  initialDrafts,
  vendorId,
  vendorName,
  onDone,
}: {
  initialDrafts: ProductDraft[];
  vendorId: string;
  vendorName: string;
  onDone: (count: number) => void;
}) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [isPending, startTransition] = useTransition();
  const [importError, setImportError] = useState("");

  const selected = drafts.filter((d) => d.selected);
  const validSelected = selected.filter((d) => d.name.trim());

  function updateDraft(id: number, field: keyof ProductDraft, value: string | boolean) {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }

  function toggleAll(checked: boolean) {
    setDrafts((prev) => prev.map((d) => ({ ...d, selected: checked })));
  }

  function removeDraft(id: number) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  function handleImport() {
    const products = validSelected.map(draftToProduct);
    startTransition(async () => {
      const result = await bulkImportMaterialsAction(vendorId, products);
      if (result.ok) {
        onDone(result.count);
      } else {
        setImportError(result.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-marble-900">Review before importing</h2>
          <p className="text-sm text-marble-600">
            {validSelected.length} of {drafts.length} rows selected — all will be added to <strong>{vendorName}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => toggleAll(true)} className="text-brand-600 hover:underline">Select all</button>
          <span className="text-marble-300">·</span>
          <button onClick={() => toggleAll(false)} className="text-marble-500 hover:underline">Deselect all</button>
        </div>
      </div>

      {importError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{importError}</p>
      )}

      <div className="overflow-x-auto rounded border border-marble-200">
        <table className="w-full text-xs">
          <thead className="bg-marble-50 sticky top-0">
            <tr>
              <th className="px-2 py-2 w-8">
                <input
                  type="checkbox"
                  checked={drafts.every((d) => d.selected)}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="rounded border-marble-300"
                />
              </th>
              {["Name *", "Brand", "Style", "Color", "Size", "SKU", "Category", "Unit", "Price $", "Cost $", "Notes", ""].map((h) => (
                <th key={h} className="px-2 py-2 text-left font-medium text-marble-600 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-marble-100">
            {drafts.map((d) => (
              <tr key={d.id} className={d.selected ? (d.name.trim() ? "" : "bg-red-50") : "opacity-40"}>
                <td className="px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={d.selected}
                    onChange={(e) => updateDraft(d.id, "selected", e.target.checked)}
                    className="rounded border-marble-300"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={d.name}
                    onChange={(e) => updateDraft(d.id, "name", e.target.value)}
                    placeholder="Required"
                    className={`${INPUT_CLS} ${!d.name.trim() && d.selected ? "border-red-400" : ""}`}
                    style={{ minWidth: 120 }}
                  />
                </td>
                {(["brand", "style", "color", "sizeSpec", "sku"] as const).map((f) => (
                  <td key={f} className="px-1 py-1">
                    <input
                      type="text"
                      value={d[f]}
                      onChange={(e) => updateDraft(d.id, f, e.target.value)}
                      className={INPUT_CLS}
                      style={{ minWidth: 80 }}
                    />
                  </td>
                ))}
                <td className="px-1 py-1">
                  <select value={d.category} onChange={(e) => updateDraft(d.id, "category", e.target.value)} className={SELECT_CLS} style={{ minWidth: 90 }}>
                    <option value="">—</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c === "counterTop" ? "Counter Top" : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </td>
                <td className="px-1 py-1">
                  <select value={d.unit} onChange={(e) => updateDraft(d.id, "unit", e.target.value)} className={SELECT_CLS} style={{ minWidth: 80 }}>
                    <option value="">—</option>
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </td>
                <td className="px-1 py-1">
                  <input type="text" value={d.price} onChange={(e) => updateDraft(d.id, "price", e.target.value)} placeholder="0.00" className={INPUT_CLS} style={{ minWidth: 70 }} />
                </td>
                <td className="px-1 py-1">
                  <input type="text" value={d.cost} onChange={(e) => updateDraft(d.id, "cost", e.target.value)} placeholder="0.00" className={INPUT_CLS} style={{ minWidth: 70 }} />
                </td>
                <td className="px-1 py-1">
                  <input type="text" value={d.notes} onChange={(e) => updateDraft(d.id, "notes", e.target.value)} className={INPUT_CLS} style={{ minWidth: 100 }} />
                </td>
                <td className="px-1 py-1">
                  <button onClick={() => removeDraft(d.id)} className="text-marble-400 hover:text-red-600 px-1">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleImport}
          disabled={isPending || validSelected.length === 0}
          className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold px-8 h-10 text-sm"
        >
          {isPending ? "Importing…" : `Import ${validSelected.length} product${validSelected.length !== 1 ? "s" : ""}`}
        </button>
        {validSelected.length < selected.length && (
          <p className="text-xs text-red-600">{selected.length - validSelected.length} row{selected.length - validSelected.length !== 1 ? "s" : ""} missing a name — they won&apos;t be imported.</p>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Done ─────────────────────────────────────────────────────────

function DoneStep({ count, vendorId }: { count: number; vendorId: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
        <span className="text-3xl">✓</span>
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold text-marble-900">{count} product{count !== 1 ? "s" : ""} imported</p>
        <p className="text-sm text-marble-600 mt-1">All products are now active in the catalog.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/admin/catalog")}
          className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-6 h-9 text-sm"
        >
          View catalog
        </button>
        <button
          onClick={() => router.push(`/admin/vendors/${vendorId}`)}
          className="inline-flex items-center justify-center rounded border border-marble-300 hover:bg-marble-50 text-marble-700 font-medium px-6 h-9 text-sm"
        >
          View vendor
        </button>
      </div>
    </div>
  );
}

// ─── Wizard root ───────────────────────────────────────────────────────────

type Step = "upload" | "map" | "pdf-review" | "review" | "done";

export default function ImportWizard({
  vendors,
  defaultVendorId,
}: {
  vendors: { id: string; name: string }[];
  defaultVendorId?: string;
}) {
  const [step, setStep] = useState<Step>("upload");
  const [vendorId, setVendorId] = useState(defaultVendorId ?? "");
  const [excelData, setExcelData] = useState<{ headers: string[]; rawRows: string[][] } | null>(null);
  const [pdfLines, setPdfLines] = useState<string[]>([]);
  const [reviewDrafts, setReviewDrafts] = useState<ProductDraft[]>([]);
  const [importedCount, setImportedCount] = useState(0);

  const vendorName = vendors.find((v) => v.id === vendorId)?.name ?? "";

  const STEPS: { key: Step; label: string }[] = [
    { key: "upload", label: "Upload" },
    { key: "map", label: "Map columns" },
    { key: "review", label: "Review" },
    { key: "done", label: "Done" },
  ];
  const visibleSteps = step === "pdf-review"
    ? [{ key: "upload" as Step, label: "Upload" }, { key: "pdf-review" as Step, label: "Add products" }, { key: "review" as Step, label: "Review" }, { key: "done" as Step, label: "Done" }]
    : STEPS;

  function handleParsed(result: ParseResult) {
    if (!result.ok) return;
    if (result.type === "excel") {
      setExcelData({ headers: result.headers, rawRows: result.rawRows });
      setStep("map");
    } else {
      setPdfLines(result.lines);
      setStep("pdf-review");
    }
  }

  function handleMapped(mapping: Record<number, string>) {
    if (!excelData) return;
    const { headers, rawRows } = excelData;
    const drafts: ProductDraft[] = rawRows.map((row, i) => {
      const mapped = applyMapping(row, headers, mapping);
      return draftFromProduct(mapped, i);
    });
    setReviewDrafts(drafts);
    setStep("review");
  }

  function handlePdfReady(drafts: ProductDraft[]) {
    setReviewDrafts(drafts);
    setStep("review");
  }

  function handleDone(count: number) {
    setImportedCount(count);
    setStep("done");
  }

  const currentStepIndex = visibleSteps.findIndex((s) => s.key === step);

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <nav className="flex items-center gap-2">
        {visibleSteps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 text-sm ${
              i === currentStepIndex
                ? "text-brand-700 font-semibold"
                : i < currentStepIndex
                ? "text-marble-500"
                : "text-marble-400"
            }`}>
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                i < currentStepIndex
                  ? "bg-green-100 text-green-700"
                  : i === currentStepIndex
                  ? "bg-brand-500 text-white"
                  : "bg-marble-200 text-marble-500"
              }`}>
                {i < currentStepIndex ? "✓" : i + 1}
              </span>
              {s.label}
            </div>
            {i < visibleSteps.length - 1 && <span className="text-marble-300">→</span>}
          </div>
        ))}
      </nav>

      {/* Step content */}
      {step === "upload" && (
        <UploadStep
          vendors={vendors}
          vendorId={vendorId}
          setVendorId={setVendorId}
            onParsed={handleParsed}
        />
      )}
      {step === "map" && excelData && (
        <ExcelMapStep
          headers={excelData.headers}
          rawRows={excelData.rawRows}
          onMapped={handleMapped}
        />
      )}
      {step === "pdf-review" && (
        <PdfReviewStep lines={pdfLines} onReady={handlePdfReady} />
      )}
      {step === "review" && (
        <ReviewStep
          initialDrafts={reviewDrafts}
          vendorId={vendorId}
          vendorName={vendorName}
          onDone={handleDone}
        />
      )}
      {step === "done" && (
        <DoneStep count={importedCount} vendorId={vendorId} />
      )}
    </div>
  );
}
