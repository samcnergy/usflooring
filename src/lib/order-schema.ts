// Zod schema for the Invoice form. Used by server actions to validate the
// form payload before touching the DB. Money fields arrive as user-entered
// strings and are converted to integer cents server-side.

import { z } from "zod";
import { AreaName, BalanceTerm } from "@prisma/client";
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

export const orderAreaInput = z.object({
  areaName: z.nativeEnum(AreaName),
  quantity: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v == null || v === "" ? null : Number(v))),
  description: z.string().trim().max(500).optional().nullable().transform((v) => v || null),
  material:    z.string().trim().max(200).optional().nullable().transform((v) => v || null),
  color:       z.string().trim().max(200).optional().nullable().transform((v) => v || null),
  size:        z.string().trim().max(200).optional().nullable().transform((v) => v || null),
  lineTotal: moneyString,
});

export const orderInput = z.object({
  // mandatory salesperson dropdown
  salespersonId: z.string().uuid("Salesperson is required"),
  advertisingSourceId: z.string().uuid().optional().nullable().transform((v) => v || null),
  dateOfSale: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? new Date(v) : new Date())),

  // sold-to
  firstName: z.string().trim().min(1, "First name is required").max(120),
  lastName:  z.string().trim().min(1, "Last name is required").max(120),
  addressLine1: z.string().trim().min(1, "Address is required").max(200),
  city:  z.string().trim().min(1, "City is required").max(80),
  state: z.string().trim().min(2).max(2).default("CA"),
  zip:   z.string().trim().min(5).max(10),
  phoneHome: z.string().trim().max(40).optional().nullable().transform((v) => v || null),
  phoneWork: z.string().trim().max(40).optional().nullable().transform((v) => v || null),
  phoneExt:  z.string().trim().max(20).optional().nullable().transform((v) => v || null),
  email:     z.string().trim().email().optional().or(z.literal("")).transform((v) => v || null),

  // ship-to (defaults to sold-to via "same as" toggle in UI; if blank we copy)
  sameAsSoldTo: z.boolean().default(true),
  shipFirstName:    z.string().trim().max(120).optional().nullable().transform((v) => v || null),
  shipLastName:     z.string().trim().max(120).optional().nullable().transform((v) => v || null),
  shipAddressLine1: z.string().trim().max(200).optional().nullable().transform((v) => v || null),
  shipCity:         z.string().trim().max(80).optional().nullable().transform((v) => v || null),
  shipState:        z.string().trim().max(2).optional().nullable().transform((v) => v || null),
  shipZip:          z.string().trim().max(10).optional().nullable().transform((v) => v || null),
  shipPhone:        z.string().trim().max(40).optional().nullable().transform((v) => v || null),

  // category checkboxes
  hasCabinet:    z.boolean().default(false),
  hasCarpet:     z.boolean().default(false),
  hasVinyl:      z.boolean().default(false),
  hasWood:       z.boolean().default(false),
  hasCeramic:    z.boolean().default(false),
  hasCounterTop: z.boolean().default(false),
  hasFireplace:  z.boolean().default(false),
  hasShower:     z.boolean().default(false),

  // areas
  areas: z.array(orderAreaInput).default([]),

  // money + terms
  taxCents:     moneyString.default(0),
  depositCents: moneyString.default(0),
  basedOn:      z.enum(["Square Yards", "Square Feet", "Total"]).optional().nullable().transform((v) => v || null),
  remarks:      z.string().trim().max(2000).optional().nullable().transform((v) => v || null),
  balanceTerm:  z.nativeEnum(BalanceTerm).optional().nullable().transform((v) => v || null),
});

export type OrderInput = z.input<typeof orderInput>;
export type OrderInputParsed = z.output<typeof orderInput>;
