import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/order";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceForm, orderToInitial, type ActionState } from "@/components/forms/InvoiceForm";
import { updateOwnOrderAction } from "../../../actions";

type Params = Promise<{ id: string }>;

export default async function SalesEditOrderPage({ params }: { params: Params }) {
  const me = await requireRole("salesperson");
  const { id } = await params;
  const order = await getOrder(id);
  if (!order || order.salespersonId !== me.id) notFound();

  const advertisingSources = await prisma.advertisingSource.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const initial = orderToInitial(order);
  const action = async (prev: ActionState, formData: FormData) =>
    updateOwnOrderAction(id, prev, formData);

  return (
    <div>
      <p className="text-xs text-marble-700 mb-1">
        <Link href={`/sales/orders/${order.id}`} className="text-brand-700 hover:underline">
          ← Back to invoice
        </Link>
      </p>
      <h1 className="text-3xl font-bold text-brand-700 mb-4">
        Edit Invoice <span className="tabular-money">#{order.invoiceNumber}</span>
      </h1>
      <InvoiceForm
        initial={initial}
        salespeople={[{ id: me.id, fullName: me.fullName }]}
        advertisingSources={advertisingSources}
        lockSalesperson
        action={action}
        submitLabel="Save changes"
        cancelHref={`/sales/orders/${order.id}`}
      />
    </div>
  );
}
