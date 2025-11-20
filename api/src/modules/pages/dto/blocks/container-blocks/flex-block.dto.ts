import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ContentBlockDto } from "../content-block.dto";

export class FlexBlockDataDto {
  @IsEnum(["row", "column", "row-reverse", "column-reverse"])
  direction: "row" | "column" | "row-reverse" | "column-reverse";

  @IsOptional()
  @IsEnum(["nowrap", "wrap", "wrap-reverse"])
  wrap?: "nowrap" | "wrap" | "wrap-reverse";

  @IsOptional()
  @IsEnum(["none", "xs", "sm", "md", "lg", "xl"])
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";

  @IsOptional()
  @IsEnum(["start", "center", "end", "stretch", "baseline"])
  align?: "start" | "center" | "end" | "stretch" | "baseline";

  @IsOptional()
  @IsEnum([
    "start",
    "center",
    "end",
    "space-between",
    "space-around",
    "space-evenly",
  ])
  justify?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";
}

export class FlexBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "flex-block";

  data: FlexBlockDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
