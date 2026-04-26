import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { WorkOrderForm, workOrderToInitial, type WorkOrderActionState } from "@/components/forms/WorkOrderForm";
import { updateWorkOrderAction } from "./actions";

type Params = Promise<{ id: string }>;

export default async function AdminEditWorkOrderPage({ params }: { params: Params }) {
  await requireRole("admin");
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: { materials: true },
  });
  if (!order) notFound();

  const initial = workOrderToInitial(order);
  const action = async (prev: WorkOrderActionState, formData: FormData) =>
    updateWorkOrderAction(id, prev, formData);

  return (
    <div>
      <p className="text-xs text-marble-700 mb-1">
        <Link href={`/admin/orders/${order.id}?doc=workorder`} className="text-brand-700 hover:underline">
          ← Back to work order
        </Link>
      </p>
      <h1 className="text-3xl font-bold text-brand-700 mb-4">
        Work Order — Invoice <span className="tabular-money">#{order.invoiceNumber}</span>
      </h1>
      <WorkOrderForm
        initial={initial}
        action={action}
        cancelHref={`/admin/orders/${order.id}?doc=workorder`}
      />
    </div>
  );
}
