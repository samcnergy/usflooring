// Wraps unauthenticated pages (login, forgot password, reset password). No
// AppShell — these pages are reached without a session.

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-marble-50 flex flex-col items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
