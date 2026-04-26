import { Document, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import { centsToDollarString } from "@/lib/money";
import { lineCategoryLabel } from "@/lib/line-categories";
import { unitShort } from "@/lib/units";
import { inclusionLabel, exclusionLabel } from "@/lib/inclusions";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    lineItems: true;
    inclusions: true;
    exclusions: true;
    moldings: true;
    fixtures: true;
  };
}>;

export function WorkOrderPDF({
  order,
  showPrices,
  downloadedBy,
}: {
  order: FullOrder;
  showPrices: boolean;
  downloadedBy?: string;
}) {
  const cust = order.customer;

  return (
    <Document title={`USFKB Work Order ${order.invoiceNumber}`}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.bigTitle}>WORK ORDER</Text>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Field label="ORDER DATE">{format(order.dateOfSale, "MM/dd/yyyy")}</Field>
            <Field label="AVAILABILITY">
              {order.availabilityDate ? format(order.availabilityDate, "MM/dd/yyyy") : ""}
            </Field>
            <Field label="DELIV.">
              {order.deliveryDate ? format(order.deliveryDate, "MM/dd/yyyy") : ""}
            </Field>
            <Field label="ORDER TAKEN BY">{order.salesperson.fullName}</Field>
          </View>
          <View style={styles.col}>
            <Field label="INVOICE #">{String(order.invoiceNumber)}</Field>
            <Field label="SALES PERSON">{order.salesperson.fullName}</Field>
            <Field label="INSTALLER">{order.installerName ?? ""}</Field>
            <Field label="INSTALLATION DATE">
              {order.installationDate ? format(order.installationDate, "MM/dd/yyyy") : ""}
            </Field>
          </View>
        </View>

        {order.siteContactName || order.accessInstructions || !order.jobSiteSameAsBilling ? (
          <View style={{ borderWidth: 1, borderColor: COLORS.borderHeavy, padding: 6, marginVertical: 6 }}>
            <Text style={[styles.sectionLabel, { marginBottom: 2 }]}>SITE NOTES</Text>
            {!order.jobSiteSameAsBilling ? (
              <Text style={{ color: COLORS.muted }}>
                {order.jobSiteAddressLine1}, {order.jobSiteCity}, {order.jobSiteState} {order.jobSiteZip}
              </Text>
            ) : null}
            {order.siteContactName ? (
              <Text>Contact: {order.siteContactName}{order.siteContactPhone ? ` · ${order.siteContactPhone}` : ""}</Text>
            ) : null}
            {order.accessInstructions ? <Text>{order.accessInstructions}</Text> : null}
          </View>
        ) : (
          <View style={{ marginVertical: 6 }}>
            <Field label="SHIP TO">{`${cust.shipFirstName ?? cust.firstName} ${cust.shipLastName ?? cust.lastName}`}</Field>
            <Field label="ADDRESS">{cust.shipAddressLine1 ?? cust.addressLine1}</Field>
            <Field label="CITY, STATE, ZIP">
              {`${cust.shipCity ?? cust.city}, ${cust.shipState ?? cust.state} ${cust.shipZip ?? cust.zip}`}
            </Field>
            <Field label="PH (HM/WK)">{`${cust.phoneHome ?? ""} / ${cust.phoneWork ?? ""}`}</Field>
          </View>
        )}

        <View style={styles.tableHead}>
          <Text style={{ width: 60 }}>CATEGORY</Text>
          <Text style={{ flex: 1 }}>BRAND/STYLE</Text>
          <Text style={{ width: 60 }}>SIZE</Text>
          <Text style={{ width: 70 }}>COLOR</Text>
          <Text style={{ width: 50 }}>REF #</Text>
          <Text style={{ width: 30, textAlign: "right" }}>QTY</Text>
          <Text style={{ width: 28 }}>UNIT</Text>
        </View>
        {order.lineItems.slice(0, 8).map((li) => (
          <View key={li.id} style={styles.tableRow}>
            <Text style={{ width: 60 }}>{lineCategoryLabel(li.category)}</Text>
            <Text style={{ flex: 1 }}>{[li.brand, li.style].filter(Boolean).join(" — ")}</Text>
            <Text style={{ width: 60 }}>{li.sizeSpec ?? ""}</Text>
            <Text style={{ width: 70 }}>{li.color ?? ""}</Text>
            <Text style={{ width: 50 }}>{li.sku ?? ""}</Text>
            <Text style={{ width: 30, textAlign: "right" }}>{li.quantity ?? ""}</Text>
            <Text style={{ width: 28 }}>{unitShort(li.unit)}</Text>
          </View>
        ))}
        {order.lineItems.length > 8 ? (
          <Text style={{ marginTop: 4, color: COLORS.muted, fontStyle: "italic" }}>
            + {order.lineItems.length - 8} more, see invoice.
          </Text>
        ) : null}

        <View style={[styles.twoCol, { marginTop: 8 }]}>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Floor Condition</Text>
            <Text>Subfloor: {labelEnum(order.subfloorType)}</Text>
            <Text>Install Subfloor: {boolLabel(order.installSubfloor)}</Text>
            <Text>Pull Old Floor: {boolLabel(order.pullOldFloor)}{order.oldFloorType ? ` (${order.oldFloorType})` : ""}</Text>
            <Text style={[styles.sectionLabel, { marginTop: 6 }]}>Installation Method</Text>
            <Text>{labelEnum(order.installMethod)}</Text>
            <Text style={[styles.sectionLabel, { marginTop: 6 }]}>Special Instructions</Text>
            <Text style={{ color: COLORS.muted }}>{order.specialInstructions ?? ""}</Text>
          </View>
          {showPrices ? (
            <View style={[styles.col, styles.totalsBox]}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Sub-total</Text>
                <Text style={styles.totalsValue}>{centsToDollarString(order.subtotalCents)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Tax</Text>
                <Text style={styles.totalsValue}>{centsToDollarString(order.taxCents)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Total</Text>
                <Text style={styles.totalsValue}>{centsToDollarString(order.totalCents)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Deposit</Text>
                <Text style={styles.totalsValue}>{centsToDollarString(order.depositCents)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={[styles.totalsLabel, { fontFamily: "Helvetica-Bold" }]}>Balance</Text>
                <Text style={styles.totalsValue}>{centsToDollarString(order.balanceCents)}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.col}>
              <Text style={{ color: COLORS.muted, fontStyle: "italic" }}>
                Pricing redacted on the salesperson copy.
              </Text>
            </View>
          )}
        </View>

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

        <PdfFooter docType="Work Order" downloadedBy={downloadedBy} />
      </Page>
    </Document>
  );
}

function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <Text style={{ marginBottom: 2 }}>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>{label}: </Text>
      {children || ""}
    </Text>
  );
}

function boolLabel(v: boolean | null | undefined): string {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}

function labelEnum(v: string | null | undefined): string {
  if (!v) return "—";
  return v.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}
