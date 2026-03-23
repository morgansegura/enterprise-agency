import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "@/common/services/prisma.service";
import { PERMISSIONS_KEY } from "@/common/decorators/permissions.decorator";
import { Permission, TenantRole, ROLE_PERMISSIONS } from "@/common/permissions";

/**
 * Checks if the authenticated user has the required atomic permissions.
 *
 * Permission sources (combined):
 * 1. Role-based defaults from ROLE_PERMISSIONS mapping
 * 2. Custom per-user permissions from TenantUser.permissions JSON field
 *
 * Prerequisites: JwtAuthGuard + TenantAccessGuard must run first
 * (sets request.user, request.tenantId, request.tenantUser)
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user, tenantId, tenantUser } = request;

    if (!user || !tenantId) {
      return false;
    }

    // Use tenantUser from TenantAccessGuard if available, otherwise look up
    const resolvedTenantUser =
      tenantUser ??
      (await this.prisma.tenantUser.findUnique({
        where: { tenantId_userId: { tenantId, userId: user.id } },
      }));

    if (!resolvedTenantUser) {
      return false;
    }

    // Combine role permissions + custom permissions
    const role = resolvedTenantUser.role as TenantRole;
    const rolePermissions = ROLE_PERMISSIONS[role] ?? [];

    let customPermissions: Permission[] = [];
    if (
      resolvedTenantUser.permissions &&
      Array.isArray(resolvedTenantUser.permissions)
    ) {
      customPermissions = resolvedTenantUser.permissions as Permission[];
    }

    const allPermissions = new Set([...rolePermissions, ...customPermissions]);

    return requiredPermissions.every((p) => allPermissions.has(p));
  }
}
