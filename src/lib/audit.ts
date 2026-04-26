// Lightweight audit log writer. Called after any mutation succeeds in a
// server action. Failures here are logged but never bubble up — we don't
// want a missing audit entry to roll back a real change.

import { prisma } from "./prisma";

type AuditEntry = {
  actorUserId?: string | null;
  action: string;        // "create" | "update" | "void" | "unvoid" | "delete" | "role_change" | "invite" | "deactivate" | "reactivate" | ...
  entityType: string;    // "Order" | "User" | "AdvertisingSource" | ...
  entityId: string;
  diff?: Record<string, unknown> | null;
};

export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: entry.actorUserId ?? null,
        action:      entry.action,
        entityType:  entry.entityType,
        entityId:    entry.entityId,
        ...(entry.diff ? { diff: entry.diff as object } : {}),
      },
    });
  } catch (e) {
    console.error("Audit log write failed:", e);
  }
}
