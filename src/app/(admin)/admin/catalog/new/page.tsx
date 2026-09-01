import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MaterialForm } from "../MaterialForm";
import { createMaterialAction } from "../actions";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ vendorId?: string }>;
}) {
  await requireRole("admin");
  const sp = await searchParams;
  const vendors = await prisma.vendor.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/catalog" className="text-sm text-brand-700 hover:underline">← Catalog</Link>
        <h1 className="mt-2 text-3xl font-bold text-brand-700">Add Product</h1>
      </div>
      <MaterialForm action={createMaterialAction} vendors={vendors} defaultVendorId={sp.vendorId} submitLabel="Create Product" />
    </div>
  );
}
