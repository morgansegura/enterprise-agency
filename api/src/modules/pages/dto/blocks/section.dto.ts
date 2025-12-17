import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";
import { ContentBlockDto } from "./content-block.dto";

// Spacing/size enums shared across section properties
const SPACING_SIZES = [
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
] as const;

const BORDER_SIZES = ["none", "thin", "medium", "thick"] as const;
const SHADOW_SIZES = ["none", "sm", "md", "lg", "xl", "inner"] as const;
const MIN_HEIGHT_SIZES = ["none", "sm", "md", "lg", "xl", "screen"] as const;
const ALIGN_OPTIONS = ["left", "center", "right"] as const;
const VERTICAL_ALIGN_OPTIONS = ["top", "center", "bottom"] as const;
const WIDTH_OPTIONS = ["narrow", "container", "wide", "full"] as const;

// Container layout options
const LAYOUT_TYPES = ["stack", "flex", "grid"] as const;
const DIRECTION_OPTIONS = ["row", "column"] as const;
const JUSTIFY_OPTIONS = [
  "start",
  "center",
  "end",
  "between",
  "around",
  "evenly",
] as const;
const ITEM_ALIGN_OPTIONS = [
  "start",
  "center",
  "end",
  "stretch",
  "baseline",
] as const;

/**
 * Container layout settings DTO
 */
class ContainerLayoutDto {
  @IsOptional()
  @IsEnum(LAYOUT_TYPES)
  type?: string;

  @IsOptional()
  @IsEnum(DIRECTION_OPTIONS)
  direction?: string;

  @IsOptional()
  wrap?: boolean;

  @IsOptional()
  @IsEnum(JUSTIFY_OPTIONS)
  justify?: string;

  @IsOptional()
  @IsEnum(ITEM_ALIGN_OPTIONS)
  align?: string;

  @IsOptional()
  columns?: number | string;

  @IsOptional()
  rows?: number | string;

  @IsOptional()
  @IsEnum(SPACING_SIZES)
  gap?: string;
}

/**
 * Container settings DTO (inner wrapper in section)
 */
class ContainerSettingsDto {
  @IsOptional()
  @IsEnum(WIDTH_OPTIONS)
  maxWidth?: string;

  @IsOptional()
  @IsString()
  background?: string;

  @IsOptional()
  @IsString()
  borderRadius?: string;

  @IsOptional()
  @IsString()
  border?: string;

  @IsOptional()
  @IsString()
  shadow?: string;

  @IsOptional()
  @IsEnum(SPACING_SIZES)
  paddingX?: string;

  @IsOptional()
  @IsEnum(SPACING_SIZES)
  paddingY?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContainerLayoutDto)
  layout?: ContainerLayoutDto;
}

export class SectionDto {
  @IsEnum(["section"])
  _type: "section";

  @IsString()
  _key: string;

  // Background can be a simple string (legacy) or an object (new format)
  // Stored as JSONB, so we accept any value here
  @IsOptional()
  background?: string | Record<string, unknown>;

  // Padding (vertical)
  @IsOptional()
  @IsEnum(SPACING_SIZES)
  paddingTop?: string;

  @IsOptional()
  @IsEnum(SPACING_SIZES)
  paddingBottom?: string;

  @IsOptional()
  @IsEnum(SPACING_SIZES)
  spacing?: string; // Legacy - maps to paddingY

  // Border settings
  @IsOptional()
  @IsEnum(BORDER_SIZES)
  borderTop?: string;

  @IsOptional()
  @IsEnum(BORDER_SIZES)
  borderBottom?: string;

  // Shadow
  @IsOptional()
  @IsEnum(SHADOW_SIZES)
  shadow?: string;

  // Width
  @IsOptional()
  @IsEnum(WIDTH_OPTIONS)
  width?: string;

  // Min height (for hero sections)
  @IsOptional()
  @IsEnum(MIN_HEIGHT_SIZES)
  minHeight?: string;

  // Content alignment
  @IsOptional()
  @IsEnum(ALIGN_OPTIONS)
  align?: string;

  @IsOptional()
  @IsEnum(VERTICAL_ALIGN_OPTIONS)
  verticalAlign?: string;

  // Container settings (inner wrapper)
  @IsOptional()
  @IsObject()
  container?: ContainerSettingsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
