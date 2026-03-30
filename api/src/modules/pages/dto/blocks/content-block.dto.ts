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
  // Composite blocks
  "hero-block",
  "cta-block",
  "testimonial-block",
  "pricing-block",
  "team-block",
  "logo-bar-block",
  // Form blocks
  "contact-form-block",
  "newsletter-block",
  // Content display blocks
  "feature-grid-block",
  "social-links-block",
  "faq-block",
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

  /** Raw CSS styles — rendered as CSS custom properties */
  @IsOptional()
  @IsObject()
  styles?: Record<string, string>;

  /** ::before pseudo-element styles */
  @IsOptional()
  @IsObject()
  stylesBefore?: Record<string, string>;

  /** ::after pseudo-element styles */
  @IsOptional()
  @IsObject()
  stylesAfter?: Record<string, string>;

  /** Responsive overrides per breakpoint */
  @IsOptional()
  @IsObject()
  _responsive?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks?: ContentBlockDto[];
}
