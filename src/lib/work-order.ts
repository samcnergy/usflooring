// Updates the work-order-only fields on an Order plus replaces its 4
// material lines. Each material line with content also upserts into
// MaterialSuggestion (Phase 2 plumbing — passive, write-only in Phase 1).

import { prisma } from "./prisma";
import type { CarpetType } from "@prisma/client";
import type { WorkOrderInputParsed, MaterialLineParsed } from "./work-order-schema";

export async function updateWorkOrder(orderId: string, input: WorkOrderInputParsed) {
  return prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        availabilityDate: input.availabilityDate,
        deliveryDate:     input.deliveryDate,
        installerName:    input.installerName,
        installationDate: input.installationDate,
        subfloorType:    input.subfloorType,
        installSubfloor: input.installSubfloor,
        pullOldFloor:    input.pullOldFloor,
        oldFloorType:    input.oldFloorType,
        oldFloorSize:    input.oldFloorSize,
        installMethod:   input.installMethod,
        specialInstructions: input.specialInstructions,
      },
    });

    // Replace material lines.
    await tx.orderMaterial.deleteMany({ where: { orderId } });
    const linesWithContent = input.materials.filter((m) => isLineFilled(m));
    if (linesWithContent.length > 0) {
      await tx.orderMaterial.createMany({
        data: linesWithContent.map((m) => ({
          orderId,
          lineNumber: m.lineNumber,
          millStyle: m.millStyle,
          size: m.size,
          color: m.color,
          refNumber: m.refNumber,
          pad: m.pad,
          areas: m.areas,
          carpetType: input.carpetType,
          unitOfMeasure: m.unitOfMeasure,
          quantity: m.quantity,
          unitPriceCents: m.unitPriceCents,
          vendorName: m.vendorName,
          lineTotalCents: m.unitPriceCents != null && m.quantity != null
            ? Math.round(m.unitPriceCents * m.quantity)
            : null,
        })),
      });
    }

    // Phase 2 plumbing: upsert MaterialSuggestion rows. Passive log, never read
    // in Phase 1; Phase 2 seeds the catalog from the top-N rows by usageCount.
    for (const m of linesWithContent) {
      const fingerprint = makeFingerprint(m, input.carpetType);
      if (!fingerprint) continue;
      const existing = await tx.materialSuggestion.findUnique({ where: { fingerprint } });
      if (existing) {
        await tx.materialSuggestion.update({
          where: { fingerprint },
          data: {
            usageCount: existing.usageCount + 1,
            lastSeenAt: new Date(),
            lastVendorName: m.vendorName ?? existing.lastVendorName,
            lastUnitPriceCents: m.unitPriceCents ?? existing.lastUnitPriceCents,
          },
        });
      } else {
        await tx.materialSuggestion.create({
          data: {
            fingerprint,
            millStyle: m.millStyle,
            color: m.color,
            size: m.size,
            carpetType: input.carpetType,
            unitOfMeasure: m.unitOfMeasure,
            usageCount: 1,
            lastVendorName: m.vendorName,
            lastUnitPriceCents: m.unitPriceCents,
          },
        });
      }
    }
  });
}

function isLineFilled(m: MaterialLineParsed): boolean {
  return Boolean(
    m.millStyle || m.size || m.color || m.refNumber || m.pad || m.areas ||
    m.vendorName || m.quantity != null || m.unitPriceCents != null,
  );
}

function makeFingerprint(m: MaterialLineParsed, carpetType: CarpetType | null): string | null {
  const parts = [
    (m.millStyle ?? "").toLowerCase().trim(),
    (m.color ?? "").toLowerCase().trim(),
    (m.size ?? "").toLowerCase().trim(),
    (carpetType ?? "").toLowerCase(),
  ].filter(Boolean);
  if (parts.length === 0) return null;
  return parts.join(" | ").replace(/\s+/g, " ");
}
