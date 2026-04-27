// Converts the new structured Invoice FormData payload into the shape
// `orderInput` (Zod schema) expects, then validates it.
//
// Field-naming conventions used by the form:
//   - Area groups: `ag_count`, `ag_<i>_room`, `ag_<i>_quantity`, `ag_<i>_notes`
//                  `ag_<i>_li_count`, `ag_<i>_li_<j>_<field>`
//   - Inclusions: `inc_<InclusionType>` (chip), `inc_custom_<i>` (custom-note text)
//   - Exclusions: `exc_<ExclusionType>` (chip), `exc_custom_<i>` (custom-note text)
//   - Moldings:   `mold_<MoldingType>` (checkbox or text for quantity types)
//   - Fixtures:   `fix_<FixtureType>` (checkbox)
//   - Other inst: `oi_<field>` (select: yes/no/"")

import { ExclusionType, FixtureType, InclusionType, MoldingType, RoomName } from "@prisma/client";
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

// Molding types that are checkboxes (present = checked)
const MOLDING_CHECKBOXES: MoldingType[] = [
  MoldingType.baseShoe,
  MoldingType.baseboard,
  MoldingType.rubberCover4in,
];

// Molding types that are text fields (value = quantity/LF)
const MOLDING_QUANTITIES: MoldingType[] = [
  MoldingType.quarterRound,
  MoldingType.wallBase,
  MoldingType.filmOnly,
  MoldingType.filmAndFoam,
  MoldingType.endMolding,
  MoldingType.stairNosing,
  MoldingType.tMolding,
  MoldingType.reducer,
];

// Fixtures shown in the form
const FIXTURE_CHECKBOXES: FixtureType[] = [
  FixtureType.stove,
  FixtureType.fridge,
  FixtureType.washer,
  FixtureType.dryer,
  FixtureType.waterbed,
  FixtureType.piano,
  FixtureType.organ,
  FixtureType.tablesChairs,
];

