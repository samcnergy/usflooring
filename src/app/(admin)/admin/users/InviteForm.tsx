"use client";

import { useActionState, useState } from "react";
import { inviteUserAction, type InviteState } from "./actions";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-marble-700">{label}</span>
      <div className="flex gap-2 items-center">
        <input
          readOnly
          value={value}
          onFocus={(e) => e.target.select()}
          className="flex-1 min-w-0 bg-white border border-marble-200 rounded px-3 py-2 text-sm text-marble-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded bg-brand-700 text-white text-sm font-medium hover:bg-brand-900 transition-colors"
        >
          {copied ? (
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
            </svg>
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export function InviteForm() {
  const [state, action, pending] = useActionState<InviteState, FormData>(inviteUserAction, null);
  const errs = state && !state.ok ? state.errors ?? {} : {};

  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-marble-900 mb-3">Add a user</h2>

      {state?.ok ? (
        <div className="bg-brand-100 border border-brand-700 rounded p-4 mb-3 flex flex-col gap-3">
          <p className="text-sm font-semibold text-brand-700">
            Account created for {state.email}
          </p>
          <p className="text-sm text-brand-700">
            Share these login credentials with the new user. They can change their
            password from their Profile page after signing in.
          </p>
          <CopyField label="Login URL" value="https://usflooring.onrender.com/login" />
          <CopyField label="Email" value={state.email} />
          <CopyField label="Temporary password" value={state.tempPassword} />
        </div>
      ) : null}

      {state && !state.ok && state.message ? (
        <p className="text-sm text-danger mb-3" role="alert">{state.message}</p>
      ) : null}

      <form action={action} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end mt-1">
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
          {pending ? "Creating…" : "Add user"}
        </button>
      </form>
    </div>
  );
}
