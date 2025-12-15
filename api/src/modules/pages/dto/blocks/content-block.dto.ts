import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";

/**
 * Block types supported by the page builder
 */
const BLOCK_TYPES = [
  // Content blocks
  "heading-block",
  "text-block",
  "button-block",
  "image-block",
  "card-block",
  "rich-text-block",
  "video-block",
  "audio-block",
  "list-block",
  "quote-block",
  "divider-block",
  "spacer-block",
  "accordion-block",
  "tabs-block",
  "embed-block",
  "icon-block",
  "stats-block",
  "map-block",
  "logo-block",
  // Container blocks
  "grid-block",
  "flex-block",
  "stack-block",
  "container-block",
  "columns-block",
] as const;

/**
 * DTO for validating a single block
 * Block data is loosely validated as an object - type-specific validation
 * happens at the application layer if needed
 */
export class ContentBlockDto {
  @IsString()
  _key: string;

  @IsEnum(BLOCK_TYPES)
  _type: string;

  @IsObject()
  data: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks?: ContentBlockDto[];
}
