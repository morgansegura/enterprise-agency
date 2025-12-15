import {
  IsString,
  IsOptional,
  IsIn,
  MaxLength,
  IsObject,
  IsArray,
  ValidateNested,
  IsBoolean,
  ValidateIf,
} from "class-validator";
import { Type } from "class-transformer";
import { SectionDto } from "./blocks/section.dto";
import { MaxNestingDepth } from "./blocks/validators/nesting-level.validator";
import { UniqueBlockKeys } from "./blocks/validators/unique-keys.validator";

export class PageSeoDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @IsOptional()
  @IsObject()
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };

  @IsOptional()
  @IsObject()
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };

  @IsOptional()
  @IsObject()
  structuredData?: Record<string, unknown>; // JSON-LD schema.org markup
}

export class CreatePageDto {
  @IsString()
  @MaxLength(255)
  slug: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  @MaxNestingDepth()
  @UniqueBlockKeys()
  sections?: SectionDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PageSeoDto)
  seo?: PageSeoDto;

  @IsOptional()
  @IsString()
  @IsIn(["draft", "published", "scheduled", "archived"])
  status?: "draft" | "published" | "scheduled" | "archived";

  @IsOptional()
  @IsString()
  @MaxLength(50)
  template?: string;

  @IsOptional()
  @IsObject()
  accessibility?: {
    skipToContent?: boolean;
    ariaLandmarks?: boolean;
    focusManagement?: boolean;
    keyboardNav?: boolean;
  };

  @IsOptional()
  @IsObject()
  performance?: {
    lazyLoadImages?: boolean;
    preloadCritical?: boolean;
    cacheStrategy?: "static" | "dynamic" | "hybrid";
  };

  @IsOptional()
  @IsBoolean()
  isHomePage?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsIn([
    "home",
    "privacy-policy",
    "terms-of-service",
    "cookie-policy",
    "coming-soon",
    "under-construction",
  ])
  pageType?: string;

  @IsOptional()
  @IsBoolean()
  isSystemPage?: boolean;

  @IsOptional()
  @ValidateIf((o) => o.headerId !== null)
  @IsString()
  headerId?: string | null;

  @IsOptional()
  @ValidateIf((o) => o.footerId !== null)
  @IsString()
  footerId?: string | null;
}
