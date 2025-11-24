import { IsOptional, IsObject } from "class-validator";

/**
 * DTO for updating tenant design tokens
 * Matches the TenantTokens interface from the builder frontend
 */
export class UpdateDesignTokensDto {
  @IsOptional()
  @IsObject()
  header?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  menu?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  footer?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  section?: Record<string, unknown>;
}
