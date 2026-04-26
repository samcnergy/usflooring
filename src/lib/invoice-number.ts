// Server-side invoice number assignment via Postgres SEQUENCE. The seed
// creates `invoice_number_seq START 6515`. Always use this inside the same
// transaction as the order insert so a rolled-back insert doesn't leak a
// gap-free guarantee (sequences advance even on rollback, but that's fine —
// gaps are acceptable; duplicates are not).

import type { Prisma } from "@prisma/client";

export async function nextInvoiceNumber(
  tx: Prisma.TransactionClient,
): Promise<number> {
  const rows = await tx.$queryRawUnsafe<{ nextval: bigint }[]>(
    `SELECT nextval('invoice_number_seq') AS nextval`,
  );
  return Number(rows[0].nextval);
}
