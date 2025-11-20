import { IsString, IsEnum, IsOptional } from "class-validator";

export class LogoBlockDataDto {
  @IsString()
  logoKey: string;

  @IsOptional()
  @IsEnum(["sm", "md", "lg", "xl"])
  size?: string;

  @IsOptional()
  @IsString()
  href?: string;
}

export class LogoBlockDto {
  @IsEnum(["logo-block"])
  _type: "logo-block";

  @IsString()
  _key: string;

  @IsOptional()
  data: LogoBlockDataDto;
}
