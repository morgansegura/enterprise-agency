import { SetMetadata } from "@nestjs/common";
import { ROLES_KEY } from "@/common/guards/roles.guard";

export enum AgencyRole {
  OWNER = "owner",
  ADMIN = "admin",
  DEVELOPER = "developer",
  DESIGNER = "designer",
  CONTENT_MANAGER = "content_manager",
}

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export const SuperAdmin = () => SetMetadata("isSuperAdmin", true);
