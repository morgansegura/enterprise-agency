import { IsString, IsEnum, IsObject, IsOptional } from "class-validator";

export enum ProjectRole {
  OWNER = "owner",
  ADMIN = "admin",
  DEVELOPER = "developer",
  DESIGNER = "designer",
  CONTENT_MANAGER = "content_manager",
}

export enum AssignmentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export interface ProjectPermissions {
  canDeploy?: boolean;
  canManageSettings?: boolean;
  canManageUsers?: boolean;
  canEditContent?: boolean;
  canViewAnalytics?: boolean;
  [key: string]: boolean | undefined;
}

export class CreateProjectAssignmentDto {
  @IsString()
  userId: string;

  @IsString()
  tenantId: string;

  @IsEnum(ProjectRole)
  role: ProjectRole;

  @IsObject()
  @IsOptional()
  permissions?: ProjectPermissions;

  @IsEnum(AssignmentStatus)
  @IsOptional()
  status?: AssignmentStatus;
}

export class UpdateProjectAssignmentDto {
  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole;

  @IsObject()
  @IsOptional()
  permissions?: ProjectPermissions;

  @IsEnum(AssignmentStatus)
  @IsOptional()
  status?: AssignmentStatus;
}
