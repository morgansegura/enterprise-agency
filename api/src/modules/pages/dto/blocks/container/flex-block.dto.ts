import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ContentBlockDto } from "../content-block.dto";

export class FlexBlockDataDto {
  @IsOptional()
  @IsEnum(["row", "column", "row-reverse", "column-reverse"])
  direction?: string;

  @IsOptional()
  @IsBoolean()
  wrap?: boolean;

  @IsOptional()
  @IsEnum(["xs", "sm", "md", "lg", "xl", "2xl"])
  gap?: string;

  @IsOptional()
  @IsEnum(["start", "center", "end", "between", "around", "evenly"])
  justify?: string;

  @IsOptional()
  @IsEnum(["start", "center", "end", "stretch", "baseline"])
  align?: string;
}

export class FlexBlockDto {
  @IsEnum(["flex-block"])
  _type: "flex-block";

  @IsString()
  _key: string;

  @IsOptional()
  data?: FlexBlockDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
