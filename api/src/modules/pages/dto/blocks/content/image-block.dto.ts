import { IsString, IsEnum, IsOptional, IsNumber } from "class-validator";

export class ImageBlockDataDto {
  @IsString()
  src: string;

  @IsString()
  alt: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsEnum(["cover", "contain", "fill", "none", "scale-down"])
  objectFit?: string;

  @IsOptional()
  @IsEnum(["eager", "lazy"])
  loading?: string;
}

export class ImageBlockDto {
  @IsEnum(["image-block"])
  _type: "image-block";

  @IsString()
  _key: string;

  @IsOptional()
  data: ImageBlockDataDto;
}
