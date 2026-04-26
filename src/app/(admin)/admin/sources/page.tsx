import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { AddSourceForm } from "./AddSourceForm";
import { setSourceActiveAction } from "./actions";

export default async function AdminSourcesPage() {
  await requireRole("admin");
  const sources = await prisma.advertisingSource.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-brand-700">Advertising Sources</h1>

      <AddSourceForm />

      <div className="border border-marble-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-marble-100 text-marble-900">
            <tr>
              <th className="text-left px-3 py-2 font-semibold">Name</th>
              <th className="text-left px-3 py-2 font-semibold">Status</th>
              <th className="text-right px-3 py-2 font-semibold">Orders</th>
              <th className="text-right px-3 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id} className="border-t border-marble-200">
                <td className="px-3 py-2 text-marble-900">{s.name}</td>
                <td className="px-3 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${s.isActive ? "bg-brand-100 text-brand-700" : "bg-marble-200 text-marble-700"}`}>
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-marble-700 tabular-money">{s._count.orders}</td>
                <td className="px-3 py-2 text-right">
                  <form action={async () => { "use server"; await setSourceActiveAction(s.id, !s.isActive); }}>
                    <button className="text-brand-700 underline-offset-2 hover:underline text-sm">
                      {s.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
