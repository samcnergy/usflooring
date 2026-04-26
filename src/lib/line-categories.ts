// Display labels + verbs for the LineCategory enum.

import { LineCategory } from "@prisma/client";

export type LineCategorySpec = {
  value: LineCategory;
  label: string;
  /** Verb used by the scope generator: "U.S. Floor will {verb} carpet …" */
  verb: string;
  /** Generic noun when no brand/style is given. */
  genericNoun: string;
};

export const LINE_CATEGORIES: LineCategorySpec[] = [
  { value: LineCategory.cabinet,    label: "Cabinet",     verb: "supply and install",   genericNoun: "cabinets" },
  { value: LineCategory.carpet,     label: "Carpet",      verb: "supply and install",   genericNoun: "carpet" },
  { value: LineCategory.vinyl,      label: "Vinyl",       verb: "supply and install",   genericNoun: "vinyl plank" },
  { value: LineCategory.wood,       label: "Wood",        verb: "supply and install",   genericNoun: "wood flooring" },
  { value: LineCategory.ceramic,    label: "Ceramic",     verb: "supply and install",   genericNoun: "ceramic tile" },
  { value: LineCategory.counterTop, label: "Counter Top", verb: "fabricate and install", genericNoun: "counter tops" },
  { value: LineCategory.fireplace,  label: "Fireplace",   verb: "build",                genericNoun: "fireplace surround" },
  { value: LineCategory.shower,     label: "Shower",      verb: "build",                genericNoun: "shower" },
  { value: LineCategory.tile,       label: "Tile",        verb: "supply and install",   genericNoun: "tile" },
  { value: LineCategory.stone,      label: "Stone",       verb: "fabricate and install", genericNoun: "stone slabs" },
  { value: LineCategory.molding,    label: "Molding",     verb: "supply and install",   genericNoun: "molding" },
  { value: LineCategory.labor,      label: "Labor",       verb: "perform",              genericNoun: "labor" },
  { value: LineCategory.fixture,    label: "Fixture",     verb: "supply and install",   genericNoun: "fixtures" },
  { value: LineCategory.other,      label: "Other",       verb: "supply and install",   genericNoun: "the agreed work" },
];

export function lineCategoryLabel(value: LineCategory): string {
  return LINE_CATEGORIES.find((c) => c.value === value)?.label ?? String(value);
}

export function lineCategorySpec(value: LineCategory): LineCategorySpec {
  return LINE_CATEGORIES.find((c) => c.value === value) ?? LINE_CATEGORIES[LINE_CATEGORIES.length - 1];
}

/** The 8 categories shown as ticked checkboxes on the printed Invoice. */
export const PRINTED_CATEGORY_CHECKBOXES: { value: LineCategory; label: string }[] = [
  { value: LineCategory.cabinet,    label: "Cabinet" },
  { value: LineCategory.carpet,     label: "Carpet" },
  { value: LineCategory.vinyl,      label: "Vinyl" },
  { value: LineCategory.wood,       label: "Wood" },
  { value: LineCategory.ceramic,    label: "Ceramic" },
  { value: LineCategory.counterTop, label: "Counter Top" },
  { value: LineCategory.fireplace,  label: "Fireplace" },
  { value: LineCategory.shower,     label: "Shower" },
];
