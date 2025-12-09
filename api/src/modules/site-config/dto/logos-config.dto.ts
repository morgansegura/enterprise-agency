import { IsString, IsEnum, IsOptional, IsObject } from "class-validator";

export class SvgLogoDto {
  @IsEnum(["svg"])
  type: "svg";

  @IsString()
  svg: string;

  @IsOptional()
  @IsString()
  width?: string;

  @IsOptional()
  @IsString()
  height?: string;
}

export class ImageLogoDto {
  @IsEnum(["image"])
  type: "image";

  @IsString()
  src: string;

  @IsString()
  alt: string;

  @IsOptional()
  @IsString()
  width?: string;

  @IsOptional()
  @IsString()
  height?: string;
}

export class TextLogoDto {
  @IsEnum(["text"])
  type: "text";

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  tagline?: string;
}

export type LogoDto = SvgLogoDto | ImageLogoDto | TextLogoDto;

export class LogosConfigDto {
  @IsObject()
  logos: Record<string, LogoDto>;
}
