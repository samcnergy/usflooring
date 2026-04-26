// Auto-generated Scope of Work narrative from the structured Order data.
// Pure function, no IO, no Claude API. Deterministic — same input, same
// output. The salesperson can override per order via Order.scopeOverride.

import { ExclusionType, InclusionType, LineCategory, RoomName } from "@prisma/client";
import { lineCategorySpec } from "./line-categories";
import { ROOMS, roomNarrative } from "./rooms";
import { inclusionPhrase, exclusionPhrase } from "./inclusions";

type LineItem = {
  category: LineCategory;
  brand: string | null;
  style: string | null;
  color: string | null;
  sizeSpec: string | null;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
};

type Room = {
  room: RoomName;
  quantity: number | null;
  notes: string | null;
};

type Inclusion = { type: InclusionType; customText: string | null };
type Exclusion = { type: ExclusionType; customText: string | null };

export type ScopeOrder = {
  rooms: Room[];
  lineItems: LineItem[];
  inclusions: Inclusion[];
  exclusions: Exclusion[];
  remarks: string | null;
  depositInstructions: string | null;
};

const FALLBACK = "U.S. Floor will perform the work as detailed above.";
const HARD_WORD_CAP = 400;

export function generateScopeOfWork(order: ScopeOrder): string {
  const p1 = paragraph1(order);
  const p2 = paragraph2(order);
  const p3 = paragraph3(order);

  const parts = [p1, p2, p3].filter(Boolean);
  if (parts.length === 0) return FALLBACK;

  const joined = parts.join("\n\n");
  return capWords(joined, HARD_WORD_CAP);
}

// ---------- Paragraph 1: what we're doing and where ----------

function paragraph1(order: ScopeOrder): string {
  if (order.lineItems.length === 0 && order.rooms.length === 0) return "";

  const roomsText = describeRooms(order.rooms);

  if (order.lineItems.length === 0) {
    // Rooms only — too vague to invent specifics.
    return `U.S. Floor will perform the agreed work in ${roomsText || "the specified areas"}.`;
  }

  // Group line items by category and pick a single sentence per category.
  const byCat = new Map<LineCategory, LineItem[]>();
  for (const li of order.lineItems) {
    if (!byCat.has(li.category)) byCat.set(li.category, []);
    byCat.get(li.category)!.push(li);
  }

  const clauses: string[] = [];
  let lineCount = 0;
  for (const [cat, items] of byCat) {
    if (lineCount >= 6) {
      clauses.push("and additional materials as listed above");
      break;
    }
    clauses.push(describeCategoryClause(cat, items));
    lineCount += items.length;
  }

  let sentence = `U.S. Floor will ${joinList(clauses)}`;
  if (roomsText) sentence += ` in ${roomsText}`;
  sentence += ".";
  return sentence;
}

function describeCategoryClause(cat: LineCategory, items: LineItem[]): string {
  const spec = lineCategorySpec(cat);
  // Pick the most detailed item to name; collapse the rest into a count.
  const named = items.find((i) => i.brand || i.style) ?? items[0];
  const descriptors = [
    named.brand,
    named.style,
    named.color ? `color ${named.color}` : null,
    named.sizeSpec,
  ].filter(Boolean).join(", ");

  let phrase = `${spec.verb} ${spec.genericNoun}`;
  if (descriptors) phrase += ` (${descriptors})`;

  // If there's a meaningful quantity (e.g., "3 slabs"), surface it.
  const qtyItems = items.filter((i) => i.quantity != null && i.unit);
  if (qtyItems.length === 1) {
    const i = qtyItems[0];
    const unitWord = unitNarrative(i.unit, i.quantity!);
    if (unitWord) phrase += ` using ${i.quantity} ${unitWord}`;
  }
  if (items.length > 1) phrase += ` and ${items.length - 1} additional ${spec.genericNoun} ${items.length - 1 === 1 ? "line" : "lines"}`;
  return phrase;
}

function describeRooms(rooms: Room[]): string {
  if (rooms.length === 0) return "";
  // Sort by ROOMS order (natural English ordering)
  const order = ROOMS.map((r) => r.value);
  const sorted = [...rooms].sort(
    (a, b) => order.indexOf(a.room) - order.indexOf(b.room),
  );
  const phrases = sorted.map((r) => roomNarrative(r.room, r.quantity));
  return joinList(phrases);
}

function unitNarrative(unit: string | null, quantity: number): string | null {
  if (!unit) return null;
  const map: Record<string, [string, string]> = {
    sqft:     ["square foot", "square feet"],
    sqyd:     ["square yard", "square yards"],
    slab:     ["slab", "slabs"],
    box:      ["box", "boxes"],
    piece:    ["piece", "pieces"],
    linearFt: ["linear foot", "linear feet"],
    each:     ["", ""],
    hour:     ["hour", "hours"],
    lump:     ["", ""],
  };
  const [singular, plural] = map[unit] ?? ["", ""];
  if (!singular && !plural) return null;
  return quantity === 1 ? singular : plural;
}

// ---------- Paragraph 2: includes / excludes ----------

function paragraph2(order: ScopeOrder): string {
  const incs = order.inclusions;
  const excs = order.exclusions;
  if (incs.length === 0 && excs.length === 0) return "";

  const parts: string[] = [];

  if (incs.length > 0) {
    const chips = incs
      .filter((i) => i.type !== InclusionType.customNote)
      .map((i) => inclusionPhrase(i.type));
    const customs = incs
      .filter((i) => i.type === InclusionType.customNote && i.customText)
      .map((i) => i.customText!.trim());
    let s = "";
    if (chips.length > 0) s = `The price includes ${joinList(chips)}.`;
    for (const c of customs) {
      s = s ? `${s} ${c.endsWith(".") ? c : `${c}.`}` : c;
    }
    if (s) parts.push(s);
  }

  if (excs.length > 0) {
    const chips = excs
      .filter((e) => e.type !== ExclusionType.customNote)
      .map((e) => exclusionPhrase(e.type));
    const customs = excs
      .filter((e) => e.type === ExclusionType.customNote && e.customText)
      .map((e) => e.customText!.trim());
    let s = "";
    if (chips.length > 0) s = `**Not included:** ${joinList(chips)}.`;
    for (const c of customs) {
      s = s ? `${s} ${c.endsWith(".") ? c : `${c}.`}` : c;
    }
    if (s) parts.push(s);
  }

  return parts.join(" ");
}

// ---------- Paragraph 3: remarks + deposit ----------

function paragraph3(order: ScopeOrder): string {
  const parts: string[] = [];
  if (order.remarks?.trim()) {
    parts.push(`Additional notes: ${order.remarks.trim()}`);
  }
  if (order.depositInstructions?.trim()) {
    parts.push(`**Deposit:** ${order.depositInstructions.trim()}`);
  }
  return parts.join(" ");
}

// ---------- Helpers ----------

function joinList(items: string[]): string {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return "";
  if (filtered.length === 1) return filtered[0];
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(", ")}, and ${filtered[filtered.length - 1]}`;
}

function capWords(text: string, max: number): string {
  const words = text.split(/\s+/);
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ") + "…";
}
