import { Document, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import { roomLabel } from "@/lib/rooms";
import { lineCategoryLabel } from "@/lib/line-categories";
import { unitShort } from "@/lib/units";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    rooms: true;
    lineItems: { include: { room: true } };
    showerSpec: true;
    tileSpec: true;
    removals: true;
  };
}>;

export function DailyWorkOrderPDF({
  order,
  downloadedBy,
}: {
  order: FullOrder;
  downloadedBy?: string;
}) {
  const cust = order.customer;
  const tile = order.tileSpec;
  const shower = order.showerSpec;

  // Build roomId → room lookup
  const roomMap = new Map(order.rooms.map((r) => [r.id, r]));

  // Group line items by area, then by category within each area
  type AreaSection = {
    roomId: string | null;
    roomLabel: string | null;
    byCategory: Map<string, typeof order.lineItems>;
  };

  const areaMap = new Map<string | null, Map<string, typeof order.lineItems>>();
  // Pre-seed in room order
  for (const r of order.rooms) {
    areaMap.set(r.id, new Map());
  }
  areaMap.set(null, new Map()); // orphans

  for (const li of order.lineItems) {
    const roomId = li.roomId ?? null;
    if (!areaMap.has(roomId)) areaMap.set(roomId, new Map());
    const catMap = areaMap.get(roomId)!;
    const cat = lineCategoryLabel(li.category);
    if (!catMap.has(cat)) catMap.set(cat, []);
    catMap.get(cat)!.push(li);
  }

  // Build ordered sections (rooms first, then orphans)
  const areaSections: AreaSection[] = [];
  for (const r of order.rooms) {
    const byCategory = areaMap.get(r.id);
    if (byCategory && byCategory.size > 0) {
      areaSections.push({
        roomId: r.id,
        roomLabel: `${roomLabel(r.room)}${r.quantity ? ` × ${r.quantity}` : ""}`,
        byCategory,
      });
    }
  }
  const orphanMap = areaMap.get(null);
  if (orphanMap && orphanMap.size > 0) {
    areaSections.push({ roomId: null, roomLabel: null, byCategory: orphanMap });
  }

  return (
    <Document title={`USFKB Daily Work Order ${order.invoiceNumber}`}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.bigTitle}>DAILY WORK ORDER</Text>

        {(order.siteContactName || order.accessInstructions || !order.jobSiteSameAsBilling) ? (
          <View style={{ borderWidth: 1, borderColor: COLORS.invoiceRed, padding: 8, marginBottom: 8 }}>
            <Text style={[styles.sectionLabel, { color: COLORS.invoiceRed, fontSize: 11 }]}>SITE NOTES — read before leaving the shop</Text>
            {!order.jobSiteSameAsBilling ? (
              <Text style={{ marginTop: 4 }}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Address: </Text>
                {order.jobSiteAddressLine1}, {order.jobSiteCity}, {order.jobSiteState} {order.jobSiteZip}
              </Text>
            ) : null}
            {order.siteContactName ? (
              <Text style={{ marginTop: 2 }}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Contact: </Text>
                {order.siteContactName}{order.siteContactPhone ? ` · ${order.siteContactPhone}` : ""}
              </Text>
            ) : null}
            {order.accessInstructions ? (
              <Text style={{ marginTop: 2 }}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Access: </Text>
                {order.accessInstructions}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={{ borderWidth: 1, borderColor: COLORS.borderHeavy, padding: 6, marginBottom: 8 }}>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Field label="SHIP TO">{`${cust.shipFirstName ?? cust.firstName} ${cust.shipLastName ?? cust.lastName}`}</Field>
              <Field label="ADDRESS">{cust.shipAddressLine1 ?? cust.addressLine1}</Field>
              <Field label="CITY, ZIP">{`${cust.shipCity ?? cust.city}, ${cust.shipZip ?? cust.zip}`}</Field>
              <Field label="TEL">{cust.shipPhone ?? cust.phoneHome ?? ""}</Field>
            </View>
            <View style={styles.col}>
              <Field label="INVOICE #">{String(order.invoiceNumber)}</Field>
              <Field label="INSTALLATION DATE">
                {order.installationDate ? format(order.installationDate, "MM/dd/yyyy") : ""}
              </Field>
              <Field label="INSTALLER">{order.installerName ?? ""}</Field>
              <Field label="SUBFLOOR">{labelEnum(order.subfloorType)}</Field>
            </View>
          </View>
        </View>

        {order.rooms.length > 0 ? (
          <View style={{ marginBottom: 8 }}>
            <Text style={[styles.sectionLabel, { fontSize: 11 }]}>ROOMS</Text>
            {order.rooms.map((r) => (
              <Text key={r.id}>
                {roomLabel(r.room)}{r.quantity ? ` × ${r.quantity}` : ""}{r.notes ? ` — ${r.notes}` : ""}
              </Text>
            ))}
          </View>
        ) : null}

        {areaSections.length > 0 ? (
          <View style={{ marginBottom: 8 }}>
            <Text style={[styles.sectionLabel, { fontSize: 11 }]}>WHAT TO INSTALL</Text>
            {areaSections.map((section) => (
              <View key={section.roomId ?? "_orphan"} style={{ marginTop: 4 }}>
                {section.roomLabel ? (
                  <Text style={{ fontFamily: "Helvetica-Bold", color: COLORS.brand, fontSize: 9, marginBottom: 2 }}>
                    {section.roomLabel}
                  </Text>
                ) : null}
                {Array.from(section.byCategory.entries()).map(([cat, lines]) => (
                  <View key={cat} style={{ marginTop: 2 }}>
                    <Text style={{ fontFamily: "Helvetica-Bold", marginLeft: section.roomLabel ? 8 : 0 }}>{cat}:</Text>
                    {lines.map((li) => (
                      <Text key={li.id} style={{ color: COLORS.muted, marginLeft: section.roomLabel ? 16 : 8 }}>
                        • {[li.brand, li.style, li.color, li.sizeSpec].filter(Boolean).join(" — ")}
                        {li.quantity != null ? ` (${li.quantity}${li.unit ? " " + unitShort(li.unit) : ""})` : ""}
                        {li.notes ? ` · ${li.notes}` : ""}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {shower ? (
          <>
            <Text style={[styles.sectionLabel, { fontSize: 11, marginBottom: 4 }]}>SHOWER</Text>
            <View style={{ borderWidth: 1, borderColor: COLORS.borderHeavy, padding: 6, marginBottom: 8 }}>
              <Field label="SHOWER WALLS SQFT">{shower.shower_walls_sqft ?? ""}</Field>
              <Field label="WALL MATERIAL">{shower.wall_material ?? ""}</Field>
              <Field label="SHOWER PAN">{shower.shower_pan ?? ""}</Field>
              <Field label="SHOWER PAN MATERIAL">{shower.shower_pan_material ?? ""}</Field>
              <Field label="GROUT COLOR">{shower.grout_color ?? ""}</Field>
            </View>
          </>
        ) : null}

        {tile ? (
          <>
            <Text style={[styles.sectionLabel, { fontSize: 11, marginBottom: 4 }]}>TILE, STONE</Text>
            <View style={{ borderWidth: 1, borderColor: COLORS.borderHeavy, padding: 6, marginBottom: 8 }}>
              <Text>
                {[
                  tile.hasTile && "Tile",
                  tile.hasMarble && "Marble",
                  tile.hasTravertine && "Travertine",
                  tile.hasSlate && "Slate",
                  tile.hasTumbleMarble && "Tumble Marble",
                ].filter(Boolean).join(" · ") || "—"}
              </Text>
              <Field label="GROUT COLOR">{tile.groutColor ?? ""}</Field>
            </View>
          </>
        ) : null}

        {order.removals.length > 0 ? (
          <>
            <Text style={[styles.sectionLabel, { fontSize: 11, marginBottom: 4 }]}>REMOVAL &amp; APPLIANCES</Text>
            <View style={{ borderWidth: 1, borderColor: COLORS.borderHeavy, padding: 6 }}>
              <Text>{order.removals.map((r) => labelEnum(r.type)).join(" · ")}</Text>
            </View>
          </>
        ) : null}

        <PdfFooter docType="Daily Work Order" downloadedBy={downloadedBy} />
      </Page>
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

function labelEnum(v: string | null | undefined): string {
  if (!v) return "—";
  return v.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}
