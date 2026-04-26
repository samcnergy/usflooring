// Vendor PO creation. Auto-creates a Vendor row when a vendor name is typed
// for the first time (Phase 2 hook from spec § 14). Snapshots the chosen
// OrderLineItem rows into JSON so editing the master order doesn't silently
// mutate a sent PO.

import { prisma } from "./prisma";
import type { LineCategory, UnitOfMeasure } from "@prisma/client";

export type VendorOrderLineSnapshot = {
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
  notes: string | null;
};

type CreateInput = {
  orderId: string;
  vendorName: string;
  poNumber: string;
  sidemark?: string | null;
  faxEmailDate?: Date | null;
  willCallDate?: Date | null;
  deliveryDate?: Date | null;
  deliveryAddress?: string | null;
  /** OrderLineItem.id values to include on this PO */
  lineItemIds: string[];
};

export async function createVendorOrder(input: CreateInput) {
  return prisma.$transaction(async (tx) => {
    const trimmed = input.vendorName.trim();
    const existing = await tx.vendor.findFirst({
      where: { name: { equals: trimmed, mode: "insensitive" } },
    });
    const vendor = existing ?? (await tx.vendor.create({ data: { name: trimmed } }));

    const lines = await tx.orderLineItem.findMany({
      where: { orderId: input.orderId, id: { in: input.lineItemIds } },
      orderBy: { position: "asc" },
    });
    const lineItems: VendorOrderLineSnapshot[] = lines.map((li) => ({
      position: li.position,
      category: li.category,
      brand: li.brand,
      style: li.style,
      color: li.color,
      sizeSpec: li.sizeSpec,
      sku: li.sku,
      quantity: li.quantity,
      unit: li.unit,
      unitPriceCents: li.unitPriceCents,
      notes: li.notes,
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
        lineItems: { lineItems } as object,
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
