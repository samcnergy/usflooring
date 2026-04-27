// Server functions for Order CRUD against the post-restructure schema.
// Always called from server actions or route handlers — never from a client.

import { LineCategory, PricingMode } from "@prisma/client";
import { prisma } from "./prisma";
import { nextInvoiceNumber } from "./invoice-number";
import { ingestSuggestions } from "./material-suggestion";
import type { OrderInputParsed } from "./order-schema";
import type { Prisma } from "@prisma/client";

function computeTotals(input: OrderInputParsed) {
  const lineSum = input.lineItems.reduce((acc, li) => {
    if (li.quantity != null && li.unitPriceCents != null) {
      return acc + Math.round(li.quantity * li.unitPriceCents);
    }
    return acc;
  }, 0);

  if (input.pricingMode === PricingMode.itemized) {
    const subtotalCents = lineSum;
    const taxCents = Math.round((subtotalCents * input.taxPercent) / 100);
    const totalCents = subtotalCents + taxCents;
    const balanceCents = totalCents - (input.depositCents ?? 0);
    return { subtotalCents, taxCents, totalCents, balanceCents };
  }
  const totalCents = input.flatTotalCents ?? 0;
  const taxCents = Math.round((totalCents * input.taxPercent) / (100 + input.taxPercent));
  const subtotalCents = totalCents - taxCents;
  const balanceCents = totalCents - (input.depositCents ?? 0);
  return { subtotalCents, taxCents, totalCents, balanceCents };
}

function shipFields(input: OrderInputParsed) {
  if (input.sameAsSoldTo) {
    return {
      shipFirstName: input.firstName,
      shipLastName:  input.lastName,
      shipAddressLine1: input.addressLine1,
      shipCity:  input.city,
      shipState: input.state,
      shipZip:   input.zip,
      shipPhone: input.phoneHome ?? input.phoneWork ?? null,
    };
  }
  return {
    shipFirstName:    input.shipFirstName,
    shipLastName:     input.shipLastName,
    shipAddressLine1: input.shipAddressLine1,
    shipCity:         input.shipCity,
    shipState:        input.shipState,
    shipZip:          input.shipZip,
    shipPhone:        input.shipPhone,
  };
}

function orderInstructionFields(input: OrderInputParsed) {
  return {
    moldingsRemoveReplace: input.moldingsRemoveReplace,
    removeOldCarpetAndPad: input.removeOldCarpetAndPad ?? null,
    removeOldTagStrip:     input.removeOldTagStrip ?? null,
    hasSteps:              input.hasSteps ?? null,
    numSteps:              input.numSteps ?? null,
    newTackStripType:      input.newTackStripType ?? null,
    emptyHouse:            input.emptyHouse ?? null,
    heavyFurniture:        input.heavyFurniture ?? null,
  };
}

