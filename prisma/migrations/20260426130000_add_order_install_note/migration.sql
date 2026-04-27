-- CreateTable
CREATE TABLE "OrderInstallNote" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "category" "LineCategory" NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "OrderInstallNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderInstallNote_orderId_category_key" ON "OrderInstallNote"("orderId", "category");

-- AddForeignKey
ALTER TABLE "OrderInstallNote" ADD CONSTRAINT "OrderInstallNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
