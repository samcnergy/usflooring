import { Document, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import type { Prisma } from "@prisma/client";
import { styles, COLORS } from "./styles";
import { PdfFooter } from "./PdfFooter";
import type { VendorOrderLineSnapshot } from "@/lib/vendor-order";
import { lineCategoryLabel } from "@/lib/line-categories";
import { unitShort } from "@/lib/units";

type FullVendorOrder = Prisma.VendorOrderGetPayload<{
  include: { order: { include: { customer: true } } };
}>;

export function VendorOrderPDF({
  vendorOrder,
  downloadedBy,
}: {
  vendorOrder: FullVendorOrder;
  downloadedBy?: string;
}) {
  const vo = vendorOrder;
  const snapshot = vo.lineItems as { lineItems?: VendorOrderLineSnapshot[] } | VendorOrderLineSnapshot[];
  const items: VendorOrderLineSnapshot[] =
    Array.isArray(snapshot) ? snapshot : (snapshot?.lineItems ?? []);

  return (
    <Document title={`USFKB Vendor PO ${vo.poNumber}`}>
      <Page size="LETTER" style={styles.page}>
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

        {items.length === 0 ? (
          <Text style={{ color: COLORS.muted, marginTop: 4 }}>No items on this PO.</Text>
        ) : (
          <View style={{ marginTop: 4 }}>
            {items.map((it, i) => (
              <View key={i} style={{ marginBottom: 8, borderBottomWidth: 0.5, borderColor: COLORS.borderLight, paddingBottom: 4 }}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  {i + 1}) {lineCategoryLabel(it.category)} {it.brand ? `— ${it.brand}` : ""}
                </Text>
                {it.style ? <Field label="Style">{it.style}</Field> : null}
                {it.color ? <Field label="Color">{it.color}</Field> : null}
                {it.sizeSpec ? <Field label="Size">{it.sizeSpec}</Field> : null}
                {it.sku ? <Field label="SKU">{it.sku}</Field> : null}
                {it.quantity != null ? (
                  <Field label="Qty">{`${it.quantity} ${unitShort(it.unit) ?? ""}`}</Field>
                ) : null}
                {it.notes ? <Field label="Notes">{it.notes}</Field> : null}
              </View>
            ))}
          </View>
        )}

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
