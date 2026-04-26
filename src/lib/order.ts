// Server functions for Order CRUD. Always called from server actions or
// route handlers — never from a client component.
//
// Authorization is the caller's responsibility: pass `salespersonId` (the
// session user's ID) for sales-context calls; admin-context calls can pass
// any salespersonId.

import { prisma } from "./prisma";
import { nextInvoiceNumber } from "./invoice-number";
import type { OrderInputParsed } from "./order-schema";
import type { Prisma } from "@prisma/client";

function computeTotals(input: OrderInputParsed) {
  const subtotalCents = input.areas.reduce((s, a) => s + (a.lineTotal ?? 0), 0);
  // Tax is computed from the rate, not typed in. Round half-up to nearest cent.
  const taxCents = Math.round((subtotalCents * input.taxPercent) / 100);
  const totalCents = subtotalCents + taxCents;
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

export async function createOrder(input: OrderInputParsed) {
  const { subtotalCents, taxCents, totalCents, balanceCents } = computeTotals(input);
  const ship = shipFields(input);

  return prisma.$transaction(async (tx) => {
    const invoiceNumber = await nextInvoiceNumber(tx);

    // Customer is created inline (matching the paper-form workflow). A future
    // pass can add customer search/select.
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
        shipFirstName:    ship.shipFirstName,
        shipLastName:     ship.shipLastName,
        shipAddressLine1: ship.shipAddressLine1,
        shipCity:         ship.shipCity,
        shipState:        ship.shipState,
        shipZip:          ship.shipZip,
        shipPhone:        ship.shipPhone,
      },
    });

    const order = await tx.order.create({
      data: {
        invoiceNumber,
        dateOfSale: input.dateOfSale,
        customerId: customer.id,
        salespersonId: input.salespersonId,
        advertisingSourceId: input.advertisingSourceId,
        hasCabinet:    input.hasCabinet,
        hasCarpet:     input.hasCarpet,
        hasVinyl:      input.hasVinyl,
        hasWood:       input.hasWood,
        hasCeramic:    input.hasCeramic,
        hasCounterTop: input.hasCounterTop,
        hasFireplace:  input.hasFireplace,
        hasShower:     input.hasShower,
        taxPercent:    input.taxPercent,
        taxCents,
        depositCents:  input.depositCents,
        subtotalCents,
        totalCents,
        balanceCents,
        basedOn:     input.basedOn,
        remarks:     input.remarks,
        balanceTerm: input.balanceTerm,
        areas: {
          create: input.areas
            .filter((a) => a.quantity != null || a.description || a.material || a.color || a.size || a.lineTotal > 0)
            .map((a) => ({
              areaName: a.areaName,
              quantity: a.quantity,
              description: a.description,
              material: a.material,
              color: a.color,
              size: a.size,
              lineTotalCents: a.lineTotal,
            })),
        },
      },
    });

    return order;
  });
}

export async function updateOrder(id: string, input: OrderInputParsed) {
  const { subtotalCents, taxCents, totalCents, balanceCents } = computeTotals(input);
  const ship = shipFields(input);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUniqueOrThrow({ where: { id } });

    // Update customer in-place (the customer is owned by this order in the
    // current schema — no shared customers across orders yet).
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
        shipFirstName:    ship.shipFirstName,
        shipLastName:     ship.shipLastName,
        shipAddressLine1: ship.shipAddressLine1,
        shipCity:         ship.shipCity,
        shipState:        ship.shipState,
        shipZip:          ship.shipZip,
        shipPhone:        ship.shipPhone,
      },
    });

    // Replace the area rows entirely (simpler than diffing in v1).
    await tx.orderArea.deleteMany({ where: { orderId: id } });

    const order = await tx.order.update({
      where: { id },
      data: {
        dateOfSale: input.dateOfSale,
        salespersonId: input.salespersonId,
        advertisingSourceId: input.advertisingSourceId,
        hasCabinet:    input.hasCabinet,
        hasCarpet:     input.hasCarpet,
        hasVinyl:      input.hasVinyl,
        hasWood:       input.hasWood,
        hasCeramic:    input.hasCeramic,
        hasCounterTop: input.hasCounterTop,
        hasFireplace:  input.hasFireplace,
        hasShower:     input.hasShower,
        taxPercent:    input.taxPercent,
        taxCents,
        depositCents:  input.depositCents,
        subtotalCents,
        totalCents,
        balanceCents,
        basedOn:     input.basedOn,
        remarks:     input.remarks,
        balanceTerm: input.balanceTerm,
        areas: {
          create: input.areas
            .filter((a) => a.quantity != null || a.description || a.material || a.color || a.size || a.lineTotal > 0)
            .map((a) => ({
              areaName: a.areaName,
              quantity: a.quantity,
              description: a.description,
              material: a.material,
              color: a.color,
              size: a.size,
              lineTotalCents: a.lineTotal,
            })),
        },
      },
    });

    return order;
  });
}

export async function voidOrder(id: string) {
  return prisma.order.update({
    where: { id },
    data: { status: "voided" },
  });
}

export async function unvoidOrder(id: string) {
  return prisma.order.update({
    where: { id },
    data: { status: "draft" },
  });
}

export async function softDeleteOrder(id: string) {
  return prisma.order.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// --- queries ---

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
            // invoice number — match if numeric
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
      areas: { orderBy: { id: "asc" } },
    },
  });
}
