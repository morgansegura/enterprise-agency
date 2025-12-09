import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class LogoLinkDto {
  @IsString()
  href: string;

  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean;
}

export class LogoBlockDataDto {
  @IsEnum(["primary", "icon", "custom"])
  logoId: "primary" | "icon" | "custom"; // References Tenant.logosConfig

  @IsOptional()
  @IsString()
  width?: string; // CSS width

  @IsOptional()
  @IsString()
  height?: string; // CSS height

  @IsOptional()
  @IsEnum(["left", "center", "right"])
  align?: "left" | "center" | "right";

  @IsOptional()
  @ValidateNested()
  @Type(() => LogoLinkDto)
  link?: LogoLinkDto;
}

export class LogoBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "logo-block";

  data: LogoBlockDataDto;
}
