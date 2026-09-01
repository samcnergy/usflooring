import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ContactType, ContactStatus } from "@prisma/client";

const TYPE_LABELS: Record<ContactType, string> = {
  pastCustomer: "Past customer",
  lostLead:     "Lost lead",
  coldContact:  "Cold contact",
};

const STATUS_LABELS: Record<ContactStatus, string> = {
  new:           "New",
  contacted:     "Contacted",
  interested:    "Interested",
  notInterested: "Not interested",
  converted:     "Converted",
};

const STATUS_COLORS: Record<ContactStatus, string> = {
  new:           "bg-marble-100 text-marble-700",
  contacted:     "bg-blue-100 text-blue-700",
  interested:    "bg-green-100 text-green-700",
  notInterested: "bg-red-100 text-red-700",
  converted:     "bg-brand-100 text-brand-700",
};

const TYPE_COLORS: Record<ContactType, string> = {
  pastCustomer: "bg-purple-100 text-purple-700",
  lostLead:     "bg-amber-100 text-amber-700",
  coldContact:  "bg-marble-100 text-marble-600",
};

export default async function MarketingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  await requireRole("admin");
  const sp = await searchParams;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const where = {
    ...(sp.type ? { type: sp.type as ContactType } : {}),
    ...(sp.status ? { status: sp.status as ContactStatus } : {}),
  };

  const [contacts, overdue, counts] = await Promise.all([
    prisma.marketingContact.findMany({
      where,
      orderBy: [{ nextFollowUp: "asc" }, { updatedAt: "desc" }],
      include: {
        source: { select: { id: true, name: true } },
        order:  { select: { invoiceNumber: true } },
        _count: { select: { outreachLogs: true, materialSends: true } },
      },
    }),
    prisma.marketingContact.count({
      where: { nextFollowUp: { lte: today }, status: { notIn: ["converted", "notInterested"] } },
    }),
    prisma.marketingContact.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countByStatus = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-700">Marketing</h1>
          <p className="text-sm text-marble-600 mt-1">{contacts.length} contact{contacts.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/marketing/contacts/new"
          className="inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-4 h-9 text-sm"
        >
          + Add Contact
        </Link>
      </div>

      {/* Follow-up alert */}
      {overdue > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
          <span className="text-amber-600 text-lg">⏰</span>
          <p className="text-sm text-amber-800">
            <strong>{overdue} contact{overdue !== 1 ? "s" : ""}</strong> need follow-up today or are overdue.
          </p>
          <Link
            href={`/admin/marketing?status=contacted`}
            className="ml-auto text-sm text-amber-700 underline hover:text-amber-900"
          >
            View
          </Link>
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["new", "contacted", "interested", "notInterested", "converted"] as ContactStatus[]).map((s) => (
          <Link
            key={s}
            href={`/admin/marketing?status=${s}`}
            className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${sp.status === s ? "ring-2 ring-brand-500" : ""}`}
          >
            <p className="text-2xl font-bold text-marble-900">{countByStatus[s] ?? 0}</p>
            <p className="text-xs text-marble-500 mt-0.5">{STATUS_LABELS[s]}</p>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-marble-500 font-medium uppercase tracking-wide mr-1">Type:</span>
        {["", "pastCustomer", "lostLead", "coldContact"].map((t) => (
          <Link
            key={t}
            href={`/admin/marketing${t ? `?type=${t}` : ""}`}
            className={`rounded px-3 py-1 text-sm ${(!t && !sp.type) || sp.type === t ? "bg-brand-500 text-white" : "bg-marble-100 text-marble-700 hover:bg-marble-200"}`}
          >
            {t ? TYPE_LABELS[t as ContactType] : "All"}
          </Link>
        ))}
        {sp.type || sp.status ? (
          <Link href="/admin/marketing" className="text-sm text-marble-500 hover:text-marble-700 underline ml-2">
            Clear filters
          </Link>
        ) : null}
      </div>

      {/* Contact list */}
      {contacts.length === 0 ? (
        <div className="text-center py-16 text-marble-500">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">No contacts yet</p>
          <p className="text-sm mt-1">Add your first contact to start tracking outreach.</p>
          <Link href="/admin/marketing/contacts/new" className="mt-4 inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700 text-white font-medium px-4 h-9 text-sm">
            + Add Contact
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-marble-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-marble-50">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide hidden md:table-cell">Source</th>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide hidden lg:table-cell">Follow-up</th>
                <th className="text-left px-4 py-2.5 font-medium text-marble-600 text-xs uppercase tracking-wide hidden lg:table-cell">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marble-100">
              {contacts.map((c) => {
                const isOverdue = c.nextFollowUp && c.nextFollowUp <= new Date() && c.status !== "converted" && c.status !== "notInterested";
                return (
                  <tr key={c.id} className="hover:bg-marble-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/marketing/contacts/${c.id}`} className="font-medium text-marble-900 hover:text-brand-700">
                        {c.name}
                      </Link>
                      {c.phone && <p className="text-xs text-marble-500 mt-0.5">{c.phone}</p>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[c.type]}`}>
                        {TYPE_LABELS[c.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[c.status]}`}>
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-marble-600 hidden md:table-cell text-xs">
                      {c.source?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {c.nextFollowUp ? (
                        <span className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-marble-600"}`}>
                          {isOverdue ? "⚠ " : ""}{c.nextFollowUp.toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-xs text-marble-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-marble-500 hidden lg:table-cell">
                      {c._count.outreachLogs} contact{c._count.outreachLogs !== 1 ? "s" : ""}
                      {c._count.materialSends > 0 && ` · ${c._count.materialSends} sent`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
