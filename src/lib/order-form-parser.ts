// Converts the Invoice FormData payload into the shape `orderInput` (Zod
// schema) expects, then validates it. Used by both admin and salesperson
// server actions.

import { AreaName } from "@prisma/client";
import { ORDER_AREAS } from "./order-areas";
import { orderInput, type OrderInputParsed } from "./order-schema";

function bool(formData: FormData, key: string): boolean {
  return formData.has(key);
}

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export function parseOrderForm(formData: FormData):
  | { ok: true; data: OrderInputParsed }
  | { ok: false; errors: Record<string, string>; message?: string } {
  const areas = ORDER_AREAS.map((a) => ({
    areaName: a.value as AreaName,
    quantity:    str(formData, `area_${a.value}_quantity`),
    description: str(formData, `area_${a.value}_description`),
    material:    str(formData, `area_${a.value}_material`),
    color:       str(formData, `area_${a.value}_color`),
    size:        str(formData, `area_${a.value}_size`),
    lineTotal:   str(formData, `area_${a.value}_lineTotal`),
  }));

  const raw = {
    salespersonId:       str(formData, "salespersonId"),
    advertisingSourceId: str(formData, "advertisingSourceId") || null,
    dateOfSale:          str(formData, "dateOfSale"),
    firstName:           str(formData, "firstName"),
    lastName:            str(formData, "lastName"),
    addressLine1:        str(formData, "addressLine1"),
    city:                str(formData, "city"),
    state:               str(formData, "state") || "CA",
    zip:                 str(formData, "zip"),
    phoneHome:           str(formData, "phoneHome"),
    phoneWork:           str(formData, "phoneWork"),
    phoneExt:            str(formData, "phoneExt"),
    email:               str(formData, "email"),
    sameAsSoldTo:        bool(formData, "sameAsSoldTo"),
    shipFirstName:       str(formData, "shipFirstName"),
    shipLastName:        str(formData, "shipLastName"),
    shipAddressLine1:    str(formData, "shipAddressLine1"),
    shipCity:            str(formData, "shipCity"),
    shipState:           str(formData, "shipState") || "CA",
    shipZip:             str(formData, "shipZip"),
    shipPhone:           str(formData, "shipPhone"),
    hasCabinet:    bool(formData, "hasCabinet"),
    hasCarpet:     bool(formData, "hasCarpet"),
    hasVinyl:      bool(formData, "hasVinyl"),
    hasWood:       bool(formData, "hasWood"),
    hasCeramic:    bool(formData, "hasCeramic"),
    hasCounterTop: bool(formData, "hasCounterTop"),
    hasFireplace:  bool(formData, "hasFireplace"),
    hasShower:     bool(formData, "hasShower"),
    areas,
    taxPercent:   str(formData, "taxPercent"),
    depositCents: str(formData, "depositCents") || "0",
    basedOn:      str(formData, "basedOn") || null,
    remarks:      str(formData, "remarks") || null,
    balanceTerm:  str(formData, "balanceTerm") || null,
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
  return { ok: true, data: parsed.data };
}
