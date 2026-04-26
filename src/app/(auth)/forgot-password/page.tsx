import Image from "next/image";
import Link from "next/link";
import { requestPasswordResetAction } from "./actions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const errorMessage = typeof params.error === "string" ? params.error : null;
  const sent = params.sent === "1";

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
        <h1 className="text-xl font-semibold text-brand-700 mb-1">Reset password</h1>

        {sent ? (
          <p className="text-sm text-marble-700">
            If an account exists for that email, we sent password reset
            instructions. Check your inbox (and spam folder).
          </p>
        ) : (
          <>
            <p className="text-sm text-marble-700 mb-4">
              Enter your email and we&apos;ll send a link to reset your password.
            </p>

            <form action={requestPasswordResetAction} className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-marble-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  className="w-full bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              {errorMessage ? (
                <p className="text-sm text-danger" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)] transition-colors"
              >
                Send reset link
              </button>
            </form>
          </>
        )}

        <div className="mt-4 text-sm">
          <Link
            href="/login"
            className="text-brand-700 underline underline-offset-2 hover:text-brand-900"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
