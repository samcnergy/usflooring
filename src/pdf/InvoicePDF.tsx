import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import { ORDER_AREAS } from "@/lib/order-areas";
import { centsToDollarString } from "@/lib/money";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    advertisingSource: true;
    areas: true;
  };
}>;

const balanceTermLabels: Record<string, string> = {
  cash: "Cash",
  cod: "C.O.D.",
  finance: "Finance",
};

export function InvoicePDF({
  order,
  downloadedBy,
}: {
  order: FullOrder;
  downloadedBy?: string;
}) {
  const cust = order.customer;
  const cats: { key: string; label: string; on: boolean }[] = [
    { key: "cab", label: "Cabinet",    on: order.hasCabinet },
    { key: "car", label: "CARPET",     on: order.hasCarpet },
    { key: "vin", label: "VINYL",      on: order.hasVinyl },
    { key: "wod", label: "WOOD",       on: order.hasWood },
    { key: "cer", label: "CERAMIC",    on: order.hasCeramic },
    { key: "ctp", label: "COUNTER TOP", on: order.hasCounterTop },
    { key: "fpl", label: "FIREPLACE",  on: order.hasFireplace },
    { key: "shw", label: "SHOWER",     on: order.hasShower },
  ];

  return (
    <Document title={`USFKB Invoice ${order.invoiceNumber}`}>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: COLORS.brand }}>
              U.S. Floor, Kitchen &amp; Bath
            </Text>
          </View>
          <View style={styles.invoiceBox}>
            <View style={styles.invoiceLabelRow}>
              <Text>DATE OF SALE</Text>
              <Text>INVOICE NUMBER</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text>{format(order.dateOfSale, "MM/dd/yyyy")}</Text>
              <Text style={styles.invoiceNumber}>{order.invoiceNumber}</Text>
            </View>
            <View style={{ marginTop: 4, paddingTop: 3, borderTopWidth: 0.5, borderColor: COLORS.borderHeavy }}>
              <Text style={{ fontSize: 7, color: COLORS.muted }}>DEPOSIT / USE TOWARD MATERIAL</Text>
              <Text>{centsToDollarString(order.depositCents)}</Text>
            </View>
            <View style={{ marginTop: 4, paddingTop: 3, borderTopWidth: 0.5, borderColor: COLORS.borderHeavy }}>
              <Text style={{ fontSize: 7, color: COLORS.muted }}>ADV. SOURCE</Text>
              <Text>{order.advertisingSource?.name ?? "—"}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.brandText}>
          30092 Santa Margarita Pkwy #G &middot; R.S.M. CA 92688{"\n"}
          Tel: 949-589-9226 &middot; Fax: 949-589-9216 &middot; usfloorkb.com
        </Text>

        {/* Sold to / Ship to */}
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>SOLD TO:</Text>
            <Text>{cust.firstName} {cust.lastName}</Text>
            <Text style={{ color: COLORS.muted }}>{cust.addressLine1}</Text>
            <Text style={{ color: COLORS.muted }}>{cust.city}, {cust.state} {cust.zip}</Text>
            {cust.phoneHome ? <Text style={{ color: COLORS.muted }}>PH (HM): {cust.phoneHome}</Text> : null}
            {cust.phoneWork ? <Text style={{ color: COLORS.muted }}>PH (WK): {cust.phoneWork}{cust.phoneExt ? ` x${cust.phoneExt}` : ""}</Text> : null}
            {cust.email ? <Text style={{ color: COLORS.muted }}>{cust.email}</Text> : null}
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>SHIP TO:</Text>
            <Text>{cust.shipFirstName ?? cust.firstName} {cust.shipLastName ?? cust.lastName}</Text>
            <Text style={{ color: COLORS.muted }}>{cust.shipAddressLine1 ?? cust.addressLine1}</Text>
            <Text style={{ color: COLORS.muted }}>
              {(cust.shipCity ?? cust.city)}, {(cust.shipState ?? cust.state)} {(cust.shipZip ?? cust.zip)}
            </Text>
            {cust.shipPhone ? <Text style={{ color: COLORS.muted }}>PH (HM): {cust.shipPhone}</Text> : null}
            <Text style={{ marginTop: 6, color: COLORS.muted }}>SALESPERSON: {order.salesperson.fullName}</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoryRow}>
          {cats.map((c) => (
            <View key={c.key} style={styles.categoryItem}>
              <View style={c.on ? styles.checkBoxFilled : styles.checkBox} />
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{c.label}</Text>
            </View>
          ))}
        </View>

        {/* Areas table */}
        <View style={styles.tableHead}>
          <Text style={{ width: 80 }}>AREA</Text>
          <Text style={{ width: 18 }}>#</Text>
          <Text style={{ flex: 1.4 }}>DESCRIPTION OF WORK</Text>
          <Text style={{ flex: 1 }}>MATERIAL</Text>
          <Text style={{ width: 60 }}>COLOR</Text>
          <Text style={{ width: 50 }}>SIZE</Text>
          <Text style={{ width: 60, textAlign: "right" }}>TOTAL</Text>
        </View>
        {ORDER_AREAS.map((spec) => {
          const a = order.areas.find((x) => x.areaName === spec.value);
          const filled =
            a &&
            (a.quantity != null || a.description || a.material || a.color || a.size || a.lineTotalCents > 0);
          return (
            <View key={spec.value} style={styles.tableRow}>
              <Text style={{ width: 80 }}>{spec.label}</Text>
              <Text style={{ width: 18 }}>{a?.quantity ?? ""}</Text>
              <Text style={{ flex: 1.4, color: COLORS.muted }}>{a?.description ?? ""}</Text>
              <Text style={{ flex: 1, color: COLORS.muted }}>{a?.material ?? ""}</Text>
              <Text style={{ width: 60, color: COLORS.muted }}>{a?.color ?? ""}</Text>
              <Text style={{ width: 50, color: COLORS.muted }}>{a?.size ?? ""}</Text>
              <Text style={{ width: 60, textAlign: "right" }}>
                {filled ? centsToDollarString(a!.lineTotalCents) : ""}
              </Text>
            </View>
          );
        })}

        {/* Based-on / Remarks + Totals */}
        <View style={[styles.twoCol, { marginTop: 8 }]}>
          <View style={styles.col}>
            <Text>
              Based on{" "}
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {order.basedOn ?? "_______________"}
              </Text>
              {" "}— Square Yards / Square Feet / Total — Subject to measurement
            </Text>
            {order.remarks ? (
              <Text style={{ marginTop: 4 }}>Remarks: {order.remarks}</Text>
            ) : null}
          </View>
          <View style={[styles.col, styles.totalsBox]}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>TOTAL</Text>
              <Text style={styles.totalsValue}>{centsToDollarString(order.subtotalCents)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>TAX ({order.taxPercent.toFixed(2)}%)</Text>
              <Text style={styles.totalsValue}>{centsToDollarString(order.taxCents)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>SUB-TOTAL</Text>
              <Text style={styles.totalsValue}>{centsToDollarString(order.subtotalCents + order.taxCents)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>DEPOSIT</Text>
              <Text style={styles.totalsValue}>{centsToDollarString(order.depositCents)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, { fontFamily: "Helvetica-Bold" }]}>BALANCE</Text>
              <Text style={styles.totalsValue}>{centsToDollarString(order.balanceCents)}</Text>
            </View>
            <Text style={{ marginTop: 4, color: COLORS.muted }}>
              BALANCE TERMS: {order.balanceTerm ? balanceTermLabels[order.balanceTerm] : "□ CASH  □ C.O.D.  □ FINANCE"}
            </Text>
          </View>
        </View>

        {/* Legal */}
        <Text style={styles.legalText}>
          DEPOSIT REQUIRED ON ALL INVOICES, NOT SUBJECT TO CANCELLATION. NO REFUNDS ON SPECIAL ORDERS OR CUT MERCHANDISE.
          ONE YEAR LABOR GUARANTEE. TIME OF INSTALLATION IS NOT GUARANTEED. U.S. FLOOR COVERING IS NOT RESPONSIBLE FOR
          FACTORY DELAY. DIFFERENT DYE LOTS SUBJECT TO COLOR VARIATIONS.{"\n\n"}
          Customer(s) grants Seller a Security interest in the goods or property being purchased (see reverse.) If any
          payment of the purchase price is not made when due, the Seller shall have the right to repossess property of
          enforce its Mechanic&apos;s lien rights. If Seller is obliged to assign counsel to collect monies due it under the
          contract, the Customers to pay all of attorney&apos;s billable hours and collection/court costs as incurred by Seller.
          Interest will be charged at maximum legal rate on all past due.
        </Text>

        {/* Signature row */}
        <View style={[styles.twoCol, { marginTop: 6 }]}>
          <View style={styles.col}>
            <View style={styles.signatureBox}>
              <Text style={{ color: COLORS.muted }}>CUSTOMER(S) SIGNATURE</Text>
            </View>
          </View>
          <View style={styles.col}>
            <View style={styles.signatureBox}>
              <Text style={{ color: COLORS.muted }}>DATE</Text>
            </View>
          </View>
        </View>

        <PdfFooter docType="Invoice" downloadedBy={downloadedBy} />
      </Page>
    </Document>
  );
}
