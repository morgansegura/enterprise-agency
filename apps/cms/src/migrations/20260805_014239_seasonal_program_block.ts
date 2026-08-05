import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_seasonal_program_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_seasonal_program_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"birth_years" varchar
  );
  
  CREATE TABLE "pages_blocks_seasonal_program_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_seasonal_program_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_seasonal_program" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"dateline_note" varchar,
  	"early_bird_price" varchar,
  	"early_bird_deadline" timestamp(3) with time zone,
  	"footnote" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_new_tab" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_seasonal_program_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_seasonal_program_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"birth_years" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_seasonal_program_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_seasonal_program_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_seasonal_program" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"dateline_note" varchar,
  	"early_bird_price" varchar,
  	"early_bird_deadline" timestamp(3) with time zone,
  	"footnote" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_new_tab" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_features_items" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_features_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  ALTER TABLE "pages_blocks_seasonal_program_facts" ADD CONSTRAINT "pages_blocks_seasonal_program_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_seasonal_program"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seasonal_program_divisions" ADD CONSTRAINT "pages_blocks_seasonal_program_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_seasonal_program"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seasonal_program_columns_items" ADD CONSTRAINT "pages_blocks_seasonal_program_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_seasonal_program_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seasonal_program_columns" ADD CONSTRAINT "pages_blocks_seasonal_program_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_seasonal_program"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seasonal_program" ADD CONSTRAINT "pages_blocks_seasonal_program_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seasonal_program_facts" ADD CONSTRAINT "_pages_v_blocks_seasonal_program_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_seasonal_program"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seasonal_program_divisions" ADD CONSTRAINT "_pages_v_blocks_seasonal_program_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_seasonal_program"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seasonal_program_columns_items" ADD CONSTRAINT "_pages_v_blocks_seasonal_program_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_seasonal_program_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seasonal_program_columns" ADD CONSTRAINT "_pages_v_blocks_seasonal_program_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_seasonal_program"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seasonal_program" ADD CONSTRAINT "_pages_v_blocks_seasonal_program_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_seasonal_program_facts_order_idx" ON "pages_blocks_seasonal_program_facts" USING btree ("_order");
  CREATE INDEX "pages_blocks_seasonal_program_facts_parent_id_idx" ON "pages_blocks_seasonal_program_facts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_seasonal_program_divisions_order_idx" ON "pages_blocks_seasonal_program_divisions" USING btree ("_order");
  CREATE INDEX "pages_blocks_seasonal_program_divisions_parent_id_idx" ON "pages_blocks_seasonal_program_divisions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_seasonal_program_columns_items_order_idx" ON "pages_blocks_seasonal_program_columns_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_seasonal_program_columns_items_parent_id_idx" ON "pages_blocks_seasonal_program_columns_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_seasonal_program_columns_order_idx" ON "pages_blocks_seasonal_program_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_seasonal_program_columns_parent_id_idx" ON "pages_blocks_seasonal_program_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_seasonal_program_order_idx" ON "pages_blocks_seasonal_program" USING btree ("_order");
  CREATE INDEX "pages_blocks_seasonal_program_parent_id_idx" ON "pages_blocks_seasonal_program" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_seasonal_program_path_idx" ON "pages_blocks_seasonal_program" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_seasonal_program_facts_order_idx" ON "_pages_v_blocks_seasonal_program_facts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_seasonal_program_facts_parent_id_idx" ON "_pages_v_blocks_seasonal_program_facts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_seasonal_program_divisions_order_idx" ON "_pages_v_blocks_seasonal_program_divisions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_seasonal_program_divisions_parent_id_idx" ON "_pages_v_blocks_seasonal_program_divisions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_seasonal_program_columns_items_order_idx" ON "_pages_v_blocks_seasonal_program_columns_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_seasonal_program_columns_items_parent_id_idx" ON "_pages_v_blocks_seasonal_program_columns_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_seasonal_program_columns_order_idx" ON "_pages_v_blocks_seasonal_program_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_seasonal_program_columns_parent_id_idx" ON "_pages_v_blocks_seasonal_program_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_seasonal_program_order_idx" ON "_pages_v_blocks_seasonal_program" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_seasonal_program_parent_id_idx" ON "_pages_v_blocks_seasonal_program" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_seasonal_program_path_idx" ON "_pages_v_blocks_seasonal_program" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_content_align";
  DROP TYPE "public"."enum_pages_blocks_cta_background";
  DROP TYPE "public"."enum_pages_blocks_cta_align";
  DROP TYPE "public"."enum_pages_blocks_features_columns";
  DROP TYPE "public"."enum_pages_blocks_features_align";
  DROP TYPE "public"."enum_pages_blocks_image_width";
  DROP TYPE "public"."enum_pages_blocks_image_align";
  DROP TYPE "public"."enum__pages_v_blocks_content_align";
  DROP TYPE "public"."enum__pages_v_blocks_cta_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_align";
  DROP TYPE "public"."enum__pages_v_blocks_features_columns";
  DROP TYPE "public"."enum__pages_v_blocks_features_align";
  DROP TYPE "public"."enum__pages_v_blocks_image_width";
  DROP TYPE "public"."enum__pages_v_blocks_image_align";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_cta_background" AS ENUM('none', 'muted', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_cta_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_features_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_features_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_image_width" AS ENUM('container', 'full');
  CREATE TYPE "public"."enum_pages_blocks_image_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_content_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_background" AS ENUM('none', 'muted', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_features_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_features_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_image_width" AS ENUM('container', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_image_align" AS ENUM('left', 'center');
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"align" "enum_pages_blocks_content_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"background" "enum_pages_blocks_cta_background" DEFAULT 'brand',
  	"align" "enum_pages_blocks_cta_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"columns" "enum_pages_blocks_features_columns" DEFAULT '3',
  	"align" "enum_pages_blocks_features_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"width" "enum_pages_blocks_image_width" DEFAULT 'container',
  	"align" "enum_pages_blocks_image_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"align" "enum__pages_v_blocks_content_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"background" "enum__pages_v_blocks_cta_background" DEFAULT 'brand',
  	"align" "enum__pages_v_blocks_cta_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"columns" "enum__pages_v_blocks_features_columns" DEFAULT '3',
  	"align" "enum__pages_v_blocks_features_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"width" "enum__pages_v_blocks_image_width" DEFAULT 'container',
  	"align" "enum__pages_v_blocks_image_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_seasonal_program_facts" CASCADE;
  DROP TABLE "pages_blocks_seasonal_program_divisions" CASCADE;
  DROP TABLE "pages_blocks_seasonal_program_columns_items" CASCADE;
  DROP TABLE "pages_blocks_seasonal_program_columns" CASCADE;
  DROP TABLE "pages_blocks_seasonal_program" CASCADE;
  DROP TABLE "_pages_v_blocks_seasonal_program_facts" CASCADE;
  DROP TABLE "_pages_v_blocks_seasonal_program_divisions" CASCADE;
  DROP TABLE "_pages_v_blocks_seasonal_program_columns_items" CASCADE;
  DROP TABLE "_pages_v_blocks_seasonal_program_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_seasonal_program" CASCADE;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_items" ADD CONSTRAINT "pages_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_items" ADD CONSTRAINT "_pages_v_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_items_order_idx" ON "pages_blocks_features_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_items_parent_id_idx" ON "pages_blocks_features_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_image_idx" ON "pages_blocks_image" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_items_order_idx" ON "_pages_v_blocks_features_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_items_parent_id_idx" ON "_pages_v_blocks_features_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_order_idx" ON "_pages_v_blocks_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_parent_id_idx" ON "_pages_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_path_idx" ON "_pages_v_blocks_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_image_idx" ON "_pages_v_blocks_image" USING btree ("image_id");`)
}
