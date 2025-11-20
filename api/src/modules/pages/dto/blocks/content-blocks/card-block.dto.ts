import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CardImageDto {
  @IsString()
  src: string;

  @IsString()
  alt: string;

  @IsOptional()
  @IsString()
  aspectRatio?: string;
}

export class CardLinkDto {
  @IsString()
  href: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean;
}

export class CardBlockDataDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CardImageDto)
  image?: CardImageDto;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  footer?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CardLinkDto)
  link?: CardLinkDto;

  @IsOptional()
  @IsEnum(["default", "bordered", "elevated"])
  variant?: "default" | "bordered" | "elevated";

  @IsOptional()
  @IsEnum(["none", "sm", "md", "lg"])
  padding?: "none" | "sm" | "md" | "lg";
}

export class CardBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "card-block";

  data: CardBlockDataDto;
}
