import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function VendorsPage() {
  await requireRole("admin");
  const vendors = await prisma.vendor.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { vendorOrders: true, materials: true } },
    },
  });

  const active = vendors.filter((v) => v.isActive);
  const inactive = vendors.filter((v) => !v.isActive);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-700">Vendors</h1>
        <Link
          href="/admin/vendors/new"
          className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-4 h-10 text-sm"
        >
          + Add Vendor
        </Link>
      </div>

      <VendorTable vendors={active} title="Active Vendors" />
      {inactive.length > 0 && <VendorTable vendors={inactive} title="Inactive" dim />}
    </div>
  );
}

type VendorRow = {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  _count: { vendorOrders: number; materials: number };
};

function VendorTable({ vendors, title, dim }: { vendors: VendorRow[]; title: string; dim?: boolean }) {
  if (vendors.length === 0) return null;
  return (
    <section>
      <h2 className={`text-sm font-semibold mb-2 ${dim ? "text-marble-500" : "text-marble-700"}`}>{title}</h2>
      <div className="border border-marble-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-marble-100 text-marble-900">
            <tr>
              <th className="text-left px-3 py-2 font-semibold">Name</th>
              <th className="text-left px-3 py-2 font-semibold">Contact</th>
              <th className="text-left px-3 py-2 font-semibold">Phone</th>
              <th className="text-right px-3 py-2 font-semibold">Products</th>
              <th className="text-right px-3 py-2 font-semibold">POs</th>
              <th className="text-right px-3 py-2 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} className={`border-t border-marble-200 ${dim ? "opacity-60" : ""}`}>
                <td className="px-3 py-2 font-medium text-marble-900">
                  <Link href={`/admin/vendors/${v.id}`} className="hover:text-brand-700 hover:underline">
                    {v.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-marble-700">{v.contactName ?? "—"}</td>
                <td className="px-3 py-2 text-marble-700">{v.phone ?? "—"}</td>
                <td className="px-3 py-2 text-right text-marble-700 tabular-nums">{v._count.materials}</td>
                <td className="px-3 py-2 text-right text-marble-700 tabular-nums">{v._count.vendorOrders}</td>
                <td className="px-3 py-2 text-right">
                  <Link href={`/admin/vendors/${v.id}`} className="text-brand-700 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
