"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useActionState } from "react";
import { submitProductRequestAction } from "@/app/(sales)/sales/catalog/request/actions";
import type { RequestState } from "@/app/(sales)/sales/catalog/request/actions";

type CatalogProduct = {
  id: string;
  name: string;
  brand: string | null;
  style: string | null;
  color: string | null;
  sizeSpec: string | null;
  sku: string | null;
  category: string;
  defaultUnit: string | null;
  defaultUnitPriceCents: number | null;
  defaultVendor: { id: string; name: string } | null;
  images: { url: string }[];
};

type PickedProduct = {
  materialId: string;
  name: string;
  brand: string;
  style: string;
  color: string;
  sizeSpec: string;
  sku: string;
  defaultUnit: string;
  defaultUnitPriceCents: number | null;
  vendorName: string;
};

type Props = {
  category?: string;
  onPick: (product: PickedProduct) => void;
};

export function CatalogPicker({ category, onPick }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, limit: "8" });
      if (category) params.set("category", category);
      const res = await fetch(`/api/catalog/search?${params}`);
      const data = await res.json();
      setResults(data.materials ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!open) return;
    debounceRef.current = setTimeout(() => search(query), 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, open, search]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function pick(p: CatalogProduct) {
    onPick({
      materialId: p.id,
      name: p.name,
      brand: p.brand ?? "",
      style: p.style ?? "",
      color: p.color ?? "",
      sizeSpec: p.sizeSpec ?? "",
      sku: p.sku ?? "",
      defaultUnit: p.defaultUnit ?? "",
      defaultUnitPriceCents: p.defaultUnitPriceCents,
      vendorName: p.defaultVendor?.name ?? "",
    });
    setQuery("");
    setOpen(false);
    setResults([]);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            placeholder="Search catalog (brand, style, color…)"
            className="w-full rounded border border-brand-300 bg-brand-50 px-3 py-2 text-sm text-marble-900 placeholder:text-marble-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            onFocus={() => setOpen(true)}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-marble-400">Searching…</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowRequest(true)}
          className="text-xs text-marble-500 hover:text-brand-700 whitespace-nowrap underline underline-offset-2"
        >
          Not in catalog?
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-lg border border-marble-200 bg-white shadow-lg overflow-hidden">
          {results.length === 0 && !loading ? (
            <div className="px-4 py-3 text-sm text-marble-500">
              {query.length < 1 ? "Start typing to search…" : "No products found."}
            </div>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => pick(p)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-brand-50 text-left"
                  >
                    {p.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0].url} alt={p.name} className="w-10 h-10 rounded object-cover shrink-0 border border-marble-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-marble-900 truncate">{p.name}</p>
                      <p className="text-xs text-marble-500 truncate">
                        {[p.brand, p.color, p.sizeSpec].filter(Boolean).join(" · ")}
                        {p.defaultVendor && ` · ${p.defaultVendor.name}`}
                      </p>
                    </div>
                    {p.defaultUnitPriceCents && (
                      <span className="text-sm font-medium text-marble-900 tabular-nums shrink-0">
                        ${(p.defaultUnitPriceCents / 100).toFixed(2)}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Product request modal */}
      {showRequest && (
        <ProductRequestModal onClose={() => setShowRequest(false)} prefill={{ brand: query, category }} />
      )}
    </div>
  );
}

function ProductRequestModal({ onClose, prefill }: { onClose: () => void; prefill?: { brand?: string; category?: string } }) {
  const [state, formAction, pending] = useActionState<RequestState, FormData>(submitProductRequestAction, null);

  useEffect(() => {
    if (state?.ok) {
      setTimeout(onClose, 1500);
    }
  }, [state, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-marble-900">Request a Product</h2>
          <button type="button" onClick={onClose} className="text-marble-400 hover:text-marble-700 text-lg leading-none">&times;</button>
        </div>
        {state?.ok ? (
          <p className="text-sm text-brand-700 font-medium">Request submitted! The admin will be notified.</p>
        ) : (
          <form action={formAction} className="flex flex-col gap-3">
            {state && !state.ok && state.message && (
              <p className="text-xs text-red-600">{state.message}</p>
            )}
            <p className="text-sm text-marble-600">Describe what you need and the admin will add it to the catalog.</p>
            <div className="grid grid-cols-2 gap-3">
              <ReqField label="Brand / Manufacturer" name="brand" defaultValue={prefill?.brand} />
              <ReqField label="Style" name="style" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ReqField label="Color" name="color" />
              <ReqField label="Size / Spec" name="sizeSpec" />
            </div>
            <ReqField label="Vendor Name (if known)" name="vendorName" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-marble-700">Notes *</label>
              <textarea
                name="notes"
                rows={2}
                placeholder="e.g. Customer wants Shaw Berber, beige, for living room"
                className="rounded border border-marble-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <input type="hidden" name="category" value={prefill?.category ?? ""} />
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={pending}
                className="flex-1 rounded bg-brand-500 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2 text-sm"
              >
                {pending ? "Submitting…" : "Submit Request"}
              </button>
              <button type="button" onClick={onClose} className="flex-1 rounded border border-marble-300 text-marble-700 hover:bg-marble-100 py-2 text-sm">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ReqField({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-marble-700">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        className="rounded border border-marble-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}
