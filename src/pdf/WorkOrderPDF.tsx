import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import { centsToDollarString } from "@/lib/money";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    materials: true;
    moldings: true;
    fixtures: true;
  };
}>;

// `showPrices` = admin only. The paper Work Order has no prices visible to
// the salesperson; we honor that here.

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

        {/* Top fields */}
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

        <View style={{ marginVertical: 6 }}>
          <Field label="SHIP TO">{`${cust.shipFirstName ?? cust.firstName} ${cust.shipLastName ?? cust.lastName}`}</Field>
          <Field label="ADDRESS">{cust.shipAddressLine1 ?? cust.addressLine1}</Field>
          <Field label="CITY, STATE, ZIP">
            {`${cust.shipCity ?? cust.city}, ${cust.shipState ?? cust.state} ${cust.shipZip ?? cust.zip}`}
          </Field>
          <Field label="PH (HM/WK)">{`${cust.phoneHome ?? ""} / ${cust.phoneWork ?? ""}`}</Field>
        </View>

        {/* Material lines (1-4). Will populate when capture lands; show 4 blank lines for now. */}
        <View style={styles.tableHead}>
          <Text style={{ width: 100 }}>MIL/STYLE</Text>
          <Text style={{ width: 60 }}>SIZE</Text>
          <Text style={{ width: 70 }}>COLOR</Text>
          <Text style={{ width: 50 }}>REF #</Text>
          <Text style={{ width: 50 }}>PAD</Text>
          <Text style={{ flex: 1 }}>AREAS</Text>
        </View>
        {Array.from({ length: 4 }).map((_, i) => {
          const m = order.materials.find((x) => x.lineNumber === i + 1);
          return (
            <View key={i} style={styles.tableRow}>
              <Text style={{ width: 100 }}>{m?.millStyle ?? ""}</Text>
              <Text style={{ width: 60 }}>{m?.size ?? ""}</Text>
              <Text style={{ width: 70 }}>{m?.color ?? ""}</Text>
              <Text style={{ width: 50 }}>{m?.refNumber ?? ""}</Text>
              <Text style={{ width: 50 }}>{m?.pad ?? ""}</Text>
              <Text style={{ flex: 1 }}>{m?.areas ?? ""}</Text>
            </View>
          );
        })}

        {/* Floor condition / install method / special instructions / totals */}
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
                <Text style={styles.totalsLabel}>Total</Text>
                <Text style={styles.totalsValue}>{centsToDollarString(order.subtotalCents)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Tax</Text>
                <Text style={styles.totalsValue}>{centsToDollarString(order.taxCents)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Subtotal</Text>
                <Text style={styles.totalsValue}>{centsToDollarString(order.subtotalCents + order.taxCents)}</Text>
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
  // crude enum → friendly label
  return v.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}
