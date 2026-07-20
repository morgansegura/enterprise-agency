import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "form_submissions" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_tenant_idx" ON "media" USING btree ("tenant_id");
  CREATE INDEX "form_submissions_tenant_idx" ON "form_submissions" USING btree ("tenant_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX "media_tenant_idx";
  DROP INDEX "form_submissions_tenant_idx";
  ALTER TABLE "media" DROP CONSTRAINT "media_tenant_id_tenants_id_fk";
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_tenant_id_tenants_id_fk";
  ALTER TABLE "media" DROP COLUMN "tenant_id";
  ALTER TABLE "form_submissions" DROP COLUMN "tenant_id";`)
}
