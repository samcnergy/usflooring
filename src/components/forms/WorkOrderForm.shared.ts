// Shared types/factories for the Work Order form. Server components import
// from here; the WorkOrderForm.tsx ("use client") file imports + re-exports
// for client convenience.

export type WorkOrderInitialValues = {
  availabilityDate: string;
  deliveryDate: string;
  installerName: string;
  installationDate: string;
  subfloorType: string;
  installSubfloor: string;
  pullOldFloor: string;
  oldFloorType: string;
  oldFloorSize: string;
  installMethod: string;
  carpetType: string;
  specialInstructions: string;
  materials: {
    lineNumber: number;
    millStyle: string; size: string; color: string; refNumber: string;
    pad: string; areas: string; vendorName: string;
    unitOfMeasure: string; quantity: string; unitPrice: string;
  }[];
};

export type WorkOrderActionState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

const dateToInput = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");
const moneyToInput = (cents: number | null | undefined) => (cents ? (cents / 100).toFixed(2) : "");
const numToInput = (n: number | null | undefined) => (n != null ? String(n) : "");

export function workOrderToInitial(order: {
  availabilityDate: Date | null; deliveryDate: Date | null;
  installerName: string | null; installationDate: Date | null;
  subfloorType: string | null;
  installSubfloor: boolean | null; pullOldFloor: boolean | null;
  oldFloorType: string | null; oldFloorSize: string | null;
  installMethod: string | null; specialInstructions: string | null;
  materials: {
    lineNumber: number;
    millStyle: string | null; size: string | null; color: string | null;
    refNumber: string | null; pad: string | null; areas: string | null;
    vendorName: string | null; carpetType: string | null;
    unitOfMeasure: string | null; quantity: number | null;
    unitPriceCents: number | null;
  }[];
}): WorkOrderInitialValues {
  const carpetType = order.materials.find((m) => m.carpetType)?.carpetType ?? "";
  return {
    availabilityDate: dateToInput(order.availabilityDate),
    deliveryDate:     dateToInput(order.deliveryDate),
    installerName:    order.installerName ?? "",
    installationDate: dateToInput(order.installationDate),
    subfloorType:     order.subfloorType ?? "",
    installSubfloor:  order.installSubfloor === null ? "" : String(order.installSubfloor),
    pullOldFloor:     order.pullOldFloor === null ? "" : String(order.pullOldFloor),
    oldFloorType:     order.oldFloorType ?? "",
    oldFloorSize:     order.oldFloorSize ?? "",
    installMethod:    order.installMethod ?? "",
    carpetType,
    specialInstructions: order.specialInstructions ?? "",
    materials: [1, 2, 3, 4].map((n) => {
      const m = order.materials.find((x) => x.lineNumber === n);
      return {
        lineNumber: n,
        millStyle: m?.millStyle ?? "",
        size:      m?.size ?? "",
        color:     m?.color ?? "",
        refNumber: m?.refNumber ?? "",
        pad:       m?.pad ?? "",
        areas:     m?.areas ?? "",
        vendorName:    m?.vendorName ?? "",
        unitOfMeasure: m?.unitOfMeasure ?? "",
        quantity:      numToInput(m?.quantity),
        unitPrice:     moneyToInput(m?.unitPriceCents),
      };
    }),
  };
}
