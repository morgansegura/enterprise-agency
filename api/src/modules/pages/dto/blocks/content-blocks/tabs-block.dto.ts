import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class TabItemDto {
  @IsString()
  label: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class TabsBlockDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TabItemDto)
  tabs: TabItemDto[];

  @IsOptional()
  @IsNumber()
  defaultTab?: number; // Index of default active tab

  @IsOptional()
  @IsEnum(["default", "pills", "underline"])
  variant?: "default" | "pills" | "underline";
}

export class TabsBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "tabs-block";

  data: TabsBlockDataDto;
}
