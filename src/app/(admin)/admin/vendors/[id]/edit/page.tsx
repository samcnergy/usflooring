import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { VendorForm } from "../../VendorForm";
import { updateVendorAction } from "../../actions";

export default async function EditVendorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;
  const vendor = await prisma.vendor.findUnique({ where: { id } });
  if (!vendor) notFound();

  const action = updateVendorAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/admin/vendors/${id}`} className="text-sm text-brand-700 hover:underline">← {vendor.name}</Link>
        <h1 className="mt-2 text-3xl font-bold text-brand-700">Edit Vendor</h1>
      </div>
      <VendorForm
        action={action}
        defaultValues={{
          name: vendor.name,
          contactName: vendor.contactName ?? undefined,
          email: vendor.email ?? undefined,
          phone: vendor.phone ?? undefined,
          address: vendor.address ?? undefined,
          website: vendor.website ?? undefined,
          notes: vendor.notes ?? undefined,
        }}
        submitLabel="Update Vendor"
      />
    </div>
  );
}
