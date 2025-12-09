import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ContentBlockDto } from "../content-block.dto";

export class StackBlockDataDto {
  @IsOptional()
  @IsEnum(["none", "xs", "sm", "md", "lg", "xl", "2xl"])
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

  @IsOptional()
  @IsEnum(["left", "center", "right"])
  align?: "left" | "center" | "right"; // Horizontal alignment
}

export class StackBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "stack-block";

  data: StackBlockDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
