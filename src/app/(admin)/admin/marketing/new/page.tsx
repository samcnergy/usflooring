import Link from "next/link";
import { requireRole } from "@/lib/auth";
import CampaignForm from "../CampaignForm";
import { createCampaignAction } from "../actions";

export default async function NewCampaignPage() {
  await requireRole("admin");
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-2 text-sm text-marble-500">
        <Link href="/admin/marketing" className="hover:text-brand-600">Marketing</Link>
        <span>›</span>
        <span className="text-marble-800">New campaign</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-marble-900">New email campaign</h1>
        <p className="text-sm text-marble-600 mt-1">Draft your campaign — you&apos;ll preview and send from the next page.</p>
      </div>
      <CampaignForm action={createCampaignAction} submitLabel="Save draft" />
    </div>
  );
}
