import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ContactForm from "../../../ContactForm";
import { updateContactAction } from "../../../actions";

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;

  const [contact, sources, orders] = await Promise.all([
    prisma.marketingContact.findUnique({ where: { id } }),
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

  if (!contact) notFound();

  const boundAction = updateContactAction.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-2 text-sm text-marble-500">
        <Link href="/admin/marketing" className="hover:text-brand-600">Marketing</Link>
        <span>›</span>
        <Link href={`/admin/marketing/contacts/${id}`} className="hover:text-brand-600">{contact.name}</Link>
        <span>›</span>
        <span className="text-marble-800">Edit</span>
      </div>
      <h1 className="text-2xl font-bold text-marble-900">Edit contact</h1>
      <ContactForm
        action={boundAction}
        sources={sources}
        orders={orders}
        defaults={{
          name:         contact.name,
          phone:        contact.phone ?? "",
          email:        contact.email ?? "",
          type:         contact.type,
          status:       contact.status,
          notes:        contact.notes ?? "",
          sourceId:     contact.sourceId ?? "",
          orderId:      contact.orderId ?? "",
          nextFollowUp: contact.nextFollowUp
            ? contact.nextFollowUp.toISOString().split("T")[0]
            : "",
        }}
        submitLabel="Save changes"
      />
    </div>
  );
}
