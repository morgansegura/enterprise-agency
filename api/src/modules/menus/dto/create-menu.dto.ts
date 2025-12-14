import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

// Menu item for nested structure
export class MenuItemDto {
  @ApiProperty({ description: "Unique identifier for the menu item" })
  @IsString()
  id: string;

  @ApiProperty({ description: "Display label for the menu item" })
  @IsString()
  label: string;

  @ApiProperty({ description: "URL or path for the menu item" })
  @IsString()
  url: string;

  @ApiPropertyOptional({ description: "Icon name (from icon library)" })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: "Link target",
    enum: ["_self", "_blank"],
  })
  @IsOptional()
  @IsString()
  target?: "_self" | "_blank";

  @ApiPropertyOptional({
    description: "Nested menu items (for dropdowns)",
    type: [MenuItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  children?: MenuItemDto[];

  @ApiPropertyOptional({
    description: "Mega menu content (for mega menus)",
  })
  @IsOptional()
  @IsObject()
  megaContent?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: "Highlight this item with special styling",
  })
  @IsOptional()
  @IsBoolean()
  highlight?: boolean;
}

// Menu styling options
export class MenuStyleDto {
  // Layout
  @ApiPropertyOptional({
    description: "Spacing between items",
    enum: ["compact", "comfortable", "spacious"],
  })
  @IsOptional()
  @IsString()
  spacing?: "compact" | "comfortable" | "spacious";

  @ApiPropertyOptional({
    description: "Menu alignment",
    enum: ["left", "center", "right", "spread"],
  })
  @IsOptional()
  @IsString()
  alignment?: "left" | "center" | "right" | "spread";

  // Typography
  @ApiPropertyOptional({
    description: "Font size",
    enum: ["sm", "md", "lg"],
  })
  @IsOptional()
  @IsString()
  fontSize?: "sm" | "md" | "lg";

  @ApiPropertyOptional({
    description: "Font weight",
    enum: ["normal", "medium", "semibold", "bold"],
  })
  @IsOptional()
  @IsString()
  fontWeight?: "normal" | "medium" | "semibold" | "bold";

  @ApiPropertyOptional({
    description: "Text transform",
    enum: ["none", "uppercase", "capitalize"],
  })
  @IsOptional()
  @IsString()
  textTransform?: "none" | "uppercase" | "capitalize";

  // Hover effects
  @ApiPropertyOptional({
    description: "Hover style",
    enum: [
      "none",
      "underline",
      "background",
      "border",
      "scale",
      "color",
      "glow",
    ],
  })
  @IsOptional()
  @IsString()
  hoverStyle?:
    | "none"
    | "underline"
    | "background"
    | "border"
    | "scale"
    | "color"
    | "glow";

  @ApiPropertyOptional({
    description: "Hover animation",
    enum: ["none", "fade", "slide", "bounce"],
  })
  @IsOptional()
  @IsString()
  hoverAnimation?: "none" | "fade" | "slide" | "bounce";

  @ApiPropertyOptional({ description: "Hover color (CSS color value)" })
  @IsOptional()
  @IsString()
  hoverColor?: string;

  // Dropdown/Mega settings
  @ApiPropertyOptional({
    description: "Dropdown trigger",
    enum: ["hover", "click"],
  })
  @IsOptional()
  @IsString()
  dropdownTrigger?: "hover" | "click";

  @ApiPropertyOptional({
    description: "Dropdown animation",
    enum: ["none", "fade", "slide", "scale"],
  })
  @IsOptional()
  @IsString()
  dropdownAnimation?: "none" | "fade" | "slide" | "scale";

  @ApiPropertyOptional({
    description: "Dropdown shadow",
    enum: ["none", "sm", "md", "lg"],
  })
  @IsOptional()
  @IsString()
  dropdownShadow?: "none" | "sm" | "md" | "lg";

  @ApiPropertyOptional({
    description: "Dropdown border radius",
    enum: ["none", "sm", "md", "lg", "full"],
  })
  @IsOptional()
  @IsString()
  dropdownRadius?: "none" | "sm" | "md" | "lg" | "full";

  @ApiPropertyOptional({ description: "Dropdown background color" })
  @IsOptional()
  @IsString()
  dropdownBackground?: string;

  // Active state
  @ApiPropertyOptional({
    description: "Active item style",
    enum: ["none", "underline", "background", "bold", "color"],
  })
  @IsOptional()
  @IsString()
  activeStyle?: "none" | "underline" | "background" | "bold" | "color";

  @ApiPropertyOptional({ description: "Active item color" })
  @IsOptional()
  @IsString()
  activeColor?: string;
}

export enum MenuType {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
  DROPDOWN = "dropdown",
  MEGA = "mega",
}

export class CreateMenuDto {
  @ApiProperty({ description: "Menu name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Menu slug (URL-friendly identifier)" })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: "Menu type",
    enum: MenuType,
    default: MenuType.HORIZONTAL,
  })
  @IsOptional()
  @IsEnum(MenuType)
  type?: MenuType;

  @ApiPropertyOptional({
    description: "Menu items",
    type: [MenuItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items?: MenuItemDto[];

  @ApiPropertyOptional({
    description: "Menu styling options",
    type: MenuStyleDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MenuStyleDto)
  style?: MenuStyleDto;

  @ApiPropertyOptional({
    description: "Set as default menu for this tenant",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
