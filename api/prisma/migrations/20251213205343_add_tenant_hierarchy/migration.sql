-- CreateEnum
CREATE TYPE "TenantType" AS ENUM ('AGENCY', 'CLIENT', 'SUB_CLIENT');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('BUSINESS', 'INDIVIDUAL');

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "client_type" "ClientType",
ADD COLUMN     "parent_tenant_id" TEXT,
ADD COLUMN     "tenant_type" "TenantType" NOT NULL DEFAULT 'CLIENT';

-- CreateIndex
CREATE INDEX "idx_tenants_parent" ON "tenants"("parent_tenant_id");

-- CreateIndex
CREATE INDEX "idx_tenants_type" ON "tenants"("tenant_type");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_parent_tenant_id_fkey" FOREIGN KEY ("parent_tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
