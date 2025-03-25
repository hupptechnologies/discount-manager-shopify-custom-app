-- Create new ENUM type for discount scope
CREATE TYPE "DiscountScope" AS ENUM ('PRODUCT', 'ORDER', 'BUYXGETY', 'SHIPPING');

-- Alter DiscountCode table to add the new column discountScope
ALTER TABLE "DiscountCode" 
ADD COLUMN "discountScope" "DiscountScope" NOT NULL DEFAULT 'PRODUCT';

-- Optionally, if you want to create an index for this new field, you can add:
-- CREATE INDEX "DiscountCode_discountScope_index" ON "DiscountCode"("discountScope");
