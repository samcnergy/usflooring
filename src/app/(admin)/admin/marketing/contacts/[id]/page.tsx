import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteOutreachLogAction, deleteMaterialSendAction } from "../../actions";
import { LogOutreachForm, LogMaterialForm } from "./LogActivityForm";
import type { ContactType, ContactStatus, OutreachMethod } from "@prisma/client";

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

const METHOD_LABELS: Record<OutreachMethod, string> = {
  call:     "Call",
  email:    "Email",
  text:     "Text",
  inPerson: "In person",
  other:    "Other",
};

const METHOD_ICONS: Record<OutreachMethod, string> = {
  call:     "📞",
  email:    "✉️",
  text:     "💬",
  inPerson: "🤝",
  other:    "📝",
};

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;

  const contact = await prisma.marketingContact.findUnique({
    where: { id },
    include: {
      source: { select: { id: true, name: true } },
      order:  { select: { id: true, invoiceNumber: true, customer: { select: { firstName: true, lastName: true } } } },
      outreachLogs: {
        orderBy: { date: "desc" },
        include: { createdBy: { select: { fullName: true } } },
      },
      materialSends: {
        orderBy: { date: "desc" },
        include: { createdBy: { select: { fullName: true } } },
      },
    },
  });

  if (!contact) notFound();

  const isOverdue = contact.nextFollowUp && contact.nextFollowUp <= new Date()
    && contact.status !== "converted" && contact.status !== "notInterested";

  // Interleave outreach + material sends in a single timeline
  const timeline = [
    ...contact.outreachLogs.map((l) => ({ ...l, _kind: "outreach" as const })),
    ...contact.materialSends.map((s) => ({ ...s, _kind: "material" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-marble-500">
        <Link href="/admin/marketing" className="hover:text-brand-600">Marketing</Link>
        <span>›</span>
        <span className="text-marble-800">{contact.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold text-brand-700">{contact.name}</h1>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[contact.status]}`}>
              {STATUS_LABELS[contact.status]}
            </span>
          </div>
          <p className="text-sm text-marble-500 mt-1">{TYPE_LABELS[contact.type]}</p>
        </div>
        <Link
          href={`/admin/marketing/contacts/${id}/edit`}
          className="inline-flex items-center justify-center rounded border border-marble-300 hover:bg-marble-50 text-marble-700 font-medium px-4 h-9 text-sm"
        >
          Edit
        </Link>
      </div>

      {/* Follow-up alert */}
      {isOverdue && (
        <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3">
          <span className="text-red-500">⚠</span>
          <p className="text-sm text-red-700">
            Follow-up was due <strong>{contact.nextFollowUp!.toLocaleDateString()}</strong>.
          </p>
        </div>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {contact.phone && (
          <div>
            <p className="text-xs text-marble-500 uppercase tracking-wide">Phone</p>
            <p className="text-sm text-marble-900 mt-0.5">
              <a href={`tel:${contact.phone}`} className="hover:text-brand-700">{contact.phone}</a>
            </p>
          </div>
        )}
        {contact.email && (
          <div>
            <p className="text-xs text-marble-500 uppercase tracking-wide">Email</p>
            <p className="text-sm text-marble-900 mt-0.5">
              <a href={`mailto:${contact.email}`} className="hover:text-brand-700">{contact.email}</a>
            </p>
          </div>
        )}
        {contact.source && (
          <div>
            <p className="text-xs text-marble-500 uppercase tracking-wide">Source</p>
            <p className="text-sm text-marble-900 mt-0.5">{contact.source.name}</p>
          </div>
        )}
        {contact.nextFollowUp && (
          <div>
            <p className="text-xs text-marble-500 uppercase tracking-wide">Next follow-up</p>
            <p className={`text-sm mt-0.5 font-medium ${isOverdue ? "text-red-600" : "text-marble-900"}`}>
              {contact.nextFollowUp.toLocaleDateString()}
            </p>
          </div>
        )}
        {contact.order && (
          <div>
            <p className="text-xs text-marble-500 uppercase tracking-wide">Linked order</p>
            <Link href={`/admin/orders/${contact.order.id}`} className="text-sm text-brand-700 hover:underline mt-0.5 block">
              #{contact.order.invoiceNumber} — {contact.order.customer.firstName} {contact.order.customer.lastName}
            </Link>
          </div>
        )}
        <div>
          <p className="text-xs text-marble-500 uppercase tracking-wide">Added</p>
          <p className="text-sm text-marble-900 mt-0.5">{contact.createdAt.toLocaleDateString()}</p>
        </div>
      </div>

      {contact.notes && (
        <div>
          <p className="text-xs text-marble-500 uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-marble-700 whitespace-pre-wrap">{contact.notes}</p>
        </div>
      )}

      {/* Activity section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-marble-900">Activity</h2>
          <div className="flex gap-2">
            <LogOutreachForm contactId={id} />
            <LogMaterialForm contactId={id} />
          </div>
        </div>

        {timeline.length === 0 ? (
          <p className="text-sm text-marble-500 py-4">No activity logged yet. Use the buttons above to record a call, email, or material sent.</p>
        ) : (
          <div className="space-y-3">
            {timeline.map((entry) => {
              if (entry._kind === "outreach") {
                const log = entry as typeof contact.outreachLogs[0] & { _kind: "outreach" };
                return (
                  <div key={log.id} className="flex gap-3 rounded-lg border border-marble-200 bg-white p-4">
                    <div className="text-xl shrink-0 w-8 text-center">{METHOD_ICONS[log.method]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-marble-900">{METHOD_LABELS[log.method]}</span>
                        <span className="text-xs text-marble-500">{new Date(log.date).toLocaleDateString()}</span>
                        <span className="text-xs text-marble-400">by {log.createdBy.fullName}</span>
                      </div>
                      {log.outcome && <p className="text-sm text-marble-700 mt-1">{log.outcome}</p>}
                      {log.notes && <p className="text-xs text-marble-500 mt-1">{log.notes}</p>}
                    </div>
                    <form action={async () => { "use server"; await deleteOutreachLogAction(log.id, id); }}>
                      <button className="text-xs text-marble-400 hover:text-red-600">Remove</button>
                    </form>
                  </div>
                );
              } else {
                const send = entry as typeof contact.materialSends[0] & { _kind: "material" };
                return (
                  <div key={send.id} className="flex gap-3 rounded-lg border border-marble-200 bg-white p-4">
                    <div className="text-xl shrink-0 w-8 text-center">📄</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-marble-900">Sent: {send.description}</span>
                        <span className="text-xs text-marble-500">{new Date(send.date).toLocaleDateString()}</span>
                        <span className="text-xs text-marble-400">by {send.createdBy.fullName}</span>
                      </div>
                      {send.url && (
                        <a href={send.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline mt-1 block truncate">
                          {send.url}
                        </a>
                      )}
                      {send.notes && <p className="text-xs text-marble-500 mt-1">{send.notes}</p>}
                    </div>
                    <form action={async () => { "use server"; await deleteMaterialSendAction(send.id, id); }}>
                      <button className="text-xs text-marble-400 hover:text-red-600">Remove</button>
                    </form>
                  </div>
                );
              }
            })}
          </div>
        )}
      </section>
    </div>
  );
}
