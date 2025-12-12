-- CreateEnum
CREATE TYPE "TenantTier" AS ENUM ('CONTENT_EDITOR', 'BUILDER');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(255) NOT NULL,
    "business_name" VARCHAR(255) NOT NULL,
    "business_type" VARCHAR(50),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "enabled_features" JSONB NOT NULL DEFAULT '{}',
    "tier" "TenantTier" NOT NULL DEFAULT 'CONTENT_EDITOR',
    "design_tokens" JSONB,
    "theme_config" JSONB NOT NULL DEFAULT '{}',
    "header_config" JSONB,
    "footer_config" JSONB,
    "menus_config" JSONB,
    "logos_config" JSONB,
    "plan_limits" JSONB NOT NULL DEFAULT '{}',
    "payment_config" JSONB,
    "payment_provider" VARCHAR(20),
    "logo_url" TEXT,
    "meta_description" TEXT,
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_domains" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "ssl_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "verified_at" TIMESTAMP(3),
    "verification_token" VARCHAR(255),
    "environment" VARCHAR(20) NOT NULL DEFAULT 'production',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clerk_user_id" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "avatar_url" TEXT,
    "password_hash" VARCHAR(255),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" VARCHAR(255),
    "verification_token_expires" TIMESTAMP(3),
    "reset_token" VARCHAR(255),
    "reset_token_expires" TIMESTAMP(3),
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "agency_role" VARCHAR(50),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "last_login_at" TIMESTAMP(3),
    "last_login_ip" TEXT,
    "token_version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "invited_by" TEXT,
    "invitation_accepted_at" TIMESTAMP(3),
    "last_active_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_assignments" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "removed_at" TIMESTAMP(3),

    CONSTRAINT "project_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "uploaded_by" TEXT,
    "file_key" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_type" VARCHAR(50) NOT NULL,
    "mime_type" VARCHAR(100),
    "size_bytes" BIGINT,
    "width" INTEGER,
    "height" INTEGER,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "alt_text" TEXT,
    "usage_context" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" JSONB,
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "author_id" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "template" VARCHAR(50),
    "page_type" VARCHAR(50),
    "is_system_page" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "featured_image_id" TEXT,
    "category" VARCHAR(100),
    "tags" TEXT[],
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "author_id" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" VARCHAR(50) NOT NULL,
    "resource_type" VARCHAR(50) NOT NULL,
    "resource_id" TEXT,
    "changes" JSONB,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_usage" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "total_requests" BIGINT NOT NULL DEFAULT 0,
    "bandwidth_mb" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "storage_mb" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "products_count" INTEGER NOT NULL DEFAULT 0,
    "pages_count" INTEGER NOT NULL DEFAULT 0,
    "posts_count" INTEGER NOT NULL DEFAULT 0,
    "assets_count" INTEGER NOT NULL DEFAULT 0,
    "users_count" INTEGER NOT NULL DEFAULT 0,
    "page_views" BIGINT NOT NULL DEFAULT 0,
    "unique_visitors" BIGINT NOT NULL DEFAULT 0,
    "orders_count" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" VARCHAR(255),
    "events" TEXT[],
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "last_triggered_at" TIMESTAMP(3),
    "last_success_at" TIMESTAMP(3),
    "last_failure_at" TIMESTAMP(3),
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_deliveries" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "webhook_id" TEXT NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "payload" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "status_code" INTEGER,
    "response_body" TEXT,
    "error_message" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "next_retry_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "parent_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "category_id" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "short_description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "compare_at_price" DECIMAL(10,2),
    "cost_per_item" DECIMAL(10,2),
    "sku" VARCHAR(100),
    "barcode" VARCHAR(100),
    "track_inventory" BOOLEAN NOT NULL DEFAULT true,
    "inventory_qty" INTEGER NOT NULL DEFAULT 0,
    "allow_backorder" BOOLEAN NOT NULL DEFAULT false,
    "low_stock_threshold" INTEGER DEFAULT 10,
    "images" JSONB,
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "has_variants" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "product_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "options" JSONB NOT NULL,
    "price" DECIMAL(10,2),
    "compare_at_price" DECIMAL(10,2),
    "sku" VARCHAR(100),
    "barcode" VARCHAR(100),
    "inventory_qty" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone" VARCHAR(50),
    "has_account" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT,
    "accepts_marketing" BOOLEAN NOT NULL DEFAULT false,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" TEXT NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "company" VARCHAR(255),
    "address1" VARCHAR(255) NOT NULL,
    "address2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100),
    "country" VARCHAR(2) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "phone" VARCHAR(50),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "order_number" INTEGER NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "shipping_address_id" TEXT,
    "billing_address_id" TEXT,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "shipping" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "payment_method" VARCHAR(50),
    "transaction_id" VARCHAR(255),
    "fulfillment_status" VARCHAR(20) NOT NULL DEFAULT 'unfulfilled',
    "shipping_method" VARCHAR(100),
    "tracking_number" VARCHAR(255),
    "tracking_url" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'open',
    "customer_note" TEXT,
    "staff_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,
    "product_title" VARCHAR(255) NOT NULL,
    "variant_title" VARCHAR(255),
    "sku" VARCHAR(100),
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "fulfilled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "tenants_slug_idx" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

