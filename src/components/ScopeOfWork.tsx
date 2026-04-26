"use client";

import { useActionState, useState } from "react";

type Props = {
  orderId: string;
  generatedScope: string;
  override: string | null;
  canEdit: boolean;
  saveAction: (prev: SaveScopeState, formData: FormData) => Promise<SaveScopeState>;
  resetAction: (orderId: string) => Promise<void>;
};

export type SaveScopeState =
  | { ok: true }
  | { ok: false; message?: string }
  | null;

// Renders the (override or generated) scope as paragraphs. Tiny markdown
// support (only **bold**) since that's all the generator emits.
export function ScopeOfWork({
  orderId,
  generatedScope,
  override,
  canEdit,
  saveAction,
  resetAction,
}: Props) {
  const [state, formAction, pending] = useActionState<SaveScopeState, FormData>(saveAction, null);
  const [editing, setEditing] = useState(false);

  const display = override ?? generatedScope;

  return (
    <div className="bg-white border border-marble-200 rounded-lg p-6">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <h2 className="text-xl font-semibold text-brand-700">Scope of Work</h2>
        <div className="flex items-center gap-2">
          {override && !editing ? (
            <span className="text-xs bg-marble-200 text-marble-700 px-2 py-0.5 rounded">
              Edited from auto-generated
            </span>
          ) : null}
          {canEdit && !editing ? (
            <>
              <CopyButton text={display} />
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center justify-center min-h-9 px-3 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 text-sm font-medium"
              >
                Edit scope
              </button>
              {override ? (
                <ResetForm orderId={orderId} resetAction={resetAction} />
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {editing ? (
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="orderId" value={orderId} />
          <textarea
            name="scopeOverride"
            defaultValue={display}
            rows={Math.max(8, display.split("\n").length + 2)}
            className="w-full bg-white border border-marble-200 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            autoFocus
          />
          {state && !state.ok && state.message ? (
            <p className="text-sm text-danger" role="alert">{state.message}</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center justify-center min-h-9 px-3 rounded border border-brand-700 text-brand-700 hover:bg-brand-100 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center min-h-9 px-3 rounded bg-brand-900 text-white text-sm font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <ScopeText text={display} />
      )}
    </div>
  );
}

export function ScopeText({ text }: { text: string }) {
  // Render paragraphs separated by blank lines; render **bold** markdown.
  const paragraphs = text.split(/\n\n+/);
  return (
    <div className="prose prose-sm max-w-none text-marble-900">
      {paragraphs.map((p, i) => (
        <p key={i} className="leading-relaxed mb-3 last:mb-0">
          {renderInlineBold(p)}
        </p>
      ))}
    </div>
  );
}

function renderInlineBold(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  const re = /\*\*([^*]+)\*\*/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > i) parts.push(<span key={key++}>{text.slice(i, match.index)}</span>);
    parts.push(<strong key={key++}>{match[1]}</strong>);
    i = match.index + match[0].length;
  }
  if (i < text.length) parts.push(<span key={key++}>{text.slice(i)}</span>);
  return parts;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      className="inline-flex items-center justify-center min-h-9 px-3 rounded border border-marble-200 text-marble-700 hover:bg-marble-100 text-sm font-medium"
    >
      {copied ? "Copied" : "Copy to clipboard"}
    </button>
  );
}

function ResetForm({ orderId, resetAction }: { orderId: string; resetAction: (orderId: string) => Promise<void> }) {
  return (
    <details className="relative">
      <summary className="cursor-pointer inline-flex items-center justify-center min-h-9 px-3 rounded border border-marble-200 text-marble-700 hover:bg-marble-100 text-sm font-medium">
        Reset to auto-generated
      </summary>
      <form
        action={async () => { await resetAction(orderId); }}
        className="absolute right-0 top-10 z-20 bg-white border border-marble-200 rounded-lg p-3 shadow-lg w-64"
      >
        <p className="text-sm text-marble-900 mb-2">
          Discard your edited scope and revert to the auto-generated version?
        </p>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center min-h-9 px-3 rounded bg-danger text-white text-sm font-medium"
        >
          Yes, reset
        </button>
      </form>
    </details>
  );
}
