import {
  IsString,
  IsObject,
  IsOptional,
  IsEnum,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class NavigationConfigDto {
  @IsString()
  menu: string;

  @IsEnum(["horizontal", "vertical"])
  style: string;

  @IsString()
  variant: string;
}

export class HeaderActionsDto {
  @IsOptional()
  @IsObject()
  primaryButton?: {
    text: string;
    href: string;
    variant?: string;
  };

  @IsOptional()
  @IsObject()
  secondaryButton?: {
    text: string;
    href: string;
    variant?: string;
  };
}

export class HeaderBehaviorDto {
  @IsOptional()
  @IsEnum(["fixed", "sticky", "static"])
  position?: string;

  @IsOptional()
  @IsEnum(["always", "scroll-up", "never"])
  showOnScroll?: string;

  @IsOptional()
  transparent?: boolean;
}

export class HeaderConfigDto {
  @IsEnum(["standard", "centered", "split"])
  template: string;

  @IsString()
  logo: string;

  @ValidateNested()
  @Type(() => NavigationConfigDto)
  navigation: NavigationConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HeaderActionsDto)
  actions?: HeaderActionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HeaderBehaviorDto)
  behavior?: HeaderBehaviorDto;
}
