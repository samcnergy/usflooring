// Read-only Invoice view for the Order detail page (post-restructure).
// Displays the structured Invoice data: rooms, line items, inclusions/
// exclusions, job-site block, totals.

import Link from "next/link";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";
import { centsToDollarString } from "@/lib/money";
import { roomLabel } from "@/lib/rooms";
import { lineCategoryLabel, PRINTED_CATEGORY_CHECKBOXES } from "@/lib/line-categories";
import { unitShort } from "@/lib/units";
import { inclusionLabel, exclusionLabel } from "@/lib/inclusions";
import { OrderStatusPill } from "@/components/forms/OrderStatusPill";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    advertisingSource: true;
    rooms: true;
    lineItems: true;
    inclusions: true;
    exclusions: true;
  };
}>;

const balanceTermLabels: Record<string, string> = {
  cash: "Cash",
  cod: "C.O.D.",
  finance: "Finance",
};

export function InvoiceView({ order }: { order: FullOrder }) {
  const cust = order.customer;
  // Categories shown ticked = those that appear in any line item
  const categoriesUsed = new Set(order.lineItems.map((li) => li.category));

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

      {/* Sold/ship/job-site/salesperson */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
          <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mb-1">Job site</p>
          {order.jobSiteSameAsBilling ? (
            <p className="text-marble-700 text-sm italic">Same as billing</p>
          ) : (
            <>
              <p className="text-marble-900">{order.jobSiteAddressLine1 ?? "—"}</p>
              <p className="text-marble-700 text-sm">
                {order.jobSiteCity ?? ""}{order.jobSiteCity ? "," : ""} {order.jobSiteState ?? ""} {order.jobSiteZip ?? ""}
              </p>
            </>
          )}
          {order.siteContactName ? <p className="text-marble-900 text-sm mt-1">Contact: {order.siteContactName}{order.siteContactPhone ? ` · ${order.siteContactPhone}` : ""}</p> : null}
          {order.accessInstructions ? <p className="text-marble-700 text-xs mt-1">Access: {order.accessInstructions}</p> : null}
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

      {/* Categories (derived) */}
      {categoriesUsed.size > 0 ? (
        <div className="border-y border-marble-200 py-3 mb-4">
          <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mb-1">Categories</p>
          <div className="flex flex-wrap gap-2">
            {PRINTED_CATEGORY_CHECKBOXES.filter((c) => categoriesUsed.has(c.value)).map((c) => (
              <span key={c.value} className="text-xs bg-brand-100 text-brand-700 rounded px-2 py-0.5">{c.label}</span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Rooms */}
      {order.rooms.length > 0 ? (
        <div className="mb-4 text-sm">
          <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mb-1">Rooms</p>
          <p className="text-marble-900">
            {order.rooms.map((r) => `${roomLabel(r.room)}${r.quantity ? ` × ${r.quantity}` : ""}${r.notes ? ` (${r.notes})` : ""}`).join(", ")}
          </p>
        </div>
      ) : null}

      {/* Line items */}
      {order.lineItems.length > 0 ? (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="border-b border-marble-700 text-marble-900">
              <tr>
                <th className="text-left py-2 w-28 font-semibold">Category</th>
                <th className="text-left py-2 font-semibold">Brand / Style</th>
                <th className="text-left py-2 w-28 font-semibold">Color</th>
                <th className="text-left py-2 w-24 font-semibold">Size</th>
                <th className="text-right py-2 w-20 font-semibold">Qty</th>
                <th className="text-left py-2 w-16 font-semibold">Unit</th>
                <th className="text-right py-2 w-24 font-semibold">Unit $</th>
                <th className="text-right py-2 w-24 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.lineItems.map((li) => (
                <tr key={li.id} className="border-b border-marble-200">
                  <td className="py-1.5 text-marble-900">{lineCategoryLabel(li.category)}</td>
                  <td className="py-1.5 text-marble-700">{[li.brand, li.style].filter(Boolean).join(" — ")}</td>
                  <td className="py-1.5 text-marble-700">{li.color ?? ""}</td>
                  <td className="py-1.5 text-marble-700">{li.sizeSpec ?? ""}</td>
                  <td className="py-1.5 text-right tabular-money">{li.quantity ?? ""}</td>
                  <td className="py-1.5 text-marble-700">{unitShort(li.unit)}</td>
                  <td className="py-1.5 text-right tabular-money">{li.unitPriceCents != null ? centsToDollarString(li.unitPriceCents) : ""}</td>
                  <td className="py-1.5 text-right tabular-money">{li.lineTotalCents != null ? centsToDollarString(li.lineTotalCents) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Inclusions / Exclusions */}
      {(order.inclusions.length > 0 || order.exclusions.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {order.inclusions.length > 0 ? (
            <div className="bg-marble-100 border border-marble-200 rounded p-3">
              <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mb-1">Price includes</p>
              <p className="text-marble-900 text-sm">
                {order.inclusions.map((i) => i.type === "customNote" ? i.customText : inclusionLabel(i.type)).filter(Boolean).join(", ")}
              </p>
            </div>
          ) : null}
          {order.exclusions.length > 0 ? (
            <div className="bg-marble-100/60 border border-marble-200 rounded p-3">
              <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold mb-1">Not included</p>
              <p className="text-marble-900 text-sm">
                {order.exclusions.map((e) => e.type === "customNote" ? e.customText : exclusionLabel(e.type)).filter(Boolean).join(", ")}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

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
          {order.depositInstructions ? (
            <p className="mt-2 text-marble-700 italic">Deposit: {order.depositInstructions}</p>
          ) : null}
        </div>
        <div className="border-l border-marble-200 pl-4">
          <SummaryRow label="Sub-total" value={order.subtotalCents} />
          <SummaryRow label={`Tax (${order.taxPercent.toFixed(2)}%)`} value={order.taxCents} />
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
  basePath: string;
  active: "invoice" | "scope" | "workorder" | "dailyworkorder" | "vendor" | "install";
}) {
  const tabs: { key: typeof active; label: string }[] = [
    { key: "invoice",         label: "Invoice" },
    { key: "scope",           label: "Scope of Work" },
    { key: "workorder",       label: "Work Order" },
    { key: "dailyworkorder",  label: "Daily Work Order" },
    { key: "vendor",          label: "Vendor Order(s)" },
    { key: "install",         label: "Install Instructions" },
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
