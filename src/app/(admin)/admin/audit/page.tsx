import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function AuditPage() {
  await requireRole("admin");
  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: { select: { fullName: true, email: true } } },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">Audit Log</h1>
        <p className="text-marble-700 text-sm mt-1">
          Last 200 entries. Records every Order create / update / void / delete
          and every user role change.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-marble-100 border border-marble-200 rounded-lg p-8 text-center">
          <p className="text-marble-700">No audit entries yet.</p>
        </div>
      ) : (
        <div className="border border-marble-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-marble-100 text-marble-900">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">When</th>
                <th className="text-left px-3 py-2 font-semibold">Actor</th>
                <th className="text-left px-3 py-2 font-semibold">Action</th>
                <th className="text-left px-3 py-2 font-semibold">Entity</th>
                <th className="text-left px-3 py-2 font-semibold">Diff</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-marble-200">
                  <td className="px-3 py-2 text-marble-700 whitespace-nowrap">
                    {format(e.createdAt, "MMM d, h:mm:ss a")}
                  </td>
                  <td className="px-3 py-2 text-marble-900">
                    {e.actor?.fullName ?? "(system)"}
                  </td>
                  <td className="px-3 py-2 text-brand-700 font-medium">{e.action}</td>
                  <td className="px-3 py-2 text-marble-900">
                    {e.entityType} <span className="text-marble-700 text-xs">{e.entityId.slice(0, 8)}…</span>
                  </td>
                  <td className="px-3 py-2 text-marble-700 text-xs font-mono max-w-md truncate">
                    {e.diff ? JSON.stringify(e.diff) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
