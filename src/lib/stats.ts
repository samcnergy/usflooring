// Server-side stats / dashboard queries. Excludes voided + soft-deleted
// orders from financial metrics.

import { prisma } from "./prisma";
import { startOfMonth, endOfMonth, subMonths, subDays, eachDayOfInterval, format } from "date-fns";

const ACTIVE = { deletedAt: null, status: { not: "voided" as const } };

export async function kpiThisMonth(now = new Date()) {
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const prevStart = startOfMonth(subMonths(now, 1));
  const prevEnd = endOfMonth(subMonths(now, 1));

  const [thisMonth, prevMonth, openBalanceAgg, topSalesperson] = await Promise.all([
    prisma.order.aggregate({
      where: { ...ACTIVE, dateOfSale: { gte: monthStart, lte: monthEnd } },
      _sum: { totalCents: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { ...ACTIVE, dateOfSale: { gte: prevStart, lte: prevEnd } },
      _sum: { totalCents: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: {
        deletedAt: null,
        status: { notIn: ["voided", "paid"] },
      },
      _sum: { balanceCents: true },
    }),
    prisma.order.groupBy({
      by: ["salespersonId"],
      where: { ...ACTIVE, dateOfSale: { gte: monthStart, lte: monthEnd } },
      _sum: { totalCents: true },
      orderBy: { _sum: { totalCents: "desc" } },
      take: 1,
    }),
  ]);

  let topName = "—";
  let topRevenue = 0;
  if (topSalesperson[0]) {
    topRevenue = topSalesperson[0]._sum.totalCents ?? 0;
    const u = await prisma.user.findUnique({
      where: { id: topSalesperson[0].salespersonId },
      select: { fullName: true },
    });
    topName = u?.fullName ?? "—";
  }

  return {
    revenueThisMonth: thisMonth._sum.totalCents ?? 0,
    revenueLastMonth: prevMonth._sum.totalCents ?? 0,
    ordersThisMonth: thisMonth._count._all,
    ordersLastMonth: prevMonth._count._all,
    openBalance: openBalanceAgg._sum.balanceCents ?? 0,
    topSalespersonName: topName,
    topSalespersonRevenue: topRevenue,
  };
}

export async function revenueOverTime(now = new Date(), days = 90) {
  const start = subDays(now, days);
  const orders = await prisma.order.findMany({
    where: { ...ACTIVE, dateOfSale: { gte: start, lte: now } },
    select: { dateOfSale: true, totalCents: true },
  });
  const byDay = new Map<string, number>();
  for (const o of orders) {
    const k = format(o.dateOfSale, "yyyy-MM-dd");
    byDay.set(k, (byDay.get(k) ?? 0) + o.totalCents);
  }
  return eachDayOfInterval({ start, end: now }).map((d) => {
    const k = format(d, "yyyy-MM-dd");
    return {
      date: k,
      label: format(d, "MMM d"),
      revenue: (byDay.get(k) ?? 0) / 100,
    };
  });
}

export async function revenueBySalesperson(now = new Date(), days = 90) {
  const start = subDays(now, days);
  const grouped = await prisma.order.groupBy({
    by: ["salespersonId"],
    where: { ...ACTIVE, dateOfSale: { gte: start, lte: now } },
    _sum: { totalCents: true },
    _count: { _all: true },
  });
  if (grouped.length === 0) return [];
  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map((g) => g.salespersonId) } },
    select: { id: true, fullName: true },
  });
  const byId = new Map(users.map((u) => [u.id, u.fullName]));
  return grouped
    .map((g) => ({
      salespersonId: g.salespersonId,
      salesperson: byId.get(g.salespersonId) ?? "—",
      revenue: (g._sum.totalCents ?? 0) / 100,
      orders: g._count._all,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export async function ordersBySource(now = new Date(), days = 90) {
  const start = subDays(now, days);
  const grouped = await prisma.order.groupBy({
    by: ["advertisingSourceId"],
    where: { ...ACTIVE, dateOfSale: { gte: start, lte: now } },
    _sum: { totalCents: true },
    _count: { _all: true },
  });
  if (grouped.length === 0) return [];
  const ids = grouped.map((g) => g.advertisingSourceId).filter((x): x is string => !!x);
  const sources = await prisma.advertisingSource.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
  const byId = new Map(sources.map((s) => [s.id, s.name]));
  return grouped.map((g) => ({
    source: g.advertisingSourceId ? byId.get(g.advertisingSourceId) ?? "—" : "(no source)",
    orders: g._count._all,
    revenue: (g._sum.totalCents ?? 0) / 100,
  }));
}

const CATEGORIES = [
  { key: "hasCabinet",    label: "Cabinet" },
  { key: "hasCarpet",     label: "Carpet" },
  { key: "hasVinyl",      label: "Vinyl" },
  { key: "hasWood",       label: "Wood" },
  { key: "hasCeramic",    label: "Ceramic" },
  { key: "hasCounterTop", label: "Counter Top" },
  { key: "hasFireplace",  label: "Fireplace" },
  { key: "hasShower",     label: "Shower" },
] as const;

export async function categoryMix(now = new Date(), months = 6) {
  const start = startOfMonth(subMonths(now, months - 1));
  const orders = await prisma.order.findMany({
    where: { ...ACTIVE, dateOfSale: { gte: start, lte: now } },
    select: {
      dateOfSale: true,
      hasCabinet: true, hasCarpet: true, hasVinyl: true, hasWood: true,
      hasCeramic: true, hasCounterTop: true, hasFireplace: true, hasShower: true,
    },
  });
  // bucket by yyyy-MM
  type Row = { month: string } & Record<string, number | string>;
  const map = new Map<string, Row>();
  for (let i = months - 1; i >= 0; i--) {
    const m = subMonths(now, i);
    const key = format(m, "yyyy-MM");
    const row: Row = { month: format(m, "MMM yy") };
    for (const c of CATEGORIES) row[c.label] = 0;
    map.set(key, row);
  }
  for (const o of orders) {
    const key = format(o.dateOfSale, "yyyy-MM");
    const row = map.get(key);
    if (!row) continue;
    for (const c of CATEGORIES) {
      if (o[c.key]) row[c.label] = (row[c.label] as number) + 1;
    }
  }
  return Array.from(map.values());
}

export const CATEGORY_LABELS = CATEGORIES.map((c) => c.label);
