// Installation Instruction PDF — one page per material category.
// Generated from the order's line items grouped by category.
// No pricing is shown; this is for the installer only.

import { Document, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import { lineCategoryLabel } from "@/lib/line-categories";
import { unitShort } from "@/lib/units";
import { roomLabel } from "@/lib/rooms";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    rooms: true;
    lineItems: { include: { room: true } };
    inclusions: true;
    moldings: true;
    fixtures: true;
    installNotes: true;
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
};

// Categories where moldings, carpet, and carpet-specific instructions apply
const CARPET_CATEGORY = "carpet";
const MOLDING_APPLICABLE_CATEGORIES = new Set(["carpet", "vinyl", "wood"]);
const FIXTURE_APPLICABLE_CATEGORIES = new Set(["carpet", "vinyl", "wood", "ceramic", "tile", "stone"]);

export function InstallationInstructionPDF({
  order,
  downloadedBy,
}: {
  order: FullOrder;
  downloadedBy?: string;
}) {
  const cust = order.customer;

  // Group line items by category
  const categoryMap = new Map<string, typeof order.lineItems>();
  for (const li of order.lineItems) {
    if (!categoryMap.has(li.category)) categoryMap.set(li.category, []);
    categoryMap.get(li.category)!.push(li);
  }

  const categories = Array.from(categoryMap.entries());

  const noteMap = new Map(order.installNotes.map((n) => [n.category, n.notes]));

  // Build roomId → room lookup for area labels on line items
  const roomMap = new Map(order.rooms.map((r) => [r.id, r]));

  const moldingCheckboxTypes = new Set(["baseShoe", "baseboard", "rubberCover4in"]);
  const checkboxMoldings = order.moldings.filter((m) => moldingCheckboxTypes.has(m.type));
  const quantityMoldings = order.moldings.filter((m) => !moldingCheckboxTypes.has(m.type) && m.quantity);
  const hasMoldings = order.moldingsRemoveReplace || checkboxMoldings.length > 0 || quantityMoldings.length > 0;

  const activeFixtures = order.fixtures.filter((f) =>
    Object.keys(FIXTURE_LABELS).includes(f.type)
  );

  const hasOtherInstructions =
    order.removeOldCarpetAndPad != null || order.removeOldTagStrip != null ||
    order.hasSteps != null || order.newTackStripType || order.emptyHouse != null ||
    order.heavyFurniture != null;

  if (categories.length === 0) {
    return (
      <Document title={`USFKB Install Instructions ${order.invoiceNumber}`}>
        <Page size="LETTER" style={styles.page}>
          <Text style={styles.bigTitle}>INSTALLATION INSTRUCTION</Text>
          <Text style={{ color: COLORS.muted }}>No line items on this order.</Text>
          <PdfFooter docType="Installation Instruction" downloadedBy={downloadedBy} />
        </Page>
      </Document>
    );
  }

  return (
    <Document title={`USFKB Install Instructions ${order.invoiceNumber}`}>
      {categories.map(([category, items]) => {
        const isCarpet = category === CARPET_CATEGORY;
        const showMoldings = hasMoldings && MOLDING_APPLICABLE_CATEGORIES.has(category);
        const showFixtures = activeFixtures.length > 0 && FIXTURE_APPLICABLE_CATEGORIES.has(category);
        const showOtherInstr = hasOtherInstructions && isCarpet;
        const installerNotes = noteMap.get(category as import("@prisma/client").LineCategory) ?? "";

        return (
          <Page key={category} size="LETTER" style={styles.page}>
            {/* Header */}
            <View style={{ borderBottomWidth: 2, borderColor: COLORS.brand, marginBottom: 8, paddingBottom: 6 }}>
              <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: COLORS.brand }}>
                INSTALLATION INSTRUCTION
              </Text>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: COLORS.text, marginTop: 2 }}>
                {lineCategoryLabel(category as import("@prisma/client").LineCategory).toUpperCase()}
              </Text>
            </View>

            {/* Order info */}
            <View style={[styles.twoCol, { marginBottom: 8 }]}>
              <View style={styles.col}>
                <Field label="INVOICE #">{String(order.invoiceNumber)}</Field>
                <Field label="CUSTOMER">{cust.firstName} {cust.lastName}</Field>
                <Field label="PHONE">{cust.phoneHome ?? cust.phoneWork ?? ""}</Field>
                <Field label="SALESPERSON">{order.salesperson.fullName}</Field>
              </View>
              <View style={styles.col}>
                <Field label="INSTALL DATE">
                  {order.installationDate ? format(order.installationDate, "MM/dd/yyyy") : "___________"}
                </Field>
                <Field label="INSTALLER">{order.installerName ?? "___________"}</Field>
                {!order.jobSiteSameAsBilling ? (
                  <>
                    <Field label="JOB SITE">{order.jobSiteAddressLine1 ?? ""}</Field>
                    <Field label="CITY/ZIP">{order.jobSiteCity ?? ""}, {order.jobSiteZip ?? ""}</Field>
                  </>
                ) : (
                  <>
                    <Field label="ADDRESS">{cust.shipAddressLine1 ?? cust.addressLine1}</Field>
                    <Field label="CITY/ZIP">{cust.shipCity ?? cust.city}, {cust.shipZip ?? cust.zip}</Field>
                  </>
                )}
                {order.siteContactName ? (
                  <Field label="CONTACT">{order.siteContactName}{order.siteContactPhone ? ` · ${order.siteContactPhone}` : ""}</Field>
                ) : null}
              </View>
            </View>

            {/* Area / Rooms */}
            {order.rooms.length > 0 ? (
              <View style={{ marginBottom: 8, paddingBottom: 6, borderBottomWidth: 0.5, borderColor: COLORS.borderLight }}>
                <Text style={[styles.sectionLabel, { marginBottom: 3 }]}>AREA</Text>
                <Text>
                  {order.rooms.map((r) =>
                    `${roomLabel(r.room)}${r.quantity ? ` × ${r.quantity}` : ""}${r.notes ? ` (${r.notes})` : ""}`
                  ).join(" · ")}
                </Text>
              </View>
            ) : null}

            {/* Materials for this category */}
            <View style={{ marginBottom: 8, paddingBottom: 6, borderBottomWidth: 0.5, borderColor: COLORS.borderLight }}>
              <Text style={[styles.sectionLabel, { marginBottom: 4 }]}>MATERIALS</Text>
              <View style={styles.tableHead}>
                <Text style={{ flex: 1 }}>{isCarpet ? "MILL — STYLE" : "BRAND — STYLE"}</Text>
                <Text style={{ width: 60 }}>COLOR</Text>
                <Text style={{ width: 48 }}>SIZE</Text>
                {isCarpet ? <Text style={{ width: 50 }}>REF #</Text> : null}
                {isCarpet ? <Text style={{ width: 50 }}>TYPE</Text> : null}
                {isCarpet ? <Text style={{ width: 50 }}>PAD</Text> : null}
                {!isCarpet ? <Text style={{ width: 70 }}>INSTALL METHOD</Text> : null}
                <Text style={{ width: 30, textAlign: "right" }}>QTY</Text>
                <Text style={{ width: 26 }}>UNIT</Text>
              </View>
              {items.map((li) => {
                const liRoom = li.roomId ? roomMap.get(li.roomId) : null;
                const brandStyle = [li.brand, li.style].filter(Boolean).join(" — ");
                const areaLabel = liRoom ? ` (${roomLabel(liRoom.room)})` : "";
                return (
                  <View key={li.id} style={styles.tableRow}>
                    <Text style={{ flex: 1 }}>{brandStyle}{areaLabel ? <Text style={{ color: COLORS.muted, fontSize: 7 }}>{areaLabel}</Text> : null}</Text>
                    <Text style={{ width: 60, color: COLORS.muted }}>{li.color ?? ""}</Text>
                    <Text style={{ width: 48, color: COLORS.muted }}>{li.sizeSpec ?? ""}</Text>
                    {isCarpet ? (
                      <Text style={{ width: 50, color: COLORS.muted }}>{li.sku ?? ""}</Text>
                    ) : null}
                    {isCarpet ? (
                      <Text style={{ width: 50, color: COLORS.muted }}>
                        {li.carpetType ? (CARPET_TYPE_LABELS[li.carpetType] ?? li.carpetType) : ""}
                      </Text>
                    ) : null}
                    {isCarpet ? (
                      <Text style={{ width: 50, color: COLORS.muted }}>{li.pad ?? ""}</Text>
                    ) : null}
                    {!isCarpet ? (
                      <Text style={{ width: 70, color: COLORS.muted }}>
                        {li.lineInstallMethod ? (INSTALL_METHOD_LABELS[li.lineInstallMethod] ?? li.lineInstallMethod) : ""}
                      </Text>
                    ) : null}
                    <Text style={{ width: 30, textAlign: "right" }}>{li.quantity ?? ""}</Text>
                    <Text style={{ width: 26 }}>{unitShort(li.unit)}</Text>
                  </View>
                );
              })}
            </View>

            {/* Moldings (carpet, vinyl, wood) */}
            {showMoldings ? (
              <View style={{ marginBottom: 8, paddingBottom: 6, borderBottomWidth: 0.5, borderColor: COLORS.borderLight }}>
                <Text style={[styles.sectionLabel, { marginBottom: 4 }]}>MOLDINGS</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                  {order.moldingsRemoveReplace ? (
                    <Text style={{ fontSize: 8 }}>☑ Remove &amp; Replace Existing</Text>
                  ) : null}
                  {checkboxMoldings.map((m) => (
                    <Text key={m.id} style={{ fontSize: 8 }}>☑ {MOLDING_LABELS[m.type] ?? m.type}</Text>
                  ))}
                </View>
                {quantityMoldings.length > 0 ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
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
            {showFixtures ? (
              <View style={{ marginBottom: 8, paddingBottom: 6, borderBottomWidth: 0.5, borderColor: COLORS.borderLight }}>
                <Text style={[styles.sectionLabel, { marginBottom: 4 }]}>FIXTURES TO MOVE</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                  {activeFixtures.map((f) => (
                    <Text key={f.id} style={{ fontSize: 8 }}>☑ {FIXTURE_LABELS[f.type] ?? f.type}</Text>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Other Instructions (carpet) */}
            {showOtherInstr ? (
              <View style={{ marginBottom: 8, paddingBottom: 6, borderBottomWidth: 0.5, borderColor: COLORS.borderLight }}>
                <Text style={[styles.sectionLabel, { marginBottom: 4 }]}>INSTRUCTIONS</Text>
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
                    <Text style={{ fontSize: 8 }}>
                      New Tack Strip: {order.newTackStripType.charAt(0).toUpperCase() + order.newTackStripType.slice(1)}
                    </Text>
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

            {/* Access instructions */}
            {order.accessInstructions ? (
              <View style={{ marginBottom: 8, paddingBottom: 6, borderBottomWidth: 0.5, borderColor: COLORS.borderLight }}>
                <Text style={[styles.sectionLabel, { marginBottom: 2 }]}>ACCESS</Text>
                <Text style={{ color: COLORS.muted }}>{order.accessInstructions}</Text>
              </View>
            ) : null}

            {/* Custom installer notes */}
            <View style={{ marginBottom: 8, paddingBottom: 6, borderBottomWidth: 0.5, borderColor: COLORS.borderLight }}>
              <Text style={[styles.sectionLabel, { marginBottom: 4 }]}>INSTALLATION NOTES</Text>
              {installerNotes ? (
                <Text style={{ color: COLORS.text }}>{installerNotes}</Text>
              ) : (
                <View style={{ borderWidth: 0.5, borderColor: COLORS.borderLight, height: 60, marginTop: 2 }} />
              )}
            </View>

            {/* Signature line */}
            <View style={[styles.twoCol, { marginTop: 12 }]}>
              <View style={styles.col}>
                <View style={styles.signatureBox}>
                  <Text style={{ color: COLORS.muted }}>INSTALLER SIGNATURE</Text>
                </View>
              </View>
              <View style={styles.col}>
                <View style={styles.signatureBox}>
                  <Text style={{ color: COLORS.muted }}>DATE COMPLETED</Text>
                </View>
              </View>
            </View>

            <PdfFooter docType={`Install — ${lineCategoryLabel(category as import("@prisma/client").LineCategory)}`} downloadedBy={downloadedBy} />
          </Page>
        );
      })}
    </Document>
  );
}

function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <Text style={{ marginBottom: 2 }}>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>{label}: </Text>
      {(children ?? "") as React.ReactNode}
    </Text>
  );
}

function boolLabel(v: boolean | null | undefined): string {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}
