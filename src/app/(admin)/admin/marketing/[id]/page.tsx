import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteCampaignAction } from "../actions";
import SendButton from "./SendButton";
import type { CampaignStatus } from "@prisma/client";

const STATUS_LABELS: Record<CampaignStatus, string> = {
  draft:   "Draft",
  sending: "Sending…",
  sent:    "Sent",
  failed:  "Failed",
};

const STATUS_COLORS: Record<CampaignStatus, string> = {
  draft:   "bg-marble-100 text-marble-700",
  sending: "bg-blue-100 text-blue-700",
  sent:    "bg-green-100 text-green-700",
  failed:  "bg-red-100 text-red-700",
};

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;

  const [campaign, recipientCount] = await Promise.all([
    prisma.campaign.findUnique({
      where: { id },
      include: { createdBy: { select: { fullName: true } } },
    }),
    prisma.customer.findMany({
      where: { email: { not: null }, deletedAt: null },
      select: { email: true },
      distinct: ["email"],
    }).then((r) => r.length),
  ]);

  if (!campaign) notFound();

  const canEdit  = campaign.status === "draft" || campaign.status === "failed";
  const canSend  = campaign.status === "draft" || campaign.status === "failed";
  const wasSent  = campaign.status === "sent";

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-marble-500">
        <Link href="/admin/marketing" className="hover:text-brand-600">Marketing</Link>
        <span>›</span>
        <span className="text-marble-800">{campaign.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold text-brand-700">{campaign.name}</h1>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[campaign.status]}`}>
              {STATUS_LABELS[campaign.status]}
            </span>
          </div>
          <p className="text-sm text-marble-500 mt-1">Created by {campaign.createdBy.fullName} on {campaign.createdAt.toLocaleDateString()}</p>
        </div>
        {canEdit && (
          <Link
            href={`/admin/marketing/${id}/edit`}
            className="inline-flex items-center justify-center rounded border border-marble-300 hover:bg-marble-50 text-marble-700 font-medium px-4 h-9 text-sm"
          >
            Edit
          </Link>
        )}
      </div>

      {/* Sent stats */}
      {wasSent && campaign.sentAt && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
            <p className="text-2xl font-bold text-green-800">{campaign.recipientCount?.toLocaleString() ?? "—"}</p>
            <p className="text-xs text-green-700 mt-0.5">Customers reached</p>
          </div>
          <div className="rounded-lg border border-marble-200 p-4 text-center">
            <p className="text-2xl font-bold text-marble-800">{campaign.sentAt.toLocaleDateString()}</p>
            <p className="text-xs text-marble-500 mt-0.5">Date sent</p>
          </div>
        </div>
      )}

      {/* Campaign details */}
      <div className="rounded-lg border border-marble-200 divide-y divide-marble-100">
        <div className="px-4 py-3">
          <p className="text-xs text-marble-500 uppercase tracking-wide mb-1">Subject line</p>
          <p className="text-sm font-medium text-marble-900">{campaign.subject}</p>
        </div>

        {campaign.promoDetails && (
          <div className="px-4 py-3">
            <p className="text-xs text-marble-500 uppercase tracking-wide mb-1">Promotion</p>
            <p className="text-sm text-marble-900">{campaign.promoDetails}</p>
            {campaign.promoCode && (
              <p className="text-sm text-marble-600 mt-1">Code: <code className="bg-marble-100 px-1.5 py-0.5 rounded font-mono">{campaign.promoCode}</code></p>
            )}
            {campaign.expiresAt && (
              <p className="text-sm text-marble-500 mt-1">Expires: {campaign.expiresAt.toLocaleDateString()}</p>
            )}
          </div>
        )}

        <div className="px-4 py-3">
          <p className="text-xs text-marble-500 uppercase tracking-wide mb-2">Email body</p>
          <div className="bg-marble-50 rounded p-3 text-sm text-marble-700 whitespace-pre-wrap font-mono leading-relaxed">
            {campaign.body}
          </div>
        </div>
      </div>

      {/* Email preview */}
      <details className="group rounded-lg border border-marble-200 overflow-hidden">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-marble-700 hover:bg-marble-50 flex items-center gap-2">
          <span className="group-open:rotate-90 inline-block transition-transform">›</span>
          Preview as customer email
        </summary>
        <div className="p-4 bg-white border-t border-marble-100">
          <div className="max-w-lg mx-auto rounded-lg overflow-hidden shadow-sm border border-marble-200">
            <div className="bg-[#1a1a2e] px-6 py-4">
              <p className="text-white font-bold text-base">U.S. Floor, Kitchen &amp; Bath</p>
            </div>
            <div className="px-6 py-5 bg-white">
              {campaign.body.split("\n").map((line, i) => (
                <p key={i} className="text-sm text-marble-700 mb-2 leading-relaxed">
                  {line.replace(/\{\{firstName\}\}/gi, "Maria") || <>&nbsp;</>}
                </p>
              ))}
              {campaign.promoDetails && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mt-4 text-center">
                  <p className="font-bold text-amber-900 text-base">Special Offer</p>
                  <p className="text-amber-800 mt-1">{campaign.promoDetails}</p>
                  {campaign.promoCode && (
                    <p className="text-xs text-amber-700 mt-2">Use code: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300">{campaign.promoCode}</strong></p>
                  )}
                  {campaign.expiresAt && (
                    <p className="text-xs text-amber-700 mt-1">Expires {campaign.expiresAt.toLocaleDateString()}</p>
                  )}
                </div>
              )}
            </div>
            <div className="bg-marble-50 px-6 py-3 border-t border-marble-100">
              <p className="text-xs text-marble-500">U.S. Floor, Kitchen &amp; Bath · Orange County, CA</p>
            </div>
          </div>
          <p className="text-xs text-center text-marble-500 mt-2">Preview shows &quot;Maria&quot; in place of {"{{firstName}}"}</p>
        </div>
      </details>

      {/* Send section */}
      {canSend && (
        <div className="rounded-lg border border-marble-200 p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-marble-900">Ready to send?</p>
            <p className="text-sm text-marble-600 mt-0.5">
              This campaign will be sent to <strong>{recipientCount.toLocaleString()}</strong> unique customer email{recipientCount !== 1 ? "s" : ""} in your database.
            </p>
          </div>
          <SendButton campaignId={id} recipientCount={recipientCount} />
        </div>
      )}

      {/* Danger zone */}
      {canEdit && (
        <div className="rounded-lg border border-red-200 p-4">
          <p className="text-sm font-medium text-red-700 mb-2">Delete campaign</p>
          <form action={deleteCampaignAction.bind(null, id)}>
            <button type="submit" className="text-sm text-red-600 hover:underline">
              Delete this draft
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
