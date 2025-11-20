import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ContentBlockDto } from "../content-block.dto";

export class ColumnsBlockDataDto {
  @IsNumber()
  @IsEnum([2, 3])
  count: 2 | 3;

  @IsOptional()
  @IsEnum(["none", "xs", "sm", "md", "lg", "xl"])
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";

  @IsOptional()
  @IsBoolean()
  responsive?: boolean; // Stack on mobile

  @IsOptional()
  @IsEnum(["1:1", "2:1", "1:2", "1:1:1"])
  ratio?: "1:1" | "2:1" | "1:2" | "1:1:1"; // Column width ratios
}

export class ColumnsBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "columns-block";

  data: ColumnsBlockDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[]; // Must have 2 or 3 blocks matching column count
}
