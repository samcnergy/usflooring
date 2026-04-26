import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { InviteForm } from "./InviteForm";
import { setUserActiveAction } from "./actions";

export default async function AdminUsersPage() {
  await requireRole("admin");
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { fullName: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">Salespeople &amp; Admins</h1>
      </div>

      <InviteForm />

      <div className="border border-marble-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-marble-100 text-marble-900">
            <tr>
              <th className="text-left px-3 py-2 font-semibold">Name</th>
              <th className="text-left px-3 py-2 font-semibold">Email</th>
              <th className="text-left px-3 py-2 font-semibold">Role</th>
              <th className="text-left px-3 py-2 font-semibold">Status</th>
              <th className="text-right px-3 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-marble-200">
                <td className="px-3 py-2 text-marble-900">{u.fullName}</td>
                <td className="px-3 py-2 text-marble-700">{u.email}</td>
                <td className="px-3 py-2 text-marble-700 capitalize">{u.role}</td>
                <td className="px-3 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${u.isActive ? "bg-brand-100 text-brand-700" : "bg-marble-200 text-marble-700"}`}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <form action={async () => { "use server"; await setUserActiveAction(u.id, !u.isActive); }}>
                    <button className="text-brand-700 underline-offset-2 hover:underline text-sm">
                      {u.isActive ? "Deactivate" : "Reactivate"}
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
