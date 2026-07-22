import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "signup_notify_emails";
  ALTER TABLE "site_settings" ADD COLUMN "signup_notify_all" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "signup_notify_boys" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "signup_notify_girls" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_settings" DROP COLUMN "signup_notify_all";
  ALTER TABLE "site_settings" DROP COLUMN "signup_notify_boys";
  ALTER TABLE "site_settings" DROP COLUMN "signup_notify_girls";
  ALTER TABLE "site_settings" ADD COLUMN "signup_notify_emails" varchar;`)
}
