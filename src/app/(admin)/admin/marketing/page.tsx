import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

export default async function MarketingPage() {
  await requireRole("admin");

  const [campaigns, customerCount] = await Promise.all([
    prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { fullName: true } } },
    }),
    prisma.customer.count({ where: { email: { not: null }, deletedAt: null } }),
  ]);

  const emailableCount = await prisma.customer.findMany({
    where: { email: { not: null }, deletedAt: null },
    select: { email: true },
    distinct: ["email"],
  }).then((r) => r.length);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-700">Email Campaigns</h1>
          <p className="text-sm text-marble-600 mt-1">
            {emailableCount} unique customer email{emailableCount !== 1 ? "s" : ""} in the database
          </p>
        </div>
        <Link
          href="/admin/marketing/new"
          className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-4 h-9 text-sm"
        >
          + New Campaign
        </Link>
      </div>

      {/* Config warning */}
      {!process.env.RESEND_API_KEY && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
          <span className="text-amber-500 shrink-0">⚠</span>
          <div className="text-sm text-amber-800">
            <strong>Email sending not configured.</strong> Add <code className="bg-amber-100 px-1 rounded">RESEND_API_KEY</code> and <code className="bg-amber-100 px-1 rounded">RESEND_FROM_EMAIL</code> to your Render environment variables to enable sending.
          </div>
        </div>
      )}

      {/* Campaign list */}
      {campaigns.length === 0 ? (
        <div className="text-center py-16 text-marble-500">
          <p className="text-4xl mb-3">📧</p>
          <p className="font-medium">No campaigns yet</p>
          <p className="text-sm mt-1">Create your first email campaign to reach {emailableCount} customers.</p>
          <Link href="/admin/marketing/new" className="mt-4 inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-4 h-9 text-sm">
            + New Campaign
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-marble-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-marble-50">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide">Campaign</th>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide hidden sm:table-cell">Subject</th>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide hidden md:table-cell">Sent to</th>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marble-100">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-marble-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/marketing/${c.id}`} className="font-medium text-marble-900 hover:text-brand-700">
                      {c.name}
                    </Link>
                    {c.promoDetails && (
                      <p className="text-xs text-marble-500 mt-0.5">{c.promoDetails}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-marble-600 hidden sm:table-cell max-w-xs truncate">{c.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[c.status]}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-marble-600 hidden md:table-cell">
                    {c.recipientCount != null ? c.recipientCount.toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-marble-500 hidden lg:table-cell">
                    {c.sentAt ? c.sentAt.toLocaleDateString() : c.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total campaigns", value: campaigns.length },
            { label: "Sent", value: campaigns.filter((c) => c.status === "sent").length },
            { label: "Customers reached", value: campaigns.reduce((sum, c) => sum + (c.recipientCount ?? 0), 0).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-marble-200 p-4 text-center">
              <p className="text-2xl font-bold text-marble-900">{value}</p>
              <p className="text-xs text-marble-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