export async function createOrder(input: OrderInputParsed) {
  const totals = computeTotals(input);
  const ship = shipFields(input);
  const instructions = orderInstructionFields(input);

  const order = await prisma.$transaction(async (tx) => {
    const invoiceNumber = await nextInvoiceNumber(tx);

    const customer = await tx.customer.create({
      data: {
        firstName: input.firstName,
        lastName:  input.lastName,
        addressLine1: input.addressLine1,
        city:  input.city,
        state: input.state,
        zip:   input.zip,
        phoneHome: input.phoneHome,
        phoneWork: input.phoneWork,
        phoneExt:  input.phoneExt,
        email:     input.email,
        ...ship,
      },
    });

    // Create order without rooms or lineItems nested
    const created = await tx.order.create({
      data: {
        invoiceNumber,
        dateOfSale: input.dateOfSale,
        customerId: customer.id,
        salespersonId: input.salespersonId,
        advertisingSourceId: input.advertisingSourceId,
        pricingMode: input.pricingMode,
        taxPercent: input.taxPercent,
        taxCents: totals.taxCents,
        depositCents: input.depositCents,
        subtotalCents: totals.subtotalCents,
        totalCents: totals.totalCents,
        balanceCents: totals.balanceCents,
        remarks:     input.remarks,
        balanceTerm: input.balanceTerm,
        ...instructions,
        depositInstructions: input.depositInstructions,
        inclusions: {
          create: input.inclusions.map((inc) => ({
            type: inc.type,
            customText: inc.customText,
          })),
        },
        exclusions: {
          create: input.exclusions.map((exc) => ({
            type: exc.type,
            customText: exc.customText,
          })),
        },
        moldings: {
          create: input.moldings.map((m) => ({
            type: m.type,
            quantity: m.quantity,
          })),
        },
        fixtures: {
          create: input.fixtures.map((f) => ({ type: f })),
        },
      },
    });

    // Create rooms and build roomId lookup map (index → id)
    const roomIdByIndex = new Map<number, string>();
    for (let idx = 0; idx < input.rooms.length; idx++) {
      const r = input.rooms[idx];
      const createdRoom = await tx.orderRoom.create({
        data: {
          orderId: created.id,
          room: r.room,
          quantity: r.quantity,
          notes: r.notes,
        },
      });
      roomIdByIndex.set(idx, createdRoom.id);
    }

    // Create line items with roomId resolved
    if (input.lineItems.length > 0) {
      await tx.orderLineItem.createMany({
        data: input.lineItems.map((li, i) => ({
          orderId: created.id,
          position: i,
          category: li.category,
          brand: li.brand,
          style: li.style,
          color: li.color,
          sizeSpec: li.sizeSpec,
          sku: li.sku,
          quantity: li.quantity,
          unit: li.unit,
          unitPriceCents: li.unitPriceCents,
          lineTotalCents:
            li.quantity != null && li.unitPriceCents != null
              ? Math.round(li.quantity * li.unitPriceCents)
              : null,
          carpetType: li.carpetType,
          pad: li.pad,
          lineInstallMethod: li.lineInstallMethod,
          notes: li.notes,
          roomId: li.roomIndex != null ? (roomIdByIndex.get(li.roomIndex) ?? null) : null,
        })),
      });
    }

    return created;
  });

  await ingestSuggestions({
    lineItems: input.lineItems.map((li) => ({
      category: li.category,
      brand: li.brand,
      style: li.style,
      color: li.color,
      sizeSpec: li.sizeSpec,
      unit: li.unit,
      unitPriceCents: li.unitPriceCents,
    })),
  });

  return order;
}

export async function updateOrder(id: string, input: OrderInputParsed) {
  const totals = computeTotals(input);
  const ship = shipFields(input);
  const instructions = orderInstructionFields(input);

  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUniqueOrThrow({ where: { id } });

    await tx.customer.update({
      where: { id: existing.customerId },
      data: {
        firstName: input.firstName,
        lastName:  input.lastName,
        addressLine1: input.addressLine1,
        city:  input.city,
        state: input.state,
        zip:   input.zip,
        phoneHome: input.phoneHome,
        phoneWork: input.phoneWork,
        phoneExt:  input.phoneExt,
        email:     input.email,
        ...ship,
      },
    });

    // Delete existing children first
    await tx.orderRoom.deleteMany({ where: { orderId: id } });
    await tx.orderLineItem.deleteMany({ where: { orderId: id } });
    await tx.orderInclusion.deleteMany({ where: { orderId: id } });
    await tx.orderExclusion.deleteMany({ where: { orderId: id } });
    await tx.orderMolding.deleteMany({ where: { orderId: id } });
    await tx.orderFixture.deleteMany({ where: { orderId: id } });

    // Update order without rooms or lineItems nested
    const updated = await tx.order.update({
      where: { id },
      data: {
        dateOfSale: input.dateOfSale,
        salespersonId: input.salespersonId,
        advertisingSourceId: input.advertisingSourceId,
        pricingMode: input.pricingMode,
        taxPercent: input.taxPercent,
        taxCents: totals.taxCents,
        depositCents: input.depositCents,
        subtotalCents: totals.subtotalCents,
        totalCents: totals.totalCents,
        balanceCents: totals.balanceCents,
        remarks:     input.remarks,
        balanceTerm: input.balanceTerm,
        ...instructions,
        depositInstructions: input.depositInstructions,
        inclusions: {
          create: input.inclusions.map((inc) => ({
            type: inc.type,
            customText: inc.customText,
          })),
        },
        exclusions: {
          create: input.exclusions.map((exc) => ({
            type: exc.type,
            customText: exc.customText,
          })),
        },
        moldings: {
          create: input.moldings.map((m) => ({
            type: m.type,
            quantity: m.quantity,
          })),
        },
        fixtures: {
          create: input.fixtures.map((f) => ({ type: f })),
        },
      },
    });

    // Create rooms and build roomId lookup map (index → id)
    const roomIdByIndex = new Map<number, string>();
    for (let idx = 0; idx < input.rooms.length; idx++) {
      const r = input.rooms[idx];
      const createdRoom = await tx.orderRoom.create({
        data: {
          orderId: id,
          room: r.room,
          quantity: r.quantity,
          notes: r.notes,
        },
      });
      roomIdByIndex.set(idx, createdRoom.id);
    }

    // Create line items with roomId resolved
    if (input.lineItems.length > 0) {
      await tx.orderLineItem.createMany({
        data: input.lineItems.map((li, i) => ({
          orderId: id,
          position: i,
          category: li.category,
          brand: li.brand,
          style: li.style,
          color: li.color,
          sizeSpec: li.sizeSpec,
          sku: li.sku,
          quantity: li.quantity,
          unit: li.unit,
          unitPriceCents: li.unitPriceCents,
          lineTotalCents:
            li.quantity != null && li.unitPriceCents != null
              ? Math.round(li.quantity * li.unitPriceCents)
              : null,
          carpetType: li.carpetType,
          pad: li.pad,
          lineInstallMethod: li.lineInstallMethod,
          notes: li.notes,
          roomId: li.roomIndex != null ? (roomIdByIndex.get(li.roomIndex) ?? null) : null,
        })),
      });
    }

    return updated;
  });

  await ingestSuggestions({
    lineItems: input.lineItems.map((li) => ({
      category: li.category,
      brand: li.brand,
      style: li.style,
      color: li.color,
      sizeSpec: li.sizeSpec,
      unit: li.unit,
      unitPriceCents: li.unitPriceCents,
    })),
  });

  return order;
}

