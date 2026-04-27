// Shared types + factories for the post-restructure Invoice form. Server
// components import factories from here; the client InvoiceForm component
// imports + re-exports them.

import {
  CarpetType, ExclusionType, InclusionType, InstallMethod,
  LineCategory, PricingMode, RoomName, SubfloorType, UnitOfMeasure,
} from "@prisma/client";

export type SalespersonOption = { id: string; fullName: string };
export type AdvSourceOption = { id: string; name: string };

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
  // Shower-specific
  showerWallSqft: string;
  showerWallMaterial: string;
  showerPan: "" | "yes" | "no";
  showerPanMaterial: string;
  showerSoapBoxMaterial: string;
  showerBench: "" | "yes" | "no";
  bathroomFloorSqft: string;
  bathroomFloorMaterial: string;
  showerSchluterSize: string;
  showerSchluterColor: string;
  showerGroutColor: string;
  showerTileVertical: "" | "yes" | "no";
  showerTileHorizontal: "" | "yes" | "no";
  // Wood-specific
  woodWhiteRisers: "" | "yes" | "no";
  woodMoistureBarrier: "" | "yes" | "no";
  // Counter top-specific
  counterTopSeal: "" | "yes" | "no";
};

export type AreaGroupFormValue = {
  key: string;
  room: RoomName | "";
  quantity: string;
  notes: string;
  lineItems: LineItemFormValue[];
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

export type FloorConditionFormValue = {
  subfloorType: "" | SubfloorType;
  installSubfloor: "" | "yes" | "no";
  pullOldFloor: "" | "yes" | "no";
  installMethod: "" | InstallMethod;
  specialInstructions: string;
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

  // deposit instructions (formerly in job-site section, now in Remarks)
  depositInstructions: string;

  // area groups (rooms + line items combined)
  areaGroups: AreaGroupFormValue[];

  inclusions: InclusionType[];
  inclusionNotes: string[];
  exclusions: ExclusionType[];
  exclusionNotes: string[];

  // work-order internal sections
  floorCondition: FloorConditionFormValue;
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

function emptyFloorCondition(): FloorConditionFormValue {
  return {
    subfloorType: "", installSubfloor: "", pullOldFloor: "",
    installMethod: "", specialInstructions: "",
  };
}

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
  depositInstructions: "",
  areaGroups: [{ key: cryptoRandomKey(), room: "", quantity: "", notes: "", lineItems: [emptyLineItem()] }],
  inclusions: [],
  inclusionNotes: [],
  exclusions: [],
  exclusionNotes: [],
  floorCondition: emptyFloorCondition(),
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
    // Shower-specific
    showerWallSqft: "",
    showerWallMaterial: "",
    showerPan: "",
    showerPanMaterial: "",
    showerSoapBoxMaterial: "",
    showerBench: "",
    bathroomFloorSqft: "",
    bathroomFloorMaterial: "",
    showerSchluterSize: "",
    showerSchluterColor: "",
    showerGroutColor: "",
    showerTileVertical: "",
    showerTileHorizontal: "",
    // Wood-specific
    woodWhiteRisers: "",
    woodMoistureBarrier: "",
    // Counter top-specific
    counterTopSeal: "",
  };
}

export function cryptoRandomKey(): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `li-${Math.random().toString(36).slice(2, 10)}`;
}

const moneyToInput = (cents: number | null | undefined) => (cents ? (cents / 100).toFixed(2) : "");
const numToInput = (n: number | null | undefined) => (n != null ? String(n) : "");
const boolToYesNo = (v: boolean | null | undefined): "" | "yes" | "no" =>
  v === true ? "yes" : v === false ? "no" : "";

