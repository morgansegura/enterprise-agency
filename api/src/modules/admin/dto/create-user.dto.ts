import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  MinLength,
} from "class-validator";

export enum AgencyRole {
  OWNER = "owner",
  ADMIN = "admin",
  DEVELOPER = "developer",
  DESIGNER = "designer",
  CONTENT_MANAGER = "content_manager",
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;

  @IsEnum(AgencyRole)
  @IsOptional()
  agencyRole?: AgencyRole;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(AgencyRole)
  @IsOptional()
  agencyRole?: AgencyRole;

  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;
}
