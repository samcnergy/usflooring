"use client";

import { useState, useActionState, useTransition, useEffect } from "react";
import {
  setUserActiveAction,
  changeEmailAction,
  deleteUserAction,
  type EmailChangeState,
} from "./actions";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
};

// ── Inline email-edit form ────────────────────────────────────────────────────

function EditEmailForm({
  userId,
  currentEmail,
  onDone,
}: {
  userId: string;
  currentEmail: string;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<EmailChangeState, FormData>(
    changeEmailAction,
    null,
  );

  // Close the form after a successful save (can't call onDone during render).
  useEffect(() => {
    if (state?.ok) onDone();
  }, [state?.ok]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state?.ok) return null;

  return (
    <form action={formAction} className="flex items-center gap-2 mt-1">
      <input type="hidden" name="userId" value={userId} />
      <input
        name="newEmail"
        type="email"
        required
        defaultValue={currentEmail}
        autoFocus
        className="flex-1 min-w-0 bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-2 py-1.5 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
      />
      <button
        type="submit"
        disabled={pending}
        className="px-3 py-1.5 rounded bg-brand-700 text-white text-xs font-medium hover:bg-brand-900 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        onClick={onDone}
        className="px-3 py-1.5 rounded bg-marble-200 text-marble-900 text-xs font-medium hover:bg-marble-300"
      >
        Cancel
      </button>
      {state && !state.ok ? (
        <span className="text-xs text-danger">{state.message}</span>
      ) : null}
    </form>
  );
}

// ── One table row ─────────────────────────────────────────────────────────────

function UserRow({ u }: { u: User }) {
  const [editingEmail, setEditingEmail] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteUserAction(u.id);
      setConfirmDelete(false);
    });
  }

  return (
    <>
      <tr className="border-t border-marble-200">
        <td className="px-3 py-2 text-marble-900">{u.fullName}</td>
        <td className="px-3 py-2 text-marble-700">
          {editingEmail ? (
            <EditEmailForm
              userId={u.id}
              currentEmail={u.email}
              onDone={() => setEditingEmail(false)}
            />
          ) : (
            <span>{u.email}</span>
          )}
        </td>
        <td className="px-3 py-2 text-marble-700 capitalize">{u.role}</td>
        <td className="px-3 py-2 text-right">
          <div className="flex items-center justify-end gap-3">
            {/* Edit email */}
            {!editingEmail && !confirmDelete && (
              <button
                type="button"
                onClick={() => setEditingEmail(true)}
                className="text-marble-700 underline-offset-2 hover:underline text-sm"
              >
                Edit email
              </button>
            )}

            {/* Deactivate / Reactivate */}
            {!confirmDelete && (
              <form action={setUserActiveAction.bind(null, u.id, !u.isActive)}>
                <button className="text-brand-700 underline-offset-2 hover:underline text-sm">
                  {u.isActive ? "Deactivate" : "Reactivate"}
                </button>
              </form>
            )}

            {/* Delete */}
            {!confirmDelete && !editingEmail ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-danger underline-offset-2 hover:underline text-sm"
              >
                Delete
              </button>
            ) : confirmDelete ? (
              <span className="flex items-center gap-2 text-sm">
                <span className="text-marble-700">Delete {u.fullName}?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="px-2 py-1 rounded bg-danger text-white text-xs font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {isPending ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 rounded bg-marble-200 text-marble-900 text-xs font-medium hover:bg-marble-300"
                >
                  Cancel
                </button>
              </span>
            ) : null}
          </div>
        </td>
      </tr>
    </>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────

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
            <th className="text-right px-3 py-2 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <UserRow key={u.id} u={u} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

export function UsersTabs({
  activeUsers,
  deactivatedUsers,
}: {
  activeUsers: User[];
  deactivatedUsers: User[];
}) {
  const [tab, setTab] = useState<"active" | "deactivated">("active");

  const tabs: { key: "active" | "deactivated"; label: string; count: number }[] = [
    { key: "active",      label: "Active",      count: activeUsers.length },
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
        <UsersTable users={activeUsers} emptyMessage="No active users." />
      ) : (
        <UsersTable users={deactivatedUsers} emptyMessage="No deactivated users." />
      )}
    </div>
  );
}