function liToForm(li: {
  id: string;
  roomId: string | null;
  position: number;
  category: LineCategory;
  brand: string | null;
  style: string | null;
  color: string | null;
  sizeSpec: string | null;
  sku: string | null;
  quantity: number | null;
  unit: UnitOfMeasure | null;
  unitPriceCents: number | null;
  carpetType: CarpetType | null;
  pad: string | null;
  lineInstallMethod: InstallMethod | null;
  notes: string | null;
  // Shower-specific
  showerWallSqft: number | null;
  showerWallMaterial: string | null;
  showerPan: boolean | null;
  showerPanMaterial: string | null;
  showerSoapBoxMaterial: string | null;
  showerBench: boolean | null;
  bathroomFloorSqft: number | null;
  bathroomFloorMaterial: string | null;
  showerSchluterSize: string | null;
  showerSchluterColor: string | null;
  showerGroutColor: string | null;
  showerTileVertical: boolean | null;
  showerTileHorizontal: boolean | null;
  // Wood-specific
  woodWhiteRisers: boolean | null;
  woodMoistureBarrier: boolean | null;
  // Counter top-specific
  counterTopSeal: boolean | null;
}): LineItemFormValue {
  return {
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
    // Shower-specific
    showerWallSqft:        li.showerWallSqft != null ? String(li.showerWallSqft) : "",
    showerWallMaterial:    li.showerWallMaterial ?? "",
    showerPan:             boolToYesNo(li.showerPan),
    showerPanMaterial:     li.showerPanMaterial ?? "",
    showerSoapBoxMaterial: li.showerSoapBoxMaterial ?? "",
    showerBench:           boolToYesNo(li.showerBench),
    bathroomFloorSqft:     li.bathroomFloorSqft != null ? String(li.bathroomFloorSqft) : "",
    bathroomFloorMaterial: li.bathroomFloorMaterial ?? "",
    showerSchluterSize:    li.showerSchluterSize ?? "",
    showerSchluterColor:   li.showerSchluterColor ?? "",
    showerGroutColor:      li.showerGroutColor ?? "",
    showerTileVertical:    boolToYesNo(li.showerTileVertical),
    showerTileHorizontal:  boolToYesNo(li.showerTileHorizontal),
    // Wood-specific
    woodWhiteRisers:       boolToYesNo(li.woodWhiteRisers),
    woodMoistureBarrier:   boolToYesNo(li.woodMoistureBarrier),
    // Counter top-specific
    counterTopSeal:        boolToYesNo(li.counterTopSeal),
  };
}

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
  depositInstructions: string | null;
  // work-order internal
  subfloorType: SubfloorType | null;
  installSubfloor: boolean | null;
  pullOldFloor: boolean | null;
  installMethod: InstallMethod | null;
  specialInstructions: string | null;
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
  rooms: { id: string; room: RoomName; quantity: number | null; notes: string | null }[];
  lineItems: {
    id: string;
    roomId: string | null;
    position: number; category: LineCategory;
    brand: string | null; style: string | null; color: string | null;
    sizeSpec: string | null; sku: string | null;
    quantity: number | null; unit: UnitOfMeasure | null;
    unitPriceCents: number | null; notes: string | null;
    carpetType: CarpetType | null; pad: string | null; lineInstallMethod: InstallMethod | null;
    // Shower-specific
    showerWallSqft: number | null;
    showerWallMaterial: string | null;
    showerPan: boolean | null;
    showerPanMaterial: string | null;
    showerSoapBoxMaterial: string | null;
    showerBench: boolean | null;
    bathroomFloorSqft: number | null;
    bathroomFloorMaterial: string | null;
    showerSchluterSize: string | null;
    showerSchluterColor: string | null;
    showerGroutColor: string | null;
    showerTileVertical: boolean | null;
    showerTileHorizontal: boolean | null;
    // Wood-specific
    woodWhiteRisers: boolean | null;
    woodMoistureBarrier: boolean | null;
    // Counter top-specific
    counterTopSeal: boolean | null;
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

  // Group line items by roomId
  const linesByRoomId = new Map<string | null, typeof order.lineItems>();
  for (const li of order.lineItems) {
    const key = li.roomId ?? null;
    if (!linesByRoomId.has(key)) linesByRoomId.set(key, []);
    linesByRoomId.get(key)!.push(li);
  }

  // Build area groups from rooms
  const areaGroups: AreaGroupFormValue[] = [];
  for (const r of order.rooms) {
    const roomItems = linesByRoomId.get(r.id) ?? [];
    areaGroups.push({
      key: cryptoRandomKey(),
      room: r.room,
      quantity: r.quantity != null ? String(r.quantity) : "",
      notes: r.notes ?? "",
      lineItems: roomItems.length > 0 ? roomItems.map(liToForm) : [emptyLineItem()],
    });
  }

  // Orphaned line items (no roomId) go into a trailing "no area" group
  const orphanItems = linesByRoomId.get(null) ?? [];
  if (orphanItems.length > 0 || areaGroups.length === 0) {
    areaGroups.push({
      key: cryptoRandomKey(),
      room: "",
      quantity: "",
      notes: "",
      lineItems: orphanItems.length > 0 ? orphanItems.map(liToForm) : [emptyLineItem()],
    });
  }

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

  const floorCondition: FloorConditionFormValue = {
    subfloorType: order.subfloorType ?? "",
    installSubfloor: boolToYesNo(order.installSubfloor),
    pullOldFloor: boolToYesNo(order.pullOldFloor),
    installMethod: order.installMethod ?? "",
    specialInstructions: order.specialInstructions ?? "",
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
    depositInstructions: order.depositInstructions ?? "",
    areaGroups,
    inclusions: order.inclusions.filter((i) => i.type !== InclusionType.customNote).map((i) => i.type),
    inclusionNotes: order.inclusions.filter((i) => i.type === InclusionType.customNote).map((i) => i.customText ?? ""),
    exclusions: order.exclusions.filter((e) => e.type !== ExclusionType.customNote).map((e) => e.type),
    exclusionNotes: order.exclusions.filter((e) => e.type === ExclusionType.customNote).map((e) => e.customText ?? ""),
    floorCondition,
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
