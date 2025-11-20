import { IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum AgencyRole {
  OWNER = "owner",
  ADMIN = "admin",
  DEVELOPER = "developer",
  DESIGNER = "designer",
  CONTENT_MANAGER = "content_manager",
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isSuperAdmin?: boolean;

  @IsOptional()
  @IsEnum(AgencyRole)
  agencyRole?: AgencyRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
