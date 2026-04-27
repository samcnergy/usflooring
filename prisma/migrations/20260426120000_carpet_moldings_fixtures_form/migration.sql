-- CreateEnum
CREATE TYPE "CarpetType" AS ENUM ('plush', 'berber', 'glueDown', 'plushWP', 'berberWP');

-- AlterEnum
ALTER TYPE "FixtureType" ADD VALUE 'tablesChairs';

-- AlterTable: Order
ALTER TABLE "Order" ADD COLUMN "moldingsRemoveReplace" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: OrderLineItem
ALTER TABLE "OrderLineItem" ADD COLUMN "carpetType" "CarpetType";
ALTER TABLE "OrderLineItem" ADD COLUMN "pad" TEXT;
ALTER TABLE "OrderLineItem" ADD COLUMN "lineInstallMethod" "InstallMethod";
