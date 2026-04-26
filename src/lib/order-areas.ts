// The 14 area-of-the-home rows from the paper invoice (page 1).

import { AreaName } from "@prisma/client";

export type AreaSpec = { value: AreaName; label: string };

export const ORDER_AREAS: AreaSpec[] = [
  { value: AreaName.livingRoom, label: "Living Room" },
  { value: AreaName.diningRoom, label: "Dining Room" },
  { value: AreaName.familyRoom, label: "Family Room" },
  { value: AreaName.hall,       label: "Hall" },
  { value: AreaName.bedroom,    label: "Bedroom(s)" },
  { value: AreaName.closet,     label: "Closet(s)" },
  { value: AreaName.entrance,   label: "Entrance" },
  { value: AreaName.bathroom,   label: "Bathroom(s)" },
  { value: AreaName.den,        label: "Den" },
  { value: AreaName.kitchen,    label: "Kitchen" },
  { value: AreaName.stairs,     label: "Stair(s)" },
  { value: AreaName.office,     label: "Office" },
  { value: AreaName.laundry,    label: "Laundry" },
  { value: AreaName.other,      label: "Other" },
];
