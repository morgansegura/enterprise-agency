import {
  IsString,
  IsOptional,
  IsEmail,
  IsObject,
  Matches,
  MinLength,
  MaxLength,
} from "class-validator";

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Slug must be at least 2 characters" })
  @MaxLength(63, { message: "Slug must be 63 characters or less" })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "Slug must be lowercase, use hyphens to separate words, and contain only letters, numbers, and hyphens",
  })
  slug?: string;

  @IsOptional()
  @IsString()
  businessName?: string;

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
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

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
