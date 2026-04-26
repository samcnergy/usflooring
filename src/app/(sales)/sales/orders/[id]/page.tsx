import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/order";
import { requireRole } from "@/lib/auth";
import { InvoiceView, DocumentTabs } from "@/components/OrderDetail";
import { DocumentToolbar } from "@/components/DocumentToolbar";
import { PdfPreview } from "@/components/PdfPreview";
import { voidOwnOrderAction } from "../../actions";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SalesOrderDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const me = await requireRole("salesperson");
  const { id } = await params;
  const sp = await searchParams;
  const doc = (typeof sp.doc === "string" ? sp.doc : "invoice") as
    | "invoice"
    | "workorder"
    | "dailyworkorder"
    | "vendor";

  const order = await getOrder(id);
  if (!order || order.salespersonId !== me.id) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-marble-700">
            <Link href="/sales/orders" className="text-brand-700 hover:underline">My orders</Link>
          </p>
          <h1 className="text-3xl font-bold text-brand-700 tabular-money">
            Invoice #{order.invoiceNumber}
          </h1>
          <p className="text-marble-700 text-sm">{order.customer.firstName} {order.customer.lastName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/sales/orders/${order.id}/edit`}
            className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 font-medium"
          >
            Edit
          </Link>
          {order.status !== "voided" ? (
            <form action={async () => { "use server"; await voidOwnOrderAction(order.id); }}>
              <button className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-marble-700 text-marble-700 hover:bg-marble-200 font-medium">
                Void
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <DocumentTabs basePath={`/sales/orders/${order.id}`} active={doc} />

      {doc === "invoice" ? (
        <>
          <DocumentToolbar orderId={order.id} doc="invoice" showPrint />
          <InvoiceView order={order} />
        </>
      ) : doc === "vendor" ? (
        <div className="bg-marble-100 border border-marble-200 rounded-lg p-8 text-center">
          <p className="text-marble-700">Vendor PO wizard ships in build step 6.</p>
        </div>
      ) : (
        <>
          <DocumentToolbar orderId={order.id} doc={doc} />
          <PdfPreview orderId={order.id} doc={doc} />
        </>
      )}
    </div>
  );
}
