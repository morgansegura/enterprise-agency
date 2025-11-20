import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ContentBlockDto } from "../content-block.dto";

export class GridColumnsDto {
  @IsOptional()
  @IsEnum([1, 2, 3, 4, 5, 6])
  mobile?: number;

  @IsOptional()
  @IsEnum([1, 2, 3, 4, 5, 6])
  tablet?: number;

  @IsOptional()
  @IsEnum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  desktop?: number;
}

export class GridBlockDataDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => GridColumnsDto)
  columns?: GridColumnsDto;

  @IsOptional()
  @IsEnum(["xs", "sm", "md", "lg", "xl", "2xl"])
  gap?: string;

  @IsOptional()
  @IsEnum(["start", "center", "end", "stretch"])
  align?: string;

  @IsOptional()
  @IsEnum(["start", "center", "end", "between", "around", "evenly"])
  justify?: string;
}

export class GridBlockDto {
  @IsEnum(["grid-block"])
  _type: "grid-block";

  @IsString()
  _key: string;

  @IsOptional()
  data?: GridBlockDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
