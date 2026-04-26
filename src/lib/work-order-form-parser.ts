import { workOrderInput, type WorkOrderInputParsed } from "./work-order-schema";

function s(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export function parseWorkOrderForm(formData: FormData):
  | { ok: true; data: WorkOrderInputParsed }
  | { ok: false; errors: Record<string, string>; message?: string } {
  const materials = [1, 2, 3, 4].map((n) => ({
    lineNumber:     n,
    millStyle:      s(formData, `mat_${n}_millStyle`),
    size:           s(formData, `mat_${n}_size`),
    color:          s(formData, `mat_${n}_color`),
    refNumber:      s(formData, `mat_${n}_refNumber`),
    pad:            s(formData, `mat_${n}_pad`),
    areas:          s(formData, `mat_${n}_areas`),
    vendorName:     s(formData, `mat_${n}_vendorName`),
    unitOfMeasure:  s(formData, `mat_${n}_unitOfMeasure`),
    quantity:       s(formData, `mat_${n}_quantity`),
    unitPriceCents: s(formData, `mat_${n}_unitPrice`),
  }));

  const raw = {
    availabilityDate: s(formData, "availabilityDate"),
    deliveryDate:     s(formData, "deliveryDate"),
    installerName:    s(formData, "installerName"),
    installationDate: s(formData, "installationDate"),
    subfloorType:     s(formData, "subfloorType") || null,
    installSubfloor:  s(formData, "installSubfloor"),
    pullOldFloor:     s(formData, "pullOldFloor"),
    oldFloorType:     s(formData, "oldFloorType"),
    oldFloorSize:     s(formData, "oldFloorSize"),
    installMethod:    s(formData, "installMethod") || null,
    carpetType:       s(formData, "carpetType") || null,
    specialInstructions: s(formData, "specialInstructions"),
    materials,
  };

  const parsed = workOrderInput.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors, message: "Please fix the highlighted fields." };
  }
  return { ok: true, data: parsed.data };
}
