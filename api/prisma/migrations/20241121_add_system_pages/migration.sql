-- Add system page tracking to Pages table
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "page_type" VARCHAR(50);
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "is_system_page" BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "idx_pages_page_type" ON "pages"("page_type");
CREATE INDEX IF NOT EXISTS "idx_pages_system" ON "pages"("tenant_id", "is_system_page");

-- Add comment explaining page_type values
COMMENT ON COLUMN "pages"."page_type" IS 'System page type: home, privacy-policy, terms-of-service, cookie-policy, coming-soon, under-construction';
