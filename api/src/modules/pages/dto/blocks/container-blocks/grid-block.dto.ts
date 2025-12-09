import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ContentBlockDto } from "../content-block.dto";

export class GridColumnsDto {
  @IsOptional()
  @IsNumber()
  mobile?: number; // 1-12

  @IsOptional()
  @IsNumber()
  tablet?: number; // 1-12

  @IsOptional()
  @IsNumber()
  desktop?: number; // 1-12
}

export class GridBlockDataDto {
  @ValidateNested()
  @Type(() => GridColumnsDto)
  columns: GridColumnsDto;

  @IsOptional()
  @IsEnum(["none", "xs", "sm", "md", "lg", "xl"])
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";

  @IsOptional()
  @IsEnum(["start", "center", "end", "stretch"])
  align?: "start" | "center" | "end" | "stretch";

  @IsOptional()
  @IsEnum(["start", "center", "end", "space-between", "space-around"])
  justify?: "start" | "center" | "end" | "space-between" | "space-around";
}

export class GridBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "grid-block";

  data: GridBlockDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
