// Embeds the PDF route in an iframe so the user sees the actual rendered
// document (the browser's native PDF viewer handles paging, search, print).

export function PdfPreview({
  orderId,
  doc,
  vendorOrderId,
}: {
  orderId: string;
  doc: "workorder" | "dailyworkorder" | "vendor";
  vendorOrderId?: string;
}) {
  const params = new URLSearchParams({ doc, inline: "1" });
  if (vendorOrderId) params.set("vendorOrderId", vendorOrderId);
  const src = `/api/orders/${orderId}/pdf?${params.toString()}`;
  return (
    <iframe
      src={src}
      title={`${doc} preview`}
      className="w-full h-[80vh] border border-marble-200 rounded"
    />
  );
}
