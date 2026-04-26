import Link from "next/link";
import { centsToDollarString } from "@/lib/money";
import {
  kpiThisMonth,
  revenueOverTime,
  revenueBySalesperson,
  ordersBySource,
  categoryMix,
  CATEGORY_LABELS,
} from "@/lib/stats";
import { listOrders } from "@/lib/order";
import { KpiCard } from "@/components/KpiCard";
import { OrderStatusPill } from "@/components/forms/OrderStatusPill";
import { RevenueOverTimeChart } from "@/components/charts/RevenueOverTimeChart";
import { RevenueBySalespersonChart } from "@/components/charts/RevenueBySalespersonChart";
import { AdSourceDonutChart } from "@/components/charts/AdSourceDonutChart";
import { CategoryMixChart } from "@/components/charts/CategoryMixChart";
import { format } from "date-fns";

function pctDelta(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? { pct: 100, up: true } : null;
  const pct = ((curr - prev) / prev) * 100;
  return { pct, up: pct >= 0 };
}

export default async function AdminDashboardPage() {
  const [kpi, rot, rbs, obs, mix, recent] = await Promise.all([
    kpiThisMonth(),
    revenueOverTime(),
    revenueBySalesperson(),
    ordersBySource(),
    categoryMix(),
    listOrders({ limit: 10 }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-brand-700">Dashboard</h1>
        <Link
          href="/admin/orders/new"
          className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)]"
        >
          + New Order
        </Link>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Revenue this month"
          value={centsToDollarString(kpi.revenueThisMonth)}
          delta={pctDelta(kpi.revenueThisMonth, kpi.revenueLastMonth)}
          sub={`vs ${centsToDollarString(kpi.revenueLastMonth)} last month`}
        />
        <KpiCard
          label="Open balance"
          value={centsToDollarString(kpi.openBalance)}
          sub="Excludes paid + voided"
        />
        <KpiCard
          label="New orders this month"
          value={String(kpi.ordersThisMonth)}
          delta={pctDelta(kpi.ordersThisMonth, kpi.ordersLastMonth)}
          sub={`vs ${kpi.ordersLastMonth} last month`}
        />
        <KpiCard
          label="Top salesperson this month"
          value={kpi.topSalespersonName}
          sub={centsToDollarString(kpi.topSalespersonRevenue)}
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Revenue over time (last 90 days)">
          <RevenueOverTimeChart data={rot} />
        </ChartCard>
        <ChartCard title="Revenue by salesperson (last 90 days)">
          <RevenueBySalespersonChart data={rbs} />
        </ChartCard>
        <ChartCard title="Orders by advertising source (last 90 days)">
          <AdSourceDonutChart data={obs} />
        </ChartCard>
        <ChartCard title="Category mix (last 6 months)">
          <CategoryMixChart data={mix} categories={CATEGORY_LABELS} />
        </ChartCard>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="text-xl font-semibold text-marble-900">Recent orders</h2>
          <Link href="/admin/orders" className="text-brand-700 underline-offset-2 hover:underline text-sm">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="bg-marble-100 border border-marble-200 rounded-lg p-8 text-center">
            <p className="text-marble-700">No orders yet — create the first one above.</p>
          </div>
        ) : (
          <div className="border border-marble-200 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-marble-100 text-marble-900">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold">Invoice #</th>
                  <th className="text-left px-3 py-2 font-semibold">Date</th>
                  <th className="text-left px-3 py-2 font-semibold">Customer</th>
                  <th className="text-left px-3 py-2 font-semibold">Salesperson</th>
                  <th className="text-right px-3 py-2 font-semibold">Total</th>
                  <th className="text-left px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-t border-marble-200 hover:bg-brand-100/40">
                    <td className="px-3 py-2">
                      <Link href={`/admin/orders/${o.id}`} className="text-brand-700 hover:underline tabular-money font-medium">
                        {o.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-marble-700">{format(o.dateOfSale, "MMM d, yyyy")}</td>
                    <td className="px-3 py-2 text-marble-900">{o.customer.firstName} {o.customer.lastName}</td>
                    <td className="px-3 py-2 text-marble-700">{o.salesperson.fullName}</td>
                    <td className="px-3 py-2 text-right tabular-money">{centsToDollarString(o.totalCents)}</td>
                    <td className="px-3 py-2"><OrderStatusPill status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-marble-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}
