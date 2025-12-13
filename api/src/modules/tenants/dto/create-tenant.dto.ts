import {
  IsString,
  IsOptional,
  IsEmail,
  IsObject,
  IsEnum,
  IsUUID,
} from "class-validator";
import { TenantType, ClientType } from "@prisma";

export class CreateTenantDto {
  @IsString()
  slug: string;

  @IsString()
  businessName: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  // Tenant hierarchy
  @IsOptional()
  @IsUUID()
  parentTenantId?: string;

  @IsOptional()
  @IsEnum(TenantType)
  tenantType?: TenantType;

  @IsOptional()
  @IsEnum(ClientType)
  clientType?: ClientType;

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
