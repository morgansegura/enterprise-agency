import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class ImageLinkDto {
  @IsString()
  href: string;

  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean;
}

export class ImageBlockDataDto {
  @IsString()
  src: string; // URL or asset ID

  @IsString()
  alt: string;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsEnum(["16/9", "4/3", "1/1", "3/2", "auto"])
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2" | "auto";

  @IsOptional()
  @IsEnum(["cover", "contain", "fill", "none"])
  objectFit?: "cover" | "contain" | "fill" | "none";

  @IsOptional()
  @IsBoolean()
  rounded?: boolean;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageLinkDto)
  link?: ImageLinkDto;
}

export class ImageBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "image-block";

  data: ImageBlockDataDto;
}
