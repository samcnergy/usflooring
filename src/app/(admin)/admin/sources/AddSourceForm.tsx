"use client";

import { useActionState } from "react";
import { addSourceAction, type AddState } from "./actions";

export function AddSourceForm() {
  const [state, action, pending] = useActionState<AddState, FormData>(addSourceAction, null);
  const errs = state && !state.ok ? state.errors ?? {} : {};
  return (
    <form action={action} className="bg-marble-100 border border-marble-200 rounded-lg p-4 flex items-end gap-3">
      <label className="flex flex-col gap-1 flex-1">
        <span className="text-sm font-medium text-marble-700">New advertising source</span>
        <input
          type="text"
          name="name"
          required
          placeholder="e.g. Nextdoor"
          className="bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
        {errs.name ? <p className="text-xs text-danger">{errs.name}</p> : null}
        {state && !state.ok && state.message ? (
          <p className="text-xs text-danger">{state.message}</p>
        ) : null}
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] disabled:opacity-50 disabled:pointer-events-none"
      >
        {pending ? "Adding…" : "Add"}
      </button>
    </form>
  );
}
