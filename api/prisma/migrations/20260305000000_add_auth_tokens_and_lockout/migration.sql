-- AlterTable: Add auth security fields to users
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "phone" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "avatar" TEXT,
ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "locked_until" TIMESTAMP(3);

-- AlterTable: Remove legacy reset token columns (replaced by password_reset_tokens table)
ALTER TABLE "users"
DROP COLUMN IF EXISTS "reset_token",
DROP COLUMN IF EXISTS "reset_token_expires";

-- CreateTable
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "token" VARCHAR(255) NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "token" VARCHAR(255) NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_user" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_token" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_password_reset_tokens_user" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_password_reset_tokens_token" ON "password_reset_tokens"("token");

-- AddForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_user_id_fkey";
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT IF EXISTS "password_reset_tokens_user_id_fkey";
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
