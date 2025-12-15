import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsObject,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum HeaderBehavior {
  STATIC = "STATIC",
  FIXED = "FIXED",
  STICKY = "STICKY",
  SCROLL_HIDE = "SCROLL_HIDE",
  TRANSPARENT = "TRANSPARENT",
}

// Header zone content - can contain menu, logo, buttons, search, etc.
export class HeaderZoneDto {
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
  @IsObject()
  blocks?: Record<string, unknown>[];

  @ApiPropertyOptional({
    description: "Zone alignment",
    enum: ["left", "center", "right"],
  })
  @IsOptional()
  @IsString()
  alignment?: "left" | "center" | "right";
}

// Header zones layout
export class HeaderZonesDto {
  @ApiPropertyOptional({ description: "Left zone content" })
  @IsOptional()
  @IsObject()
  left?: HeaderZoneDto;

  @ApiPropertyOptional({ description: "Center zone content" })
  @IsOptional()
  @IsObject()
  center?: HeaderZoneDto;

  @ApiPropertyOptional({ description: "Right zone content" })
  @IsOptional()
  @IsObject()
  right?: HeaderZoneDto;
}

// Header styling options - full-width bar styling
export class HeaderStyleDto {
  // Header Bar Styling
  @ApiPropertyOptional({ description: "Background color" })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: "Text color" })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiPropertyOptional({ description: "Header height in pixels or preset" })
  @IsOptional()
  height?: number | "sm" | "md" | "lg" | "xl";

  @ApiPropertyOptional({ description: "Horizontal padding" })
  @IsOptional()
  @IsString()
  paddingX?: string;

  @ApiPropertyOptional({ description: "Vertical padding" })
  @IsOptional()
  @IsString()
  paddingY?: string;

  @ApiPropertyOptional({ description: "Blur effect for transparent headers" })
  @IsOptional()
  @IsBoolean()
  blur?: boolean;

  // Header Bar Borders
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

  // Container Styling - inner wrapper that holds the zones
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

  // Scroll State Styling
  @ApiPropertyOptional({ description: "Background color when scrolled" })
  @IsOptional()
  @IsString()
  scrolledBackgroundColor?: string;

  @ApiPropertyOptional({ description: "Text color when scrolled" })
  @IsOptional()
  @IsString()
  scrolledTextColor?: string;

  @ApiPropertyOptional({ description: "Shadow when scrolled" })
  @IsOptional()
  @IsString()
  scrolledShadow?: string;

  @ApiPropertyOptional({ description: "Border bottom when scrolled" })
  @IsOptional()
  @IsString()
  scrolledBorderBottom?: string;
}

// Transparent state styling (when header is at top of page)
export class TransparentStyleDto {
  @ApiPropertyOptional({ description: "Background color when transparent" })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: "Text color when transparent" })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiPropertyOptional({
    description: "Logo source when transparent (light logo)",
  })
  @IsOptional()
  @IsString()
  logoSrc?: string;
}

// Mobile menu trigger icon configuration
export class MobileMenuTriggerDto {
  @ApiPropertyOptional({
    description: "Open icon type",
    enum: [
      "hamburger",
      "menu",
      "dots-vertical",
      "dots-horizontal",
      "grid",
      "custom",
    ],
  })
  @IsOptional()
  @IsString()
  openIcon?:
    | "hamburger"
    | "menu"
    | "dots-vertical"
    | "dots-horizontal"
    | "grid"
    | "custom";

  @ApiPropertyOptional({ description: "Custom open icon (SVG or icon name)" })
  @IsOptional()
  @IsString()
  openIconCustom?: string;

  @ApiPropertyOptional({
    description: "Close icon type",
    enum: ["x", "arrow-left", "arrow-right", "chevron-down", "custom"],
  })
  @IsOptional()
  @IsString()
  closeIcon?: "x" | "arrow-left" | "arrow-right" | "chevron-down" | "custom";

  @ApiPropertyOptional({ description: "Custom close icon (SVG or icon name)" })
  @IsOptional()
  @IsString()
  closeIconCustom?: string;

  @ApiPropertyOptional({
    description: "Trigger size",
    enum: ["sm", "md", "lg"],
  })
  @IsOptional()
  @IsString()
  size?: "sm" | "md" | "lg";

