import { Document, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import { centsToDollarString } from "@/lib/money";
import { lineCategoryLabel } from "@/lib/line-categories";
import { unitShort } from "@/lib/units";
import { inclusionLabel, exclusionLabel } from "@/lib/inclusions";
import { generateScopeOfWork } from "@/lib/scope";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    rooms: true;
    lineItems: { include: { room: true } };
    inclusions: true;
    exclusions: true;
    moldings: true;
    fixtures: true;
  };
}>;

const CARPET_TYPE_LABELS: Record<string, string> = {
  plush: "Plush", berber: "Berber", glueDown: "Glue Down",
  plushWP: "Plush W/P", berberWP: "Berber W/P",
};

const INSTALL_METHOD_LABELS: Record<string, string> = {
  glueDown: "Glue Down", nailDown: "Nail Down", click: "Click",
  clip: "Clip", other: "Other",
};

const MOLDING_LABELS: Record<string, string> = {
  baseShoe: "Base Shoes", baseboard: "Baseboard", rubberCover4in: '4" Rubber Cover',
  quarterRound: "1/4 Round", wallBase: "Wall Base", filmOnly: "Film Only",
  filmAndFoam: "Film & Foam", endMolding: "End Molding", stairNosing: "Stair Nosing",
  tMolding: "T-Molding", reducer: "Reducer",
};

