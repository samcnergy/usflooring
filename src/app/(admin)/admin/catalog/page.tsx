import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { centsToDollarString } from "@/lib/money";
import type { LineCategory } from "@prisma/client";

const CATEGORIES: LineCategory[] = [
  "carpet", "vinyl", "wood", "ceramic", "tile", "stone",
  "cabinet", "counterTop", "fireplace", "shower", "molding", "labor", "fixture", "other",
];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; vendorId?: string; inactive?: string }>;
}) {
  await requireRole("admin");
  const sp = await searchParams;

  const [vendors, materials, pendingCount] = await Promise.all([
    prisma.vendor.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.material.findMany({
      where: {
        ...(sp.category ? { category: sp.category as LineCategory } : {}),
        ...(sp.vendorId ? { defaultVendorId: sp.vendorId } : {}),
        isActive: sp.inactive === "1" ? false : true,
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
      include: {
        defaultVendor: { select: { id: true, name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.productRequest.count({ where: { status: "pending" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-brand-700">Product Catalog</h1>
          <p className="text-sm text-marble-600 mt-1">{materials.length} product{materials.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2 items-center">
          {pendingCount > 0 && (
            <Link
              href="/admin/catalog/requests"
              className="inline-flex items-center gap-1.5 rounded border border-amber-300 bg-amber-50 text-amber-800 font-medium px-3 h-9 text-sm hover:bg-amber-100"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-600 text-white text-xs font-bold">{pendingCount}</span>
              Product Requests
            </Link>
          )}
          <Link
            href="/admin/catalog/new"
            className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-4 h-9 text-sm"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-marble-600 uppercase tracking-wide">Category</label>
          <select name="category" defaultValue={sp.category ?? ""} className="rounded border border-marble-300 px-2 py-1.5 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === "counterTop" ? "Counter Top" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-marble-600 uppercase tracking-wide">Vendor</label>
          <select name="vendorId" defaultValue={sp.vendorId ?? ""} className="rounded border border-marble-300 px-2 py-1.5 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 pb-0.5">
          <input type="checkbox" id="inactive" name="inactive" value="1" defaultChecked={sp.inactive === "1"} className="accent-brand-700" />
          <label htmlFor="inactive" className="text-sm text-marble-700">Show inactive</label>
        </div>
        <button type="submit" className="rounded border border-marble-300 bg-white hover:bg-marble-100 text-marble-900 px-3 py-1.5 text-sm font-medium">Filter</button>
        {(sp.category || sp.vendorId) && (
          <Link href="/admin/catalog" className="text-sm text-brand-700 hover:underline pb-0.5">Clear</Link>
        )}
      </form>

      {/* Table */}
      {materials.length === 0 ? (
        <div className="rounded-lg border border-marble-200 bg-marble-100 px-6 py-12 text-center">
          <p className="text-marble-700 font-medium">No products match your filters.</p>
          <Link href="/admin/catalog/new" className="mt-3 inline-block text-brand-700 underline text-sm">Add the first product</Link>
        </div>
      ) : (
        <div className="border border-marble-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-marble-100 text-marble-900">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">Product</th>
                <th className="text-left px-3 py-2 font-semibold">Category</th>
                <th className="text-left px-3 py-2 font-semibold">Vendor</th>
                <th className="text-right px-3 py-2 font-semibold">Price</th>
                <th className="text-right px-3 py-2 font-semibold">Cost</th>
                <th className="text-right px-3 py-2 font-semibold">Margin</th>
                <th className="text-right px-3 py-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => {
                const price = m.defaultUnitPriceCents;
                const cost = m.defaultCostCents;
                const margin = price && cost ? Math.round(((price - cost) / price) * 100) : null;
                return (
                  <tr key={m.id} className={`border-t border-marble-200 ${!m.isActive ? "opacity-50" : ""}`}>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {m.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.images[0].url} alt={m.name} className="w-8 h-8 rounded object-cover shrink-0 border border-marble-200" />
                        )}
                        <div>
                          <p className="font-medium text-marble-900">{m.name}</p>
                          <p className="text-xs text-marble-500">{[m.brand, m.color, m.sizeSpec].filter(Boolean).join(" · ")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-marble-700 capitalize">{m.category === "counterTop" ? "Counter Top" : m.category}</td>
                    <td className="px-3 py-2 text-marble-700">{m.defaultVendor?.name ?? "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{price ? centsToDollarString(price) : "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-marble-600">{cost ? centsToDollarString(cost) : "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {margin !== null ? (
                        <span className={`font-medium ${margin >= 30 ? "text-brand-700" : margin >= 15 ? "text-amber-700" : "text-red-600"}`}>
                          {margin}%
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Link href={`/admin/catalog/${m.id}`} className="text-brand-700 hover:underline">View</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
