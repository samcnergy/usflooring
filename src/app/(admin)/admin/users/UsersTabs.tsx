"use client";

import { useState } from "react";
import { setUserActiveAction } from "./actions";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
};

function UsersTable({
  users,
  emptyMessage,
}: {
  users: User[];
  emptyMessage: string;
}) {
  if (users.length === 0) {
    return (
      <p className="text-sm text-marble-700 py-6 text-center">{emptyMessage}</p>
    );
  }

  return (
    <div className="border border-marble-200 rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-marble-100 text-marble-900">
          <tr>
            <th className="text-left px-3 py-2 font-semibold">Name</th>
            <th className="text-left px-3 py-2 font-semibold">Email</th>
            <th className="text-left px-3 py-2 font-semibold">Role</th>
            <th className="text-right px-3 py-2 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-marble-200">
              <td className="px-3 py-2 text-marble-900">{u.fullName}</td>
              <td className="px-3 py-2 text-marble-700">{u.email}</td>
              <td className="px-3 py-2 text-marble-700 capitalize">{u.role}</td>
              <td className="px-3 py-2 text-right">
                <form action={setUserActiveAction.bind(null, u.id, !u.isActive)}>
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
  );
}

export function UsersTabs({
  activeUsers,
  deactivatedUsers,
}: {
  activeUsers: User[];
  deactivatedUsers: User[];
}) {
  const [tab, setTab] = useState<"active" | "deactivated">("active");

  const tabs: { key: "active" | "deactivated"; label: string; count: number }[] = [
    { key: "active", label: "Active", count: activeUsers.length },
    { key: "deactivated", label: "Deactivated", count: deactivatedUsers.length },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-marble-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={[
              "px-4 py-2 text-sm font-medium rounded-t -mb-px border border-b-0 transition-colors",
              tab === t.key
                ? "border-marble-200 bg-white text-brand-700"
                : "border-transparent text-marble-700 hover:text-marble-900",
            ].join(" ")}
          >
            {t.label}
            <span
              className={[
                "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                tab === t.key
                  ? "bg-brand-100 text-brand-700"
                  : "bg-marble-200 text-marble-700",
              ].join(" ")}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {tab === "active" ? (
        <UsersTable
          users={activeUsers}
          emptyMessage="No active users."
        />
      ) : (
        <UsersTable
          users={deactivatedUsers}
          emptyMessage="No deactivated users."
        />
      )}
    </div>
  );
}
