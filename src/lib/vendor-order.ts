// Vendor PO creation. Auto-creates a Vendor row when a vendor name is typed
// for the first time (Phase 2 hook from spec § 14). Snapshots the chosen
// material lines into JSON so editing the master order doesn't silently
// mutate a sent PO.

import { prisma } from "./prisma";

type CreateInput = {
  orderId: string;
  vendorName: string;
  poNumber: string;
  sidemark?: string | null;
  faxEmailDate?: Date | null;
  willCallDate?: Date | null;
  deliveryDate?: Date | null;
  deliveryAddress?: string | null;
  materialLineIds: string[];
};

export async function createVendorOrder(input: CreateInput) {
  return prisma.$transaction(async (tx) => {
    // Auto-create or match the Vendor by case-insensitive name.
    const trimmed = input.vendorName.trim();
    const existing = await tx.vendor.findFirst({
      where: { name: { equals: trimmed, mode: "insensitive" } },
    });
    const vendor =
      existing ??
      (await tx.vendor.create({ data: { name: trimmed } }));

    // Snapshot the selected material lines.
    const lines = await tx.orderMaterial.findMany({
      where: { orderId: input.orderId, id: { in: input.materialLineIds } },
    });
    const lineItems = lines.map((m) => ({
      lineNumber: m.lineNumber,
      millStyle: m.millStyle,
      color: m.color,
      size: m.size,
      refNumber: m.refNumber,
      pad: m.pad,
      areas: m.areas,
      unitOfMeasure: m.unitOfMeasure,
      quantity: m.quantity,
      unitPriceCents: m.unitPriceCents,
    }));

    return tx.vendorOrder.create({
      data: {
        orderId: input.orderId,
        vendorId: vendor.id,
        vendorName: vendor.name,
        poNumber: input.poNumber,
        sidemark: input.sidemark ?? null,
        faxEmailDate: input.faxEmailDate ?? null,
        willCallDate: input.willCallDate ?? null,
        deliveryDate: input.deliveryDate ?? null,
        deliveryAddress: input.deliveryAddress ?? null,
        lineItems: lineItems as object,
      },
    });
  });
}

export async function listVendorOrders(orderId: string) {
  return prisma.vendorOrder.findMany({
    where: { orderId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVendorOrder(id: string) {
  return prisma.vendorOrder.findUnique({
    where: { id },
    include: { order: { include: { customer: true } } },
  });
}
