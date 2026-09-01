import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { setVendorActiveAction } from "../actions";
import { centsToDollarString } from "@/lib/money";

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;

  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: {
      materials: {
        where: { isActive: true },
        orderBy: [{ category: "asc" }, { name: "asc" }],
        select: {
          id: true, name: true, brand: true, style: true, color: true,
          category: true, defaultUnitPriceCents: true, defaultCostCents: true, isActive: true,
        },
      },
      vendorOrders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { order: { select: { invoiceNumber: true } } },
      },
    },
  });

  if (!vendor) notFound();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/vendors" className="text-sm text-brand-700 hover:underline">← Vendors</Link>
          <h1 className="mt-2 text-3xl font-bold text-brand-700">{vendor.name}</h1>
          {!vendor.isActive && (
            <span className="mt-1 inline-block text-xs bg-marble-200 text-marble-600 px-2 py-0.5 rounded">Inactive</span>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/admin/vendors/${id}/edit`}
            className="inline-flex items-center justify-center rounded border border-marble-300 bg-white hover:bg-marble-100 text-marble-900 font-medium px-4 h-9 text-sm"
          >
            Edit
          </Link>
          <form action={async () => { "use server"; await setVendorActiveAction(id, !vendor.isActive); }}>
            <button className={`inline-flex items-center justify-center rounded font-medium px-4 h-9 text-sm ${vendor.isActive ? "border border-red-300 text-red-700 hover:bg-red-50" : "bg-brand-500 hover:bg-brand-700 text-white"}`}>
              {vendor.isActive ? "Deactivate" : "Reactivate"}
            </button>
          </form>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Contact", value: vendor.contactName },
          { label: "Email", value: vendor.email },
          { label: "Phone", value: vendor.phone },
          { label: "Address", value: vendor.address },
          { label: "Website", value: vendor.website },
        ].map(({ label, value }) =>
          value ? (
            <div key={label}>
              <p className="text-xs text-marble-500 uppercase tracking-wide">{label}</p>
              <p className="text-sm text-marble-900 mt-0.5">{value}</p>
            </div>
          ) : null
        )}
      </div>
      {vendor.notes && (
        <div>
          <p className="text-xs text-marble-500 uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-marble-700 whitespace-pre-wrap">{vendor.notes}</p>
        </div>
      )}

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-marble-900">Products ({vendor.materials.length})</h2>
          <div className="flex gap-2">
            <Link
              href={`/admin/catalog/import?vendorId=${id}`}
              className="inline-flex items-center justify-center rounded border border-marble-300 hover:bg-marble-50 text-marble-700 font-medium px-3 h-8 text-sm"
            >
              Import file
            </Link>
            <Link
              href={`/admin/catalog/new?vendorId=${id}`}
              className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-3 h-8 text-sm"
            >
              + Add Product
            </Link>
          </div>
        </div>
        {vendor.materials.length === 0 ? (
          <p className="text-sm text-marble-500">No products yet. Add one to get started.</p>
        ) : (
          <div className="border border-marble-200 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-marble-100">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">Product</th>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">Category</th>
                  <th className="text-right px-3 py-2 font-semibold text-marble-900">Price</th>
                  <th className="text-right px-3 py-2 font-semibold text-marble-900">Cost</th>
                  <th className="text-right px-3 py-2 font-semibold text-marble-900">Margin</th>
                  <th className="text-right px-3 py-2 font-semibold text-marble-900"></th>
                </tr>
              </thead>
              <tbody>
                {vendor.materials.map((m) => {
                  const price = m.defaultUnitPriceCents;
                  const cost = m.defaultCostCents;
                  const margin = price && cost ? Math.round(((price - cost) / price) * 100) : null;
                  return (
                    <tr key={m.id} className="border-t border-marble-200">
                      <td className="px-3 py-2">
                        <p className="font-medium text-marble-900">{m.name}</p>
                        {(m.brand || m.color) && (
                          <p className="text-xs text-marble-500">{[m.brand, m.color].filter(Boolean).join(" · ")}</p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-marble-700 capitalize">{m.category}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-marble-900">
                        {price ? centsToDollarString(price) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-marble-700">
                        {cost ? centsToDollarString(cost) : "—"}
                      </td>
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
      </section>

      {/* Recent POs */}
      {vendor.vendorOrders.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-marble-900 mb-3">Recent Purchase Orders</h2>
          <div className="border border-marble-200 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-marble-100">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">PO #</th>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">Invoice</th>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">Status</th>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {vendor.vendorOrders.map((po) => (
                  <tr key={po.id} className="border-t border-marble-200">
                    <td className="px-3 py-2 text-marble-900 font-mono">{po.poNumber}</td>
                    <td className="px-3 py-2 text-marble-700">#{po.order.invoiceNumber}</td>
                    <td className="px-3 py-2 capitalize text-marble-700">{po.status}</td>
                    <td className="px-3 py-2 text-marble-500">{new Date(po.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
