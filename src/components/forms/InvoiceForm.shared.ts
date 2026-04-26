// Types + factories shared between server components (which compute the
// initial values for the form) and the InvoiceForm client component (which
// renders them). Lives outside the "use client" file so server components
// can call these functions during SSR without tripping Next.js's
// client/server boundary check.

import { ORDER_AREAS } from "@/lib/order-areas";

export type OrderInitialValues = {
  id?: string;
  invoiceNumber?: number;
  salespersonId: string;
  advertisingSourceId: string | null;
  dateOfSale: string;          // yyyy-mm-dd
  firstName: string;
  lastName: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  phoneHome: string;
  phoneWork: string;
  phoneExt: string;
  email: string;
  sameAsSoldTo: boolean;
  shipFirstName: string;
  shipLastName: string;
  shipAddressLine1: string;
  shipCity: string;
  shipState: string;
  shipZip: string;
  shipPhone: string;
  hasCabinet: boolean;
  hasCarpet: boolean;
  hasVinyl: boolean;
  hasWood: boolean;
  hasCeramic: boolean;
  hasCounterTop: boolean;
  hasFireplace: boolean;
  hasShower: boolean;
  areas: {
    areaName: string;
    quantity: string;
    description: string;
    material: string;
    color: string;
    size: string;
    lineTotal: string;
  }[];
  taxCents: string;
  depositCents: string;
  basedOn: string;
  remarks: string;
  balanceTerm: "" | "cash" | "cod" | "finance";
};

export type ActionState =
  | { ok: true; orderId: string }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export const emptyInitialValues = (defaultSalespersonId: string): OrderInitialValues => ({
  salespersonId: defaultSalespersonId,
  advertisingSourceId: null,
  dateOfSale: new Date().toISOString().slice(0, 10),
  firstName: "", lastName: "", addressLine1: "",
  city: "", state: "CA", zip: "",
  phoneHome: "", phoneWork: "", phoneExt: "", email: "",
  sameAsSoldTo: true,
  shipFirstName: "", shipLastName: "", shipAddressLine1: "",
  shipCity: "", shipState: "CA", shipZip: "", shipPhone: "",
  hasCabinet: false, hasCarpet: false, hasVinyl: false, hasWood: false,
  hasCeramic: false, hasCounterTop: false, hasFireplace: false, hasShower: false,
  areas: ORDER_AREAS.map((a) => ({
    areaName: a.value, quantity: "", description: "",
    material: "", color: "", size: "",
    lineTotal: "",
  })),
  taxCents: "", depositCents: "",
  basedOn: "", remarks: "", balanceTerm: "",
});

export function orderToInitial(order: {
  id: string;
  invoiceNumber: number;
  salespersonId: string;
  advertisingSourceId: string | null;
  dateOfSale: Date;
  hasCabinet: boolean; hasCarpet: boolean; hasVinyl: boolean; hasWood: boolean;
  hasCeramic: boolean; hasCounterTop: boolean; hasFireplace: boolean; hasShower: boolean;
  taxCents: number; depositCents: number;
  basedOn: string | null; remarks: string | null; balanceTerm: "cash" | "cod" | "finance" | null;
  customer: {
    firstName: string; lastName: string; addressLine1: string; city: string; state: string; zip: string;
    phoneHome: string | null; phoneWork: string | null; phoneExt: string | null; email: string | null;
    shipFirstName: string | null; shipLastName: string | null; shipAddressLine1: string | null;
    shipCity: string | null; shipState: string | null; shipZip: string | null; shipPhone: string | null;
  };
  areas: {
    areaName: string;
    quantity: number | null;
    description: string | null;
    material: string | null;
    color: string | null;
    size: string | null;
    lineTotalCents: number;
  }[];
}): OrderInitialValues {
  const ship = order.customer;
  const same =
    ship.shipFirstName === order.customer.firstName &&
    ship.shipLastName  === order.customer.lastName  &&
    ship.shipAddressLine1 === order.customer.addressLine1;
  const moneyToInput = (cents: number) => (cents ? (cents / 100).toFixed(2) : "");
  return {
    id: order.id,
    invoiceNumber: order.invoiceNumber,
    salespersonId: order.salespersonId,
    advertisingSourceId: order.advertisingSourceId,
    dateOfSale: order.dateOfSale.toISOString().slice(0, 10),
    firstName: order.customer.firstName,
    lastName:  order.customer.lastName,
    addressLine1: order.customer.addressLine1,
    city:  order.customer.city,
    state: order.customer.state,
    zip:   order.customer.zip,
    phoneHome: order.customer.phoneHome ?? "",
    phoneWork: order.customer.phoneWork ?? "",
    phoneExt:  order.customer.phoneExt  ?? "",
    email:     order.customer.email     ?? "",
    sameAsSoldTo: same,
    shipFirstName: order.customer.shipFirstName ?? "",
    shipLastName:  order.customer.shipLastName  ?? "",
    shipAddressLine1: order.customer.shipAddressLine1 ?? "",
    shipCity:  order.customer.shipCity  ?? "",
    shipState: order.customer.shipState ?? "CA",
    shipZip:   order.customer.shipZip   ?? "",
    shipPhone: order.customer.shipPhone ?? "",
    hasCabinet: order.hasCabinet, hasCarpet: order.hasCarpet, hasVinyl: order.hasVinyl,
    hasWood: order.hasWood, hasCeramic: order.hasCeramic, hasCounterTop: order.hasCounterTop,
    hasFireplace: order.hasFireplace, hasShower: order.hasShower,
    areas: ORDER_AREAS.map((spec) => {
      const a = order.areas.find((x) => x.areaName === spec.value);
      return {
        areaName: spec.value,
        quantity: a?.quantity != null ? String(a.quantity) : "",
        description: a?.description ?? "",
        material: a?.material ?? "",
        color: a?.color ?? "",
        size: a?.size ?? "",
        lineTotal: a ? moneyToInput(a.lineTotalCents) : "",
      };
    }),
    taxCents:     moneyToInput(order.taxCents),
    depositCents: moneyToInput(order.depositCents),
    basedOn:     order.basedOn ?? "",
    remarks:     order.remarks ?? "",
    balanceTerm: order.balanceTerm ?? "",
  };
}