  @ApiPropertyOptional({ description: "Trigger color" })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: "Trigger style",
    enum: ["default", "rounded", "pill", "ghost"],
  })
  @IsOptional()
  @IsString()
  style?: "default" | "rounded" | "pill" | "ghost";
}

// Mobile menu configuration
export class MobileMenuDto {
  @ApiPropertyOptional({
    description: "Mobile menu type",
    enum: ["slide-left", "slide-right", "dropdown", "fullscreen", "bottom-nav"],
  })
  @IsOptional()
  @IsString()
  type?:
    | "slide-left"
    | "slide-right"
    | "dropdown"
    | "fullscreen"
    | "bottom-nav";

  @ApiPropertyOptional({
    description: "Breakpoint at which mobile menu activates",
    enum: ["sm", "md", "lg"],
  })
  @IsOptional()
  @IsString()
  breakpoint?: "sm" | "md" | "lg";

  @ApiPropertyOptional({
    description: "Animation style for mobile menu",
    enum: ["none", "fade", "slide", "scale"],
  })
  @IsOptional()
  @IsString()
  animation?: "none" | "fade" | "slide" | "scale";

  @ApiPropertyOptional({ description: "Background color for mobile menu" })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: "Text color for mobile menu" })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiPropertyOptional({ description: "Show overlay behind mobile menu" })
  @IsOptional()
  @IsBoolean()
  showOverlay?: boolean;

  @ApiPropertyOptional({ description: "Overlay color (with opacity)" })
  @IsOptional()
  @IsString()
  overlayColor?: string;

  @ApiPropertyOptional({ description: "Trigger icon configuration" })
  @IsOptional()
  @IsObject()
  trigger?: MobileMenuTriggerDto;

  @ApiPropertyOptional({ description: "Close on outside click" })
  @IsOptional()
  @IsBoolean()
  closeOnOutsideClick?: boolean;

  @ApiPropertyOptional({ description: "Close on link click" })
  @IsOptional()
  @IsBoolean()
  closeOnLinkClick?: boolean;

  @ApiPropertyOptional({ description: "Include search in mobile menu" })
  @IsOptional()
  @IsBoolean()
  includeSearch?: boolean;

  @ApiPropertyOptional({ description: "Include social links in mobile menu" })
  @IsOptional()
  @IsBoolean()
  includeSocial?: boolean;

  @ApiPropertyOptional({ description: "Show logo in mobile menu" })
  @IsOptional()
  @IsBoolean()
  showLogo?: boolean;

  @ApiPropertyOptional({
    description: "Menu item alignment in mobile menu",
    enum: ["left", "center", "right"],
  })
  @IsOptional()
  @IsString()
  menuAlignment?: "left" | "center" | "right";
}

export class CreateHeaderDto {
  @ApiProperty({ description: "Header name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Header slug (URL-friendly identifier)" })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: "Header behavior",
    enum: HeaderBehavior,
    default: HeaderBehavior.STATIC,
  })
  @IsOptional()
  @IsEnum(HeaderBehavior)
  behavior?: HeaderBehavior;

  @ApiPropertyOptional({
    description:
      "Scroll threshold in pixels (for sticky/scroll-hide behaviors)",
    minimum: 0,
    maximum: 1000,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  scrollThreshold?: number;

  @ApiPropertyOptional({
    description: "Animation style",
    enum: ["none", "fade", "slide", "scale"],
  })
  @IsOptional()
  @IsString()
  animation?: "none" | "fade" | "slide" | "scale";

  @ApiPropertyOptional({ description: "Header zones configuration" })
  @IsOptional()
  @IsObject()
  zones?: HeaderZonesDto;

  @ApiPropertyOptional({ description: "Header styling" })
  @IsOptional()
  @IsObject()
  style?: HeaderStyleDto;

  @ApiPropertyOptional({ description: "Transparent state styling" })
  @IsOptional()
  @IsObject()
  transparentStyle?: TransparentStyleDto;

  @ApiPropertyOptional({ description: "Mobile menu configuration" })
  @IsOptional()
  @IsObject()
  mobileMenu?: MobileMenuDto;

  @ApiPropertyOptional({ description: "Menu ID to associate with this header" })
  @IsOptional()
  @IsString()
  menuId?: string;

  @ApiPropertyOptional({
    description: "Set as default header for this tenant",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
