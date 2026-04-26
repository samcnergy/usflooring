// Aggregated, anonymized snapshot of orders sent to Claude for the
// admin's business-analysis runs. NEVER includes raw customer PII.

import { prisma } from "./prisma";
import { centsToDollarString } from "./money";
import { format, differenceInDays, subDays } from "date-fns";

const ACTIVE = { deletedAt: null };

export type Snapshot = {
  range: { startISO: string; endISO: string; days: number };
  totals: {
    revenue: string;
    orderCount: number;
    avgOrderValue: string;
    voidedRate: string;
  };
  bySalesperson: { name: string; revenue: string; orders: number; avg: string }[];
  byAdSource: { name: string; revenue: string; orders: number; impliedConversion: string }[];
  categoryMixPct: { category: string; pctOfRevenue: string }[];
  topAreasByFrequency: { area: string; count: number }[];
  topAreasByRevenue: { area: string; revenue: string }[];
  openBalance: { total: string; aging: { bucket: string; total: string; orderCount: number }[] };
};

export async function buildSnapshot(start: Date, end: Date): Promise<Snapshot> {
  const days = differenceInDays(end, start);

  const allInRange = await prisma.order.findMany({
    where: { ...ACTIVE, dateOfSale: { gte: start, lte: end } },
    include: {
      salesperson: { select: { fullName: true } },
      advertisingSource: { select: { name: true } },
      lineItems: { select: { category: true, lineTotalCents: true } },
      rooms: { select: { room: true } },
    },
  });

  const nonVoided = allInRange.filter((o) => o.status !== "voided");
  const totalRev = nonVoided.reduce((s, o) => s + o.totalCents, 0);
  const orderCount = nonVoided.length;
  const avg = orderCount > 0 ? Math.round(totalRev / orderCount) : 0;
  const voidedCount = allInRange.filter((o) => o.status === "voided").length;
  const voidedRate = allInRange.length > 0
    ? `${((voidedCount / allInRange.length) * 100).toFixed(1)}%`
    : "0.0%";

  // by salesperson
  const sMap = new Map<string, { rev: number; n: number }>();
  for (const o of nonVoided) {
    const k = o.salesperson.fullName;
    const cur = sMap.get(k) ?? { rev: 0, n: 0 };
    cur.rev += o.totalCents;
    cur.n += 1;
    sMap.set(k, cur);
  }
  const bySalesperson = Array.from(sMap.entries())
    .map(([name, v]) => ({
      name,
      revenue: centsToDollarString(v.rev),
      orders: v.n,
      avg: centsToDollarString(Math.round(v.rev / v.n)),
    }))
    .sort((a, b) => parseDollar(b.revenue) - parseDollar(a.revenue));

  // by ad source
  const aMap = new Map<string, { rev: number; n: number }>();
  for (const o of nonVoided) {
    const k = o.advertisingSource?.name ?? "(no source)";
    const cur = aMap.get(k) ?? { rev: 0, n: 0 };
    cur.rev += o.totalCents;
    cur.n += 1;
    aMap.set(k, cur);
  }
  const byAdSource = Array.from(aMap.entries())
    .map(([name, v]) => ({
      name,
      revenue: centsToDollarString(v.rev),
      orders: v.n,
      impliedConversion: v.n > 0 ? centsToDollarString(Math.round(v.rev / v.n)) : "$0.00",
    }))
    .sort((a, b) => parseDollar(b.revenue) - parseDollar(a.revenue));

  // category mix (% of revenue) — sum of line-item totals per category /
  // total revenue. A line item with no totals (qty/price not set) contributes 0.
  const catRevenue = new Map<string, number>();
  for (const o of nonVoided) {
    for (const li of o.lineItems) {
      const cur = catRevenue.get(li.category) ?? 0;
      catRevenue.set(li.category, cur + (li.lineTotalCents ?? 0));
    }
  }
  const categoryMixPct = Array.from(catRevenue.entries())
    .map(([category, sum]) => ({
      category,
      pctOfRevenue: (totalRev > 0 ? (sum / totalRev) * 100 : 0).toFixed(1) + "%",
    }))
    .sort((a, b) => parseFloat(b.pctOfRevenue) - parseFloat(a.pctOfRevenue));

  // rooms touched (replaces the old areas-frequency calc)
  const roomFreq = new Map<string, number>();
  for (const o of nonVoided) {
    for (const r of o.rooms) {
      roomFreq.set(r.room, (roomFreq.get(r.room) ?? 0) + 1);
    }
  }
  const topAreasByFrequency = Array.from(roomFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([area, count]) => ({ area, count }));
  // Per-room revenue is no longer trivially computable (revenue lives on line
  // items, rooms are a checklist). Approximate: distribute order revenue evenly
  // across the rooms touched.
  const roomRev = new Map<string, number>();
  for (const o of nonVoided) {
    if (o.rooms.length === 0) continue;
    const share = Math.round(o.totalCents / o.rooms.length);
    for (const r of o.rooms) {
      roomRev.set(r.room, (roomRev.get(r.room) ?? 0) + share);
    }
  }
  const topAreasByRevenue = Array.from(roomRev.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([area, rev]) => ({ area, revenue: centsToDollarString(rev) }));

  // open balance + aging (against ALL non-paid/non-voided orders, regardless of range)
  const openOrders = await prisma.order.findMany({
    where: { deletedAt: null, status: { notIn: ["voided", "paid"] } },
    select: { dateOfSale: true, balanceCents: true },
  });
  const buckets = [
    { name: "0–30 days", min: 0, max: 30 },
    { name: "31–60 days", min: 31, max: 60 },
    { name: "61–90 days", min: 61, max: 90 },
    { name: "90+ days", min: 91, max: Number.POSITIVE_INFINITY },
  ];
  const aging = buckets.map((b) => {
    const inBucket = openOrders.filter((o) => {
      const age = differenceInDays(new Date(), o.dateOfSale);
      return age >= b.min && age <= b.max;
    });
    return {
      bucket: b.name,
      total: centsToDollarString(inBucket.reduce((s, o) => s + o.balanceCents, 0)),
      orderCount: inBucket.length,
    };
  });

  return {
    range: { startISO: format(start, "yyyy-MM-dd"), endISO: format(end, "yyyy-MM-dd"), days },
    totals: {
      revenue: centsToDollarString(totalRev),
      orderCount,
      avgOrderValue: centsToDollarString(avg),
      voidedRate,
    },
    bySalesperson,
    byAdSource,
    categoryMixPct,
    topAreasByFrequency,
    topAreasByRevenue,
    openBalance: {
      total: centsToDollarString(openOrders.reduce((s, o) => s + o.balanceCents, 0)),
      aging,
    },
  };
}

function parseDollar(s: string) {
  return Number(s.replace(/[$,]/g, ""));
}

export function defaultDateRange(days = 90) {
  const end = new Date();
  const start = subDays(end, days);
  return { start, end };
}
