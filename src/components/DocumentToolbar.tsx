// Per-tab toolbar with Download PDF (always) and Print (Invoice tab only —
// other tabs render a PDF iframe, where the browser's native PDF viewer has
// its own print control).

import { PrintButton } from "./PrintButton";

type DocType = "invoice" | "workorder" | "vendor" | "install";

const docFilenameSuffix: Record<DocType, string> = {
  invoice: "invoice",
  workorder: "workorder",
  vendor: "vendor",
  install: "install",
};

export function DocumentToolbar({
  orderId,
  doc,
  vendorOrderId,
  showPrint,
}: {
  orderId: string;
  doc: DocType;
  vendorOrderId?: string;
  showPrint?: boolean;
}) {
  const params = new URLSearchParams({ doc: docFilenameSuffix[doc] });
  if (vendorOrderId) params.set("vendorOrderId", vendorOrderId);
  const downloadHref = `/api/orders/${orderId}/pdf?${params.toString()}`;

  return (
    <div className="flex items-center justify-end gap-2 mb-3 no-print">
      {showPrint ? <PrintButton /> : null}
      <a
        href={downloadHref}
        className="inline-flex items-center justify-center min-h-11 px-4 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)]"
      >
        Download PDF
      </a>
    </div>
  );
}
