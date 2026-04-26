// Room display labels + natural English ordering. Used by the form (checkbox
// grid) and by the scope generator (sentences read in this order).

import { RoomName } from "@prisma/client";

export type RoomSpec = {
  value: RoomName;
  label: string;
  /** Rooms that are usually counted (Bedroom × 2, Closets × 4). */
  countable: boolean;
};

export const ROOMS: RoomSpec[] = [
  { value: RoomName.livingRoom, label: "Living Room", countable: false },
  { value: RoomName.diningRoom, label: "Dining Room", countable: false },
  { value: RoomName.familyRoom, label: "Family Room", countable: false },
  { value: RoomName.kitchen,    label: "Kitchen",     countable: false },
  { value: RoomName.bathroom,   label: "Bathroom(s)", countable: true  },
  { value: RoomName.masterBath, label: "Master Bath", countable: false },
  { value: RoomName.bedroom,    label: "Bedroom(s)",  countable: true  },
  { value: RoomName.closet,     label: "Closet(s)",   countable: true  },
  { value: RoomName.hall,       label: "Hall",        countable: false },
  { value: RoomName.entrance,   label: "Entrance",    countable: false },
  { value: RoomName.den,        label: "Den",         countable: false },
  { value: RoomName.office,     label: "Office",      countable: false },
  { value: RoomName.laundry,    label: "Laundry",     countable: false },
  { value: RoomName.stairs,     label: "Stairs",      countable: false },
  { value: RoomName.downstairs, label: "Downstairs",  countable: false },
  { value: RoomName.upstairs,   label: "Upstairs",    countable: false },
  { value: RoomName.outside,    label: "Outside",     countable: false },
  { value: RoomName.other,      label: "Other",       countable: false },
];

export function roomLabel(value: RoomName): string {
  return ROOMS.find((r) => r.value === value)?.label ?? String(value);
}

/**
 * Render a room reference for the scope-of-work narrative.
 *   { room: bedroom, quantity: 2 }       → "2 bedrooms"
 *   { room: bedroom, quantity: 1 }       → "1 bedroom"
 *   { room: bedroom, quantity: null }    → "the bedroom"
 *   { room: livingRoom, quantity: null } → "the living room"
 */
export function roomNarrative(room: RoomName, quantity: number | null | undefined): string {
  const spec = ROOMS.find((r) => r.value === room);
  if (!spec) return String(room);
  const baseSingular = spec.label.replace(/\(s\)/g, "").toLowerCase();
  const basePlural = baseSingular + "s";
  if (quantity != null && quantity > 0) {
    return `${quantity} ${quantity === 1 ? baseSingular : basePlural}`;
  }
  // No count: definite article. Multi-word labels keep their casing minus the parens.
  const article = baseSingular === "outside" || baseSingular === "downstairs" || baseSingular === "upstairs" ? "" : "the ";
  return `${article}${baseSingular}`.trim();
}