export async function voidOrder(id: string) {
  return prisma.order.update({ where: { id }, data: { status: "voided" } });
}

export async function unvoidOrder(id: string) {
  return prisma.order.update({ where: { id }, data: { status: "draft" } });
}

export async function softDeleteOrder(id: string) {
  return prisma.order.update({ where: { id }, data: { deletedAt: new Date() } });
}

// ---------- Queries ----------

export type OrderListItem = Awaited<ReturnType<typeof listOrders>>[number];

export async function listOrders(opts?: {
  salespersonId?: string;
  search?: string;
  limit?: number;
}) {
  const where: Prisma.OrderWhereInput = {
    deletedAt: null,
    ...(opts?.salespersonId ? { salespersonId: opts.salespersonId } : {}),
    ...(opts?.search
      ? {
          OR: [
            ...(Number.isFinite(Number(opts.search))
              ? [{ invoiceNumber: Number(opts.search) }]
              : []),
            { customer: { firstName: { contains: opts.search, mode: "insensitive" as const } } },
            { customer: { lastName:  { contains: opts.search, mode: "insensitive" as const } } },
            { salesperson: { fullName: { contains: opts.search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };
  return prisma.order.findMany({
    where,
    orderBy: { invoiceNumber: "desc" },
    take: opts?.limit ?? 50,
    include: {
      customer: { select: { firstName: true, lastName: true } },
      salesperson: { select: { fullName: true } },
      advertisingSource: { select: { name: true } },
    },
  });
}

export async function getOrder(id: string) {
  return prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: {
      customer: true,
      salesperson: { select: { id: true, fullName: true, email: true } },
      advertisingSource: true,
      rooms: { orderBy: { id: "asc" } },
      lineItems: { orderBy: { position: "asc" }, include: { room: true } },
      inclusions: { orderBy: { id: "asc" } },
      exclusions: { orderBy: { id: "asc" } },
      moldings: { orderBy: { id: "asc" } },
      fixtures: { orderBy: { id: "asc" } },
      installNotes: { orderBy: { category: "asc" } },
    },
  });
}

export async function upsertInstallNote(orderId: string, category: LineCategory, notes: string) {
  return prisma.orderInstallNote.upsert({
    where: { orderId_category: { orderId, category } },
    create: { orderId, category, notes },
    update: { notes },
  });
}
