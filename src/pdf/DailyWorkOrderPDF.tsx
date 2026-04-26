import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    salesperson: { select: { id: true; fullName: true; email: true } };
    showerSpec: true;
    tileSpec: true;
    removals: true;
  };
}>;

// Installer's sheet — never has prices, regardless of role.

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

  return (
    <Document title={`USFKB Daily Work Order ${order.invoiceNumber}`}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.bigTitle}>DAILY WORK ORDER</Text>

        {/* Identity strip */}
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

        {/* Shower */}
        <Text style={[styles.sectionLabel, { fontSize: 11, marginBottom: 4 }]}>SHOWER</Text>
        <View style={{ borderWidth: 1, borderColor: COLORS.borderHeavy, padding: 6, marginBottom: 8 }}>
          <Field label="SHOWER WALLS SQFT">{shower?.shower_walls_sqft ?? ""}</Field>
          <Field label="WALL MATERIAL">{shower?.wall_material ?? ""}</Field>
          <Field label="SHOWER PAN">{shower?.shower_pan ?? ""}</Field>
          <Field label="SHOWER PAN MATERIAL">{shower?.shower_pan_material ?? ""}</Field>
          <Field label="SOAP BOX MATERIAL">{shower?.soap_box_material ?? ""}</Field>
          <Field label="BENCH">{shower?.bench ?? ""}</Field>
          <Field label="BATHROOM FLOOR SQFT">{shower?.bathroom_floor_sqft ?? ""}</Field>
          <Field label="BATHROOM FLOOR MATERIAL">{shower?.bathroom_floor_material ?? ""}</Field>
          <Field label="SCHLUTER">{shower?.schluter ?? ""}</Field>
          <Field label="GROUT COLOR">{shower?.grout_color ?? ""}</Field>
          <Field label="VERTICAL / HORIZONTAL">
            {`${boolLabel(shower?.vertical)} / ${boolLabel(shower?.horizontal)}`}
          </Field>
        </View>

        {/* Tile / Stone */}
        <Text style={[styles.sectionLabel, { fontSize: 11, marginBottom: 4 }]}>TILE, STONE</Text>
        <View style={{ borderWidth: 1, borderColor: COLORS.borderHeavy, padding: 6, marginBottom: 8 }}>
          <Text>
            {[
              tile?.hasTile && "Tile",
              tile?.hasMarble && "Marble",
              tile?.hasTravertine && "Travertine",
              tile?.hasSlate && "Slate",
              tile?.hasTumbleMarble && "Tumble Marble",
            ].filter(Boolean).join(" · ") || "—"}
          </Text>
          <Text style={{ marginTop: 4 }}>
            {[
              tile?.hasBacksplash && "Back Splash",
              tile?.hasFloor && "Floor",
              tile?.hasFireplace && "Fireplace",
              tile?.hasShowerTile && "Shower",
              tile?.hasWalls && "Walls",
              tile?.hasCounterTop && "Counter Top",
              tile?.hasStone && "Stone",
              tile?.hasSlab && "Slab",
            ].filter(Boolean).join(" · ") || "—"}
          </Text>
          <Field label="WONDERBOARD">{boolLabel(tile?.wonderboard)}</Field>
          <Field label="SLIP SHEET">{boolLabel(tile?.slipSheet)}</Field>
          <Field label="SEAL">{boolLabel(tile?.seal)}</Field>
          <Field label="GROUT COLOR">{tile?.groutColor ?? ""}</Field>
        </View>

        {/* Removal & appliances */}
        <Text style={[styles.sectionLabel, { fontSize: 11, marginBottom: 4 }]}>REMOVAL &amp; APPLIANCES</Text>
        <View style={{ borderWidth: 1, borderColor: COLORS.borderHeavy, padding: 6 }}>
          <Text>
            {order.removals.length > 0
              ? order.removals.map((r) => labelEnum(r.type)).join(" · ")
              : "—"}
          </Text>
        </View>

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

function boolLabel(v: boolean | null | undefined): string {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}

function labelEnum(v: string | null | undefined): string {
  if (!v) return "—";
  return v.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}
