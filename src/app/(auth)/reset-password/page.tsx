"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

// Lands here after the user clicks the reset link in their email. Supabase
// passes a `code` query param; we exchange it for a session, let the user
// pick a new password, then sign them out so they have to log in fresh.

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");

  const [exchanging, setExchanging] = useState(true);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function exchange() {
      if (!code) {
        setExchangeError("Missing reset code. Request a new reset link.");
        setExchanging(false);
        return;
      }
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (cancelled) return;
      if (error) setExchangeError(error.message);
      setExchanging(false);
    }
    exchange();
    return () => {
      cancelled = true;
    };
  }, [code]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }
    await supabase.auth.signOut();
    router.push("/login?reset=1");
  }

  if (exchanging) {
    return <p className="text-sm text-marble-700">Verifying reset link…</p>;
  }
  if (exchangeError) {
    return (
      <>
        <p className="text-sm text-danger" role="alert">{exchangeError}</p>
        <Link
          href="/forgot-password"
          className="mt-3 inline-block text-brand-700 underline underline-offset-2 hover:text-brand-900 text-sm"
        >
          Request a new link
        </Link>
      </>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-marble-700 mb-1">
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-marble-700 mb-1">
          Confirm new password
        </label>
        <input
          id="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
      </div>

      {error ? (
        <p className="text-sm text-danger" role="alert">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] transition-colors disabled:opacity-50 disabled:pointer-events-none"
      >
        {submitting ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.avif"
          alt="U.S. Floor, Kitchen & Bath"
          width={280}
          height={180}
          priority
        />
      </div>

      <div className="bg-marble-100 border border-marble-200 rounded-lg p-6">
        <h1 className="text-xl font-semibold text-brand-700 mb-1">Set new password</h1>
        <Suspense fallback={<p className="text-sm text-marble-700">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
