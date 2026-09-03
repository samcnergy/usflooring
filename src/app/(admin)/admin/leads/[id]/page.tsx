import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignForm, StatusForm } from "./AssignForm";
import type { LeadStatus } from "@prisma/client";

const JOB_LABEL: Record<string, string> = {
  flooring: "Flooring", kitchen: "Kitchen", bathroom: "Bathroom",
  wholeHome: "Whole-home", other: "Other",
};

const PROPERTY_LABEL: Record<string, string> = { own: "Owner", rent: "Renter (w/ approval)" };

const QUALITY_LABEL: Record<string, string> = {
  budget: "Budget", midRange: "Mid-range", highEnd: "High-end",
};

const TIMEFRAME_LABEL: Record<string, string> = {
  asap: "As soon as possible", withinMonth: "Within the next month",
  oneToThreeMonths: "1 – 3 months", threeToSixMonths: "3 – 6 months", flexible: "Just planning ahead",
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

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="px-4 py-3 flex gap-4">
      <span className="text-xs text-marble-500 uppercase tracking-wide w-32 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-marble-800">{String(value)}</span>
    </div>
  );
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;

  const [lead, salespeople] = await Promise.all([
    prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, fullName: true } },
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.user.findMany({
      where: { role: "salesperson", isActive: true },
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
  ]);

  if (!lead) notFound();

  const address = [lead.addressLine1, lead.city, lead.state, lead.zip].filter(Boolean).join(", ");

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-marble-500">
        <Link href="/admin/leads" className="hover:text-brand-600">Leads</Link>
        <span>›</span>
        <span className="text-marble-800">{lead.firstName} {lead.lastName}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-brand-700">{lead.firstName} {lead.lastName}</h1>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[lead.status]}`}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-marble-500 mt-1">
            {JOB_LABEL[lead.jobType] ?? lead.jobType} · Submitted {lead.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Actions panel */}
      <div className="rounded-lg border border-marble-200 divide-y divide-marble-100">
        <div className="px-4 py-3 flex items-center gap-4 flex-wrap">
          <span className="text-xs text-marble-500 uppercase tracking-wide w-28 shrink-0">Assign to</span>
          <AssignForm
            leadId={lead.id}
            currentAssignedToId={lead.assignedTo?.id ?? null}
            salespeople={salespeople}
          />
        </div>
        <div className="px-4 py-3 flex items-start gap-4 flex-wrap">
          <span className="text-xs text-marble-500 uppercase tracking-wide w-28 shrink-0 pt-2">Status</span>
          <StatusForm leadId={lead.id} currentStatus={lead.status} />
        </div>
      </div>

      {/* Contact info */}
      <div>
        <h2 className="text-sm font-semibold text-marble-700 uppercase tracking-wide mb-2">Contact</h2>
        <div className="rounded-lg border border-marble-200 divide-y divide-marble-100">
          <Field label="Email" value={lead.email} />
          <Field label="Phone" value={lead.phone} />
          {address && <Field label="Address" value={address} />}
        </div>
      </div>

      {/* Project details */}
      <div>
        <h2 className="text-sm font-semibold text-marble-700 uppercase tracking-wide mb-2">Project</h2>
        <div className="rounded-lg border border-marble-200 divide-y divide-marble-100">
          <Field label="Type" value={JOB_LABEL[lead.jobType] ?? lead.jobType} />
          <Field label="Property" value={PROPERTY_LABEL[lead.propertyType] ?? lead.propertyType} />
          <Field label="Sq ft" value={lead.sqft ? `${lead.sqft.toLocaleString()} sq ft` : null} />
          <Field label="Quality" value={lead.qualityLevel ? QUALITY_LABEL[lead.qualityLevel] : null} />
          <Field label="Structural" value={lead.hasStructural ? "Yes — involves structural changes" : "No"} />
          <Field label="Budget" value={lead.budgetRange} />
          <Field label="Timeframe" value={TIMEFRAME_LABEL[lead.timeframe] ?? lead.timeframe} />
          {lead.photoNote && (
            <div className="px-4 py-3 flex gap-4">
              <span className="text-xs text-marble-500 uppercase tracking-wide w-32 shrink-0 pt-0.5">Photos</span>
              <a href={lead.photoNote} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 hover:underline break-all">
                {lead.photoNote}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-sm font-semibold text-marble-700 uppercase tracking-wide mb-2">Description</h2>
        <div className="rounded-lg border border-marble-200 p-4">
          <p className="text-sm text-marble-800 whitespace-pre-wrap leading-relaxed">{lead.description}</p>
        </div>
      </div>

      {/* Status history */}
      {lead.statusHistory.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-marble-700 uppercase tracking-wide mb-2">History</h2>
          <div className="rounded-lg border border-marble-200 divide-y divide-marble-100">
            {lead.statusHistory.map((h) => (
              <div key={h.id} className="px-4 py-2.5 flex items-center gap-3 text-sm">
                <span className="text-marble-400 text-xs w-24 shrink-0">
                  {h.createdAt.toLocaleDateString()}
                </span>
                <span className="text-marble-700 font-medium capitalize">{h.status}</span>
                {h.note && <span className="text-marble-500">· {h.note}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
