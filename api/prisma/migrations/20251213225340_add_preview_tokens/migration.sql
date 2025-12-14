-- CreateTable
CREATE TABLE "preview_tokens" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "content_type" VARCHAR(20) NOT NULL,
    "content_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preview_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "preview_tokens_token_key" ON "preview_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_preview_tokens_token" ON "preview_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_preview_tokens_tenant" ON "preview_tokens"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_preview_tokens_expiry" ON "preview_tokens"("expires_at");

-- AddForeignKey
ALTER TABLE "preview_tokens" ADD CONSTRAINT "preview_tokens_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preview_tokens" ADD CONSTRAINT "preview_tokens_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
