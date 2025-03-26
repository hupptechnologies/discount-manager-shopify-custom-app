-- Migration for removing description and adding advancedRule field to DiscountCode

-- Drop the description column
ALTER TABLE "DiscountCode" 
  DROP COLUMN "description";

-- Add the new advancedRule column with JSONB type (PostgreSQL)
ALTER TABLE "DiscountCode" 
  ADD COLUMN "advancedRule" JSONB;
