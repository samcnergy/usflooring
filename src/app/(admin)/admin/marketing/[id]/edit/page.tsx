import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CampaignForm from "../../CampaignForm";
import { updateCampaignAction } from "../../actions";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign || campaign.status === "sent") notFound();

  const boundAction = updateCampaignAction.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-2 text-sm text-marble-500">
        <Link href="/admin/marketing" className="hover:text-brand-600">Marketing</Link>
        <span>›</span>
        <Link href={`/admin/marketing/${id}`} className="hover:text-brand-600">{campaign.name}</Link>
        <span>›</span>
        <span className="text-marble-800">Edit</span>
      </div>
      <h1 className="text-2xl font-bold text-marble-900">Edit campaign</h1>
      <CampaignForm
        action={boundAction}
        defaults={{
          name:         campaign.name,
          subject:      campaign.subject,
          body:         campaign.body,
          promoDetails: campaign.promoDetails ?? "",
          promoCode:    campaign.promoCode ?? "",
          expiresAt:    campaign.expiresAt ? campaign.expiresAt.toISOString().split("T")[0] : "",
        }}
        submitLabel="Save changes"
      />
    </div>
  );
}
