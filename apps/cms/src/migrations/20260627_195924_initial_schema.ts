import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_slides_cta_kind" AS ENUM('none', 'link', 'evaluation');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_actions_kind" AS ENUM('link', 'evaluation');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_actions_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_background" AS ENUM('white', 'bone');
  CREATE TYPE "public"."enum_pages_blocks_heading_section_background" AS ENUM('bone', 'white', 'transparent', 'midnight');
  CREATE TYPE "public"."enum_pages_blocks_heading_section_size" AS ENUM('compact', 'default', 'loose');
  CREATE TYPE "public"."enum_pages_blocks_heading_section_heading_size" AS ENUM('display', 'section', 'compact');
  CREATE TYPE "public"."enum_pages_blocks_heading_section_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_pages_blocks_heading_section_cta_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_media_split_buttons_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_media_split_background" AS ENUM('bone', 'white');
  CREATE TYPE "public"."enum_pages_blocks_icon_cards_background" AS ENUM('bone', 'white');
  CREATE TYPE "public"."enum_pages_blocks_icon_cards_cta_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_callout_variant" AS ENUM('midnight', 'bone', 'gold', 'midnight-bright');
  CREATE TYPE "public"."enum_pages_blocks_callout_cta_kind" AS ENUM('link', 'evaluation');
  CREATE TYPE "public"."enum_pages_blocks_callout_cta_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_stat_band_variant" AS ENUM('midnight', 'bone');
  CREATE TYPE "public"."enum_pages_blocks_portrait_grid_background" AS ENUM('bone', 'white');
  CREATE TYPE "public"."enum_pages_blocks_portrait_grid_cta_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_cta_background" AS ENUM('none', 'muted', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_cta_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_features_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_features_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_image_width" AS ENUM('container', 'full');
  CREATE TYPE "public"."enum_pages_blocks_image_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_slides_cta_kind" AS ENUM('none', 'link', 'evaluation');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_actions_kind" AS ENUM('link', 'evaluation');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_actions_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_background" AS ENUM('white', 'bone');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_section_background" AS ENUM('bone', 'white', 'transparent', 'midnight');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_section_size" AS ENUM('compact', 'default', 'loose');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_section_heading_size" AS ENUM('display', 'section', 'compact');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_section_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_section_cta_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_media_split_buttons_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_media_split_background" AS ENUM('bone', 'white');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_cards_background" AS ENUM('bone', 'white');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_cards_cta_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_callout_variant" AS ENUM('midnight', 'bone', 'gold', 'midnight-bright');
  CREATE TYPE "public"."enum__pages_v_blocks_callout_cta_kind" AS ENUM('link', 'evaluation');
  CREATE TYPE "public"."enum__pages_v_blocks_callout_cta_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_stat_band_variant" AS ENUM('midnight', 'bone');
  CREATE TYPE "public"."enum__pages_v_blocks_portrait_grid_background" AS ENUM('bone', 'white');
  CREATE TYPE "public"."enum__pages_v_blocks_portrait_grid_cta_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_background" AS ENUM('none', 'muted', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_features_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_features_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_image_width" AS ENUM('container', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_image_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_staff_pathway" AS ENUM('boys', 'girls', 'goalkeeper', 'foundations');
  CREATE TYPE "public"."enum_staff_programs" AS ENUM('mls-next-homegrown', 'mls-next', 'mls-next-academy', 'elite-academy', 'ea-2', 'dpl', 'socal-flight', 'mini-maestros');
  CREATE TYPE "public"."enum_staff_status" AS ENUM('active', 'on-leave', 'departed');
  CREATE TYPE "public"."enum_testimonials_role" AS ENUM('Parent', 'Player', 'Alumnus', 'Coach');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('active', 'archived');
  CREATE TYPE "public"."enum_facilities_tier" AS ENUM('featured', 'park');
  CREATE TYPE "public"."enum_facilities_status" AS ENUM('active', 'archived');
  CREATE TYPE "public"."enum_site_settings_footer_social_platform" AS ENUM('facebook', 'instagram', 'x', 'youtube', 'tiktok', 'linkedin');
  CREATE TYPE "public"."enum_menus_items_children_target" AS ENUM('', '_blank');
  CREATE TYPE "public"."enum_menus_items_target" AS ENUM('', '_blank');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "pages_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url" varchar,
  	"alt" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"tagline" varchar,
  	"cta_kind" "enum_pages_blocks_hero_slides_cta_kind" DEFAULT 'none',
  	"cta_label" varchar,
  	"cta_href" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"auto_play_delay" numeric DEFAULT 6500,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_pages_blocks_page_hero_actions_kind" DEFAULT 'link',
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum_pages_blocks_page_hero_actions_variant" DEFAULT 'default',
  	"icon_token" varchar
  );
  
  CREATE TABLE "pages_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"background" "enum_pages_blocks_page_hero_background" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_heading_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"background" "enum_pages_blocks_heading_section_background" DEFAULT 'bone',
  	"size" "enum_pages_blocks_heading_section_size" DEFAULT 'default',
  	"heading_size" "enum_pages_blocks_heading_section_heading_size" DEFAULT 'section',
  	"align" "enum_pages_blocks_heading_section_align" DEFAULT 'center',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum_pages_blocks_heading_section_cta_variant" DEFAULT 'secondary',
  	"cta_icon_token" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_welcome_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_section_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_section_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_split_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_media_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum_pages_blocks_media_split_buttons_variant" DEFAULT 'secondary',
  	"icon_token" varchar
  );
  
  CREATE TABLE "pages_blocks_media_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"image_alt" varchar,
  	"background" "enum_pages_blocks_media_split_background" DEFAULT 'bone',
  	"reverse" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_icon_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_token" varchar,
  	"title" varchar,
  	"description" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_icon_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"background" "enum_pages_blocks_icon_cards_background" DEFAULT 'bone',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum_pages_blocks_icon_cards_cta_variant" DEFAULT 'secondary',
  	"cta_icon_token" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"variant" "enum_pages_blocks_callout_variant" DEFAULT 'midnight',
  	"cta_kind" "enum_pages_blocks_callout_cta_kind" DEFAULT 'link',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum_pages_blocks_callout_cta_variant" DEFAULT 'default',
  	"cta_icon_token" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stat_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stat_band_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_stat_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"variant" "enum_pages_blocks_stat_band_variant" DEFAULT 'midnight',
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_portrait_grid_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"credential" varchar,
  	"image_id" integer,
  	"image_url" varchar
  );
  
  CREATE TABLE "pages_blocks_portrait_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"background" "enum_pages_blocks_portrait_grid_background" DEFAULT 'bone',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum_pages_blocks_portrait_grid_cta_variant" DEFAULT 'secondary',
  	"cta_icon_token" varchar,
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"align" "enum_pages_blocks_rich_text_align" DEFAULT 'left',
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
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url" varchar,
  	"alt" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"tagline" varchar,
  	"cta_kind" "enum__pages_v_blocks_hero_slides_cta_kind" DEFAULT 'none',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"auto_play_delay" numeric DEFAULT 6500,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__pages_v_blocks_page_hero_actions_kind" DEFAULT 'link',
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum__pages_v_blocks_page_hero_actions_variant" DEFAULT 'default',
  	"icon_token" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"background" "enum__pages_v_blocks_page_hero_background" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_heading_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"background" "enum__pages_v_blocks_heading_section_background" DEFAULT 'bone',
  	"size" "enum__pages_v_blocks_heading_section_size" DEFAULT 'default',
  	"heading_size" "enum__pages_v_blocks_heading_section_heading_size" DEFAULT 'section',
  	"align" "enum__pages_v_blocks_heading_section_align" DEFAULT 'center',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum__pages_v_blocks_heading_section_cta_variant" DEFAULT 'secondary',
  	"cta_icon_token" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_welcome_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_section_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_section_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_split_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum__pages_v_blocks_media_split_buttons_variant" DEFAULT 'secondary',
  	"icon_token" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"image_alt" varchar,
  	"background" "enum__pages_v_blocks_media_split_background" DEFAULT 'bone',
  	"reverse" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_icon_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_token" varchar,
  	"title" varchar,
  	"description" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_icon_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"background" "enum__pages_v_blocks_icon_cards_background" DEFAULT 'bone',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum__pages_v_blocks_icon_cards_cta_variant" DEFAULT 'secondary',
  	"cta_icon_token" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"variant" "enum__pages_v_blocks_callout_variant" DEFAULT 'midnight',
  	"cta_kind" "enum__pages_v_blocks_callout_cta_kind" DEFAULT 'link',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum__pages_v_blocks_callout_cta_variant" DEFAULT 'default',
  	"cta_icon_token" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stat_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stat_band_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stat_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"variant" "enum__pages_v_blocks_stat_band_variant" DEFAULT 'midnight',
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_portrait_grid_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"credential" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_portrait_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"background" "enum__pages_v_blocks_portrait_grid_background" DEFAULT 'bone',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum__pages_v_blocks_portrait_grid_cta_variant" DEFAULT 'secondary',
  	"cta_icon_token" varchar,
  	"_uuid" varchar,
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
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"align" "enum__pages_v_blocks_rich_text_align" DEFAULT 'left',
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
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"price" numeric,
  	"description" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"cover_image_url" varchar,
  	"published_at" timestamp(3) with time zone,
  	"author" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_image_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_image_id" integer,
  	"version_cover_image_url" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_author" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_image_url" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "staff_pathway" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_staff_pathway",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "staff_programs" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_staff_programs",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"title" varchar,
  	"group" varchar,
  	"department" varchar,
  	"team" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"image_url" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"is_featured" boolean DEFAULT false,
  	"joined_year" numeric,
  	"status" "enum_staff_status" DEFAULT 'active',
  	"role" varchar,
  	"order" numeric DEFAULT 0,
  	"key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "staff_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"role" "enum_testimonials_role" DEFAULT 'Parent',
  	"context" varchar,
  	"longform" varchar,
  	"featured" boolean DEFAULT false,
  	"photo_id" integer,
  	"image_url" varchar,
  	"status" "enum_testimonials_status" DEFAULT 'active',
  	"order" numeric DEFAULT 0,
  	"key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "facilities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"tier" "enum_facilities_tier" DEFAULT 'featured',
  	"role" varchar,
  	"role_label" varchar,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_zip" varchar,
  	"description" varchar,
  	"photo_id" integer,
  	"image_url" varchar,
  	"maps_url" varchar,
  	"status" "enum_facilities_status" DEFAULT 'active',
  	"order" numeric DEFAULT 0,
  	"key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "facilities_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "tenants_theme_tokens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"domain" varchar,
  	"theme_primary" varchar,
  	"theme_primary_foreground" varchar,
  	"theme_secondary" varchar,
  	"theme_secondary_foreground" varchar,
  	"theme_background" varchar,
  	"theme_foreground" varchar,
  	"theme_muted" varchar,
  	"theme_heading_font" varchar,
  	"theme_body_font" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_footer_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_seo_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"site_name" varchar,
  	"logo_id" integer,
  	"logo_url" varchar,
  	"header_menu_id" integer,
  	"footer_text" varchar,
  	"footer_menu_id" integer,
  	"footer_tagline" varchar,
  	"footer_copyright_name" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_twitter" varchar,
  	"analytics_gtm_id" varchar,
  	"analytics_ga4_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menus_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"target" "enum_menus_items_children_target" DEFAULT ''
  );
  
  CREATE TABLE "menus_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"href" varchar,
  	"description" varchar,
  	"target" "enum_menus_items_target" DEFAULT ''
  );
  
  CREATE TABLE "menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_feature_url" varchar,
  	"sizes_feature_width" numeric,
  	"sizes_feature_height" numeric,
  	"sizes_feature_mime_type" varchar,
  	"sizes_feature_filesize" numeric,
  	"sizes_feature_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"posts_id" integer,
  	"staff_id" integer,
  	"testimonials_id" integer,
  	"facilities_id" integer,
  	"tenants_id" integer,
  	"site_settings_id" integer,
  	"menus_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero_actions" ADD CONSTRAINT "pages_blocks_page_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero" ADD CONSTRAINT "pages_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_heading_section" ADD CONSTRAINT "pages_blocks_heading_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_welcome_banner" ADD CONSTRAINT "pages_blocks_welcome_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_welcome_banner" ADD CONSTRAINT "pages_blocks_welcome_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section_entries" ADD CONSTRAINT "pages_blocks_faq_section_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section" ADD CONSTRAINT "pages_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_section_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_section_testimonials_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_section_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_section_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_section" ADD CONSTRAINT "pages_blocks_testimonials_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_split_tags" ADD CONSTRAINT "pages_blocks_media_split_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_split_buttons" ADD CONSTRAINT "pages_blocks_media_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_split" ADD CONSTRAINT "pages_blocks_media_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_split" ADD CONSTRAINT "pages_blocks_media_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_cards_cards" ADD CONSTRAINT "pages_blocks_icon_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_icon_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_cards" ADD CONSTRAINT "pages_blocks_icon_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callout" ADD CONSTRAINT "pages_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_band_stats" ADD CONSTRAINT "pages_blocks_stat_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_band_highlights" ADD CONSTRAINT "pages_blocks_stat_band_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_band" ADD CONSTRAINT "pages_blocks_stat_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_portrait_grid_people" ADD CONSTRAINT "pages_blocks_portrait_grid_people_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_portrait_grid_people" ADD CONSTRAINT "pages_blocks_portrait_grid_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_portrait_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_portrait_grid" ADD CONSTRAINT "pages_blocks_portrait_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_items" ADD CONSTRAINT "pages_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero_actions" ADD CONSTRAINT "_pages_v_blocks_page_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD CONSTRAINT "_pages_v_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_heading_section" ADD CONSTRAINT "_pages_v_blocks_heading_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_welcome_banner" ADD CONSTRAINT "_pages_v_blocks_welcome_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_welcome_banner" ADD CONSTRAINT "_pages_v_blocks_welcome_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_section_entries" ADD CONSTRAINT "_pages_v_blocks_faq_section_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_section" ADD CONSTRAINT "_pages_v_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_section_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_section_testimonials_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_section_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_section_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_section" ADD CONSTRAINT "_pages_v_blocks_testimonials_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_split_tags" ADD CONSTRAINT "_pages_v_blocks_media_split_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_split_buttons" ADD CONSTRAINT "_pages_v_blocks_media_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_split" ADD CONSTRAINT "_pages_v_blocks_media_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_split" ADD CONSTRAINT "_pages_v_blocks_media_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_cards_cards" ADD CONSTRAINT "_pages_v_blocks_icon_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_icon_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_cards" ADD CONSTRAINT "_pages_v_blocks_icon_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_callout" ADD CONSTRAINT "_pages_v_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_band_stats" ADD CONSTRAINT "_pages_v_blocks_stat_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_band_highlights" ADD CONSTRAINT "_pages_v_blocks_stat_band_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_band" ADD CONSTRAINT "_pages_v_blocks_stat_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_portrait_grid_people" ADD CONSTRAINT "_pages_v_blocks_portrait_grid_people_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_portrait_grid_people" ADD CONSTRAINT "_pages_v_blocks_portrait_grid_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_portrait_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_portrait_grid" ADD CONSTRAINT "_pages_v_blocks_portrait_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_items" ADD CONSTRAINT "_pages_v_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff_pathway" ADD CONSTRAINT "staff_pathway_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff_programs" ADD CONSTRAINT "staff_programs_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff_texts" ADD CONSTRAINT "staff_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilities" ADD CONSTRAINT "facilities_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilities" ADD CONSTRAINT "facilities_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilities_texts" ADD CONSTRAINT "facilities_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenants_theme_tokens" ADD CONSTRAINT "tenants_theme_tokens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_values" ADD CONSTRAINT "site_settings_footer_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_social" ADD CONSTRAINT "site_settings_footer_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_seo_same_as" ADD CONSTRAINT "site_settings_seo_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_header_menu_id_menus_id_fk" FOREIGN KEY ("header_menu_id") REFERENCES "public"."menus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_footer_menu_id_menus_id_fk" FOREIGN KEY ("footer_menu_id") REFERENCES "public"."menus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menus_items_children" ADD CONSTRAINT "menus_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menus_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menus_items" ADD CONSTRAINT "menus_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menus" ADD CONSTRAINT "menus_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms" ADD CONSTRAINT "forms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_facilities_fk" FOREIGN KEY ("facilities_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_settings_fk" FOREIGN KEY ("site_settings_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menus_fk" FOREIGN KEY ("menus_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_slides_order_idx" ON "pages_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slides_parent_id_idx" ON "pages_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_image_idx" ON "pages_blocks_hero_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_hero_actions_order_idx" ON "pages_blocks_page_hero_actions" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_hero_actions_parent_id_idx" ON "pages_blocks_page_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_hero_order_idx" ON "pages_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_hero_parent_id_idx" ON "pages_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_hero_path_idx" ON "pages_blocks_page_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_heading_section_order_idx" ON "pages_blocks_heading_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_heading_section_parent_id_idx" ON "pages_blocks_heading_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_heading_section_path_idx" ON "pages_blocks_heading_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_welcome_banner_order_idx" ON "pages_blocks_welcome_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_welcome_banner_parent_id_idx" ON "pages_blocks_welcome_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_welcome_banner_path_idx" ON "pages_blocks_welcome_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_welcome_banner_image_idx" ON "pages_blocks_welcome_banner" USING btree ("image_id");
  CREATE INDEX "pages_blocks_faq_section_entries_order_idx" ON "pages_blocks_faq_section_entries" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_section_entries_parent_id_idx" ON "pages_blocks_faq_section_entries" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_section_order_idx" ON "pages_blocks_faq_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_section_parent_id_idx" ON "pages_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_section_path_idx" ON "pages_blocks_faq_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_section_testimonials_order_idx" ON "pages_blocks_testimonials_section_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_section_testimonials_parent_id_idx" ON "pages_blocks_testimonials_section_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_section_testimonials_image_idx" ON "pages_blocks_testimonials_section_testimonials" USING btree ("image_id");
  CREATE INDEX "pages_blocks_testimonials_section_order_idx" ON "pages_blocks_testimonials_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_section_parent_id_idx" ON "pages_blocks_testimonials_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_section_path_idx" ON "pages_blocks_testimonials_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_split_tags_order_idx" ON "pages_blocks_media_split_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_split_tags_parent_id_idx" ON "pages_blocks_media_split_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_split_buttons_order_idx" ON "pages_blocks_media_split_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_split_buttons_parent_id_idx" ON "pages_blocks_media_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_split_order_idx" ON "pages_blocks_media_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_split_parent_id_idx" ON "pages_blocks_media_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_split_path_idx" ON "pages_blocks_media_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_split_image_idx" ON "pages_blocks_media_split" USING btree ("image_id");
  CREATE INDEX "pages_blocks_icon_cards_cards_order_idx" ON "pages_blocks_icon_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_cards_cards_parent_id_idx" ON "pages_blocks_icon_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_cards_order_idx" ON "pages_blocks_icon_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_cards_parent_id_idx" ON "pages_blocks_icon_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_cards_path_idx" ON "pages_blocks_icon_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_callout_order_idx" ON "pages_blocks_callout" USING btree ("_order");
  CREATE INDEX "pages_blocks_callout_parent_id_idx" ON "pages_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_callout_path_idx" ON "pages_blocks_callout" USING btree ("_path");
  CREATE INDEX "pages_blocks_stat_band_stats_order_idx" ON "pages_blocks_stat_band_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stat_band_stats_parent_id_idx" ON "pages_blocks_stat_band_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stat_band_highlights_order_idx" ON "pages_blocks_stat_band_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_stat_band_highlights_parent_id_idx" ON "pages_blocks_stat_band_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stat_band_order_idx" ON "pages_blocks_stat_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_stat_band_parent_id_idx" ON "pages_blocks_stat_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stat_band_path_idx" ON "pages_blocks_stat_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_portrait_grid_people_order_idx" ON "pages_blocks_portrait_grid_people" USING btree ("_order");
  CREATE INDEX "pages_blocks_portrait_grid_people_parent_id_idx" ON "pages_blocks_portrait_grid_people" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_portrait_grid_people_image_idx" ON "pages_blocks_portrait_grid_people" USING btree ("image_id");
  CREATE INDEX "pages_blocks_portrait_grid_order_idx" ON "pages_blocks_portrait_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_portrait_grid_parent_id_idx" ON "pages_blocks_portrait_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_portrait_grid_path_idx" ON "pages_blocks_portrait_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
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
  CREATE INDEX "pages_tenant_idx" ON "pages" USING btree ("tenant_id");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "tenant_slug_idx" ON "pages" USING btree ("tenant_id","slug");
  CREATE INDEX "_pages_v_blocks_hero_slides_order_idx" ON "_pages_v_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slides_parent_id_idx" ON "_pages_v_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_image_idx" ON "_pages_v_blocks_hero_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_hero_actions_order_idx" ON "_pages_v_blocks_page_hero_actions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_hero_actions_parent_id_idx" ON "_pages_v_blocks_page_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_hero_order_idx" ON "_pages_v_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_hero_parent_id_idx" ON "_pages_v_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_hero_path_idx" ON "_pages_v_blocks_page_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_heading_section_order_idx" ON "_pages_v_blocks_heading_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_heading_section_parent_id_idx" ON "_pages_v_blocks_heading_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_heading_section_path_idx" ON "_pages_v_blocks_heading_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_welcome_banner_order_idx" ON "_pages_v_blocks_welcome_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_welcome_banner_parent_id_idx" ON "_pages_v_blocks_welcome_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_welcome_banner_path_idx" ON "_pages_v_blocks_welcome_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_welcome_banner_image_idx" ON "_pages_v_blocks_welcome_banner" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_faq_section_entries_order_idx" ON "_pages_v_blocks_faq_section_entries" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_section_entries_parent_id_idx" ON "_pages_v_blocks_faq_section_entries" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_section_order_idx" ON "_pages_v_blocks_faq_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_section_parent_id_idx" ON "_pages_v_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_section_path_idx" ON "_pages_v_blocks_faq_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_section_testimonials_order_idx" ON "_pages_v_blocks_testimonials_section_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_section_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_section_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_section_testimonials_image_idx" ON "_pages_v_blocks_testimonials_section_testimonials" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_section_order_idx" ON "_pages_v_blocks_testimonials_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_section_parent_id_idx" ON "_pages_v_blocks_testimonials_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_section_path_idx" ON "_pages_v_blocks_testimonials_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_split_tags_order_idx" ON "_pages_v_blocks_media_split_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_split_tags_parent_id_idx" ON "_pages_v_blocks_media_split_tags" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_split_buttons_order_idx" ON "_pages_v_blocks_media_split_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_split_buttons_parent_id_idx" ON "_pages_v_blocks_media_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_split_order_idx" ON "_pages_v_blocks_media_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_split_parent_id_idx" ON "_pages_v_blocks_media_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_split_path_idx" ON "_pages_v_blocks_media_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_split_image_idx" ON "_pages_v_blocks_media_split" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_icon_cards_cards_order_idx" ON "_pages_v_blocks_icon_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_icon_cards_cards_parent_id_idx" ON "_pages_v_blocks_icon_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_cards_order_idx" ON "_pages_v_blocks_icon_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_icon_cards_parent_id_idx" ON "_pages_v_blocks_icon_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_cards_path_idx" ON "_pages_v_blocks_icon_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_callout_order_idx" ON "_pages_v_blocks_callout" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_callout_parent_id_idx" ON "_pages_v_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_callout_path_idx" ON "_pages_v_blocks_callout" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stat_band_stats_order_idx" ON "_pages_v_blocks_stat_band_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stat_band_stats_parent_id_idx" ON "_pages_v_blocks_stat_band_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stat_band_highlights_order_idx" ON "_pages_v_blocks_stat_band_highlights" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stat_band_highlights_parent_id_idx" ON "_pages_v_blocks_stat_band_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stat_band_order_idx" ON "_pages_v_blocks_stat_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stat_band_parent_id_idx" ON "_pages_v_blocks_stat_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stat_band_path_idx" ON "_pages_v_blocks_stat_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_portrait_grid_people_order_idx" ON "_pages_v_blocks_portrait_grid_people" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_portrait_grid_people_parent_id_idx" ON "_pages_v_blocks_portrait_grid_people" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_portrait_grid_people_image_idx" ON "_pages_v_blocks_portrait_grid_people" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_portrait_grid_order_idx" ON "_pages_v_blocks_portrait_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_portrait_grid_parent_id_idx" ON "_pages_v_blocks_portrait_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_portrait_grid_path_idx" ON "_pages_v_blocks_portrait_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
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
  CREATE INDEX "_pages_v_blocks_image_image_idx" ON "_pages_v_blocks_image" USING btree ("image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_tenant_idx" ON "_pages_v" USING btree ("version_tenant_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "version_tenant_version_slug_idx" ON "_pages_v" USING btree ("version_tenant_id","version_slug");
  CREATE INDEX "products_tenant_idx" ON "products" USING btree ("tenant_id");
  CREATE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "tenant_slug_1_idx" ON "products" USING btree ("tenant_id","slug");
  CREATE INDEX "posts_tenant_idx" ON "posts" USING btree ("tenant_id");
  CREATE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "tenant_slug_2_idx" ON "posts" USING btree ("tenant_id","slug");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_tenant_idx" ON "_posts_v" USING btree ("version_tenant_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_image_idx" ON "_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "version_tenant_version_slug_1_idx" ON "_posts_v" USING btree ("version_tenant_id","version_slug");
  CREATE INDEX "staff_pathway_order_idx" ON "staff_pathway" USING btree ("order");
  CREATE INDEX "staff_pathway_parent_idx" ON "staff_pathway" USING btree ("parent_id");
  CREATE INDEX "staff_programs_order_idx" ON "staff_programs" USING btree ("order");
  CREATE INDEX "staff_programs_parent_idx" ON "staff_programs" USING btree ("parent_id");
  CREATE INDEX "staff_tenant_idx" ON "staff" USING btree ("tenant_id");
  CREATE INDEX "staff_group_idx" ON "staff" USING btree ("group");
  CREATE INDEX "staff_photo_idx" ON "staff" USING btree ("photo_id");
  CREATE INDEX "staff_key_idx" ON "staff" USING btree ("key");
  CREATE INDEX "staff_updated_at_idx" ON "staff" USING btree ("updated_at");
  CREATE INDEX "staff_created_at_idx" ON "staff" USING btree ("created_at");
  CREATE INDEX "staff_texts_order_parent" ON "staff_texts" USING btree ("order","parent_id");
  CREATE INDEX "testimonials_tenant_idx" ON "testimonials" USING btree ("tenant_id");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_key_idx" ON "testimonials" USING btree ("key");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "facilities_tenant_idx" ON "facilities" USING btree ("tenant_id");
  CREATE INDEX "facilities_photo_idx" ON "facilities" USING btree ("photo_id");
  CREATE INDEX "facilities_key_idx" ON "facilities" USING btree ("key");
  CREATE INDEX "facilities_updated_at_idx" ON "facilities" USING btree ("updated_at");
  CREATE INDEX "facilities_created_at_idx" ON "facilities" USING btree ("created_at");
  CREATE INDEX "facilities_texts_order_parent" ON "facilities_texts" USING btree ("order","parent_id");
  CREATE INDEX "tenants_theme_tokens_order_idx" ON "tenants_theme_tokens" USING btree ("_order");
  CREATE INDEX "tenants_theme_tokens_parent_id_idx" ON "tenants_theme_tokens" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE UNIQUE INDEX "tenants_domain_idx" ON "tenants" USING btree ("domain");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "site_settings_footer_values_order_idx" ON "site_settings_footer_values" USING btree ("_order");
  CREATE INDEX "site_settings_footer_values_parent_id_idx" ON "site_settings_footer_values" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_social_order_idx" ON "site_settings_footer_social" USING btree ("_order");
  CREATE INDEX "site_settings_footer_social_parent_id_idx" ON "site_settings_footer_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seo_same_as_order_idx" ON "site_settings_seo_same_as" USING btree ("_order");
  CREATE INDEX "site_settings_seo_same_as_parent_id_idx" ON "site_settings_seo_same_as" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_tenant_idx" ON "site_settings" USING btree ("tenant_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_header_menu_idx" ON "site_settings" USING btree ("header_menu_id");
  CREATE INDEX "site_settings_footer_menu_idx" ON "site_settings" USING btree ("footer_menu_id");
  CREATE INDEX "site_settings_seo_seo_og_image_idx" ON "site_settings" USING btree ("seo_og_image_id");
  CREATE INDEX "site_settings_updated_at_idx" ON "site_settings" USING btree ("updated_at");
  CREATE INDEX "site_settings_created_at_idx" ON "site_settings" USING btree ("created_at");
  CREATE INDEX "menus_items_children_order_idx" ON "menus_items_children" USING btree ("_order");
  CREATE INDEX "menus_items_children_parent_id_idx" ON "menus_items_children" USING btree ("_parent_id");
  CREATE INDEX "menus_items_order_idx" ON "menus_items" USING btree ("_order");
  CREATE INDEX "menus_items_parent_id_idx" ON "menus_items" USING btree ("_parent_id");
  CREATE INDEX "menus_tenant_idx" ON "menus" USING btree ("tenant_id");
  CREATE INDEX "menus_updated_at_idx" ON "menus" USING btree ("updated_at");
  CREATE INDEX "menus_created_at_idx" ON "menus" USING btree ("created_at");
  CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_tenant_idx" ON "forms" USING btree ("tenant_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_facilities_id_idx" ON "payload_locked_documents_rels" USING btree ("facilities_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_site_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("site_settings_id");
  CREATE INDEX "payload_locked_documents_rels_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("menus_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_slides" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_page_hero_actions" CASCADE;
  DROP TABLE "pages_blocks_page_hero" CASCADE;
  DROP TABLE "pages_blocks_heading_section" CASCADE;
  DROP TABLE "pages_blocks_welcome_banner" CASCADE;
  DROP TABLE "pages_blocks_faq_section_entries" CASCADE;
  DROP TABLE "pages_blocks_faq_section" CASCADE;
  DROP TABLE "pages_blocks_testimonials_section_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials_section" CASCADE;
  DROP TABLE "pages_blocks_media_split_tags" CASCADE;
  DROP TABLE "pages_blocks_media_split_buttons" CASCADE;
  DROP TABLE "pages_blocks_media_split" CASCADE;
  DROP TABLE "pages_blocks_icon_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_icon_cards" CASCADE;
  DROP TABLE "pages_blocks_callout" CASCADE;
  DROP TABLE "pages_blocks_stat_band_stats" CASCADE;
  DROP TABLE "pages_blocks_stat_band_highlights" CASCADE;
  DROP TABLE "pages_blocks_stat_band" CASCADE;
  DROP TABLE "pages_blocks_portrait_grid_people" CASCADE;
  DROP TABLE "pages_blocks_portrait_grid" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_features_items" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero_actions" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_heading_section" CASCADE;
  DROP TABLE "_pages_v_blocks_welcome_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section_entries" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_section_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_section" CASCADE;
  DROP TABLE "_pages_v_blocks_media_split_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_media_split_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_media_split" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_cards_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_callout" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_band_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_band_highlights" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_band" CASCADE;
  DROP TABLE "_pages_v_blocks_portrait_grid_people" CASCADE;
  DROP TABLE "_pages_v_blocks_portrait_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_features_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "staff_pathway" CASCADE;
  DROP TABLE "staff_programs" CASCADE;
  DROP TABLE "staff" CASCADE;
  DROP TABLE "staff_texts" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "facilities" CASCADE;
  DROP TABLE "facilities_texts" CASCADE;
  DROP TABLE "tenants_theme_tokens" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "site_settings_footer_values" CASCADE;
  DROP TABLE "site_settings_footer_social" CASCADE;
  DROP TABLE "site_settings_seo_same_as" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "menus_items_children" CASCADE;
  DROP TABLE "menus_items" CASCADE;
  DROP TABLE "menus" CASCADE;
  DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_hero_slides_cta_kind";
  DROP TYPE "public"."enum_pages_blocks_page_hero_actions_kind";
  DROP TYPE "public"."enum_pages_blocks_page_hero_actions_variant";
  DROP TYPE "public"."enum_pages_blocks_page_hero_background";
  DROP TYPE "public"."enum_pages_blocks_heading_section_background";
  DROP TYPE "public"."enum_pages_blocks_heading_section_size";
  DROP TYPE "public"."enum_pages_blocks_heading_section_heading_size";
  DROP TYPE "public"."enum_pages_blocks_heading_section_align";
  DROP TYPE "public"."enum_pages_blocks_heading_section_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_media_split_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_media_split_background";
  DROP TYPE "public"."enum_pages_blocks_icon_cards_background";
  DROP TYPE "public"."enum_pages_blocks_icon_cards_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_callout_variant";
  DROP TYPE "public"."enum_pages_blocks_callout_cta_kind";
  DROP TYPE "public"."enum_pages_blocks_callout_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_stat_band_variant";
  DROP TYPE "public"."enum_pages_blocks_portrait_grid_background";
  DROP TYPE "public"."enum_pages_blocks_portrait_grid_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_content_align";
  DROP TYPE "public"."enum_pages_blocks_rich_text_align";
  DROP TYPE "public"."enum_pages_blocks_cta_background";
  DROP TYPE "public"."enum_pages_blocks_cta_align";
  DROP TYPE "public"."enum_pages_blocks_features_columns";
  DROP TYPE "public"."enum_pages_blocks_features_align";
  DROP TYPE "public"."enum_pages_blocks_image_width";
  DROP TYPE "public"."enum_pages_blocks_image_align";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_slides_cta_kind";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_actions_kind";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_actions_variant";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_background";
  DROP TYPE "public"."enum__pages_v_blocks_heading_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_heading_section_size";
  DROP TYPE "public"."enum__pages_v_blocks_heading_section_heading_size";
  DROP TYPE "public"."enum__pages_v_blocks_heading_section_align";
  DROP TYPE "public"."enum__pages_v_blocks_heading_section_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_media_split_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_media_split_background";
  DROP TYPE "public"."enum__pages_v_blocks_icon_cards_background";
  DROP TYPE "public"."enum__pages_v_blocks_icon_cards_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_callout_variant";
  DROP TYPE "public"."enum__pages_v_blocks_callout_cta_kind";
  DROP TYPE "public"."enum__pages_v_blocks_callout_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_stat_band_variant";
  DROP TYPE "public"."enum__pages_v_blocks_portrait_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_portrait_grid_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_content_align";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_cta_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_align";
  DROP TYPE "public"."enum__pages_v_blocks_features_columns";
  DROP TYPE "public"."enum__pages_v_blocks_features_align";
  DROP TYPE "public"."enum__pages_v_blocks_image_width";
  DROP TYPE "public"."enum__pages_v_blocks_image_align";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_staff_pathway";
  DROP TYPE "public"."enum_staff_programs";
  DROP TYPE "public"."enum_staff_status";
  DROP TYPE "public"."enum_testimonials_role";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum_facilities_tier";
  DROP TYPE "public"."enum_facilities_status";
  DROP TYPE "public"."enum_site_settings_footer_social_platform";
  DROP TYPE "public"."enum_menus_items_children_target";
  DROP TYPE "public"."enum_menus_items_target";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
