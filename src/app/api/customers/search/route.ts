import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  // Support "John Smith" multi-word queries — all words must match first or last name
  const words = q.split(/\s+/).filter(Boolean);

  const customers = await prisma.customer.findMany({
    where: {
      deletedAt: null,
      AND: words.map((word) => ({
        OR: [
          { firstName: { contains: word, mode: "insensitive" as const } },
          { lastName:  { contains: word, mode: "insensitive" as const } },
        ],
      })),
    },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      firstName: true, lastName: true,
      addressLine1: true, city: true, state: true, zip: true,
      phoneHome: true, phoneWork: true, phoneExt: true, email: true,
      shipFirstName: true, shipLastName: true, shipAddressLine1: true,
      shipCity: true, shipState: true, shipZip: true, shipPhone: true,
      orders: {
        where: { deletedAt: null },
        orderBy: { dateOfSale: "desc" },
        take: 1,
        select: { dateOfSale: true },
      },
    },
  });

  return NextResponse.json(
    customers.map((c) => ({
      id: c.id,
      firstName: c.firstName, lastName: c.lastName,
      addressLine1: c.addressLine1, city: c.city, state: c.state, zip: c.zip,
      phoneHome: c.phoneHome, phoneWork: c.phoneWork, phoneExt: c.phoneExt, email: c.email,
      shipFirstName: c.shipFirstName, shipLastName: c.shipLastName,
      shipAddressLine1: c.shipAddressLine1, shipCity: c.shipCity,
      shipState: c.shipState, shipZip: c.shipZip, shipPhone: c.shipPhone,
      lastOrderDate: c.orders[0]?.dateOfSale
        ? c.orders[0].dateOfSale.toISOString().slice(0, 10)
        : null,
    })),
  );
}
