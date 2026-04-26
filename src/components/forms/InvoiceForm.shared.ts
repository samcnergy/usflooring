// Shared types + factories for the post-restructure Invoice form. Server
// components import factories from here; the client InvoiceForm component
// imports + re-exports them.

import {
  ExclusionType, InclusionType, LineCategory, PricingMode,
  RoomName, UnitOfMeasure,
} from "@prisma/client";

export type SalespersonOption = { id: string; fullName: string };
export type AdvSourceOption = { id: string; name: string };

export type RoomFormValue = {
  room: RoomName;
  on: boolean;
  quantity: string;
  notes: string;
};

export type LineItemFormValue = {
  // Stable client-side key for React; not persisted.
  key: string;
  category: LineCategory | "";
  brand: string;
  style: string;
  color: string;
  sizeSpec: string;
  sku: string;
  quantity: string;
  unit: UnitOfMeasure | "";
  unitPriceCents: string;
  notes: string;
};

export type OrderInitialValues = {
  id?: string;
  invoiceNumber?: number;

  salespersonId: string;
  advertisingSourceId: string | null;
  dateOfSale: string;          // yyyy-mm-dd

  // sold-to
  firstName: string;
  lastName: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  phoneHome: string;
  phoneWork: string;
  phoneExt: string;
  email: string;

  // ship-to
  sameAsSoldTo: boolean;
  shipFirstName: string;
  shipLastName: string;
  shipAddressLine1: string;
  shipCity: string;
  shipState: string;
  shipZip: string;
  shipPhone: string;

  // job-site
  jobSiteSameAsBilling: boolean;
  jobSiteAddressLine1: string;
  jobSiteCity: string;
  jobSiteState: string;
  jobSiteZip: string;
  siteContactName: string;
  siteContactPhone: string;
  accessInstructions: string;
  depositInstructions: string;

  // children
  rooms: RoomFormValue[];
  lineItems: LineItemFormValue[];
  inclusions: InclusionType[];          // chips
  inclusionNotes: string[];             // custom notes
  exclusions: ExclusionType[];
  exclusionNotes: string[];

  // money + pricing
  pricingMode: PricingMode;
  taxPercent: string;
  flatTotalCents: string;
  depositCents: string;
  basedOn: string;
  remarks: string;
  balanceTerm: "" | "cash" | "cod" | "finance";
};

export type ActionState =
  | { ok: true; orderId: string }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export const emptyInitialValues = (defaultSalespersonId: string): OrderInitialValues => ({
  salespersonId: defaultSalespersonId,
  advertisingSourceId: null,
  dateOfSale: new Date().toISOString().slice(0, 10),
  firstName: "", lastName: "", addressLine1: "",
  city: "", state: "CA", zip: "",
  phoneHome: "", phoneWork: "", phoneExt: "", email: "",
  sameAsSoldTo: true,
  shipFirstName: "", shipLastName: "", shipAddressLine1: "",
  shipCity: "", shipState: "CA", shipZip: "", shipPhone: "",
  jobSiteSameAsBilling: true,
  jobSiteAddressLine1: "", jobSiteCity: "", jobSiteState: "CA", jobSiteZip: "",
  siteContactName: "", siteContactPhone: "",
  accessInstructions: "", depositInstructions: "",
  rooms: Object.values(RoomName).map((r) => ({
    room: r, on: false, quantity: "", notes: "",
  })),
  lineItems: [emptyLineItem()],
  inclusions: [],
  inclusionNotes: [],
  exclusions: [],
  exclusionNotes: [],
  pricingMode: PricingMode.itemized,
  taxPercent: "7.75",
  flatTotalCents: "",
  depositCents: "",
  basedOn: "",
  remarks: "",
  balanceTerm: "",
});

export function emptyLineItem(): LineItemFormValue {
  return {
    key: cryptoRandomKey(),
    category: "",
    brand: "", style: "", color: "", sizeSpec: "", sku: "",
    quantity: "", unit: "",
    unitPriceCents: "",
    notes: "",
  };
}

function cryptoRandomKey(): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `li-${Math.random().toString(36).slice(2, 10)}`;
}

const moneyToInput = (cents: number | null | undefined) => (cents ? (cents / 100).toFixed(2) : "");
const numToInput = (n: number | null | undefined) => (n != null ? String(n) : "");

