// Shared types for the Vendor PO wizard.

export type CreateVendorState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;
