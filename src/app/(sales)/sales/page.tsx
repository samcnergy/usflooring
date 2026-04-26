import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { emptyInitialValues } from "@/components/forms/InvoiceForm.shared";
import { createOwnOrderAction } from "./actions";

export default async function NewOrderPage() {
  const me = await requireRole("salesperson");

  // Salesperson can only pick themselves; we still pass the list (just one)
  // so the dropdown renders consistently.
  const advertisingSources = await prisma.advertisingSource.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-700 mb-4">New Order</h1>
      <InvoiceForm
        initial={emptyInitialValues(me.id)}
        salespeople={[{ id: me.id, fullName: me.fullName }]}
        advertisingSources={advertisingSources}
        lockSalesperson
        action={createOwnOrderAction}
        submitLabel="Save invoice"
        cancelHref="/sales/orders"
      />
    </div>
  );
}
