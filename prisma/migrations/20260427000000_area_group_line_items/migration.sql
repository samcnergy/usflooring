-- RemoveUniqueConstraint
DROP INDEX IF EXISTS "OrderRoom_orderId_room_key";

-- CreateIndex
CREATE INDEX "OrderRoom_orderId_idx" ON "OrderRoom"("orderId");

-- AlterTable
ALTER TABLE "OrderLineItem" ADD COLUMN "roomId" TEXT;

-- AddForeignKey
ALTER TABLE "OrderLineItem" ADD CONSTRAINT "OrderLineItem_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "OrderRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "OrderLineItem_roomId_idx" ON "OrderLineItem"("roomId");
