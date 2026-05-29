import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction } from "./actions";
import { getSessionUser } from "@/lib/auth";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Already signed in? Send them to their shell.
  const user = await getSessionUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/sales");

  const params = await searchParams;
  const rawError = typeof params.error === "string" ? params.error : null;
  const errorMessage = rawError === "auth_callback_failed"
    ? "The invitation link has expired or is invalid. Please ask an admin to re-send the invitation."
    : rawError;
  const justReset = params.reset === "1";

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
        <h1 className="text-xl font-semibold text-brand-700 mb-1">Sign in</h1>
        <p className="text-sm text-marble-700 mb-4">
          U.S. Floor, Kitchen &amp; Bath order management.
        </p>

        {justReset ? (
          <p className="text-sm text-brand-700 bg-brand-100 border border-brand-700 rounded px-3 py-2 mb-3">
            Password updated. Sign in with your new password.
          </p>
        ) : null}

        <form action={signInAction} className="flex flex-col gap-3">
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-marble-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
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
            Sign in
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <Link href="/forgot-password" className="text-brand-700 underline underline-offset-2 hover:text-brand-900">
            Forgot password?
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-marble-700">
        30092 Santa Margarita Pkwy #G &middot; Rancho Santa Margarita, CA 92688
      </p>
    </div>
  );
}
