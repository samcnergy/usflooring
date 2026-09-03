"use client";
import { useTransition, useState } from "react";
import { assignLeadAction, updateLeadStatusAction } from "./actions";
import type { LeadStatus } from "@prisma/client";

type Salesperson = { id: string; fullName: string };

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new",       label: "New" },
  { value: "assigned",  label: "Assigned" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted",    label: "Quoted" },
  { value: "won",       label: "Won" },
  { value: "lost",      label: "Lost" },
  { value: "archived",  label: "Archived" },
];

export function AssignForm({
  leadId,
  currentAssignedToId,
  salespeople,
}: {
  leadId: string;
  currentAssignedToId: string | null;
  salespeople: Salesperson[];
}) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(currentAssignedToId ?? "");

  function submit() {
    startTransition(async () => {
      await assignLeadAction(leadId, value || null);
    });
  }

  return (
    <div className="flex gap-2 items-center">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded border border-marble-200 text-sm px-2 py-1.5 text-marble-800 bg-white"
      >
        <option value="">— Unassigned —</option>
        {salespeople.map((s) => (
          <option key={s.id} value={s.id}>{s.fullName}</option>
        ))}
      </select>
      <button
        onClick={submit}
        disabled={pending || value === (currentAssignedToId ?? "")}
        className="rounded bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white text-sm px-3 py-1.5 font-medium"
      >
        {pending ? "Saving…" : "Assign"}
      </button>
    </div>
  );
}

export function StatusForm({ leadId, currentStatus }: { leadId: string; currentStatus: LeadStatus }) {
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(currentStatus);

  function submit() {
    startTransition(async () => {
      await updateLeadStatusAction(leadId, status, note || undefined);
      setNote("");
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
          className="rounded border border-marble-200 text-sm px-2 py-1.5 text-marble-800 bg-white"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          onClick={submit}
          disabled={pending || status === currentStatus}
          className="rounded bg-marble-700 hover:bg-marble-900 disabled:opacity-40 text-white text-sm px-3 py-1.5 font-medium"
        >
          {pending ? "Saving…" : "Update"}
        </button>
      </div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note (e.g. left voicemail)"
        className="rounded border border-marble-200 text-sm px-2 py-1.5 text-marble-700 bg-white"
      />
    </div>
  );
}
