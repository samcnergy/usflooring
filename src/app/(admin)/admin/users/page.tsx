import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { InviteForm } from "./InviteForm";
import { UsersTabs } from "./UsersTabs";

export default async function AdminUsersPage() {
  await requireRole("admin");

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { fullName: "asc" }],
    select: { id: true, fullName: true, email: true, role: true, isActive: true },
  });

  const activeUsers      = users.filter((u) => u.isActive);
  const deactivatedUsers = users.filter((u) => !u.isActive);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">Salespeople &amp; Admins</h1>
      </div>

      <InviteForm />

      <UsersTabs activeUsers={activeUsers} deactivatedUsers={deactivatedUsers} />
    </div>
  );
}
