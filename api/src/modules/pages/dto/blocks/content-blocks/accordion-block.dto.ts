import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class AccordionItemDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  defaultOpen?: boolean;
}

export class AccordionBlockDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccordionItemDto)
  items: AccordionItemDto[];

  @IsOptional()
  @IsBoolean()
  allowMultiple?: boolean; // Allow multiple open at once

  @IsOptional()
  @IsEnum(["default", "bordered", "separated"])
  variant?: "default" | "bordered" | "separated";
}

export class AccordionBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "accordion-block";

  data: AccordionBlockDataDto;
}
