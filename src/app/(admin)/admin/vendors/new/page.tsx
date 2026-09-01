import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { VendorForm } from "../VendorForm";
import { createVendorAction } from "../actions";

export default async function NewVendorPage() {
  await requireRole("admin");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/vendors" className="text-sm text-brand-700 hover:underline">← Vendors</Link>
        <h1 className="mt-2 text-3xl font-bold text-brand-700">Add Vendor</h1>
      </div>
      <VendorForm action={createVendorAction} submitLabel="Create Vendor" />
    </div>
  );
}
