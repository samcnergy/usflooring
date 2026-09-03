import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@prisma/client";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new:      "New",
  assigned: "Assigned",
  contacted:"Contacted",
  quoted:   "Quoted",
  won:      "Won",
  lost:     "Lost",
  archived: "Archived",
};

const STATUS_COLOR: Record<LeadStatus, string> = {
  new:      "bg-amber-100 text-amber-800",
  assigned: "bg-blue-100 text-blue-700",
  contacted:"bg-indigo-100 text-indigo-700",
  quoted:   "bg-purple-100 text-purple-700",
  won:      "bg-green-100 text-green-700",
  lost:     "bg-marble-100 text-marble-500",
  archived: "bg-marble-100 text-marble-400",
};

const JOB_LABEL: Record<string, string> = {
  flooring: "Flooring", kitchen: "Kitchen", bathroom: "Bathroom",
  wholeHome: "Whole-home", other: "Other",
};

const TIMEFRAME_LABEL: Record<string, string> = {
  asap: "ASAP", withinMonth: "< 1 mo", oneToThreeMonths: "1–3 mo",
  threeToSixMonths: "3–6 mo", flexible: "Flexible",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireRole("admin");
  const { status: statusFilter } = await searchParams;

  const where = statusFilter
    ? { status: statusFilter as LeadStatus }
    : { status: { notIn: ["archived", "lost"] as LeadStatus[] } };

  const [leads, counts] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { assignedTo: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count.id]));
  const totalNew = countMap["new"] ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Leads</h1>
          {totalNew > 0 && (
            <p className="text-sm text-amber-700 mt-0.5">
              {totalNew} new lead{totalNew !== 1 ? "s" : ""} waiting for assignment
            </p>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { label: "Active", value: "" },
          { label: "New", value: "new" },
          { label: "Assigned", value: "assigned" },
          { label: "Contacted", value: "contacted" },
          { label: "Quoted", value: "quoted" },
          { label: "Won", value: "won" },
          { label: "Lost", value: "lost" },
          { label: "Archived", value: "archived" },
        ] as const).map((tab) => {
          const isActive = (statusFilter ?? "") === tab.value;
          const count = tab.value ? countMap[tab.value] : Object.values(countMap).reduce((a, b) => a + b, 0);
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/leads?status=${tab.value}` : "/admin/leads"}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                isActive
                  ? "bg-brand-700 text-white border-brand-700"
                  : "bg-white border-marble-200 text-marble-700 hover:bg-marble-50"
              }`}
            >
              {tab.label}
              {count != null && <span className={`text-xs ${isActive ? "opacity-70" : "text-marble-400"}`}>{count}</span>}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-marble-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-marble-50 border-b border-marble-200">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-marble-600">Name</th>
              <th className="text-left px-4 py-2.5 font-medium text-marble-600">Project</th>
              <th className="text-left px-4 py-2.5 font-medium text-marble-600">Timeframe</th>
              <th className="text-left px-4 py-2.5 font-medium text-marble-600">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-marble-600">Assigned to</th>
              <th className="text-left px-4 py-2.5 font-medium text-marble-600">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marble-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-marble-400 text-sm">
                  No leads match this filter.
                </td>
              </tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-marble-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-brand-700 hover:underline">
                    {lead.firstName} {lead.lastName}
                  </Link>
                  <p className="text-xs text-marble-500 mt-0.5">{lead.email}</p>
                </td>
                <td className="px-4 py-3 text-marble-700">
                  {JOB_LABEL[lead.jobType] ?? lead.jobType}
                  {lead.sqft ? <span className="text-marble-400 ml-1">· {lead.sqft.toLocaleString()} ft²</span> : null}
                </td>
                <td className="px-4 py-3 text-marble-700">{TIMEFRAME_LABEL[lead.timeframe] ?? lead.timeframe}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[lead.status]}`}>
                    {STATUS_LABEL[lead.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-marble-700">{lead.assignedTo?.fullName ?? <span className="text-marble-400 italic">Unassigned</span>}</td>
                <td className="px-4 py-3 text-marble-500 text-xs">{lead.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
