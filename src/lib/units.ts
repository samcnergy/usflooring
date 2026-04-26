import { UnitOfMeasure } from "@prisma/client";

export const UNITS: { value: UnitOfMeasure; label: string; short: string }[] = [
  { value: UnitOfMeasure.sqft,     label: "Square feet",  short: "sqft"   },
  { value: UnitOfMeasure.sqyd,     label: "Square yards", short: "sqyd"   },
  { value: UnitOfMeasure.slab,     label: "Slab",         short: "slab"   },
  { value: UnitOfMeasure.box,      label: "Box",          short: "box"    },
  { value: UnitOfMeasure.piece,    label: "Piece",        short: "piece"  },
  { value: UnitOfMeasure.linearFt, label: "Linear feet",  short: "lin ft" },
  { value: UnitOfMeasure.each,     label: "Each",         short: "ea"     },
  { value: UnitOfMeasure.hour,     label: "Hour",         short: "hr"     },
  { value: UnitOfMeasure.lump,     label: "Lump sum",     short: "lump"   },
];

export function unitShort(value: UnitOfMeasure | null | undefined): string {
  if (!value) return "";
  return UNITS.find((u) => u.value === value)?.short ?? String(value);
}
