-- CreateTable
CREATE TABLE "product_images" (
    "id" UUID NOT NULL,
    "content_type" VARCHAR(40) NOT NULL,
    "data" BYTEA NOT NULL,
    "byte_size" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_login_attempts" (
    "id" UUID NOT NULL,
    "ip" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_login_attempts_ip_created_at_idx" ON "admin_login_attempts"("ip", "created_at");

-- Keep stored photos small: the admin page resizes them before upload.
ALTER TABLE "product_images"
    ADD CONSTRAINT "product_images_byte_size_check"
    CHECK ("byte_size" > 0 AND "byte_size" <= 2000000);
