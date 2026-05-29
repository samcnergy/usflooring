import { requireRole } from "@/lib/auth";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { changePasswordAction } from "./actions";

export default async function AdminProfilePage() {
  const me = await requireRole("admin");

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">Profile</h1>
        <p className="text-marble-700 mt-1">{me.fullName} · {me.email}</p>
      </div>

      <PasswordChangeForm action={changePasswordAction} />
    </div>
  );
}
