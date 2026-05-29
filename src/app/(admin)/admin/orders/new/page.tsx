import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { emptyInitialValues } from "@/components/forms/InvoiceForm.shared";
import { createOrderAction } from "../actions";

export default async function NewOrderPage() {
  await requireRole("admin");

  const [allUsers, advertisingSources] = await Promise.all([
    prisma.user.findMany({
      where: { isActive: true },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, role: true },
    }),
    prisma.advertisingSource.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  // Show admins with "(Admin)" label so they're distinguishable in the dropdown.
  const salespeople = allUsers.map((u) => ({
    id: u.id,
    fullName: u.role === "admin" ? `${u.fullName} (Admin)` : u.fullName,
  }));

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
