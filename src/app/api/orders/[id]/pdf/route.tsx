import { renderToStream } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { InvoicePDF } from "@/pdf/InvoicePDF";
import { WorkOrderPDF } from "@/pdf/WorkOrderPDF";

import { VendorOrderPDF } from "@/pdf/VendorOrderPDF";
import { InstallationInstructionPDF } from "@/pdf/InstallationInstructionPDF";

type Params = Promise<{ id: string }>;

export async function GET(req: Request, { params }: { params: Params }) {
  const me = await getSessionUser();
  if (!me) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const url = new URL(req.url);
  const doc = url.searchParams.get("doc") ?? "invoice";
  const vendorOrderId = url.searchParams.get("vendorOrderId");
  const categoryFilter = url.searchParams.get("category");

  // Fetch order with everything; ownership-check for salespeople.
  const order = await prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: {
      customer: true,
      salesperson: { select: { id: true, fullName: true, email: true } },
      advertisingSource: true,
      rooms: true,
      lineItems: { orderBy: { position: "asc" }, include: { room: true } },
      inclusions: true,
      exclusions: true,
      moldings: true,
      fixtures: true,
      installNotes: true,
    },
  });
  if (!order) return new Response("Not found", { status: 404 });
  if (me.role === "salesperson" && order.salespersonId !== me.id) {
    return new Response("Forbidden", { status: 403 });
  }

  let stream: NodeJS.ReadableStream;
  let filename: string;

  switch (doc) {
    case "invoice":
      stream = await renderToStream(
        <InvoicePDF order={order} downloadedBy={me.fullName} />,
      );
      filename = `USFKB-${order.invoiceNumber}-invoice.pdf`;
      break;
    case "workorder":
      stream = await renderToStream(
        <WorkOrderPDF
          order={order}
          showPrices={false}
          downloadedBy={me.fullName}
        />,
      );
      filename = `USFKB-${order.invoiceNumber}-workorder.pdf`;
      break;
    case "install": {
      const orderForPdf = categoryFilter
        ? { ...order, lineItems: order.lineItems.filter((li) => li.category === categoryFilter) }
        : order;
      stream = await renderToStream(
        <InstallationInstructionPDF order={orderForPdf} downloadedBy={me.fullName} />,
      );
      filename = categoryFilter
        ? `USFKB-${order.invoiceNumber}-install-${categoryFilter}.pdf`
        : `USFKB-${order.invoiceNumber}-install-instructions.pdf`;
      break;
    }
    case "vendor": {
      if (!vendorOrderId) return new Response("vendorOrderId required for vendor PDF", { status: 400 });
      const vo = await prisma.vendorOrder.findFirst({
        where: { id: vendorOrderId, orderId: id },
        include: { order: { include: { customer: true } } },
      });
      if (!vo) return new Response("Vendor order not found", { status: 404 });
      stream = await renderToStream(
        <VendorOrderPDF vendorOrder={vo} downloadedBy={me.fullName} />,
      );
      filename = `USFKB-${order.invoiceNumber}-vendor-${vo.poNumber}.pdf`;
      break;
    }
    default:
      return new Response(`Unknown doc type: ${doc}`, { status: 400 });
  }

  const inline = url.searchParams.get("inline") === "1";
  return new Response(stream as unknown as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
