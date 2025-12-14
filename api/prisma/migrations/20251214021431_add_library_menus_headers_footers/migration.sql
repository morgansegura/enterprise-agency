-- CreateEnum
CREATE TYPE "ComponentScope" AS ENUM ('GLOBAL', 'TENANT');

-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('MENU', 'HEADER', 'FOOTER', 'SECTION', 'BLOCK');

-- CreateEnum
CREATE TYPE "HeaderBehavior" AS ENUM ('STATIC', 'FIXED', 'STICKY', 'SCROLL_HIDE', 'TRANSPARENT');

-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "footer_id" TEXT,
ADD COLUMN     "header_id" TEXT;

-- CreateTable
CREATE TABLE "library_components" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "scope" "ComponentScope" NOT NULL DEFAULT 'TENANT',
    "type" "ComponentType" NOT NULL,
    "content" JSONB NOT NULL,
    "category" VARCHAR(100),
    "tags" TEXT[],
    "thumbnail_url" TEXT,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'horizontal',
    "items" JSONB NOT NULL DEFAULT '[]',
    "style" JSONB NOT NULL DEFAULT '{}',
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "headers" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "behavior" "HeaderBehavior" NOT NULL DEFAULT 'STATIC',
    "scroll_threshold" INTEGER,
    "animation" VARCHAR(20) NOT NULL DEFAULT 'none',
    "zones" JSONB NOT NULL DEFAULT '{}',
    "style" JSONB NOT NULL DEFAULT '{}',
    "transparent_style" JSONB,
    "menu_id" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footers" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "layout" VARCHAR(20) NOT NULL DEFAULT 'simple',
    "zones" JSONB NOT NULL DEFAULT '{}',
    "style" JSONB NOT NULL DEFAULT '{}',
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_library_components_tenant" ON "library_components"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_library_components_scope" ON "library_components"("scope");

-- CreateIndex
CREATE INDEX "idx_library_components_type" ON "library_components"("type");

-- CreateIndex
CREATE INDEX "idx_library_components_category" ON "library_components"("category");

-- CreateIndex
CREATE UNIQUE INDEX "uq_library_components_tenant_slug_type" ON "library_components"("tenant_id", "slug", "type");

-- CreateIndex
CREATE INDEX "idx_menus_tenant" ON "menus"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_menus_tenant_slug" ON "menus"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "idx_headers_tenant" ON "headers"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_headers_tenant_slug" ON "headers"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "idx_footers_tenant" ON "footers"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_footers_tenant_slug" ON "footers"("tenant_id", "slug");

-- AddForeignKey
ALTER TABLE "library_components" ADD CONSTRAINT "library_components_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "headers" ADD CONSTRAINT "headers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "headers" ADD CONSTRAINT "headers_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "footers" ADD CONSTRAINT "footers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "headers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_footer_id_fkey" FOREIGN KEY ("footer_id") REFERENCES "footers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
