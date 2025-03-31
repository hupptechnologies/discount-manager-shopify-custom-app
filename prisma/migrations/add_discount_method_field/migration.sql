-- Create new ENUM type for discount method
CREATE TYPE "DiscountMethod" AS ENUM ('CUSTOM', 'AUTOMATIC');

-- Alter DiscountCode table to add the new column discountMethod
ALTER TABLE "DiscountCode" 
ADD COLUMN "discountMethod" "DiscountMethod" NOT NULL DEFAULT 'CUSTOM';

-- Optionally, if you want to create an index for this new field, you can add:
-- CREATE INDEX "DiscountCode_discountMethod_index" ON "DiscountCode"("discountMethod");
