-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'salesperson');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('draft', 'finalized', 'installed', 'paid', 'voided');

-- CreateEnum
CREATE TYPE "BalanceTerm" AS ENUM ('cash', 'cod', 'finance');

-- CreateEnum
CREATE TYPE "SubfloorType" AS ENUM ('wood', 'concrete', 'softConcrete', 'other');

-- CreateEnum
CREATE TYPE "InstallMethod" AS ENUM ('glueDown', 'nailDown', 'click', 'clip', 'other');

-- CreateEnum
CREATE TYPE "AreaName" AS ENUM ('livingRoom', 'diningRoom', 'familyRoom', 'hall', 'bedroom', 'closet', 'entrance', 'bathroom', 'den', 'kitchen', 'stairs', 'office', 'laundry', 'other');

-- CreateEnum
CREATE TYPE "CarpetType" AS ENUM ('plush', 'berber', 'glueDown', 'plushWP', 'berberWP');

-- CreateEnum
CREATE TYPE "MoldingType" AS ENUM ('baseShoe', 'baseboard', 'rubberCover4in', 'quarterRound', 'endMolding', 'tMolding', 'reducer', 'wallBase', 'stairNosing', 'metalStrip', 'filmOnly', 'filmAndFoam', 'silentStep', 'bullNose');

-- CreateEnum
CREATE TYPE "RubberCoverColor" AS ENUM ('gold', 'silver', 'glue', 'none');

-- CreateEnum
CREATE TYPE "FixtureType" AS ENUM ('stove', 'fridge', 'washer', 'dryer', 'waterbed', 'piano', 'organ', 'stool', 'other');

-- CreateEnum
CREATE TYPE "RemovalType" AS ENUM ('tile', 'glueDownCarpet', 'poolTable', 'stone', 'stool', 'bigScreenTV', 'wood', 'refrigerator', 'piano', 'vinyl', 'washer', 'stove', 'laminate', 'dryer', 'other');

