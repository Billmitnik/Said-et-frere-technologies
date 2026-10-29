-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "product_category" AS ENUM ('computers', 'displays', 'accessories', 'storage', 'network', 'bags');

-- CreateTable
CREATE TABLE "products" (
    "id" VARCHAR(120) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category" "product_category" NOT NULL,
    "category_label" VARCHAR(120) NOT NULL,
    "badge" VARCHAR(80) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER,
    "art" VARCHAR(40) NOT NULL,
    "mark" VARCHAR(40) NOT NULL,
    "image" VARCHAR(500) NOT NULL,
    "blend_background" BOOLEAN NOT NULL DEFAULT false,
    "pitch" TEXT,
    "is_demo" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_is_active_sort_order_idx" ON "products"("is_active", "sort_order");

-- Keep invalid negative prices out of the catalog.
ALTER TABLE "products"
    ADD CONSTRAINT "products_price_nonnegative_check"
    CHECK ("price" IS NULL OR "price" >= 0);

