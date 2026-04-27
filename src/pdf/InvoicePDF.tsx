import { Document, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import { centsToDollarString } from "@/lib/money";
import { roomLabel } from "@/lib/rooms";
import { lineCategoryLabel, PRINTED_CATEGORY_CHECKBOXES } from "@/lib/line-categories";
import { unitShort } from "@/lib/units";
import { inclusionLabel, exclusionLabel } from "@/lib/inclusions";
import { generateScopeOfWork } from "@/lib/scope";
import { PricingMode } from "@prisma/client";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    advertisingSource: true;
    rooms: true;
    lineItems: true;
    inclusions: true;
    exclusions: true;
  };
}>;

// Strip the **bold** markdown wrappers that the scope generator emits,
// since @react-pdf doesn't render markdown. (Bold formatting is sacrificed
// in the PDF — the readable text remains intact.)
function stripBoldMarkdown(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1");
}

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
  const categoriesUsed = new Set(order.lineItems.map((li) => li.category));
  const showPrices = order.pricingMode === PricingMode.itemized;

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

        {/* Sold to / Ship to / Job Site / Salesperson */}
        <View style={[styles.twoCol, { marginBottom: 4 }]}>
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
            {cust.shipPhone ? <Text style={{ color: COLORS.muted }}>{cust.shipPhone}</Text> : null}
            <Text style={{ marginTop: 6, color: COLORS.muted }}>SALESPERSON: {order.salesperson.fullName}</Text>
          </View>
        </View>

        {!order.jobSiteSameAsBilling || order.siteContactName || order.accessInstructions ? (
          <View style={{ borderTopWidth: 0.5, borderColor: COLORS.borderLight, paddingTop: 4, marginBottom: 4 }}>
            <Text style={styles.sectionLabel}>JOB SITE:</Text>
            {!order.jobSiteSameAsBilling ? (
              <Text style={{ color: COLORS.muted }}>
                {order.jobSiteAddressLine1}, {order.jobSiteCity}, {order.jobSiteState} {order.jobSiteZip}
              </Text>
            ) : null}
            {order.siteContactName ? (
              <Text style={{ color: COLORS.muted }}>
                Contact: {order.siteContactName}{order.siteContactPhone ? ` · ${order.siteContactPhone}` : ""}
              </Text>
            ) : null}
            {order.accessInstructions ? (
              <Text style={{ color: COLORS.muted }}>Access: {order.accessInstructions}</Text>
            ) : null}
          </View>
        ) : null}

        {/* Categories (derived from line items) */}
        <View style={styles.categoryRow}>
          {PRINTED_CATEGORY_CHECKBOXES.map((c) => (
            <View key={c.value} style={styles.categoryItem}>
              <View style={categoriesUsed.has(c.value) ? styles.checkBoxFilled : styles.checkBox} />
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{c.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Rooms summary */}
        {order.rooms.length > 0 ? (
          <View style={{ marginBottom: 6 }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              ROOMS:{" "}
              <Text style={{ fontFamily: "Helvetica" }}>
                {order.rooms.map((r) => `${roomLabel(r.room)}${r.quantity ? ` × ${r.quantity}` : ""}`).join(", ")}
              </Text>
            </Text>
          </View>
        ) : null}

        {/* Line items */}
        {order.lineItems.length > 0 ? (
          <>
            <View style={styles.tableHead}>
              <Text style={{ width: 56 }}>CATEGORY</Text>
              <Text style={{ flex: 1.2 }}>BRAND / STYLE</Text>
              <Text style={{ width: 70 }}>COLOR</Text>
              <Text style={{ width: 50 }}>SIZE</Text>
              <Text style={{ width: 30, textAlign: "right" }}>QTY</Text>
              <Text style={{ width: 30 }}>UNIT</Text>
              {showPrices ? <Text style={{ width: 56, textAlign: "right" }}>UNIT $</Text> : null}
              {showPrices ? <Text style={{ width: 56, textAlign: "right" }}>TOTAL</Text> : null}
            </View>
            {order.lineItems.map((li) => (
              <View key={li.id} style={styles.tableRow}>
                <Text style={{ width: 56 }}>{lineCategoryLabel(li.category)}</Text>
                <Text style={{ flex: 1.2, color: COLORS.muted }}>
                  {[li.brand, li.style].filter(Boolean).join(" — ")}
                </Text>
                <Text style={{ width: 70, color: COLORS.muted }}>{li.color ?? ""}</Text>
                <Text style={{ width: 50, color: COLORS.muted }}>{li.sizeSpec ?? ""}</Text>
                <Text style={{ width: 30, textAlign: "right" }}>{li.quantity ?? ""}</Text>
                <Text style={{ width: 30 }}>{unitShort(li.unit)}</Text>
                {showPrices ? <Text style={{ width: 56, textAlign: "right" }}>{li.unitPriceCents != null ? centsToDollarString(li.unitPriceCents) : ""}</Text> : null}
                {showPrices ? <Text style={{ width: 56, textAlign: "right" }}>{li.lineTotalCents != null ? centsToDollarString(li.lineTotalCents) : ""}</Text> : null}
              </View>
            ))}
          </>
        ) : null}

        {/* Inclusions / Exclusions */}
        {(order.inclusions.length > 0 || order.exclusions.length > 0) ? (
          <View style={{ marginTop: 8 }}>
            {order.inclusions.length > 0 ? (
              <Text style={{ marginBottom: 3 }}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Price includes: </Text>
                {order.inclusions.map((i) => i.type === "customNote" ? i.customText : inclusionLabel(i.type)).filter(Boolean).join(", ")}.
              </Text>
            ) : null}
            {order.exclusions.length > 0 ? (
              <Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Not included: </Text>
                {order.exclusions.map((e) => e.type === "customNote" ? e.customText : exclusionLabel(e.type)).filter(Boolean).join(", ")}.
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Scope of Work — between line items/inclusions and totals. */}
        <View style={{ marginTop: 10, paddingTop: 6, borderTopWidth: 0.5, borderColor: COLORS.borderLight }}>
          <Text style={[styles.sectionLabel, { color: COLORS.brand, fontSize: 10, marginBottom: 3 }]}>SCOPE OF WORK</Text>
          {(order.scopeOverride ?? generateScopeOfWork(order)).split(/\n\n+/).map((p, i) => (
            <Text key={i} style={{ marginBottom: 3 }}>{stripBoldMarkdown(p)}</Text>
          ))}
        </View>

        {/* Remarks + Totals */}
        <View style={[styles.twoCol, { marginTop: 8 }]}>
          <View style={styles.col}>
            {order.remarks ? <Text style={{ marginTop: 4 }}>Remarks: {order.remarks}</Text> : null}
            {order.depositInstructions ? <Text style={{ marginTop: 4, fontStyle: "italic" }}>Deposit: {order.depositInstructions}</Text> : null}
          </View>
          <View style={[styles.col, styles.totalsBox]}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>SUB-TOTAL</Text>
              <Text style={styles.totalsValue}>{centsToDollarString(order.subtotalCents)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>TAX ({order.taxPercent.toFixed(2)}%)</Text>
              <Text style={styles.totalsValue}>{centsToDollarString(order.taxCents)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, { fontFamily: "Helvetica-Bold" }]}>TOTAL</Text>
              <Text style={styles.totalsValue}>{centsToDollarString(order.totalCents)}</Text>
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
