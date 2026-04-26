// Converts the new structured Invoice FormData payload into the shape
// `orderInput` (Zod schema) expects, then validates it.
//
// Field-naming conventions used by the form:
//   - Rooms:      `room_<RoomName>_on` (checkbox), `room_<RoomName>_quantity`, `room_<RoomName>_notes`
//   - Line items: `li_<i>_<field>` (i = 0..N-1)
//   - Inclusions: `inc_<InclusionType>` (chip), `inc_custom_<i>` (custom-note text)
//   - Exclusions: `exc_<ExclusionType>` (chip), `exc_custom_<i>` (custom-note text)

import { ExclusionType, InclusionType, RoomName } from "@prisma/client";
import { orderInput, type OrderInputParsed } from "./order-schema";

function bool(formData: FormData, key: string): boolean {
  return formData.has(key);
}

function s(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

function getCustomNotes(formData: FormData, prefix: string): string[] {
  const notes: string[] = [];
  for (const [k, v] of formData.entries()) {
    if (k.startsWith(prefix) && typeof v === "string" && v.trim()) {
      notes.push(v.trim());
    }
  }
  return notes;
}

export function parseOrderForm(formData: FormData):
  | { ok: true; data: OrderInputParsed }
  | { ok: false; errors: Record<string, string>; message?: string } {
  // --- rooms ---
  const rooms = Object.values(RoomName)
    .filter((r) => bool(formData, `room_${r}_on`))
    .map((r) => ({
      room: r as RoomName,
      quantity: s(formData, `room_${r}_quantity`),
      notes:    s(formData, `room_${r}_notes`),
    }));

  // --- line items ---
  // The form sends `li_count` so we know how many rows there are. Empty rows
  // (no category change + nothing typed) are dropped before validation.
  const liCount = Number(s(formData, "li_count")) || 0;
  const lineItems = [];
  for (let i = 0; i < liCount; i++) {
    const category = s(formData, `li_${i}_category`);
    if (!category) continue; // empty row
    const brand    = s(formData, `li_${i}_brand`);
    const style    = s(formData, `li_${i}_style`);
    const color    = s(formData, `li_${i}_color`);
    const sizeSpec = s(formData, `li_${i}_sizeSpec`);
    const sku      = s(formData, `li_${i}_sku`);
    const quantity = s(formData, `li_${i}_quantity`);
    const unit     = s(formData, `li_${i}_unit`);
    const unitPrice = s(formData, `li_${i}_unitPriceCents`);
    const notes    = s(formData, `li_${i}_notes`);
    // Drop wholly-blank rows
    if (!brand && !style && !color && !sizeSpec && !sku && !quantity && !unitPrice && !notes) continue;
    lineItems.push({
      position: i,
      category,
      brand, style, color, sizeSpec, sku,
      quantity,
      unit: unit || null,
      unitPriceCents: unitPrice,
      notes,
    });
  }

  // --- inclusions / exclusions ---
  const inclusions: Array<{ type: InclusionType | "customNote"; customText: string | null }> = [];
  for (const t of Object.values(InclusionType)) {
    if (t === InclusionType.customNote) continue;
    if (bool(formData, `inc_${t}`)) {
      inclusions.push({ type: t, customText: null });
    }
  }
  for (const note of getCustomNotes(formData, "inc_custom_")) {
    inclusions.push({ type: InclusionType.customNote, customText: note });
  }

  const exclusions: Array<{ type: ExclusionType | "customNote"; customText: string | null }> = [];
  for (const t of Object.values(ExclusionType)) {
    if (t === ExclusionType.customNote) continue;
    if (bool(formData, `exc_${t}`)) {
      exclusions.push({ type: t, customText: null });
    }
  }
  for (const note of getCustomNotes(formData, "exc_custom_")) {
    exclusions.push({ type: ExclusionType.customNote, customText: note });
  }

  const raw = {
    salespersonId:       s(formData, "salespersonId"),
    advertisingSourceId: s(formData, "advertisingSourceId") || null,
    dateOfSale:          s(formData, "dateOfSale"),
    firstName:           s(formData, "firstName"),
    lastName:            s(formData, "lastName"),
    addressLine1:        s(formData, "addressLine1"),
    city:                s(formData, "city"),
    state:               s(formData, "state") || "CA",
    zip:                 s(formData, "zip"),
    phoneHome:           s(formData, "phoneHome"),
    phoneWork:           s(formData, "phoneWork"),
    phoneExt:            s(formData, "phoneExt"),
    email:               s(formData, "email"),
    sameAsSoldTo:        bool(formData, "sameAsSoldTo"),
    shipFirstName:       s(formData, "shipFirstName"),
    shipLastName:        s(formData, "shipLastName"),
    shipAddressLine1:    s(formData, "shipAddressLine1"),
    shipCity:            s(formData, "shipCity"),
    shipState:           s(formData, "shipState"),
    shipZip:             s(formData, "shipZip"),
    shipPhone:           s(formData, "shipPhone"),
    jobSiteSameAsBilling: bool(formData, "jobSiteSameAsBilling"),
    jobSiteAddressLine1:  s(formData, "jobSiteAddressLine1"),
    jobSiteCity:          s(formData, "jobSiteCity"),
    jobSiteState:         s(formData, "jobSiteState"),
    jobSiteZip:           s(formData, "jobSiteZip"),
    siteContactName:      s(formData, "siteContactName"),
    siteContactPhone:     s(formData, "siteContactPhone"),
    accessInstructions:   s(formData, "accessInstructions"),
    depositInstructions:  s(formData, "depositInstructions"),
    rooms,
    lineItems,
    inclusions,
    exclusions,
    pricingMode:    s(formData, "pricingMode") || "itemized",
    taxPercent:     s(formData, "taxPercent"),
    flatTotalCents: s(formData, "flatTotalCents") || "0",
    depositCents:   s(formData, "depositCents") || "0",
    basedOn:        s(formData, "basedOn") || null,
    remarks:        s(formData, "remarks") || null,
    balanceTerm:    s(formData, "balanceTerm") || null,
  };

  const parsed = orderInput.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".") || "_root";
      errors[path] = issue.message;
    }
    return { ok: false, errors, message: "Please fix the highlighted fields." };
  }

  // Application-level validation that doesn't fit cleanly in Zod:
  // require at least one room OR one line item.
  if (parsed.data.rooms.length === 0 && parsed.data.lineItems.length === 0) {
    return {
      ok: false,
      errors: { _root: "Add at least one room or one line item." },
      message: "An order needs at least one room or one line item.",
    };
  }

  // Itemized mode: every line with quantity must have unitPriceCents and vice-versa.
  if (parsed.data.pricingMode === "itemized") {
    const bad: Record<string, string> = {};
    parsed.data.lineItems.forEach((li, i) => {
      const hasQty = li.quantity != null;
      const hasPrice = li.unitPriceCents != null;
      if (hasQty !== hasPrice) {
        bad[`lineItems.${i}`] = "Quantity and unit price must both be filled (or both blank).";
      }
    });
    if (Object.keys(bad).length) {
      return { ok: false, errors: bad, message: "Some line items are missing quantity or price." };
    }
  }

  return { ok: true, data: parsed.data };
}
