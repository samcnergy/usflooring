import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { rejectRequestAction } from "../actions";

export default async function ProductRequestsPage() {
  await requireRole("admin");

  const [pending, recent] = await Promise.all([
    prisma.productRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      include: { requestedBy: { select: { fullName: true } } },
    }),
    prisma.productRequest.findMany({
      where: { status: { not: "pending" } },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        requestedBy: { select: { fullName: true } },
        fulfilledBy: { select: { id: true, name: true } },
      },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/catalog" className="text-sm text-brand-700 hover:underline">← Catalog</Link>
          <h1 className="mt-2 text-3xl font-bold text-brand-700">Product Requests</h1>
        </div>
      </div>

      {/* Pending */}
      <section>
        <h2 className="text-lg font-semibold text-marble-900 mb-3">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-marble-500">No pending requests.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((req) => (
              <div key={req.id} className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-marble-900">
                      {[req.brand, req.style, req.color, req.sizeSpec].filter(Boolean).join(" · ") || "Unnamed product"}
                    </p>
                    <p className="text-xs text-marble-500 mt-0.5">
                      Requested by {req.requestedBy.fullName} · {new Date(req.createdAt).toLocaleDateString()}
                      {req.category && ` · ${req.category}`}
                      {req.vendorName && ` · Vendor: ${req.vendorName}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-medium">Pending</span>
                </div>
                {req.notes && <p className="text-sm text-marble-700 italic">&ldquo;{req.notes}&rdquo;</p>}
                <div className="flex gap-3">
                  <Link
                    href={`/admin/catalog/new?requestId=${req.id}&brand=${encodeURIComponent(req.brand ?? "")}&style=${encodeURIComponent(req.style ?? "")}&color=${encodeURIComponent(req.color ?? "")}`}
                    className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-3 h-8 text-sm"
                  >
                    Add to Catalog
                  </Link>
                  <form action={async () => { "use server"; await rejectRequestAction(req.id); }}>
                    <button className="inline-flex items-center justify-center rounded border border-red-300 text-red-700 hover:bg-red-50 font-medium px-3 h-8 text-sm">
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent history */}
      {recent.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-marble-500 uppercase tracking-wide mb-3">Recent History</h2>
          <div className="border border-marble-200 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-marble-100">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">Request</th>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">By</th>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">Status</th>
                  <th className="text-left px-3 py-2 font-semibold text-marble-900">Resolved</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((req) => (
                  <tr key={req.id} className="border-t border-marble-200">
                    <td className="px-3 py-2 text-marble-900">
                      {[req.brand, req.style, req.color].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-3 py-2 text-marble-600">{req.requestedBy.fullName}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${req.status === "fulfilled" ? "bg-brand-100 text-brand-700" : "bg-marble-200 text-marble-600"}`}>
                        {req.status}
                      </span>
                      {req.fulfilledBy && (
                        <Link href={`/admin/catalog/${req.fulfilledBy.id}`} className="ml-2 text-xs text-brand-700 hover:underline">
                          → {req.fulfilledBy.name}
                        </Link>
                      )}
                    </td>
                    <td className="px-3 py-2 text-marble-500">
                      {req.fulfilledAt ? new Date(req.fulfilledAt).toLocaleDateString() : new Date(req.updatedAt).toLocaleDateString()}
                    </td>
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
