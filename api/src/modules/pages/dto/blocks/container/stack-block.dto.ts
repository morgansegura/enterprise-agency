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
  @IsEnum(["xs", "sm", "md", "lg", "xl", "2xl"])
  gap?: string;

  @IsOptional()
  @IsEnum(["left", "center", "right", "stretch"])
  align?: string;
}

export class StackBlockDto {
  @IsEnum(["stack-block"])
  _type: "stack-block";

  @IsString()
  _key: string;

  @IsOptional()
  data?: StackBlockDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
