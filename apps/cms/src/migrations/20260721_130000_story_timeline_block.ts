import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
CREATE TABLE "pages_blocks_story_timeline" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"eyebrow" varchar,
	"heading" varchar,
	"intro" varchar,
	"block_name" varchar
);
CREATE TABLE "pages_blocks_story_timeline_entries" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"year" varchar,
	"title" varchar,
	"body" varchar,
	"image_id" integer,
	"image_url" varchar
);
CREATE TABLE "_pages_v_blocks_story_timeline" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"eyebrow" varchar,
	"heading" varchar,
	"intro" varchar,
	"_uuid" varchar,
	"block_name" varchar
);
CREATE TABLE "_pages_v_blocks_story_timeline_entries" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"year" varchar,
	"title" varchar,
	"body" varchar,
	"image_id" integer,
	"image_url" varchar,
	"_uuid" varchar
);
ALTER TABLE "pages_blocks_story_timeline" ADD CONSTRAINT "pages_blocks_story_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_story_timeline_entries" ADD CONSTRAINT "pages_blocks_story_timeline_entries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_story_timeline_entries" ADD CONSTRAINT "pages_blocks_story_timeline_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story_timeline"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_story_timeline" ADD CONSTRAINT "_pages_v_blocks_story_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_story_timeline_entries" ADD CONSTRAINT "_pages_v_blocks_story_timeline_entries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_story_timeline_entries" ADD CONSTRAINT "_pages_v_blocks_story_timeline_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_story_timeline"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_story_timeline_order_idx" ON "pages_blocks_story_timeline" USING btree ("_order");
CREATE INDEX "pages_blocks_story_timeline_parent_id_idx" ON "pages_blocks_story_timeline" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_story_timeline_path_idx" ON "pages_blocks_story_timeline" USING btree ("_path");
CREATE INDEX "pages_blocks_story_timeline_entries_order_idx" ON "pages_blocks_story_timeline_entries" USING btree ("_order");
CREATE INDEX "pages_blocks_story_timeline_entries_parent_id_idx" ON "pages_blocks_story_timeline_entries" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_story_timeline_entries_image_idx" ON "pages_blocks_story_timeline_entries" USING btree ("image_id");
CREATE INDEX "_pages_v_blocks_story_timeline_order_idx" ON "_pages_v_blocks_story_timeline" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_story_timeline_parent_id_idx" ON "_pages_v_blocks_story_timeline" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_story_timeline_path_idx" ON "_pages_v_blocks_story_timeline" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_story_timeline_entries_order_idx" ON "_pages_v_blocks_story_timeline_entries" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_story_timeline_entries_parent_id_idx" ON "_pages_v_blocks_story_timeline_entries" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_story_timeline_entries_image_idx" ON "_pages_v_blocks_story_timeline_entries" USING btree ("image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
DROP TABLE "_pages_v_blocks_story_timeline_entries" CASCADE;
DROP TABLE "_pages_v_blocks_story_timeline" CASCADE;
DROP TABLE "pages_blocks_story_timeline_entries" CASCADE;
DROP TABLE "pages_blocks_story_timeline" CASCADE;`)
}
