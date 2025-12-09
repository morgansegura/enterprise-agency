import {
  IsString,
  IsObject,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class FooterColumnDto {
  @IsString()
  title: string;

  @IsString()
  menu: string;

  @IsOptional()
  @IsEnum(["vertical", "horizontal"])
  layout?: string;
}

export class FooterSocialDto {
  @IsString()
  platform: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class FooterConfigDto {
  @IsEnum(["simple", "multi-column", "mega"])
  template: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterColumnDto)
  columns?: FooterColumnDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterSocialDto)
  social?: FooterSocialDto[];

  @IsOptional()
  @IsObject()
  copyright?: {
    text: string;
    showYear?: boolean;
  };

  @IsOptional()
  @IsObject()
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}