export function orderToInitial(order: {
  id: string;
  invoiceNumber: number;
  salespersonId: string;
  advertisingSourceId: string | null;
  dateOfSale: Date;
  pricingMode: PricingMode;
  taxPercent: number;
  totalCents: number;
  depositCents: number;
  basedOn: string | null;
  remarks: string | null;
  balanceTerm: "cash" | "cod" | "finance" | null;
  jobSiteSameAsBilling: boolean;
  jobSiteAddressLine1: string | null;
  jobSiteCity: string | null;
  jobSiteState: string | null;
  jobSiteZip: string | null;
  siteContactName: string | null;
  siteContactPhone: string | null;
  accessInstructions: string | null;
  depositInstructions: string | null;
  customer: {
    firstName: string; lastName: string; addressLine1: string; city: string; state: string; zip: string;
    phoneHome: string | null; phoneWork: string | null; phoneExt: string | null; email: string | null;
    shipFirstName: string | null; shipLastName: string | null; shipAddressLine1: string | null;
    shipCity: string | null; shipState: string | null; shipZip: string | null; shipPhone: string | null;
  };
  rooms: { room: RoomName; quantity: number | null; notes: string | null }[];
  lineItems: {
    position: number; category: LineCategory;
    brand: string | null; style: string | null; color: string | null;
    sizeSpec: string | null; sku: string | null;
    quantity: number | null; unit: UnitOfMeasure | null;
    unitPriceCents: number | null; notes: string | null;
  }[];
  inclusions: { type: InclusionType; customText: string | null }[];
  exclusions: { type: ExclusionType; customText: string | null }[];
}): OrderInitialValues {
  const c = order.customer;
  const same =
    c.shipFirstName === c.firstName &&
    c.shipLastName === c.lastName &&
    c.shipAddressLine1 === c.addressLine1;

  // Rooms: make a value for every enum entry, mark `on` true for those that exist.
  const roomMap = new Map(order.rooms.map((r) => [r.room, r]));
  const rooms = Object.values(RoomName).map((rname) => {
    const r = roomMap.get(rname);
    return {
      room: rname,
      on: !!r,
      quantity: r?.quantity != null ? String(r.quantity) : "",
      notes: r?.notes ?? "",
    };
  });

  return {
    id: order.id,
    invoiceNumber: order.invoiceNumber,
    salespersonId: order.salespersonId,
    advertisingSourceId: order.advertisingSourceId,
    dateOfSale: order.dateOfSale.toISOString().slice(0, 10),
    firstName: c.firstName, lastName: c.lastName,
    addressLine1: c.addressLine1, city: c.city, state: c.state, zip: c.zip,
    phoneHome: c.phoneHome ?? "", phoneWork: c.phoneWork ?? "",
    phoneExt: c.phoneExt ?? "", email: c.email ?? "",
    sameAsSoldTo: same,
    shipFirstName: c.shipFirstName ?? "", shipLastName: c.shipLastName ?? "",
    shipAddressLine1: c.shipAddressLine1 ?? "",
    shipCity: c.shipCity ?? "", shipState: c.shipState ?? "CA", shipZip: c.shipZip ?? "",
    shipPhone: c.shipPhone ?? "",
    jobSiteSameAsBilling: order.jobSiteSameAsBilling,
    jobSiteAddressLine1: order.jobSiteAddressLine1 ?? "",
    jobSiteCity: order.jobSiteCity ?? "",
    jobSiteState: order.jobSiteState ?? "CA",
    jobSiteZip: order.jobSiteZip ?? "",
    siteContactName: order.siteContactName ?? "",
    siteContactPhone: order.siteContactPhone ?? "",
    accessInstructions: order.accessInstructions ?? "",
    depositInstructions: order.depositInstructions ?? "",
    rooms,
    lineItems: order.lineItems.length > 0
      ? order.lineItems.map((li) => ({
          key: cryptoRandomKey(),
          category: li.category,
          brand: li.brand ?? "",
          style: li.style ?? "",
          color: li.color ?? "",
          sizeSpec: li.sizeSpec ?? "",
          sku: li.sku ?? "",
          quantity: numToInput(li.quantity),
          unit: li.unit ?? "",
          unitPriceCents: moneyToInput(li.unitPriceCents),
          notes: li.notes ?? "",
        }))
      : [emptyLineItem()],
    inclusions: order.inclusions.filter((i) => i.type !== InclusionType.customNote).map((i) => i.type),
    inclusionNotes: order.inclusions.filter((i) => i.type === InclusionType.customNote).map((i) => i.customText ?? ""),
    exclusions: order.exclusions.filter((e) => e.type !== ExclusionType.customNote).map((e) => e.type),
    exclusionNotes: order.exclusions.filter((e) => e.type === ExclusionType.customNote).map((e) => e.customText ?? ""),
    pricingMode: order.pricingMode,
    taxPercent: order.taxPercent != null ? String(order.taxPercent) : "7.75",
    flatTotalCents: order.pricingMode === PricingMode.flatTotal ? moneyToInput(order.totalCents) : "",
    depositCents: moneyToInput(order.depositCents),
    basedOn: order.basedOn ?? "",
    remarks: order.remarks ?? "",
    balanceTerm: order.balanceTerm ?? "",
  };
}