-- CreateIndex
CREATE INDEX "idx_tenants_tier" ON "tenants"("tier");

-- CreateIndex
CREATE INDEX "idx_tenants_business_type" ON "tenants"("business_type");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_domains_domain_key" ON "tenant_domains"("domain");

-- CreateIndex
CREATE INDEX "idx_tenant_domains_tenant" ON "tenant_domains"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_tenant_domains_domain" ON "tenant_domains"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_user_id_key" ON "users"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_token_key" ON "users"("verification_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_token_key" ON "users"("reset_token");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_clerk_id" ON "users"("clerk_user_id");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "idx_tenant_users_tenant" ON "tenant_users"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_tenant_users_user" ON "tenant_users"("user_id");

-- CreateIndex
CREATE INDEX "idx_tenant_users_role" ON "tenant_users"("tenant_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_users_tenant_id_user_id_key" ON "tenant_users"("tenant_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_project_assignments_user" ON "project_assignments"("user_id");

-- CreateIndex
CREATE INDEX "idx_project_assignments_tenant" ON "project_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_project_assignments_status" ON "project_assignments"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "project_assignments_user_id_tenant_id_key" ON "project_assignments"("user_id", "tenant_id");

-- CreateIndex
CREATE INDEX "idx_assets_tenant" ON "assets"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_assets_type" ON "assets"("tenant_id", "file_type");

-- CreateIndex
CREATE INDEX "idx_assets_usage" ON "assets"("tenant_id", "usage_context");

-- CreateIndex
CREATE INDEX "idx_assets_uploader" ON "assets"("uploaded_by");

-- CreateIndex
CREATE INDEX "idx_pages_tenant" ON "pages"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_pages_tenant_slug" ON "pages"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "idx_pages_tenant_status" ON "pages"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "idx_pages_author" ON "pages"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "pages_tenant_id_slug_key" ON "pages"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "idx_posts_tenant" ON "posts"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_posts_tenant_slug" ON "posts"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "idx_posts_category" ON "posts"("tenant_id", "category");

-- CreateIndex
CREATE INDEX "idx_posts_author" ON "posts"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_tenant_id_slug_key" ON "posts"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "idx_audit_logs_tenant_time" ON "audit_logs"("tenant_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_audit_logs_user" ON "audit_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_audit_logs_resource" ON "audit_logs"("resource_type", "resource_id");

-- CreateIndex
CREATE INDEX "idx_audit_logs_action" ON "audit_logs"("tenant_id", "action");

-- CreateIndex
CREATE INDEX "idx_tenant_usage_tenant_period" ON "tenant_usage"("tenant_id", "period_start" DESC);

-- CreateIndex
CREATE INDEX "idx_tenant_usage_period" ON "tenant_usage"("period_start");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_usage_tenant_id_period_start_key" ON "tenant_usage"("tenant_id", "period_start");

-- CreateIndex
CREATE INDEX "idx_webhooks_tenant" ON "webhooks"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_webhooks_status" ON "webhooks"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "idx_webhook_deliveries_webhook" ON "webhook_deliveries"("webhook_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_product_categories_tenant" ON "product_categories"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_product_categories_tenant_slug" ON "product_categories"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "idx_products_tenant" ON "products"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_products_status" ON "products"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "idx_products_category" ON "products"("tenant_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_products_tenant_slug" ON "products"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "idx_product_variants_product" ON "product_variants"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_product_variants_options" ON "product_variants"("product_id", "options");

-- CreateIndex
CREATE INDEX "idx_customers_tenant" ON "customers"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_customers_user" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_customers_tenant_email" ON "customers"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "idx_customer_addresses_customer" ON "customer_addresses"("customer_id");

-- CreateIndex
CREATE INDEX "idx_orders_tenant" ON "orders"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_orders_customer" ON "orders"("customer_id");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "orders"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "idx_orders_payment_status" ON "orders"("tenant_id", "payment_status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_orders_tenant_number" ON "orders"("tenant_id", "order_number");

-- CreateIndex
CREATE INDEX "idx_order_items_order" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_items_product" ON "order_items"("product_id");

-- AddForeignKey
ALTER TABLE "tenant_domains" ADD CONSTRAINT "tenant_domains_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_users" ADD CONSTRAINT "tenant_users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_users" ADD CONSTRAINT "tenant_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_users" ADD CONSTRAINT "tenant_users_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assignments" ADD CONSTRAINT "project_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assignments" ADD CONSTRAINT "project_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_usage" ADD CONSTRAINT "tenant_usage_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "customer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "customer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