const FIXTURE_LABELS: Record<string, string> = {
  stove: "Stove", fridge: "Ref", washer: "Washer", dryer: "Dryer",
  waterbed: "Waterbed", piano: "Piano", organ: "Organ", tablesChairs: "Tables & Chairs",
  stool: "Stool", other: "Other",
};

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

  // Separate moldings: checkboxes vs. quantity fields
  const moldingCheckboxTypes = new Set(["baseShoe", "baseboard", "rubberCover4in"]);
  const checkboxMoldings = order.moldings.filter((m) => moldingCheckboxTypes.has(m.type));
  const quantityMoldings = order.moldings.filter((m) => !moldingCheckboxTypes.has(m.type) && m.quantity);

  const activeFixtures = order.fixtures.filter((f) =>
    ["stove", "fridge", "washer", "dryer", "waterbed", "piano", "organ", "tablesChairs"].includes(f.type)
  );

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

        {/* Line Items */}
        <View style={styles.tableHead}>
          <Text style={{ width: 56 }}>CATEGORY</Text>
          <Text style={{ flex: 1 }}>MILL/BRAND — STYLE</Text>
          <Text style={{ width: 60 }}>SIZE</Text>
          <Text style={{ width: 60 }}>COLOR</Text>
          <Text style={{ width: 44 }}>REF #</Text>
          <Text style={{ width: 28, textAlign: "right" }}>QTY</Text>
          <Text style={{ width: 26 }}>UNIT</Text>
        </View>
        {order.lineItems.slice(0, 8).map((li) => (
          <View key={li.id}>
            <View style={styles.tableRow}>
              <Text style={{ width: 56 }}>{lineCategoryLabel(li.category)}</Text>
              <Text style={{ flex: 1 }}>{[li.brand, li.style].filter(Boolean).join(" — ")}</Text>
              <Text style={{ width: 60 }}>{li.sizeSpec ?? ""}</Text>
              <Text style={{ width: 60 }}>{li.color ?? ""}</Text>
              <Text style={{ width: 44 }}>{li.sku ?? ""}</Text>
              <Text style={{ width: 28, textAlign: "right" }}>{li.quantity ?? ""}</Text>
              <Text style={{ width: 26 }}>{unitShort(li.unit)}</Text>
            </View>
            {/* Carpet extras */}
            {(li.carpetType || li.pad) ? (
              <View style={{ flexDirection: "row", gap: 12, marginLeft: 56, marginBottom: 2 }}>
                {li.carpetType ? (
                  <Text style={{ fontSize: 7, color: COLORS.muted }}>
                    Type: {CARPET_TYPE_LABELS[li.carpetType] ?? li.carpetType}
                  </Text>
                ) : null}
                {li.pad ? (
                  <Text style={{ fontSize: 7, color: COLORS.muted }}>Pad: {li.pad}</Text>
                ) : null}
              </View>
            ) : null}
            {/* Install method */}
            {li.lineInstallMethod ? (
              <View style={{ marginLeft: 56, marginBottom: 2 }}>
                <Text style={{ fontSize: 7, color: COLORS.muted }}>
                  Install: {INSTALL_METHOD_LABELS[li.lineInstallMethod] ?? li.lineInstallMethod}
                </Text>
              </View>
            ) : null}
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

        {/* Moldings */}
        {(order.moldingsRemoveReplace || checkboxMoldings.length > 0 || quantityMoldings.length > 0) ? (
          <View style={{ marginTop: 8, paddingTop: 6, borderTopWidth: 0.5, borderColor: COLORS.borderLight }}>
            <Text style={[styles.sectionLabel, { marginBottom: 4 }]}>MOLDINGS</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {order.moldingsRemoveReplace ? (
                <Text style={{ fontSize: 8 }}>☑ Remove &amp; Replace Existing</Text>
              ) : null}
              {checkboxMoldings.map((m) => (
                <Text key={m.id} style={{ fontSize: 8 }}>☑ {MOLDING_LABELS[m.type] ?? m.type}</Text>
              ))}
            </View>
            {quantityMoldings.length > 0 ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
                {quantityMoldings.map((m) => (
                  <Text key={m.id} style={{ fontSize: 8 }}>
                    {MOLDING_LABELS[m.type] ?? m.type}: {m.quantity}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Fixtures */}
        {activeFixtures.length > 0 ? (
          <View style={{ marginTop: 8, paddingTop: 6, borderTopWidth: 0.5, borderColor: COLORS.borderLight }}>
            <Text style={[styles.sectionLabel, { marginBottom: 4 }]}>FIXTURES</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {activeFixtures.map((f) => (
                <Text key={f.id} style={{ fontSize: 8 }}>☑ {FIXTURE_LABELS[f.type] ?? f.type}</Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* Other Instructions */}
        {(order.removeOldCarpetAndPad != null || order.removeOldTagStrip != null ||
          order.hasSteps != null || order.newTackStripType || order.emptyHouse != null ||
          order.heavyFurniture != null) ? (
          <View style={{ marginTop: 8, paddingTop: 6, borderTopWidth: 0.5, borderColor: COLORS.borderLight }}>
            <Text style={[styles.sectionLabel, { marginBottom: 4 }]}>OTHER INSTRUCTIONS</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {order.removeOldCarpetAndPad != null ? (
                <Text style={{ fontSize: 8 }}>Remove Old Carpet &amp; Pad: {boolLabel(order.removeOldCarpetAndPad)}</Text>
              ) : null}
              {order.removeOldTagStrip != null ? (
                <Text style={{ fontSize: 8 }}>Remove Old Tack Strip: {boolLabel(order.removeOldTagStrip)}</Text>
              ) : null}
              {order.hasSteps != null ? (
                <Text style={{ fontSize: 8 }}>
                  Steps: {boolLabel(order.hasSteps)}{order.hasSteps && order.numSteps ? ` (${order.numSteps})` : ""}
                </Text>
              ) : null}
              {order.newTackStripType ? (
                <Text style={{ fontSize: 8 }}>New Tack Strip: {order.newTackStripType.charAt(0).toUpperCase() + order.newTackStripType.slice(1)}</Text>
              ) : null}
              {order.emptyHouse != null ? (
                <Text style={{ fontSize: 8 }}>Empty House: {boolLabel(order.emptyHouse)}</Text>
              ) : null}
              {order.heavyFurniture != null ? (
                <Text style={{ fontSize: 8 }}>Heavy Furniture: {boolLabel(order.heavyFurniture)}</Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Scope of Work */}
        <View style={{ marginTop: 8, paddingTop: 6, borderTopWidth: 0.5, borderColor: COLORS.borderLight }}>
          <Text style={[styles.sectionLabel, { color: COLORS.brand, fontSize: 10, marginBottom: 3 }]}>
            SCOPE OF WORK (per Invoice)
          </Text>
          {(order.scopeOverride ?? generateScopeOfWork({
            rooms: [],
            lineItems: order.lineItems,
            inclusions: order.inclusions,
            exclusions: order.exclusions,
            remarks: order.remarks,
            depositInstructions: order.depositInstructions,
          })).split(/\n\n+/).map((p, i) => (
            <Text key={i} style={{ marginBottom: 3 }}>
              {p.replace(/\*\*([^*]+)\*\*/g, "$1")}
            </Text>
          ))}
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
  return v.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}
