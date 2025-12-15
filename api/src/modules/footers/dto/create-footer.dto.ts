import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsArray,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

// Footer zone content
export class FooterZoneDto {
  @ApiPropertyOptional({ description: "Menu ID to display in this zone" })
  @IsOptional()
  @IsString()
  menuId?: string;

  @ApiPropertyOptional({ description: "Logo configuration" })
  @IsOptional()
  @IsObject()
  logo?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    href?: string;
  };

  @ApiPropertyOptional({ description: "Custom blocks in this zone" })
  @IsOptional()
  @IsArray()
  blocks?: Record<string, unknown>[];

  @ApiPropertyOptional({
    description: "Zone alignment",
    enum: ["left", "center", "right"],
  })
  @IsOptional()
  @IsString()
  alignment?: "left" | "center" | "right";
}

// Footer zones layout
export class FooterZonesDto {
  @ApiPropertyOptional({ description: "Left zone content" })
  @IsOptional()
  @IsObject()
  left?: FooterZoneDto;

  @ApiPropertyOptional({ description: "Center zone content" })
  @IsOptional()
  @IsObject()
  center?: FooterZoneDto;

  @ApiPropertyOptional({ description: "Right zone content" })
  @IsOptional()
  @IsObject()
  right?: FooterZoneDto;

  @ApiPropertyOptional({ description: "Column 1 content" })
  @IsOptional()
  @IsObject()
  column1?: FooterZoneDto;

  @ApiPropertyOptional({ description: "Column 2 content" })
  @IsOptional()
  @IsObject()
  column2?: FooterZoneDto;

  @ApiPropertyOptional({ description: "Column 3 content" })
  @IsOptional()
  @IsObject()
  column3?: FooterZoneDto;

  @ApiPropertyOptional({ description: "Column 4 content" })
  @IsOptional()
  @IsObject()
  column4?: FooterZoneDto;

  @ApiPropertyOptional({ description: "Bottom zone content" })
  @IsOptional()
  @IsObject()
  bottom?: FooterZoneDto;
}

// Footer styling options
export class FooterStyleDto {
  // Footer Wrapper (full-width background layer)
  @ApiPropertyOptional({ description: "Background color" })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: "Text color" })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiPropertyOptional({ description: "Horizontal padding" })
  @IsOptional()
  @IsString()
  paddingX?: string;

  @ApiPropertyOptional({ description: "Vertical padding" })
  @IsOptional()
  @IsString()
  paddingY?: string;

  // Footer Wrapper borders
  @ApiPropertyOptional({ description: "Border top" })
  @IsOptional()
  @IsString()
  borderTop?: string;

  @ApiPropertyOptional({ description: "Border bottom" })
  @IsOptional()
  @IsString()
  borderBottom?: string;

  @ApiPropertyOptional({ description: "Border left" })
  @IsOptional()
  @IsString()
  borderLeft?: string;

  @ApiPropertyOptional({ description: "Border right" })
  @IsOptional()
  @IsString()
  borderRight?: string;

  @ApiPropertyOptional({ description: "Box shadow" })
  @IsOptional()
  @IsString()
  boxShadow?: string;

  // Container settings
  @ApiPropertyOptional({
    description: "Container max-width",
    enum: ["full", "container", "narrow"],
  })
  @IsOptional()
  @IsString()
  containerWidth?: "full" | "container" | "narrow";

  @ApiPropertyOptional({ description: "Container background color" })
  @IsOptional()
  @IsString()
  containerBackground?: string;

  @ApiPropertyOptional({ description: "Container border radius" })
  @IsOptional()
  @IsString()
  containerBorderRadius?: string;

  @ApiPropertyOptional({ description: "Container border" })
  @IsOptional()
  @IsString()
  containerBorder?: string;

  @ApiPropertyOptional({ description: "Container shadow" })
  @IsOptional()
  @IsString()
  containerShadow?: string;

  @ApiPropertyOptional({ description: "Container horizontal margin" })
  @IsOptional()
  @IsString()
  containerMarginX?: string;

  @ApiPropertyOptional({ description: "Container vertical margin" })
  @IsOptional()
  @IsString()
  containerMarginY?: string;

  @ApiPropertyOptional({ description: "Container horizontal padding" })
  @IsOptional()
  @IsString()
  containerPaddingX?: string;

  @ApiPropertyOptional({ description: "Container vertical padding" })
  @IsOptional()
  @IsString()
  containerPaddingY?: string;

  @ApiPropertyOptional({ description: "Gap between zones" })
  @IsOptional()
  @IsString()
  containerGap?: string;
}

// Social link configuration
export class SocialLinkDto {
  @ApiProperty({ description: "Unique identifier" })
  @IsString()
  id: string;

  @ApiProperty({ description: "Social platform name" })
  @IsString()
  platform: string;

  @ApiProperty({ description: "Social profile URL" })
  @IsString()
  url: string;

  @ApiPropertyOptional({ description: "Custom icon" })
  @IsOptional()
  @IsString()
  icon?: string;
}

// Copyright configuration
export class CopyrightConfigDto {
  @ApiPropertyOptional({ description: "Copyright text" })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ description: "Show current year" })
  @IsOptional()
  @IsBoolean()
  showYear?: boolean;

  @ApiPropertyOptional({ description: "Company name" })
  @IsOptional()
  @IsString()
  companyName?: string;
}

export class CreateFooterDto {
  @ApiProperty({ description: "Footer name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Footer slug (URL-friendly identifier)" })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: "Footer layout type",
    enum: ["SIMPLE", "COLUMNS", "STACKED", "MINIMAL", "CENTERED"],
    default: "SIMPLE",
  })
  @IsOptional()
  @IsString()
  layout?: "SIMPLE" | "COLUMNS" | "STACKED" | "MINIMAL" | "CENTERED";

  @ApiPropertyOptional({ description: "Footer zones configuration" })
  @IsOptional()
  @IsObject()
  zones?: FooterZonesDto;

  @ApiPropertyOptional({ description: "Footer styling" })
  @IsOptional()
  @IsObject()
  style?: FooterStyleDto;

  @ApiPropertyOptional({ description: "Social media links" })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @ApiPropertyOptional({ description: "Copyright configuration" })
  @IsOptional()
  @IsObject()
  copyright?: CopyrightConfigDto;

  @ApiPropertyOptional({ description: "Menu ID to associate with this footer" })
  @IsOptional()
  @IsString()
  menuId?: string;

  @ApiPropertyOptional({
    description: "Set as default footer for this tenant",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
