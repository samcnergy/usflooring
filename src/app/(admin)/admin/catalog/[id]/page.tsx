import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { centsToDollarString } from "@/lib/money";
import { setMaterialActiveAction, deleteImageAction, setPrimaryImageAction } from "../actions";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;

  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      defaultVendor: { select: { id: true, name: true } },
      images: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      lineItems: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { order: { select: { invoiceNumber: true, dateOfSale: true } } },
      },
    },
  });

  if (!material) notFound();

  const price = material.defaultUnitPriceCents;
  const cost = material.defaultCostCents;
  const margin = price && cost ? Math.round(((price - cost) / price) * 100) : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/admin/catalog" className="text-sm text-brand-700 hover:underline">← Catalog</Link>
          <h1 className="mt-2 text-3xl font-bold text-brand-700">{material.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-marble-600 capitalize">{material.category === "counterTop" ? "Counter Top" : material.category}</span>
            {!material.isActive && (
              <span className="text-xs bg-marble-200 text-marble-600 px-2 py-0.5 rounded">Inactive</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/admin/catalog/${id}/edit`}
            className="inline-flex items-center justify-center rounded border border-marble-300 bg-white hover:bg-marble-100 text-marble-900 font-medium px-4 h-9 text-sm"
          >
            Edit
          </Link>
          <form action={async () => { "use server"; await setMaterialActiveAction(id, !material.isActive); }}>
            <button className={`inline-flex items-center justify-center rounded font-medium px-4 h-9 text-sm ${material.isActive ? "border border-red-300 text-red-700 hover:bg-red-50" : "bg-brand-500 hover:bg-brand-700 text-white"}`}>
              {material.isActive ? "Deactivate" : "Reactivate"}
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Specs */}
          <section>
            <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide mb-3">Specifications</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Brand", value: material.brand },
                { label: "Style", value: material.style },
                { label: "Color", value: material.color },
                { label: "Size / Spec", value: material.sizeSpec },
                { label: "SKU", value: material.sku },
                { label: "Default Unit", value: material.defaultUnit },
                { label: "Vendor", value: material.defaultVendor?.name },
              ].map(({ label, value }) =>
                value ? (
                  <div key={label}>
                    <dt className="text-xs text-marble-500">{label}</dt>
                    <dd className="text-sm text-marble-900 mt-0.5 font-medium">{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
          </section>

          {/* Pricing (admin only) */}
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">Pricing — Admin Only</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-amber-700">Default Price</p>
                <p className="text-lg font-bold text-marble-900 tabular-nums mt-0.5">{price ? centsToDollarString(price) : "—"}</p>
                <p className="text-xs text-marble-500">Suggested to salesperson</p>
              </div>
              <div>
                <p className="text-xs text-amber-700">Our Cost</p>
                <p className="text-lg font-bold text-marble-900 tabular-nums mt-0.5">{cost ? centsToDollarString(cost) : "—"}</p>
                <p className="text-xs text-marble-500">What we pay vendor</p>
              </div>
              <div>
                <p className="text-xs text-amber-700">Gross Margin</p>
                {margin !== null ? (
                  <p className={`text-lg font-bold tabular-nums mt-0.5 ${margin >= 30 ? "text-brand-700" : margin >= 15 ? "text-amber-700" : "text-red-600"}`}>
                    {margin}%
                  </p>
                ) : (
                  <p className="text-lg font-bold text-marble-400 mt-0.5">—</p>
                )}
              </div>
            </div>
          </section>

          {/* Notes */}
          {material.notes && (
            <section>
              <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide mb-2">Notes</h2>
              <p className="text-sm text-marble-700 whitespace-pre-wrap">{material.notes}</p>
            </section>
          )}

          {/* Usage history */}
          {material.lineItems.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide mb-3">Recent Order Usage</h2>
              <div className="border border-marble-200 rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-marble-100">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-marble-900">Invoice</th>
                      <th className="text-left px-3 py-2 font-semibold text-marble-900">Date</th>
                      <th className="text-right px-3 py-2 font-semibold text-marble-900">Qty</th>
                      <th className="text-right px-3 py-2 font-semibold text-marble-900">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {material.lineItems.map((li) => (
                      <tr key={li.id} className="border-t border-marble-200">
                        <td className="px-3 py-2">
                          <Link href={`/admin/orders/${li.orderId}`} className="text-brand-700 hover:underline font-mono">
                            #{li.order.invoiceNumber}
                          </Link>
                        </td>
                        <td className="px-3 py-2 text-marble-600">{new Date(li.order.dateOfSale).toLocaleDateString()}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-marble-700">{li.quantity ?? "—"}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-marble-900">
                          {li.unitPriceCents ? centsToDollarString(li.unitPriceCents) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Right: images */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide">Images & Spec Sheets</h2>
          {material.images.length === 0 ? (
            <div className="rounded-lg border border-dashed border-marble-300 bg-marble-100 px-4 py-8 text-center">
              <p className="text-sm text-marble-500">No images yet.</p>
              <Link href={`/admin/catalog/${id}/edit`} className="text-sm text-brand-700 hover:underline mt-1 inline-block">Add via Edit</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {material.images.map((img) => (
                <div key={img.id} className="rounded-lg border border-marble-200 overflow-hidden">
                  {img.url.match(/\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt={img.label ?? material.name} className="w-full object-cover max-h-48" />
                  ) : (
                    <a href={img.url} target="_blank" rel="noopener noreferrer" className="block p-3 text-sm text-brand-700 hover:underline">
                      📄 {img.label ?? "View spec sheet"}
                    </a>
                  )}
                  <div className="flex items-center justify-between px-3 py-2 bg-marble-50 border-t border-marble-200">
                    <span className="text-xs text-marble-500">{img.isPrimary ? "Primary" : img.sourceType}</span>
                    <div className="flex gap-3">
                      {!img.isPrimary && (
                        <form action={async () => { "use server"; await setPrimaryImageAction(img.id, id); }}>
                          <button className="text-xs text-brand-700 hover:underline">Set primary</button>
                        </form>
                      )}
                      <form action={async () => { "use server"; await deleteImageAction(img.id, id); }}>
                        <button className="text-xs text-red-600 hover:underline">Remove</button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
