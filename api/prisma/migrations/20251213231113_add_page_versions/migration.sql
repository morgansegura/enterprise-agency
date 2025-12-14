-- CreateTable
CREATE TABLE "page_versions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "page_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB,
    "title" VARCHAR(255) NOT NULL,
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "created_by" TEXT NOT NULL,
    "change_note" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_page_versions_page" ON "page_versions"("page_id");

-- CreateIndex
CREATE INDEX "idx_page_versions_page_version" ON "page_versions"("page_id", "version");

-- CreateIndex
CREATE INDEX "idx_page_versions_author" ON "page_versions"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "page_versions_page_id_version_key" ON "page_versions"("page_id", "version");

-- AddForeignKey
ALTER TABLE "page_versions" ADD CONSTRAINT "page_versions_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_versions" ADD CONSTRAINT "page_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
