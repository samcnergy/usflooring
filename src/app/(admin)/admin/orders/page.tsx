import Link from "next/link";
import { listOrders, getAdminOrderStats } from "@/lib/order";
import { OrderStatusPill } from "@/components/forms/OrderStatusPill";
import { centsToDollarString } from "@/lib/money";
import { format } from "date-fns";
import type { OrderStatus } from "@prisma/client";

const ALL_STATUSES: OrderStatus[] = ["draft", "finalized", "installed", "paid", "voided"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  draft:     "Draft",
  finalized: "Finalized",
  installed: "Installed",
  paid:      "Paid",
  voided:    "Voided",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const search   = typeof params.q        === "string" ? params.q        : undefined;
  const status   = typeof params.status   === "string" ? params.status   : undefined;
  const dateFrom = typeof params.dateFrom === "string" ? params.dateFrom : undefined;
  const dateTo   = typeof params.dateTo   === "string" ? params.dateTo   : undefined;

  const validStatus = ALL_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;

  const [orders, stats] = await Promise.all([
    listOrders({ search, status: validStatus, dateFrom, dateTo }),
    getAdminOrderStats(),
  ]);

  // Build a URL with current filters + a new param value
  function filterUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    if (search)   p.set("q", search);
    if (status)   p.set("status", status);
    if (dateFrom) p.set("dateFrom", dateFrom);
    if (dateTo)   p.set("dateTo", dateTo);
    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined) p.delete(k);
      else p.set(k, v);
    }
    const qs = p.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-brand-700">Orders</h1>
        <Link
          href="/admin/orders/new"
          className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)]"
        >
          + New Order
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Orders this month" value={String(stats.monthlyCount)} />
        <StatCard label="Revenue this month" value={centsToDollarString(stats.monthlyRevenue)} money />
        <StatCard label="Pending balance" value={centsToDollarString(stats.pendingBalance)} money />
      </div>

      {/* Search + date range */}
      <form className="flex flex-wrap gap-2" method="GET">
        {validStatus && <input type="hidden" name="status" value={validStatus} />}
        <input
          type="text"
          name="q"
          defaultValue={search ?? ""}
          placeholder="Invoice #, customer, or salesperson"
          className="flex-1 min-w-48 bg-white border border-marble-200 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
        <input
          type="date"
          name="dateFrom"
          defaultValue={dateFrom ?? ""}
          className="bg-white border border-marble-200 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
        <input
          type="date"
          name="dateTo"
          defaultValue={dateTo ?? ""}
          className="bg-white border border-marble-200 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
        <button
          type="submit"
          className="px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium"
        >
          Search
        </button>
        {(search || validStatus || dateFrom || dateTo) && (
          <Link
            href="/admin/orders"
            className="px-4 rounded border border-marble-300 text-marble-700 hover:bg-marble-100 font-medium inline-flex items-center"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={filterUrl({ status: undefined })}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
            !validStatus
              ? "bg-brand-900 text-white border-brand-900"
              : "border-marble-300 text-marble-700 hover:bg-marble-100"
          }`}
        >
          All
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={filterUrl({ status: s })}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              validStatus === s
                ? "bg-brand-900 text-white border-brand-900"
                : "border-marble-300 text-marble-700 hover:bg-marble-100"
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {/* Table */}
      {orders.length === 0 ? (
        <EmptyState search={search} status={validStatus} />
      ) : (
        <div className="border border-marble-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-marble-100 text-marble-900">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">Invoice #</th>
                <th className="text-left px-3 py-2 font-semibold">Date</th>
                <th className="text-left px-3 py-2 font-semibold">Customer</th>
                <th className="text-left px-3 py-2 font-semibold">Salesperson</th>
                <th className="text-left px-3 py-2 font-semibold">Adv. Source</th>
                <th className="text-right px-3 py-2 font-semibold">Total</th>
                <th className="text-right px-3 py-2 font-semibold">Balance</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-marble-200 hover:bg-brand-100/40">
                  <td className="px-3 py-2">
                    <Link href={`/admin/orders/${o.id}`} className="text-brand-700 underline-offset-2 hover:underline tabular-money font-medium">
                      {o.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-marble-700">{format(o.dateOfSale, "MMM d, yyyy")}</td>
                  <td className="px-3 py-2 text-marble-900">{o.customer.firstName} {o.customer.lastName}</td>
                  <td className="px-3 py-2 text-marble-700">{o.salesperson.fullName}</td>
                  <td className="px-3 py-2 text-marble-700">{o.advertisingSource?.name ?? "—"}</td>
                  <td className="px-3 py-2 text-right tabular-money">{centsToDollarString(o.totalCents)}</td>
                  <td className="px-3 py-2 text-right tabular-money">{centsToDollarString(o.balanceCents)}</td>
                  <td className="px-3 py-2"><OrderStatusPill status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, money }: { label: string; value: string; money?: boolean }) {
  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg px-4 py-3">
      <p className="text-xs text-marble-700 mb-1">{label}</p>
      <p className={`text-xl font-bold text-brand-700 ${money ? "tabular-money" : ""}`}>{value}</p>
    </div>
  );
}

function EmptyState({ search, status }: { search?: string; status?: OrderStatus }) {
  const hasFilter = search || status;
  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg p-8 text-center">
      {hasFilter ? (
        <p className="text-marble-700">No orders match the current filters. Try adjusting your search.</p>
      ) : (
        <p className="text-marble-700">No orders yet — start by entering one above.</p>
      )}
    </div>
  );
}
