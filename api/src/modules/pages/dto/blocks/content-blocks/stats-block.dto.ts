import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class StatItemDto {
  @IsString()
  label: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class StatsBlockDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatItemDto)
  stats: StatItemDto[];

  @IsOptional()
  @IsEnum(["horizontal", "vertical"])
  layout?: "horizontal" | "vertical";

  @IsOptional()
  @IsEnum(["default", "highlighted", "bordered"])
  variant?: "default" | "highlighted" | "bordered";
}

export class StatsBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "stats-block";

  data: StatsBlockDataDto;
}
