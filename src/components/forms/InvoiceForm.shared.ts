// Shared types + factories for the post-restructure Invoice form. Server
// components import factories from here; the client InvoiceForm component
// imports + re-exports them.

import {
  CarpetType, ExclusionType, InclusionType, InstallMethod,
  LineCategory, PricingMode, RoomName, UnitOfMeasure,
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
  carpetType: CarpetType | "";
  pad: string;
  lineInstallMethod: InstallMethod | "";
  notes: string;
};

export type MoldingsFormValue = {
  removeReplace: boolean;
  baseShoe: boolean;
  baseboard: boolean;
  rubberCover4in: boolean;
  quarterRound: string;
  wallBase: string;
  filmOnly: string;
  filmAndFoam: string;
  endMolding: string;
  stairNosing: string;
  tMolding: string;
  reducer: string;
};

export type FixturesFormValue = {
  stove: boolean;
  fridge: boolean;
  washer: boolean;
  dryer: boolean;
  waterbed: boolean;
  piano: boolean;
  organ: boolean;
  tablesChairs: boolean;
};

export type OtherInstructionsFormValue = {
  removeOldCarpetAndPad: "" | "yes" | "no";
  removeOldTagStrip: "" | "yes" | "no";
  hasSteps: "" | "yes" | "no";
  numSteps: string;
  newTackStripType: "" | "wood" | "concrete";
  emptyHouse: "" | "yes" | "no";
  heavyFurniture: "" | "yes" | "no";
};

export type OrderInitialValues = {
  id?: string;
  invoiceNumber?: number;

  salespersonId: string;
  advertisingSourceId: string | null;
  dateOfSale: string;

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
  inclusions: InclusionType[];
  inclusionNotes: string[];
  exclusions: ExclusionType[];
  exclusionNotes: string[];

  // work-order internal sections
  moldings: MoldingsFormValue;
  fixtures: FixturesFormValue;
  otherInstructions: OtherInstructionsFormValue;

  // money + pricing
  pricingMode: PricingMode;
  taxPercent: string;
  flatTotalCents: string;
  depositCents: string;
  remarks: string;
  balanceTerm: "" | "cash" | "cod" | "finance";
};

export type ActionState =
  | { ok: true; orderId: string }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

function emptyMoldings(): MoldingsFormValue {
  return {
    removeReplace: false, baseShoe: false, baseboard: false, rubberCover4in: false,
    quarterRound: "", wallBase: "", filmOnly: "", filmAndFoam: "",
    endMolding: "", stairNosing: "", tMolding: "", reducer: "",
  };
}

function emptyFixtures(): FixturesFormValue {
  return {
    stove: false, fridge: false, washer: false, dryer: false,
    waterbed: false, piano: false, organ: false, tablesChairs: false,
  };
}

function emptyOtherInstructions(): OtherInstructionsFormValue {
  return {
    removeOldCarpetAndPad: "", removeOldTagStrip: "",
    hasSteps: "", numSteps: "",
    newTackStripType: "", emptyHouse: "", heavyFurniture: "",
  };
}

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
  moldings: emptyMoldings(),
  fixtures: emptyFixtures(),
  otherInstructions: emptyOtherInstructions(),
  pricingMode: PricingMode.itemized,
  taxPercent: "7.75",
  flatTotalCents: "",
  depositCents: "",
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
    carpetType: "", pad: "", lineInstallMethod: "",
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
const boolToYesNo = (v: boolean | null | undefined): "" | "yes" | "no" =>
  v === true ? "yes" : v === false ? "no" : "";

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
  // work-order internal
  moldingsRemoveReplace: boolean;
  removeOldCarpetAndPad: boolean | null;
  removeOldTagStrip: boolean | null;
  hasSteps: boolean | null;
  numSteps: number | null;
  newTackStripType: string | null;
  emptyHouse: boolean | null;
  heavyFurniture: boolean | null;
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
    carpetType: CarpetType | null; pad: string | null; lineInstallMethod: InstallMethod | null;
  }[];
  inclusions: { type: InclusionType; customText: string | null }[];
  exclusions: { type: ExclusionType; customText: string | null }[];
  moldings: { type: string; quantity: string | null }[];
  fixtures: { type: string }[];
}): OrderInitialValues {
  const c = order.customer;
  const same =
    c.shipFirstName === c.firstName &&
    c.shipLastName === c.lastName &&
    c.shipAddressLine1 === c.addressLine1;

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

  // Reconstruct moldings form value from DB rows
  const moldingMap = new Map(order.moldings.map((m) => [m.type, m]));
  const moldings: MoldingsFormValue = {
    removeReplace: order.moldingsRemoveReplace,
    baseShoe: moldingMap.has("baseShoe"),
    baseboard: moldingMap.has("baseboard"),
    rubberCover4in: moldingMap.has("rubberCover4in"),
    quarterRound: moldingMap.get("quarterRound")?.quantity ?? "",
    wallBase: moldingMap.get("wallBase")?.quantity ?? "",
    filmOnly: moldingMap.get("filmOnly")?.quantity ?? "",
    filmAndFoam: moldingMap.get("filmAndFoam")?.quantity ?? "",
    endMolding: moldingMap.get("endMolding")?.quantity ?? "",
    stairNosing: moldingMap.get("stairNosing")?.quantity ?? "",
    tMolding: moldingMap.get("tMolding")?.quantity ?? "",
    reducer: moldingMap.get("reducer")?.quantity ?? "",
  };

  const fixtureSet = new Set(order.fixtures.map((f) => f.type));
  const fixtures: FixturesFormValue = {
    stove: fixtureSet.has("stove"),
    fridge: fixtureSet.has("fridge"),
    washer: fixtureSet.has("washer"),
    dryer: fixtureSet.has("dryer"),
    waterbed: fixtureSet.has("waterbed"),
    piano: fixtureSet.has("piano"),
    organ: fixtureSet.has("organ"),
    tablesChairs: fixtureSet.has("tablesChairs"),
  };

  const otherInstructions: OtherInstructionsFormValue = {
    removeOldCarpetAndPad: boolToYesNo(order.removeOldCarpetAndPad),
    removeOldTagStrip: boolToYesNo(order.removeOldTagStrip),
    hasSteps: boolToYesNo(order.hasSteps),
    numSteps: numToInput(order.numSteps),
    newTackStripType: (order.newTackStripType as "" | "wood" | "concrete") ?? "",
    emptyHouse: boolToYesNo(order.emptyHouse),
    heavyFurniture: boolToYesNo(order.heavyFurniture),
  };

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
          carpetType: li.carpetType ?? "",
          pad: li.pad ?? "",
          lineInstallMethod: li.lineInstallMethod ?? "",
          notes: li.notes ?? "",
        }))
      : [emptyLineItem()],
    inclusions: order.inclusions.filter((i) => i.type !== InclusionType.customNote).map((i) => i.type),
    inclusionNotes: order.inclusions.filter((i) => i.type === InclusionType.customNote).map((i) => i.customText ?? ""),
    exclusions: order.exclusions.filter((e) => e.type !== ExclusionType.customNote).map((e) => e.type),
    exclusionNotes: order.exclusions.filter((e) => e.type === ExclusionType.customNote).map((e) => e.customText ?? ""),
    moldings,
    fixtures,
    otherInstructions,
    pricingMode: order.pricingMode,
    taxPercent: order.taxPercent != null ? String(order.taxPercent) : "7.75",
    flatTotalCents: "",
    depositCents: moneyToInput(order.depositCents),
    remarks: order.remarks ?? "",
    balanceTerm: order.balanceTerm ?? "",
  };
}