-- CreateEnum
CREATE TYPE "VendorOrderStatus" AS ENUM ('draft', 'sent', 'received', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvertisingSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdvertisingSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'CA',
    "zip" TEXT NOT NULL,
    "phoneHome" TEXT,
    "phoneWork" TEXT,
    "phoneExt" TEXT,
    "email" TEXT,
    "shipFirstName" TEXT,
    "shipLastName" TEXT,
    "shipAddressLine1" TEXT,
    "shipCity" TEXT,
    "shipState" TEXT,
    "shipZip" TEXT,
    "shipPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "invoiceNumber" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'draft',
    "dateOfSale" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" TEXT NOT NULL,
    "salespersonId" TEXT NOT NULL,
    "advertisingSourceId" TEXT,
    "hasCabinet" BOOLEAN NOT NULL DEFAULT false,
    "hasCarpet" BOOLEAN NOT NULL DEFAULT false,
    "hasVinyl" BOOLEAN NOT NULL DEFAULT false,
    "hasWood" BOOLEAN NOT NULL DEFAULT false,
    "hasCeramic" BOOLEAN NOT NULL DEFAULT false,
    "hasCounterTop" BOOLEAN NOT NULL DEFAULT false,
    "hasFireplace" BOOLEAN NOT NULL DEFAULT false,
    "hasShower" BOOLEAN NOT NULL DEFAULT false,
    "taxCents" INTEGER NOT NULL DEFAULT 0,
    "depositCents" INTEGER NOT NULL DEFAULT 0,
    "subtotalCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "balanceCents" INTEGER NOT NULL DEFAULT 0,
    "basedOn" TEXT,
    "remarks" TEXT,
    "balanceTerm" "BalanceTerm",
    "availabilityDate" TIMESTAMP(3),
    "deliveryDate" TIMESTAMP(3),
    "installerName" TEXT,
    "installationDate" TIMESTAMP(3),
    "orderTakenByUserId" TEXT,
    "subfloorType" "SubfloorType",
    "installSubfloor" BOOLEAN,
    "pullOldFloor" BOOLEAN,
    "oldFloorType" TEXT,
    "oldFloorSize" TEXT,
    "removeOldCarpetAndPad" BOOLEAN,
    "removeOldTagStrip" BOOLEAN,
    "newTackStripType" TEXT,
    "hasSteps" BOOLEAN,
    "numSteps" INTEGER,
    "emptyHouse" BOOLEAN,
    "heavyFurniture" BOOLEAN,
    "heavyFurnitureType" TEXT,
    "installMethod" "InstallMethod",
    "specialInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderArea" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "areaName" "AreaName" NOT NULL,
    "quantity" INTEGER,
    "description" TEXT,
    "lineTotalCents" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OrderArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderMaterial" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "materialId" TEXT,
    "millStyle" TEXT,
    "size" TEXT,
    "color" TEXT,
    "refNumber" TEXT,
    "pad" TEXT,
    "areas" TEXT,
    "carpetType" "CarpetType",
    "unitOfMeasure" TEXT,
    "quantity" DOUBLE PRECISION,
    "unitPriceCents" INTEGER,
    "lineTotalCents" INTEGER,
    "vendorName" TEXT,
    "poNumber" TEXT,
    "willCallDate" TIMESTAMP(3),
    "vendorDeliveryDate" TIMESTAMP(3),

    CONSTRAINT "OrderMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderMolding" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "MoldingType" NOT NULL,
    "quantity" TEXT,
    "isReplaceExisting" BOOLEAN NOT NULL DEFAULT false,
    "rubberCoverColor" "RubberCoverColor",

    CONSTRAINT "OrderMolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderFixture" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "FixtureType" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "OrderFixture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderShower" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shower_walls_sqft" DOUBLE PRECISION,
    "wall_material" TEXT,
    "shower_pan" TEXT,
    "shower_pan_material" TEXT,
    "soap_box_material" TEXT,
    "bench" TEXT,
    "bathroom_floor_sqft" DOUBLE PRECISION,
    "bathroom_floor_material" TEXT,
    "schluter" TEXT,
    "grout_color" TEXT,
    "vertical" BOOLEAN,
    "horizontal" BOOLEAN,

    CONSTRAINT "OrderShower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderTileStone" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "hasTile" BOOLEAN NOT NULL DEFAULT false,
    "hasMarble" BOOLEAN NOT NULL DEFAULT false,
    "hasTravertine" BOOLEAN NOT NULL DEFAULT false,
    "hasSlate" BOOLEAN NOT NULL DEFAULT false,
    "hasTumbleMarble" BOOLEAN NOT NULL DEFAULT false,
    "hasBacksplash" BOOLEAN NOT NULL DEFAULT false,
    "hasFloor" BOOLEAN NOT NULL DEFAULT false,
    "hasFireplace" BOOLEAN NOT NULL DEFAULT false,
    "hasShowerTile" BOOLEAN NOT NULL DEFAULT false,
    "hasWalls" BOOLEAN NOT NULL DEFAULT false,
    "hasCounterTop" BOOLEAN NOT NULL DEFAULT false,
    "hasStone" BOOLEAN NOT NULL DEFAULT false,
    "hasSlab" BOOLEAN NOT NULL DEFAULT false,
    "wonderboard" BOOLEAN,
    "slipSheet" BOOLEAN,
    "seal" BOOLEAN,
    "groutColor" TEXT,

    CONSTRAINT "OrderTileStone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderRemoval" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "RemovalType" NOT NULL,

    CONSTRAINT "OrderRemoval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "vendorId" TEXT,
    "vendorName" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "sidemark" TEXT,
    "faxEmailDate" TIMESTAMP(3),
    "willCallDate" TIMESTAMP(3),
    "deliveryDate" TIMESTAMP(3),
    "deliveryAddress" TEXT,
    "lineItems" JSONB NOT NULL,
    "status" "VendorOrderStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialSuggestion" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "millStyle" TEXT,
    "color" TEXT,
    "size" TEXT,
    "carpetType" "CarpetType",
    "unitOfMeasure" TEXT,
    "usageCount" INTEGER NOT NULL DEFAULT 1,
    "lastVendorName" TEXT,
    "lastUnitPriceCents" INTEGER,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "diff" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAnalysisRun" (
    "id" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "rangeStart" TIMESTAMP(3) NOT NULL,
    "rangeEnd" TIMESTAMP(3) NOT NULL,
    "customQuestion" TEXT,
    "snapshotJson" JSONB NOT NULL,
    "responseMd" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysisRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdvertisingSource_name_key" ON "AdvertisingSource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Order_invoiceNumber_key" ON "Order"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Order_salespersonId_deletedAt_idx" ON "Order"("salespersonId", "deletedAt");

-- CreateIndex
CREATE INDEX "Order_advertisingSourceId_idx" ON "Order"("advertisingSourceId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderMaterial_orderId_lineNumber_idx" ON "OrderMaterial"("orderId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OrderShower_orderId_key" ON "OrderShower"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderTileStone_orderId_key" ON "OrderTileStone"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialSuggestion_fingerprint_key" ON "MaterialSuggestion"("fingerprint");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_salespersonId_fkey" FOREIGN KEY ("salespersonId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_advertisingSourceId_fkey" FOREIGN KEY ("advertisingSourceId") REFERENCES "AdvertisingSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderArea" ADD CONSTRAINT "OrderArea_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderMaterial" ADD CONSTRAINT "OrderMaterial_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderMolding" ADD CONSTRAINT "OrderMolding_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFixture" ADD CONSTRAINT "OrderFixture_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderShower" ADD CONSTRAINT "OrderShower_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTileStone" ADD CONSTRAINT "OrderTileStone_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRemoval" ADD CONSTRAINT "OrderRemoval_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOrder" ADD CONSTRAINT "VendorOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOrder" ADD CONSTRAINT "VendorOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
