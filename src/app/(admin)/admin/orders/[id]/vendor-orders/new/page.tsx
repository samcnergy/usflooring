import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { VendorOrderWizard } from "@/components/forms/VendorOrderWizard";
import type { CreateVendorState } from "@/components/forms/VendorOrderWizard.shared";
import { createVendorOrderAction } from "./actions";

type Params = Promise<{ id: string }>;

export default async function AdminNewVendorOrderPage({ params }: { params: Params }) {
  await requireRole("admin");
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: { materials: { orderBy: { lineNumber: "asc" } }, vendorOrders: { select: { id: true } } },
  });
  if (!order) notFound();

  const defaultPo = `${order.invoiceNumber}-${order.vendorOrders.length + 1}`;
  const action = async (prev: CreateVendorState, formData: FormData) =>
    createVendorOrderAction(id, prev, formData);

  return (
    <div>
      <p className="text-xs text-marble-700 mb-1">
        <Link href={`/admin/orders/${order.id}?doc=vendor`} className="text-brand-700 hover:underline">
          ← Back to vendor POs
        </Link>
      </p>
      <h1 className="text-3xl font-bold text-brand-700 mb-4">
        New Vendor PO — Invoice <span className="tabular-money">#{order.invoiceNumber}</span>
      </h1>
      <VendorOrderWizard
        defaultVendorName=""
        defaultPoSuggestion={defaultPo}
        materials={order.materials.map((m) => ({
          id: m.id, lineNumber: m.lineNumber,
          millStyle: m.millStyle, color: m.color, size: m.size,
        }))}
        action={action}
        cancelHref={`/admin/orders/${order.id}?doc=vendor`}
      />
    </div>
  );
}
