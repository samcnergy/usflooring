// Shared @react-pdf/renderer styles. We stick to Helvetica (built-in) so we
// don't have to ship a TTF for Inter. The paper-form layouts are line-art
// black-on-white, except the invoice number which is brand red.

import { StyleSheet } from "@react-pdf/renderer";

export const COLORS = {
  text:        "#1A1A17",
  muted:       "#4A4A45",
  brand:       "#1B6B1F",
  invoiceRed:  "#B91C1C",
  borderLight: "#DEDCD3",
  borderHeavy: "#4A4A45",
  white:       "#FFFFFF",
};

export const styles = StyleSheet.create({
  page: {
    padding: 36, // 0.5"
    fontFamily: "Helvetica",
    fontSize: 9,
    color: COLORS.text,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  brandText: {
    fontSize: 8,
    color: COLORS.muted,
    lineHeight: 1.35,
  },
  invoiceBox: {
    borderWidth: 1,
    borderColor: COLORS.borderHeavy,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 200,
  },
  invoiceLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.muted,
  },
  invoiceNumber: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: COLORS.invoiceRed,
    textAlign: "right",
  },
  // Section labels
  sectionLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: COLORS.text,
    marginBottom: 2,
  },
  // Two-column splits
  twoCol: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  col: { flex: 1 },
  // Table
  tableHead: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderHeavy,
    paddingVertical: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: COLORS.borderLight,
    paddingVertical: 3,
    minHeight: 16,
  },
  // Categories row (8 boxes)
  categoryRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderHeavy,
    paddingVertical: 3,
    marginVertical: 6,
    gap: 8,
  },
  categoryItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  checkBox: {
    width: 8, height: 8, borderWidth: 0.5, borderColor: COLORS.text,
  },
  checkBoxFilled: {
    width: 8, height: 8, borderWidth: 0.5, borderColor: COLORS.text,
    backgroundColor: COLORS.text,
  },
  // Footer / totals
  totalsBox: {
    borderWidth: 1,
    borderColor: COLORS.borderHeavy,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  totalsLabel: { color: COLORS.muted },
  totalsValue: { fontFamily: "Helvetica-Bold" },
  legalText: {
    fontSize: 7,
    color: COLORS.text,
    lineHeight: 1.3,
    marginTop: 8,
    backgroundColor: "#F1F0EB",
    padding: 6,
  },
  signatureBox: {
    borderTopWidth: 1,
    borderColor: COLORS.borderHeavy,
    paddingTop: 4,
    marginTop: 4,
  },
  pageFooter: {
    position: "absolute",
    bottom: 18,
    left: 36,
    right: 36,
    fontSize: 7,
    color: COLORS.muted,
    textAlign: "center",
  },
  bigTitle: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
    marginBottom: 8,
  },
});
