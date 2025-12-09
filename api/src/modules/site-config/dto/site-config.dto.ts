import { IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { HeaderConfigDto } from "./header-config.dto";
import { FooterConfigDto } from "./footer-config.dto";
import { MenusConfigDto } from "./menus-config.dto";
import { LogosConfigDto } from "./logos-config.dto";

export class SiteConfigDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => HeaderConfigDto)
  headerConfig?: HeaderConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FooterConfigDto)
  footerConfig?: FooterConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MenusConfigDto)
  menusConfig?: MenusConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LogosConfigDto)
  logosConfig?: LogosConfigDto;
}

export class UpdateHeaderConfigDto extends HeaderConfigDto {}
export class UpdateFooterConfigDto extends FooterConfigDto {}
export class UpdateMenusConfigDto extends MenusConfigDto {}
export class UpdateLogosConfigDto extends LogosConfigDto {}
