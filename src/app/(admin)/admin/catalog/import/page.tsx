import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ImportWizard from "./ImportWizard";

export default async function ImportProductsPage({
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
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-2 text-sm text-marble-500">
        <Link href="/admin/catalog" className="hover:text-brand-600">Catalog</Link>
        <span>›</span>
        <span className="text-marble-800">Import products</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-marble-900">Import products</h1>
        <p className="text-sm text-marble-600 mt-1">
          Upload an Excel, CSV, or PDF file to add multiple products to a vendor&apos;s catalog at once.
        </p>
      </div>

      <ImportWizard vendors={vendors} defaultVendorId={sp.vendorId} />
    </div>
  );
}
