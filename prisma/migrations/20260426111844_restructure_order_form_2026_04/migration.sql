/*
  Warnings:

  - You are about to drop the column `carpetType` on the `MaterialSuggestion` table. All the data in the column will be lost.
  - You are about to drop the column `millStyle` on the `MaterialSuggestion` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `MaterialSuggestion` table. All the data in the column will be lost.
  - You are about to drop the column `unitOfMeasure` on the `MaterialSuggestion` table. All the data in the column will be lost.
  - You are about to drop the column `hasCabinet` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `hasCarpet` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `hasCeramic` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `hasCounterTop` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `hasFireplace` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `hasShower` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `hasVinyl` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `hasWood` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `OrderArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderMaterial` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `MaterialSuggestion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PricingMode" AS ENUM ('itemized', 'flatTotal');

-- CreateEnum
CREATE TYPE "RoomName" AS ENUM ('livingRoom', 'diningRoom', 'familyRoom', 'hall', 'bedroom', 'closet', 'entrance', 'bathroom', 'masterBath', 'den', 'kitchen', 'stairs', 'office', 'laundry', 'downstairs', 'upstairs', 'outside', 'other');

-- CreateEnum
CREATE TYPE "LineCategory" AS ENUM ('cabinet', 'carpet', 'vinyl', 'wood', 'ceramic', 'counterTop', 'fireplace', 'shower', 'tile', 'stone', 'molding', 'labor', 'fixture', 'other');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('sqft', 'sqyd', 'slab', 'box', 'piece', 'linearFt', 'each', 'hour', 'lump');

-- CreateEnum
CREATE TYPE "InclusionType" AS ENUM ('material', 'installation', 'removalAndHaulAway', 'pad', 'underlayment', 'moveFurniture', 'demo', 'sandAndCement', 'hotMop', 'fabrication', 'sinkCutOut', 'fullBacksplash', 'straightEdgeNosing', 'delivery', 'roughPlumbing', 'customerProvidedVanityInstall', 'customNote');

-- CreateEnum
CREATE TYPE "ExclusionType" AS ENUM ('plumbing', 'patchAndPaint', 'electrical', 'leveling', 'permits', 'disposal', 'customNote');

-- DropForeignKey
ALTER TABLE "OrderArea" DROP CONSTRAINT "OrderArea_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderMaterial" DROP CONSTRAINT "OrderMaterial_orderId_fkey";

-- AlterTable
ALTER TABLE "MaterialSuggestion" DROP COLUMN "carpetType",
DROP COLUMN "millStyle",
DROP COLUMN "size",
DROP COLUMN "unitOfMeasure",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "category" "LineCategory" NOT NULL,
ADD COLUMN     "sizeSpec" TEXT,
ADD COLUMN     "style" TEXT,
ADD COLUMN     "unit" "UnitOfMeasure";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "hasCabinet",
DROP COLUMN "hasCarpet",
DROP COLUMN "hasCeramic",
DROP COLUMN "hasCounterTop",
DROP COLUMN "hasFireplace",
DROP COLUMN "hasShower",
DROP COLUMN "hasVinyl",
DROP COLUMN "hasWood",
ADD COLUMN     "accessInstructions" TEXT,
ADD COLUMN     "depositInstructions" TEXT,
ADD COLUMN     "jobSiteAddressLine1" TEXT,
ADD COLUMN     "jobSiteCity" TEXT,
ADD COLUMN     "jobSiteSameAsBilling" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "jobSiteState" TEXT,
ADD COLUMN     "jobSiteZip" TEXT,
ADD COLUMN     "pricingMode" "PricingMode" NOT NULL DEFAULT 'itemized',
ADD COLUMN     "siteContactName" TEXT,
ADD COLUMN     "siteContactPhone" TEXT;

-- DropTable
DROP TABLE "OrderArea";

-- DropTable
DROP TABLE "OrderMaterial";

-- DropEnum
DROP TYPE "AreaName";

-- DropEnum
DROP TYPE "CarpetType";

-- CreateTable
CREATE TABLE "OrderRoom" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "room" "RoomName" NOT NULL,
    "quantity" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderLineItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "category" "LineCategory" NOT NULL,
    "brand" TEXT,
    "style" TEXT,
    "color" TEXT,
    "sizeSpec" TEXT,
    "sku" TEXT,
    "quantity" DOUBLE PRECISION,
    "unit" "UnitOfMeasure",
    "unitPriceCents" INTEGER,
    "lineTotalCents" INTEGER,
    "notes" TEXT,
    "materialId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderInclusion" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "InclusionType" NOT NULL,
    "customText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderInclusion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderExclusion" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "ExclusionType" NOT NULL,
    "customText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderExclusion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderRoom_orderId_room_key" ON "OrderRoom"("orderId", "room");

-- CreateIndex
CREATE INDEX "OrderLineItem_orderId_position_idx" ON "OrderLineItem"("orderId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "OrderInclusion_orderId_type_customText_key" ON "OrderInclusion"("orderId", "type", "customText");

-- CreateIndex
CREATE UNIQUE INDEX "OrderExclusion_orderId_type_customText_key" ON "OrderExclusion"("orderId", "type", "customText");

-- CreateIndex
CREATE INDEX "MaterialSuggestion_category_usageCount_idx" ON "MaterialSuggestion"("category", "usageCount");

-- CreateIndex
CREATE INDEX "MaterialSuggestion_brand_usageCount_idx" ON "MaterialSuggestion"("brand", "usageCount");

-- AddForeignKey
ALTER TABLE "OrderRoom" ADD CONSTRAINT "OrderRoom_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLineItem" ADD CONSTRAINT "OrderLineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderInclusion" ADD CONSTRAINT "OrderInclusion_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderExclusion" ADD CONSTRAINT "OrderExclusion_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
