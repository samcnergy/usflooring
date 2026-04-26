// Zod schema for the Work Order Details form (page 2 of the paper invoice).
// Captures the work-order-only fields that the Invoice form doesn't already
// hold, plus the four material lines (which feed into MaterialSuggestion).

import { z } from "zod";
import {
  CarpetType, InstallMethod, SubfloorType,
} from "@prisma/client";
import { dollarsToCents } from "./money";

const optDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? new Date(v) : null));

const optStr = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null);

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

const optFloat = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? Number(v) : null));

export const materialLineInput = z.object({
  lineNumber:    z.number().int().min(1).max(4),
  millStyle:     optStr,
  size:          optStr,
  color:         optStr,
  refNumber:     optStr,
  pad:           optStr,
  areas:         optStr,
  vendorName:    optStr,
  unitOfMeasure: optStr, // sqft | sqyd | linft | each (free text in P1)
  quantity:      optFloat,
  unitPriceCents: optMoneyCents,
});

export const workOrderInput = z.object({
  availabilityDate:   optDate,
  deliveryDate:       optDate,
  installerName:      optStr,
  installationDate:   optDate,

  subfloorType:    z.nativeEnum(SubfloorType).optional().nullable().transform((v) => v || null),
  installSubfloor: z.union([z.literal("true"), z.literal("false"), z.literal("")])
                    .optional()
                    .transform((v) => (v === "true" ? true : v === "false" ? false : null)),
  pullOldFloor:    z.union([z.literal("true"), z.literal("false"), z.literal("")])
                    .optional()
                    .transform((v) => (v === "true" ? true : v === "false" ? false : null)),
  oldFloorType:    optStr,
  oldFloorSize:    optStr,

  installMethod:      z.nativeEnum(InstallMethod).optional().nullable().transform((v) => v || null),
  carpetType:         z.nativeEnum(CarpetType).optional().nullable().transform((v) => v || null),
  specialInstructions: optStr,

  materials: z.array(materialLineInput).default([]),
});

export type WorkOrderInputParsed = z.output<typeof workOrderInput>;
export type MaterialLineParsed = z.output<typeof materialLineInput>;
