import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class ListItemDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class ListBlockDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListItemDto)
  items: ListItemDto[];

  @IsOptional()
  @IsBoolean()
  ordered?: boolean; // true = <ol>, false = <ul>

  @IsOptional()
  @IsEnum(["default", "checkmarks", "bullets", "numbers"])
  style?: "default" | "checkmarks" | "bullets" | "numbers";

  @IsOptional()
  @IsEnum(["compact", "comfortable"])
  spacing?: "compact" | "comfortable";
}

export class ListBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "list-block";

  data: ListBlockDataDto;
}
