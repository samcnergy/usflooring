// Read-only Invoice view for the Order detail page. Matches the paper-form
// layout closely enough that staff feel at home. Used in both /admin and
// /sales contexts; admin sees prices in Work Order, salesperson doesn't (the
// distinction matters when WorkOrder/DailyWorkOrder content lands in step 5).

import Link from "next/link";
import { centsToDollarString } from "@/lib/money";
import { ORDER_AREAS } from "@/lib/order-areas";
import { OrderStatusPill } from "@/components/forms/OrderStatusPill";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    advertisingSource: true;
    areas: true;
  };
}>;

const balanceTermLabels: Record<string, string> = {
  cash: "Cash",
  cod: "C.O.D.",
  finance: "Finance",
};

export function InvoiceView({ order }: { order: FullOrder }) {
  const cust = order.customer;
  const cats = [
    order.hasCabinet && "Cabinet",
    order.hasCarpet && "Carpet",
    order.hasVinyl && "Vinyl",
    order.hasWood && "Wood",
    order.hasCeramic && "Ceramic",
    order.hasCounterTop && "Counter Top",
    order.hasFireplace && "Fireplace",
    order.hasShower && "Shower",
  ].filter(Boolean) as string[];

  return (
    <div className="bg-white border border-marble-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-marble-200 pb-4 mb-4">
        <div>
          <p className="text-xs text-marble-700">Date of sale</p>
          <p className="text-marble-900">{format(order.dateOfSale, "MM/dd/yyyy")}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-marble-700">Invoice number</p>
          <p className="text-3xl font-bold tabular-money text-invoice-red">{order.invoiceNumber}</p>
        </div>
      </div>

      {/* Sold/ship/salesperson */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mb-1">Sold to</p>
          <p className="text-marble-900 font-medium">{cust.firstName} {cust.lastName}</p>
          <p className="text-marble-700 text-sm">{cust.addressLine1}</p>
          <p className="text-marble-700 text-sm">{cust.city}, {cust.state} {cust.zip}</p>
          {cust.phoneHome ? <p className="text-marble-700 text-sm">H: {cust.phoneHome}</p> : null}
          {cust.phoneWork ? <p className="text-marble-700 text-sm">W: {cust.phoneWork}{cust.phoneExt ? ` x${cust.phoneExt}` : ""}</p> : null}
          {cust.email ? <p className="text-marble-700 text-sm">{cust.email}</p> : null}
        </div>
        <div>
          <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mb-1">Ship to</p>
          <p className="text-marble-900 font-medium">{cust.shipFirstName ?? cust.firstName} {cust.shipLastName ?? cust.lastName}</p>
          <p className="text-marble-700 text-sm">{cust.shipAddressLine1 ?? cust.addressLine1}</p>
          <p className="text-marble-700 text-sm">
            {(cust.shipCity ?? cust.city)}, {(cust.shipState ?? cust.state)} {(cust.shipZip ?? cust.zip)}
          </p>
          {cust.shipPhone ? <p className="text-marble-700 text-sm">{cust.shipPhone}</p> : null}
        </div>
        <div>
          <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mb-1">Salesperson</p>
          <p className="text-marble-900 font-medium">{order.salesperson.fullName}</p>
          {order.advertisingSource ? (
            <>
              <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mt-3 mb-1">Adv. source</p>
              <p className="text-marble-900">{order.advertisingSource.name}</p>
            </>
          ) : null}
          <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mt-3 mb-1">Status</p>
          <OrderStatusPill status={order.status} />
        </div>
      </div>

      {/* Categories */}
      {cats.length > 0 ? (
        <div className="border-y border-marble-200 py-3 mb-4">
          <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mb-1">Categories</p>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <span key={c} className="text-xs bg-brand-100 text-brand-700 rounded px-2 py-0.5">
                {c}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Areas table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm min-w-[820px]">
          <thead className="border-b border-marble-700 text-marble-900">
            <tr>
              <th className="text-left py-2 w-32 font-semibold">Area</th>
              <th className="text-left py-2 w-10 font-semibold">#</th>
              <th className="text-left py-2 font-semibold">Description of work</th>
              <th className="text-left py-2 w-32 font-semibold">Material</th>
              <th className="text-left py-2 w-24 font-semibold">Color</th>
              <th className="text-left py-2 w-20 font-semibold">Size</th>
              <th className="text-right py-2 w-24 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {ORDER_AREAS.map((spec) => {
              const a = order.areas.find((x) => x.areaName === spec.value);
              const filled =
                a &&
                (a.quantity != null || a.description || a.material || a.color || a.size || a.lineTotalCents > 0);
              return (
                <tr key={spec.value} className="border-b border-marble-200">
                  <td className="py-1.5 text-marble-900 whitespace-nowrap">{spec.label}</td>
                  <td className="py-1.5 text-marble-700 tabular-money">{a?.quantity ?? ""}</td>
                  <td className="py-1.5 text-marble-700">{a?.description ?? ""}</td>
                  <td className="py-1.5 text-marble-700">{a?.material ?? ""}</td>
                  <td className="py-1.5 text-marble-700">{a?.color ?? ""}</td>
                  <td className="py-1.5 text-marble-700">{a?.size ?? ""}</td>
                  <td className="py-1.5 text-right tabular-money">
                    {filled ? centsToDollarString(a!.lineTotalCents) : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 text-sm">
          {order.basedOn ? (
            <p className="text-marble-700">Based on <span className="text-marble-900 font-medium">{order.basedOn}</span> &middot; subject to measurement</p>
          ) : null}
          {order.remarks ? <p className="mt-2 text-marble-900">{order.remarks}</p> : null}
          {order.balanceTerm ? (
            <p className="mt-2 text-marble-700">Balance terms: <span className="text-marble-900">{balanceTermLabels[order.balanceTerm]}</span></p>
          ) : null}
        </div>
        <div className="border-l border-marble-200 pl-4">
          <SummaryRow label="Sub-total" value={order.subtotalCents} />
          <SummaryRow label="Tax" value={order.taxCents} />
          <SummaryRow label="Total" value={order.totalCents} bold />
          <SummaryRow label="Deposit" value={order.depositCents} />
          <SummaryRow label="Balance" value={order.balanceCents} bold />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-sm py-1 ${bold ? "border-t border-marble-200 mt-1 pt-2" : ""}`}>
      <span className="text-marble-700">{label}</span>
      <span className={`tabular-money ${bold ? "text-marble-900 font-semibold" : "text-marble-900"}`}>
        {centsToDollarString(value)}
      </span>
    </div>
  );
}

export function DocumentTabs({
  basePath,
  active,
}: {
  basePath: string; // e.g. /admin/orders/abc-123 or /sales/orders/abc-123
  active: "invoice" | "workorder" | "dailyworkorder" | "vendor";
}) {
  const tabs: { key: typeof active; label: string }[] = [
    { key: "invoice",         label: "Invoice" },
    { key: "workorder",       label: "Work Order" },
    { key: "dailyworkorder",  label: "Daily Work Order" },
    { key: "vendor",          label: "Vendor Order(s)" },
  ];
  return (
    <div className="flex border-b border-marble-200 mb-4 overflow-x-auto">
      {tabs.map((t) => {
        const href = t.key === "invoice" ? basePath : `${basePath}?doc=${t.key}`;
        const isActive = active === t.key;
        return (
          <Link
            key={t.key}
            href={href}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${
              isActive
                ? "border-brand-700 text-brand-700 font-semibold"
                : "border-transparent text-marble-700 hover:text-brand-700"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
