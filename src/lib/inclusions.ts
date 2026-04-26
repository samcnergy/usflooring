// Display labels for the InclusionType / ExclusionType chips.

import { InclusionType, ExclusionType } from "@prisma/client";

export const INCLUSION_CHIPS: { value: InclusionType; label: string }[] = [
  { value: InclusionType.material,                       label: "Material" },
  { value: InclusionType.installation,                   label: "Installation" },
  { value: InclusionType.removalAndHaulAway,             label: "Removal & Haul Away" },
  { value: InclusionType.pad,                            label: "Pad" },
  { value: InclusionType.underlayment,                   label: "Underlayment" },
  { value: InclusionType.moveFurniture,                  label: "Move Furniture" },
  { value: InclusionType.demo,                           label: "Demo" },
  { value: InclusionType.sandAndCement,                  label: "Sand & Cement" },
  { value: InclusionType.hotMop,                         label: "Hot Mop" },
  { value: InclusionType.fabrication,                    label: "Fabrication" },
  { value: InclusionType.sinkCutOut,                     label: "Sink Cut Out" },
  { value: InclusionType.fullBacksplash,                 label: "Full Backsplash" },
  { value: InclusionType.straightEdgeNosing,             label: "Straight Edge Nosing" },
  { value: InclusionType.delivery,                       label: "Delivery" },
  { value: InclusionType.roughPlumbing,                  label: "Rough Plumbing" },
  { value: InclusionType.customerProvidedVanityInstall,  label: "Customer-Provided Vanity Install" },
];

export const EXCLUSION_CHIPS: { value: ExclusionType; label: string }[] = [
  { value: ExclusionType.plumbing,      label: "Plumbing" },
  { value: ExclusionType.patchAndPaint, label: "Patch & Paint" },
  { value: ExclusionType.electrical,    label: "Electrical" },
  { value: ExclusionType.leveling,      label: "Leveling" },
  { value: ExclusionType.permits,       label: "Permits" },
  { value: ExclusionType.disposal,      label: "Disposal" },
];

export function inclusionLabel(value: InclusionType): string {
  return INCLUSION_CHIPS.find((c) => c.value === value)?.label ?? String(value);
}

export function exclusionLabel(value: ExclusionType): string {
  return EXCLUSION_CHIPS.find((c) => c.value === value)?.label ?? String(value);
}

/** lowercased for use inside narrative sentences ("the price includes installation, …") */
export function inclusionPhrase(value: InclusionType): string {
  return inclusionLabel(value).toLowerCase();
}
export function exclusionPhrase(value: ExclusionType): string {
  return exclusionLabel(value).toLowerCase();
}
