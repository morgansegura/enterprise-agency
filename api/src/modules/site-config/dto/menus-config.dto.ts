import {
  IsString,
  IsObject,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class MenuItemDto {
  @IsString()
  _key: string;

  @IsString()
  label: string;

  @IsString()
  href: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  external?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items?: MenuItemDto[];
}

export class MenuDto {
  @IsString()
  _key: string;

  @IsString()
  label: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items: MenuItemDto[];
}

export class MenusConfigDto {
  @IsObject()
  menus: Record<string, MenuDto>;
}
