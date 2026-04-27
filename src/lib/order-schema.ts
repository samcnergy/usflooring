// Zod schema for the post-restructure Invoice form. The order is built from
// the new structured shape: rooms (checklist), lineItems (the money), plus
// inclusion/exclusion chips and job-site fields. Money fields arrive as
// user-entered strings and are converted to integer cents server-side.

import { z } from "zod";
import {
  BalanceTerm, CarpetType, ExclusionType, InclusionType, InstallMethod,
  LineCategory, MoldingType, FixtureType, PricingMode, RoomName, SubfloorType, UnitOfMeasure,
} from "@prisma/client";
import { dollarsToCents } from "./money";

const moneyString = z
  .string()
  .trim()
  .transform((v, ctx) => {
    if (v === "") return 0;
    try {
      return dollarsToCents(v);
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid money value" });
      return z.NEVER;
    }
  });

const optMoneyCents = z
  .string()
  .trim()
  .optional()
  .transform((v, ctx) => {
    if (!v) return null;
    try {
      return dollarsToCents(v);
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid money value" });
      return z.NEVER;
    }
  });

const optStr = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null);

const optFloat = z
  .string()
  .trim()
  .optional()
  .transform((v) => {
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  });

const optInt = z
  .string()
  .trim()
  .optional()
  .transform((v) => {
    if (!v) return null;
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  });

const optBool = z
  .string()
  .optional()
  .transform((v) => {
    if (v === "yes") return true;
    if (v === "no") return false;
    return null;
  });

// ---------- Sub-schemas ----------

export const orderRoomInput = z.object({
  room:     z.nativeEnum(RoomName),
  quantity: optInt,
  notes:    optStr,
});

export const orderLineItemInput = z.object({
  position: z.number().int().min(0),
  category: z.nativeEnum(LineCategory),
  brand:    optStr,
  style:    optStr,
  color:    optStr,
  sizeSpec: optStr,
  sku:      optStr,
  quantity: optFloat,
  unit:     z.nativeEnum(UnitOfMeasure).optional().nullable().transform((v) => v || null),
  unitPriceCents: optMoneyCents,
  carpetType:       z.nativeEnum(CarpetType).optional().nullable().transform((v) => v || null),
  pad:              optStr,
  lineInstallMethod: z.nativeEnum(InstallMethod).optional().nullable().transform((v) => v || null),
  notes:    optStr,
  // Shower-specific
  showerWallSqft:        optFloat,
  showerWallMaterial:    optStr,
  showerPan:             optBool,
  showerPanMaterial:     optStr,
  showerSoapBoxMaterial: optStr,
  showerBench:           optBool,
  bathroomFloorSqft:     optFloat,
  bathroomFloorMaterial: optStr,
  showerSchluterSize:    optStr,
  showerSchluterColor:   optStr,
  showerGroutColor:      optStr,
  showerTileVertical:    optBool,
  showerTileHorizontal:  optBool,
  // Wood-specific
  woodWhiteRisers:     optBool,
  woodMoistureBarrier: optBool,
  // Counter top-specific
  counterTopSeal: optBool,
  roomIndex: z.number().int().min(0).optional().nullable(),
});

export const orderMoldingInput = z.object({
  type:     z.nativeEnum(MoldingType),
  quantity: optStr,
});

export const orderInclusionInput = z.object({
  type:       z.nativeEnum(InclusionType),
  customText: optStr,
});

export const orderExclusionInput = z.object({
  type:       z.nativeEnum(ExclusionType),
  customText: optStr,
});

// ---------- Top-level Order schema ----------

export const orderInput = z.object({
  // mandatory salesperson dropdown
  salespersonId:       z.string().uuid("Salesperson is required"),
  advertisingSourceId: z.string().uuid().optional().nullable().transform((v) => v || null),
  dateOfSale: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? new Date(v) : new Date())),

  // sold-to
  firstName:    z.string().trim().min(1, "First name is required").max(120),
  lastName:     z.string().trim().min(1, "Last name is required").max(120),
  addressLine1: z.string().trim().min(1, "Address is required").max(200),
  city:         z.string().trim().min(1, "City is required").max(80),
  state:        z.string().trim().min(2).max(2).default("CA"),
  zip:          z.string().trim().min(5).max(10),
  phoneHome: optStr,
  phoneWork: optStr,
  phoneExt:  optStr,
  email:     z.string().trim().email().optional().or(z.literal("")).transform((v) => v || null),

  // ship-to
  sameAsSoldTo:     z.boolean().default(true),
  shipFirstName:    optStr,
  shipLastName:     optStr,
  shipAddressLine1: optStr,
  shipCity:         optStr,
  shipState:        optStr,
  shipZip:          optStr,
  shipPhone:        optStr,

  // deposit instructions (in Remarks section)
  depositInstructions:  optStr,

  // children
  rooms:      z.array(orderRoomInput).default([]),
  lineItems:  z.array(orderLineItemInput).default([]),
  inclusions: z.array(orderInclusionInput).default([]),
  exclusions: z.array(orderExclusionInput).default([]),

  // moldings (work-order internal)
  moldingsRemoveReplace: z.boolean().default(false),
  moldings: z.array(orderMoldingInput).default([]),

  // fixtures (work-order internal)
  fixtures: z.array(z.nativeEnum(FixtureType)).default([]),

  // floor condition (work-order internal)
  subfloorType:        z.nativeEnum(SubfloorType).optional().nullable().transform((v) => v || null),
  installSubfloor:     optBool,
  pullOldFloor:        optBool,
  installMethod:       z.nativeEnum(InstallMethod).optional().nullable().transform((v) => v || null),
  specialInstructions: optStr,

  // other instructions (work-order internal)
  removeOldCarpetAndPad: optBool,
  removeOldTagStrip:     optBool,
  hasSteps:              optBool,
  numSteps:              optInt,
  newTackStripType:      optStr,
  emptyHouse:            optBool,
  heavyFurniture:        optBool,

  // pricing & money
  pricingMode: z.nativeEnum(PricingMode).default(PricingMode.itemized),
  taxPercent: z
    .string()
    .trim()
    .optional()
    .transform((v, ctx) => {
      if (v == null || v === "") return 7.75;
      const n = Number(v.replace(/[%\s]/g, ""));
      if (!Number.isFinite(n) || n < 0 || n > 100) {
        ctx.addIssue({ code: "custom", message: "Tax % must be between 0 and 100" });
        return z.NEVER;
      }
      return n;
    }),
  flatTotalCents: moneyString.optional().default(0),
  depositCents:   moneyString.default(0),
  remarks:        optStr,
  balanceTerm:    z.nativeEnum(BalanceTerm).optional().nullable().transform((v) => v || null),
});

export type OrderInput = z.input<typeof orderInput>;
export type OrderInputParsed = z.output<typeof orderInput>;
export type OrderRoomInputParsed = z.output<typeof orderRoomInput>;
export type OrderLineItemInputParsed = z.output<typeof orderLineItemInput>;
export type OrderMoldingInputParsed = z.output<typeof orderMoldingInput>;
export type OrderInclusionInputParsed = z.output<typeof orderInclusionInput>;
export type OrderExclusionInputParsed = z.output<typeof orderExclusionInput>;
