-- Add soft-delete support to the User table.
-- Orders reference salespersonId via a FK; soft-deleting the row (setting
-- deletedAt) rather than hard-deleting keeps every FK intact so salesperson
-- names continue to resolve on all existing invoices.
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);
