import { IsString, IsEnum, IsOptional, IsBoolean } from "class-validator";

export class LogoBlockDataDto {
  @IsString()
  src: string;

  @IsString()
  alt: string;

  @IsOptional()
  @IsString()
  href?: string;

  @IsEnum(["sm", "md", "lg", "xl"])
  size: string;

  @IsEnum(["left", "center", "right"])
  align: string;

  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean;
}

export class LogoBlockDto {
  @IsEnum(["logo-block"])
  _type: "logo-block";

  @IsString()
  _key: string;

  @IsOptional()
  data: LogoBlockDataDto;
}
