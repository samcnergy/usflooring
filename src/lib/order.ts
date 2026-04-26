// Server functions for Order CRUD against the post-restructure schema.
// Always called from server actions or route handlers — never from a client.

import { PricingMode } from "@prisma/client";
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
  // flatTotal: salesperson types totalCents directly. Subtotal = total - tax.
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

function jobSiteFields(input: OrderInputParsed) {
  if (input.jobSiteSameAsBilling) {
    return {
      jobSiteSameAsBilling: true,
      jobSiteAddressLine1: null,
      jobSiteCity:         null,
      jobSiteState:        null,
      jobSiteZip:          null,
    };
  }
  return {
    jobSiteSameAsBilling: false,
    jobSiteAddressLine1: input.jobSiteAddressLine1,
    jobSiteCity:         input.jobSiteCity,
    jobSiteState:        input.jobSiteState,
    jobSiteZip:          input.jobSiteZip,
  };
}

function lineItemCreateData(input: OrderInputParsed) {
  return input.lineItems.map((li, i) => ({
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
    notes: li.notes,
  }));
}

export async function createOrder(input: OrderInputParsed) {
  const totals = computeTotals(input);
  const ship = shipFields(input);
  const site = jobSiteFields(input);

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
        basedOn:     input.basedOn,
        remarks:     input.remarks,
        balanceTerm: input.balanceTerm,
        ...site,
        siteContactName:     input.siteContactName,
        siteContactPhone:    input.siteContactPhone,
        accessInstructions:  input.accessInstructions,
        depositInstructions: input.depositInstructions,
        rooms: {
          create: input.rooms.map((r) => ({
            room: r.room,
            quantity: r.quantity,
            notes: r.notes,
          })),
        },
        lineItems: {
          create: lineItemCreateData(input),
        },
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
      },
    });

    return created;
  });

  // Phase 2 plumbing: feed MaterialSuggestion. Outside the transaction —
  // failures here never roll back the order.
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
  const site = jobSiteFields(input);

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

    // Replace children entirely (simpler than diffing in v1).
    await tx.orderRoom.deleteMany({ where: { orderId: id } });
    await tx.orderLineItem.deleteMany({ where: { orderId: id } });
    await tx.orderInclusion.deleteMany({ where: { orderId: id } });
    await tx.orderExclusion.deleteMany({ where: { orderId: id } });

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
        basedOn:     input.basedOn,
        remarks:     input.remarks,
        balanceTerm: input.balanceTerm,
        ...site,
        siteContactName:     input.siteContactName,
        siteContactPhone:    input.siteContactPhone,
        accessInstructions:  input.accessInstructions,
        depositInstructions: input.depositInstructions,
        rooms: {
          create: input.rooms.map((r) => ({
            room: r.room,
            quantity: r.quantity,
            notes: r.notes,
          })),
        },
        lineItems: {
          create: lineItemCreateData(input),
        },
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
      },
    });

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
      lineItems: { orderBy: { position: "asc" } },
      inclusions: { orderBy: { id: "asc" } },
      exclusions: { orderBy: { id: "asc" } },
    },
  });
}
