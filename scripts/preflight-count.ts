// Pre-flight check before the destructive restructure migration (§ 0a of
// the order-form-restructure prompt).

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.local" });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL or DATABASE_URL must be set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [orderCount, roomCount, lineItemCount, vendorOrderCount, customerCount] = await Promise.all([
    prisma.order.count({ where: { deletedAt: null } }),
    prisma.orderRoom.count(),
    prisma.orderLineItem.count(),
    prisma.vendorOrder.count(),
    prisma.customer.count({ where: { deletedAt: null } }),
  ]);

  console.log("\nPre-flight check (post-restructure):");
  console.log(`  Active orders:          ${orderCount}`);
  console.log(`  OrderRoom rows:         ${roomCount}`);
  console.log(`  OrderLineItem rows:     ${lineItemCount}`);
  console.log(`  VendorOrder rows:       ${vendorOrderCount}`);
  console.log(`  Active customers:       ${customerCount}`);
  console.log("");
  if (orderCount <= 5) {
    console.log("  ✅ ≤5 active orders — safe to proceed with destructive migration");
    console.log("     after explicit user go-ahead (any test data will be lost).");
  } else {
    console.log("  ⛔ More than 5 active orders — DO NOT proceed without writing");
    console.log("     a data migration script that maps OrderArea + OrderMaterial");
    console.log("     into OrderRoom + OrderLineItem.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
