"use client";

import { useActionState, useState } from "react";

export type PasswordState =
  | { ok: true }
  | { ok: false; message: string }
  | null;

type Props = {
  action: (prev: PasswordState, formData: FormData) => Promise<PasswordState>;
};

export function PasswordChangeForm({ action }: Props) {
  const [state, formAction, pending] = useActionState<PasswordState, FormData>(action, null);
  const [show, setShow] = useState(false);

  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg p-6 max-w-md">
      <h2 className="text-lg font-semibold text-marble-900 mb-4">Change password</h2>

      {state?.ok ? (
        <p className="text-sm text-brand-700 bg-brand-100 border border-brand-200 rounded px-3 py-2 mb-4">
          Password updated successfully.
        </p>
      ) : null}

      {state && !state.ok ? (
        <p className="text-sm text-danger bg-marble-100 border border-danger rounded px-3 py-2 mb-4" role="alert">
          {state.message}
        </p>
      ) : null}

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-marble-700">Current password</span>
          <input
            type={show ? "text" : "password"}
            name="currentPassword"
            required
            autoComplete="current-password"
            className="bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-marble-700">New password</span>
          <input
            type={show ? "text" : "password"}
            name="newPassword"
            required
            minLength={8}
            autoComplete="new-password"
            className="bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-marble-700">Confirm new password</span>
          <input
            type={show ? "text" : "password"}
            name="confirmPassword"
            required
            minLength={8}
            autoComplete="new-password"
            className="bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-marble-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
            className="rounded border-marble-300"
          />
          Show passwords
        </label>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] disabled:opacity-50 disabled:pointer-events-none self-start"
        >
          {pending ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
