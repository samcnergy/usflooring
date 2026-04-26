import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/order";
import { requireRole } from "@/lib/auth";
import { InvoiceView, DocumentTabs } from "@/components/OrderDetail";
import { DocumentToolbar } from "@/components/DocumentToolbar";
import { PdfPreview } from "@/components/PdfPreview";
import { voidOrderAction, unvoidOrderAction, deleteOrderAction } from "../actions";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  await requireRole("admin");
  const { id } = await params;
  const sp = await searchParams;
  const doc = (typeof sp.doc === "string" ? sp.doc : "invoice") as
    | "invoice"
    | "workorder"
    | "dailyworkorder"
    | "vendor";

  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-marble-700">
            <Link href="/admin/orders" className="text-brand-700 hover:underline">All orders</Link>
          </p>
          <h1 className="text-3xl font-bold text-brand-700 tabular-money">
            Invoice #{order.invoiceNumber}
          </h1>
          <p className="text-marble-700 text-sm">{order.customer.firstName} {order.customer.lastName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/orders/${order.id}/edit`}
            className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium"
          >
            Edit
          </Link>
          {order.status === "voided" ? (
            <form action={async () => { "use server"; await unvoidOrderAction(order.id); }}>
              <button className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium">
                Unvoid
              </button>
            </form>
          ) : (
            <form action={async () => { "use server"; await voidOrderAction(order.id); }}>
              <button className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-marble-700 text-marble-700 hover:bg-marble-200 font-medium">
                Void
              </button>
            </form>
          )}
          <DeleteForm orderId={order.id} invoiceNumber={order.invoiceNumber} />
        </div>
      </div>

      <DocumentTabs basePath={`/admin/orders/${order.id}`} active={doc} />

      {doc === "invoice" ? (
        <>
          <DocumentToolbar orderId={order.id} doc="invoice" showPrint />
          <InvoiceView order={order} />
        </>
      ) : doc === "vendor" ? (
        <VendorTab orderId={order.id} />
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <DocumentToolbar orderId={order.id} doc={doc} />
            {doc === "workorder" ? (
              <Link
                href={`/admin/orders/${order.id}/work-order`}
                className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium no-print"
              >
                Edit work order details
              </Link>
            ) : null}
          </div>
          <PdfPreview orderId={order.id} doc={doc} />
        </>
      )}
    </div>
  );
}

async function VendorTab({ orderId }: { orderId: string }) {
  const { listVendorOrders } = await import("@/lib/vendor-order");
  const vos = await listVendorOrders(orderId);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end gap-2">
        <Link
          href={`/admin/orders/${orderId}/vendor-orders/new`}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)]"
        >
          + New Vendor PO
        </Link>
      </div>
      {vos.length === 0 ? (
        <div className="bg-marble-100 border border-marble-200 rounded-lg p-8 text-center">
          <p className="text-marble-700">No vendor POs yet — create one above.</p>
        </div>
      ) : (
        <div className="border border-marble-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-marble-100 text-marble-900">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">P.O. #</th>
                <th className="text-left px-3 py-2 font-semibold">Vendor</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
                <th className="text-left px-3 py-2 font-semibold">Will-Call</th>
                <th className="text-left px-3 py-2 font-semibold">Delivery</th>
                <th className="text-right px-3 py-2 font-semibold">PDF</th>
              </tr>
            </thead>
            <tbody>
              {vos.map((vo) => (
                <tr key={vo.id} className="border-t border-marble-200">
                  <td className="px-3 py-2 text-marble-900 tabular-money">{vo.poNumber}</td>
                  <td className="px-3 py-2 text-marble-900">{vo.vendorName}</td>
                  <td className="px-3 py-2 text-marble-700 capitalize">{vo.status}</td>
                  <td className="px-3 py-2 text-marble-700">
                    {vo.willCallDate ? vo.willCallDate.toLocaleDateString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-marble-700">
                    {vo.deliveryDate ? vo.deliveryDate.toLocaleDateString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <a
                      href={`/api/orders/${orderId}/pdf?doc=vendor&vendorOrderId=${vo.id}`}
                      className="text-brand-700 underline-offset-2 hover:underline text-sm"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DeleteForm({ orderId, invoiceNumber }: { orderId: string; invoiceNumber: number }) {
  // Server action invoked from a form. The user types the invoice number in
  // the prompt below to confirm.
  async function action(formData: FormData) {
    "use server";
    const typed = String(formData.get("confirmInvoice") ?? "");
    await deleteOrderAction(orderId, typed);
  }
  return (
    <details className="relative">
      <summary className="cursor-pointer inline-flex items-center justify-center min-h-11 px-4 rounded border border-danger text-danger hover:bg-marble-200 font-medium">
        Delete
      </summary>
      <form
        action={action}
        className="absolute right-0 top-12 z-20 bg-white border border-marble-200 rounded-lg p-4 shadow-lg w-72"
      >
        <p className="text-sm text-marble-900 mb-2">
          Type <span className="font-bold tabular-money">{invoiceNumber}</span> to permanently delete.
        </p>
        <input
          type="text"
          name="confirmInvoice"
          required
          className="w-full bg-white border border-marble-200 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-danger"
        />
        <button
          type="submit"
          className="mt-2 w-full inline-flex items-center justify-center min-h-11 px-4 rounded bg-danger text-white font-medium"
        >
          Delete invoice {invoiceNumber}
        </button>
      </form>
    </details>
  );
}
