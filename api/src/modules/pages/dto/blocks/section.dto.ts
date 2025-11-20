import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ContentBlockDto } from "./content-block.dto";

export class SectionDto {
  @IsEnum(["section"])
  _type: "section";

  @IsString()
  _key: string;

  @IsOptional()
  @IsEnum([
    "white",
    "gray",
    "primary",
    "secondary",
    "accent",
    "muted",
    "dark",
    "transparent",
  ])
  background?: string;

  @IsOptional()
  @IsEnum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl"])
  spacing?: string;

  @IsOptional()
  @IsEnum(["narrow", "default", "wide", "full"])
  width?: string;

  @IsOptional()
  @IsEnum(["left", "center", "right"])
  align?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
