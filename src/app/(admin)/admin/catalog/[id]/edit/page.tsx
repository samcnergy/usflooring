import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { MaterialForm } from "../../MaterialForm";
import { updateMaterialAction } from "../../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;

  const [material, vendors] = await Promise.all([
    prisma.material.findUnique({ where: { id } }),
    prisma.vendor.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!material) notFound();

  const action = updateMaterialAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/admin/catalog/${id}`} className="text-sm text-brand-700 hover:underline">← {material.name}</Link>
        <h1 className="mt-2 text-3xl font-bold text-brand-700">Edit Product</h1>
      </div>
      <MaterialForm
        action={action}
        vendors={vendors}
        defaultValues={{
          name: material.name,
          brand: material.brand ?? undefined,
          style: material.style ?? undefined,
          color: material.color ?? undefined,
          sizeSpec: material.sizeSpec ?? undefined,
          sku: material.sku ?? undefined,
          category: material.category,
          defaultVendorId: material.defaultVendorId ?? undefined,
          defaultUnit: material.defaultUnit ?? undefined,
          defaultUnitPriceCents: material.defaultUnitPriceCents,
          defaultCostCents: material.defaultCostCents,
          notes: material.notes ?? undefined,
        }}
        submitLabel="Update Product"
      />
    </div>
  );
}
