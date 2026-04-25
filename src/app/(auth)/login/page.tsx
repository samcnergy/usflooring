// Stub. Real Supabase Auth UI ships in step 2 of the build order.
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-marble-50 flex flex-col items-center justify-center px-4">
      <Image src="/logo.avif" alt="U.S. Floor, Kitchen & Bath" width={320} height={200} priority />
      <h1 className="mt-6 text-2xl font-semibold text-brand-700">Sign in</h1>
      <p className="mt-2 text-marble-700 text-sm">
        Login form ships in build step 2 (auth + role routing).
      </p>
    </div>
  );
}
