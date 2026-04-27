"use client";

import { useActionState, useEffect, useState } from "react";
import type { LineCategory } from "@prisma/client";

export type SaveInstallNoteState =
  | { ok: true; category: string }
  | { ok: false; category: string; message?: string }
  | null;

type CategoryNotes = { category: LineCategory; label: string; notes: string };

type Props = {
  orderId: string;
  categories: CategoryNotes[];
  saveAction: (prev: SaveInstallNoteState, formData: FormData) => Promise<SaveInstallNoteState>;
};

export function InstallationInstruction({ orderId, categories, saveAction }: Props) {
  if (categories.length === 0) {
    return (
      <div className="bg-marble-100 border border-marble-200 rounded-lg p-8 text-center">
        <p className="text-marble-700">No line items on this order — add line items first.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-marble-700">
          One installation instruction sheet is generated per material type. Each installer receives only their sheet.
        </p>
        <a
          href={`/api/orders/${orderId}/pdf?doc=install`}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)]"
        >
          Download All Sheets (PDF)
        </a>
      </div>

      {categories.map((cat) => (
        <CategoryCard
          key={cat.category}
          orderId={orderId}
          cat={cat}
          saveAction={saveAction}
        />
      ))}
    </div>
  );
}

function CategoryCard({
  orderId, cat, saveAction,
}: {
  orderId: string;
  cat: CategoryNotes;
  saveAction: Props["saveAction"];
}) {
  const [state, formAction, pending] = useActionState<SaveInstallNoteState, FormData>(
    saveAction,
    null,
  );
  const [notes, setNotes] = useState(cat.notes);
  const [editing, setEditing] = useState(false);

  const saved = state?.ok && state.category === cat.category;
  const errored = state && !state.ok && state.category === cat.category;

  useEffect(() => {
    if (saved) setEditing(false);
  }, [saved]);

  return (
    <div className="bg-marble-100 border border-marble-200 rounded-lg p-4">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <h3 className="text-base font-semibold text-brand-700">{cat.label}</h3>
        <div className="flex items-center gap-2">
          <a
            href={`/api/orders/${orderId}/pdf?doc=install&category=${cat.category}`}
            className="text-xs text-brand-700 underline-offset-2 hover:underline"
          >
            Download this sheet
          </a>
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 text-sm font-medium"
            >
              Edit notes
            </button>
          ) : null}
        </div>
      </div>

      {saved && !editing ? (
        <p className="text-xs text-brand-700 mb-2">Saved.</p>
      ) : null}
      {errored ? (
        <p className="text-xs text-danger mb-2">{(state as { message?: string }).message ?? "Save failed."}</p>
      ) : null}

      {editing ? (
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="category" value={cat.category} />
          <div>
            <label className="block text-xs text-marble-700 mb-1">
              Installation notes for {cat.label} installer
            </label>
            <textarea
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder={`Enter specific instructions for the ${cat.label} installer…`}
              className="w-full bg-white border border-marble-200 rounded px-3 py-2 text-sm text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center px-4 py-2 rounded bg-brand-900 text-white font-medium text-sm hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setNotes(cat.notes); }}
              className="inline-flex items-center justify-center px-4 py-2 rounded border border-marble-300 text-marble-700 font-medium text-sm hover:bg-marble-200"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-sm text-marble-900 whitespace-pre-wrap min-h-8">
          {notes || <span className="text-marble-500 italic">No notes yet — click Edit to add installation instructions.</span>}
        </div>
      )}
    </div>
  );
}
