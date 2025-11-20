import { IsString, IsOptional, IsEmail, IsObject } from "class-validator";

export class CreateTenantDto {
  @IsString()
  slug: string;

  @IsString()
  businessName: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsObject()
  enabledFeatures?: Record<string, boolean>;

  @IsOptional()
  @IsObject()
  themeConfig?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  planLimits?: Record<string, unknown>;
}
