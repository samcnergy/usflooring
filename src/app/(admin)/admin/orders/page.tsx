import Link from "next/link";
import { listOrders } from "@/lib/order";
import { OrderStatusPill } from "@/components/forms/OrderStatusPill";
import { centsToDollarString } from "@/lib/money";
import { format } from "date-fns";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;
  const orders = await listOrders({ search, limit: 100 });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-brand-700">Orders</h1>
        <Link
          href="/admin/orders/new"
          className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)]"
        >
          + New Order
        </Link>
      </div>

      <form className="flex gap-2" method="GET">
        <input
          type="text"
          name="q"
          defaultValue={search ?? ""}
          placeholder="Search by invoice #, customer, or salesperson"
          className="flex-1 bg-white border border-marble-200 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
        <button
          type="submit"
          className="px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium"
        >
          Search
        </button>
      </form>

      {orders.length === 0 ? (
        <EmptyState search={search} />
      ) : (
        <div className="border border-marble-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-marble-100 text-marble-900">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">Invoice #</th>
                <th className="text-left px-3 py-2 font-semibold">Date</th>
                <th className="text-left px-3 py-2 font-semibold">Customer</th>
                <th className="text-left px-3 py-2 font-semibold">Salesperson</th>
                <th className="text-left px-3 py-2 font-semibold">Adv. source</th>
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

function EmptyState({ search }: { search?: string }) {
  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg p-8 text-center">
      {search ? (
        <p className="text-marble-700">
          No orders match &ldquo;{search}&rdquo;. Try a different search.
        </p>
      ) : (
        <p className="text-marble-700">
          No orders yet — start by entering one above.
        </p>
      )}
    </div>
  );
}