export function parseOrderForm(formData: FormData):
  | { ok: true; data: OrderInputParsed }
  | { ok: false; errors: Record<string, string>; message?: string } {

  // --- area groups → rooms + line items ---
  const agCount = Number(s(formData, "ag_count")) || 0;
  const rooms: Array<{ room: RoomName; quantity: string; notes: string }> = [];
  const lineItems: Array<{
    position: number;
    category: string;
    brand: string;
    style: string;
    color: string;
    sizeSpec: string;
    sku: string;
    quantity: string;
    unit: string | null;
    unitPriceCents: string;
    carpetType: string | null;
    pad: string | null;
    lineInstallMethod: string | null;
    notes: string;
    // Shower-specific
    showerWallSqft: string;
    showerWallMaterial: string;
    showerPan: string | undefined;
    showerPanMaterial: string;
    showerSoapBoxMaterial: string;
    showerBench: string | undefined;
    bathroomFloorSqft: string;
    bathroomFloorMaterial: string;
    showerSchluterSize: string;
    showerSchluterColor: string;
    showerGroutColor: string;
    showerTileVertical: string | undefined;
    showerTileHorizontal: string | undefined;
    // Wood-specific
    woodWhiteRisers: string | undefined;
    woodMoistureBarrier: string | undefined;
    // Counter top-specific
    counterTopSeal: string | undefined;
    roomIndex: number | null;
  }> = [];

  let linePosition = 0;

  for (let i = 0; i < agCount; i++) {
    const roomValue = s(formData, `ag_${i}_room`);
    const qty = s(formData, `ag_${i}_quantity`);
    const notes = s(formData, `ag_${i}_notes`);

    let roomIndex: number | null = null;
    if (roomValue && Object.values(RoomName).includes(roomValue as RoomName)) {
      roomIndex = rooms.length;
      rooms.push({
        room: roomValue as RoomName,
        quantity: qty,
        notes,
      });
    }

    const liCount = Number(s(formData, `ag_${i}_li_count`)) || 0;
    for (let j = 0; j < liCount; j++) {
      const category = s(formData, `ag_${i}_li_${j}_category`);
      if (!category) continue;
      const brand    = s(formData, `ag_${i}_li_${j}_brand`);
      const style    = s(formData, `ag_${i}_li_${j}_style`);
      const color    = s(formData, `ag_${i}_li_${j}_color`);
      const sizeSpec = s(formData, `ag_${i}_li_${j}_sizeSpec`);
      const sku      = s(formData, `ag_${i}_li_${j}_sku`);
      const quantity = s(formData, `ag_${i}_li_${j}_quantity`);
      const unit     = s(formData, `ag_${i}_li_${j}_unit`);
      const unitPrice = s(formData, `ag_${i}_li_${j}_unitPriceCents`);
      const carpetType = s(formData, `ag_${i}_li_${j}_carpetType`);
      const pad      = s(formData, `ag_${i}_li_${j}_pad`);
      const lineInstallMethod = s(formData, `ag_${i}_li_${j}_lineInstallMethod`);
      const liNotes  = s(formData, `ag_${i}_li_${j}_notes`);
      // Shower spec
      const showerWallSqft        = s(formData, `ag_${i}_li_${j}_showerWallSqft`);
      const showerWallMaterial    = s(formData, `ag_${i}_li_${j}_showerWallMaterial`);
      const showerPan             = s(formData, `ag_${i}_li_${j}_showerPan`) || undefined;
      const showerPanMaterial     = s(formData, `ag_${i}_li_${j}_showerPanMaterial`);
      const showerSoapBoxMaterial = s(formData, `ag_${i}_li_${j}_showerSoapBoxMaterial`);
      const showerBench           = s(formData, `ag_${i}_li_${j}_showerBench`) || undefined;
      const bathroomFloorSqft     = s(formData, `ag_${i}_li_${j}_bathroomFloorSqft`);
      const bathroomFloorMaterial = s(formData, `ag_${i}_li_${j}_bathroomFloorMaterial`);
      const showerSchluterSize    = s(formData, `ag_${i}_li_${j}_showerSchluterSize`);
      const showerSchluterColor   = s(formData, `ag_${i}_li_${j}_showerSchluterColor`);
      const showerGroutColor      = s(formData, `ag_${i}_li_${j}_showerGroutColor`);
      const showerTileVertical    = s(formData, `ag_${i}_li_${j}_showerTileVertical`) || undefined;
      const showerTileHorizontal  = s(formData, `ag_${i}_li_${j}_showerTileHorizontal`) || undefined;
      const woodWhiteRisers       = s(formData, `ag_${i}_li_${j}_woodWhiteRisers`) || undefined;
      const woodMoistureBarrier   = s(formData, `ag_${i}_li_${j}_woodMoistureBarrier`) || undefined;
      const counterTopSeal        = s(formData, `ag_${i}_li_${j}_counterTopSeal`) || undefined;
      if (!brand && !style && !color && !sizeSpec && !sku && !quantity && !unitPrice && !liNotes) continue;
      lineItems.push({
        position: linePosition++,
        category,
        brand, style, color, sizeSpec, sku,
        quantity,
        unit: unit || null,
        unitPriceCents: unitPrice,
        carpetType: carpetType || null,
        pad: pad || null,
        lineInstallMethod: lineInstallMethod || null,
        notes: liNotes,
        showerWallSqft,
        showerWallMaterial,
        showerPan,
        showerPanMaterial,
        showerSoapBoxMaterial,
        showerBench,
        bathroomFloorSqft,
        bathroomFloorMaterial,
        showerSchluterSize,
        showerSchluterColor,
        showerGroutColor,
        showerTileVertical,
        showerTileHorizontal,
        woodWhiteRisers,
        woodMoistureBarrier,
        counterTopSeal,
        roomIndex,
      });
    }
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

  // --- moldings ---
  const moldings: Array<{ type: MoldingType; quantity: string | null }> = [];
  for (const t of MOLDING_CHECKBOXES) {
    if (bool(formData, `mold_${t}`)) {
      moldings.push({ type: t, quantity: null });
    }
  }
  for (const t of MOLDING_QUANTITIES) {
    const qty = s(formData, `mold_${t}`).trim();
    if (qty) {
      moldings.push({ type: t, quantity: qty });
    }
  }

  // --- fixtures ---
  const fixtures: FixtureType[] = [];
  for (const t of FIXTURE_CHECKBOXES) {
    if (bool(formData, `fix_${t}`)) {
      fixtures.push(t);
    }
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
    depositInstructions:  s(formData, "depositInstructions"),
    rooms,
    lineItems,
    inclusions,
    exclusions,
    moldingsRemoveReplace: bool(formData, "moldingsRemoveReplace"),
    moldings,
    fixtures,
    subfloorType:        s(formData, "oi_subfloorType") || undefined,
    installSubfloor:     s(formData, "oi_installSubfloor") || undefined,
    pullOldFloor:        s(formData, "oi_pullOldFloor") || undefined,
    installMethod:       s(formData, "oi_installMethod") || undefined,
    specialInstructions: s(formData, "oi_specialInstructions") || undefined,
    removeOldCarpetAndPad: s(formData, "oi_removeOldCarpetAndPad") || undefined,
    removeOldTagStrip:     s(formData, "oi_removeOldTagStrip") || undefined,
    hasSteps:              s(formData, "oi_hasSteps") || undefined,
    numSteps:              s(formData, "oi_numSteps") || undefined,
    newTackStripType:      s(formData, "oi_newTackStripType") || undefined,
    emptyHouse:            s(formData, "oi_emptyHouse") || undefined,
    heavyFurniture:        s(formData, "oi_heavyFurniture") || undefined,
    pricingMode:    s(formData, "pricingMode") || "itemized",
    taxPercent:     s(formData, "taxPercent"),
    flatTotalCents: s(formData, "flatTotalCents") || "0",
    depositCents:   s(formData, "depositCents") || "0",
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

  if (parsed.data.lineItems.length === 0) {
    return {
      ok: false,
      errors: { _root: "Add at least one line item." },
      message: "An order needs at least one line item.",
    };
  }

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
