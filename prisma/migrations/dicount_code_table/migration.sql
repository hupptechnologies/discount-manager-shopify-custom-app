CREATE TYPE "DiscountType" AS ENUM ('FIXED', 'PERCENT');

CREATE TABLE "DiscountCode" (
  "id" SERIAL PRIMARY KEY,
  "code" VARCHAR(255) NOT NULL UNIQUE,
  "title" VARCHAR(255) NOT NULL,
  "shop" TEXT NOT NULL,
  "description" TEXT,
  "discountAmount" FLOAT NOT NULL,
  "discountType" "DiscountType" NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "startDate" TIMESTAMPTZ NOT NULL,
  "endDate" TIMESTAMPTZ NOT NULL,
  "usageLimit" INT NOT NULL,
  "usedCount" INT DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "DiscountCode_code_index" ON "DiscountCode"("code");
