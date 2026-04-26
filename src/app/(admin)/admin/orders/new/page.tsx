import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { emptyInitialValues } from "@/components/forms/InvoiceForm.shared";
import { createOrderAction } from "../actions";

export default async function NewOrderPage() {
  await requireRole("admin");

  const [salespeople, advertisingSources] = await Promise.all([
    prisma.user.findMany({
      where: { role: "salesperson", isActive: true },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
    prisma.advertisingSource.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-700 mb-4">New Order</h1>
      <InvoiceForm
        initial={emptyInitialValues(salespeople[0]?.id ?? "")}
        salespeople={salespeople}
        advertisingSources={advertisingSources}
        action={createOrderAction}
        submitLabel="Save invoice"
        cancelHref="/admin/orders"
      />
    </div>
  );
}
