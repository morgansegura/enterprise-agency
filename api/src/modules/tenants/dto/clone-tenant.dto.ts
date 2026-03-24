import { IsString, IsOptional, IsEmail, IsUUID, IsEnum } from "class-validator";
import { TenantTier } from "@prisma";

export class CloneTenantDto {
  @IsUUID()
  templateId: string;

  @IsString()
  businessName: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsEnum(TenantTier)
  tier?: TenantTier;
}
