import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ContentBlockDto } from "../content-block.dto";

export class ContainerBlockDataDto {
  @IsOptional()
  @IsEnum(["sm", "md", "lg", "xl", "2xl", "full"])
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  @IsOptional()
  @IsEnum(["none", "sm", "md", "lg"])
  padding?: "none" | "sm" | "md" | "lg";

  @IsOptional()
  @IsBoolean()
  center?: boolean;
}

export class ContainerBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "container-block";

  data: ContainerBlockDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
