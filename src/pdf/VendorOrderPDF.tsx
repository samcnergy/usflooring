import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";

type FullVendorOrder = Prisma.VendorOrderGetPayload<{
  include: { order: { include: { customer: true } } };
}>;

type LineItem = {
  millStyle?: string | null;
  color?: string | null;
  size?: string | null;
};

type Molding = {
  type: string;
  quantity?: string | null;
};

export function VendorOrderPDF({
  vendorOrder,
  downloadedBy,
}: {
  vendorOrder: FullVendorOrder;
  downloadedBy?: string;
}) {
  const vo = vendorOrder;
  const items: LineItem[] = Array.isArray(vo.lineItems)
    ? (vo.lineItems as unknown as LineItem[])
    : [];
  const moldings: Molding[] = []; // populated when material capture lands

  return (
    <Document title={`USFKB Vendor PO ${vo.poNumber}`}>
      <Page size="LETTER" style={styles.page}>
        {/* Letterhead */}
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold" }}>U.S. Floor, Kitchen &amp; Bath</Text>
          <Text style={{ fontSize: 9, color: COLORS.muted }}>
            30092 Santa Margarita Pkwy #G &middot; R.S.M., CA 92688
          </Text>
          <Text style={{ fontSize: 9, color: COLORS.muted }}>
            Tel: 949-589-9226 &middot; Fax: 949-589-9216 &middot; info@usfloorkb.com
          </Text>
        </View>

        <Text style={[styles.bigTitle, { textDecoration: "none" }]}>ORDER FORM</Text>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Field label="Vendor">{vo.vendorName}</Field>
            <Field label="P.O. #">{vo.poNumber}</Field>
            <Field label="Sidemark">{vo.sidemark ?? ""}</Field>
          </View>
          <View style={styles.col}>
            <Field label="FAX, E-MAIL DATE">
              {vo.faxEmailDate ? format(vo.faxEmailDate, "MM/dd/yyyy") : ""}
            </Field>
            <Field label="Will Call Date">
              {vo.willCallDate ? format(vo.willCallDate, "MM/dd/yyyy") : ""}
            </Field>
            <Field label="Delivery Date">
              {vo.deliveryDate ? format(vo.deliveryDate, "MM/dd/yyyy") : ""}
            </Field>
            <Field label="Delivery Address">{vo.deliveryAddress ?? ""}</Field>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { fontSize: 11, marginTop: 8 }]}>
          ORDERING THE FOLLOWING ITEMS:
        </Text>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            {[0, 1, 2, 3].map((i) => {
              const it = items[i];
              return (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Field label={`${i + 1}) Style`}>{it?.millStyle ?? ""}</Field>
                  <Field label={`${i + 1}) Color`}>{it?.color ?? ""}</Field>
                  <Field label={`${i + 1}) Size`}>{it?.size ?? ""}</Field>
                </View>
              );
            })}
          </View>

          <View style={styles.col}>
            <Text style={[styles.sectionLabel, { fontSize: 10 }]}>MOLDINGS:</Text>
            {moldings.length === 0 ? (
              <Text style={{ color: COLORS.muted }}>—</Text>
            ) : (
              moldings.map((m, i) => (
                <Text key={i}>{labelMolding(m.type)}: {m.quantity ?? ""}</Text>
              ))
            )}
          </View>
        </View>

        <Text style={{ marginTop: 12, color: COLORS.invoiceRed, fontFamily: "Helvetica-Bold", textAlign: "center" }}>
          PLEASE, FAX OR E-MAIL ORDER CONFIRMATION ASAP
        </Text>

        <PdfFooter
          docType={`Vendor PO ${vo.poNumber} (Invoice ${vo.order.invoiceNumber})`}
          downloadedBy={downloadedBy}
        />
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

function labelMolding(type: string) {
  // Map enum-ish names to paper-form labels.
  const map: Record<string, string> = {
    baseShoe: "Base Shoe",
    baseboard: "Baseboard",
    quarterRound: "Quarter round",
    tMolding: "T-Molding",
    reducer: "Reducer",
    endMolding: "End Molding",
    bullNose: "Bull-Nose",
  };
  return map[type] ?? type;
}
