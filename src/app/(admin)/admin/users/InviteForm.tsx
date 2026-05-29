"use client";

import { useActionState } from "react";
import { inviteUserAction, type InviteState } from "./actions";

export function InviteForm() {
  const [state, action, pending] = useActionState<InviteState, FormData>(inviteUserAction, null);
  const errs = state && !state.ok ? state.errors ?? {} : {};

  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-marble-900 mb-3">Invite a user</h2>

      {state?.ok ? (
        <div className="bg-brand-100 border border-brand-700 rounded p-3 text-sm text-brand-700">
          <p className="font-semibold">Invitation sent to {state.email}.</p>
          <p className="mt-1">
            They will receive an email with a link to set their own password and activate their account.
          </p>
        </div>
      ) : null}

      {state && !state.ok && state.message ? (
        <p className="text-sm text-danger mb-3" role="alert">{state.message}</p>
      ) : null}

      <form action={action} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <label className="flex flex-col gap-1 sm:col-span-1">
          <span className="text-sm font-medium text-marble-700">Email</span>
          <input
            type="email"
            name="email"
            required
            className="bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
          {errs.email ? <p className="text-xs text-danger">{errs.email}</p> : null}
        </label>
        <label className="flex flex-col gap-1 sm:col-span-1">
          <span className="text-sm font-medium text-marble-700">Full name</span>
          <input
            type="text"
            name="fullName"
            required
            className="bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
          {errs.fullName ? <p className="text-xs text-danger">{errs.fullName}</p> : null}
        </label>
        <label className="flex flex-col gap-1 sm:col-span-1">
          <span className="text-sm font-medium text-marble-700">Role</span>
          <select
            name="role"
            defaultValue="salesperson"
            className="bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          >
            <option value="salesperson">Salesperson</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] disabled:opacity-50 disabled:pointer-events-none"
        >
          {pending ? "Inviting…" : "Invite"}
        </button>
      </form>
    </div>
  );
}
