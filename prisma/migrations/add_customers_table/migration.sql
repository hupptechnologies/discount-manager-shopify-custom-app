CREATE TABLE "customers" (
	"id" SERIAL PRIMARY KEY,
	"shop" VARCHAR(255) NOT NULL,
	"shopify_customer_id" VARCHAR(255),
	"first_name" VARCHAR(100),
	"last_name" VARCHAR(100),
	"email" VARCHAR(255) UNIQUE NOT NULL,
	"phone" VARCHAR(20),
	"used_discount_code_count" INTEGER DEFAULT 0,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);