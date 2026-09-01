import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ContactForm from "../../ContactForm";
import { createContactAction } from "../../actions";

export default async function NewContactPage() {
  await requireRole("admin");

  const [sources, orders] = await Promise.all([
    prisma.advertisingSource.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.order.findMany({
      where: { deletedAt: null },
      orderBy: { invoiceNumber: "desc" },
      take: 200,
      select: {
        id: true,
        invoiceNumber: true,
        customer: { select: { firstName: true, lastName: true } },
      },
    }),
  ]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-2 text-sm text-marble-500">
        <Link href="/admin/marketing" className="hover:text-brand-600">Marketing</Link>
        <span>›</span>
        <span className="text-marble-800">New contact</span>
      </div>
      <h1 className="text-2xl font-bold text-marble-900">Add marketing contact</h1>
      <ContactForm
        action={createContactAction}
        sources={sources}
        orders={orders}
        submitLabel="Create contact"
      />
    </div>
  );
}
