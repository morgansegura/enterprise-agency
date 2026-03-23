import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import { TenantRole } from "@/common/permissions";

/**
 * Verifies the authenticated user has access to the requested tenant.
 *
 * Access paths (checked in order):
 * 1. Direct TenantUser membership
 * 2. SUPERADMIN in any tenant (god mode)
 * 3. Parent tenant agency role (agency accessing child client)
 * 4. ProjectAssignment (agency user assigned to specific client project)
 *
 * Attaches `request.tenantUser` for downstream guards (PermissionGuard, etc.)
 *
 * Prerequisites: JwtAuthGuard (sets request.user), TenantMiddleware (sets request.tenantId)
 */
@Injectable()
export class TenantAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.tenantId;

    if (!user || !tenantId) {
      throw new ForbiddenException(
        "Authentication and tenant context required",
      );
    }

    // 1. Direct tenant membership
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: { tenantId_userId: { tenantId, userId: user.id } },
    });

    if (tenantUser) {
      request.tenantUser = tenantUser;
      return true;
    }

    // 2. SUPERADMIN in any tenant
    const superAdminAccess = await this.prisma.tenantUser.findFirst({
      where: { userId: user.id, role: TenantRole.SUPERADMIN },
    });

    if (superAdminAccess) {
      request.tenantUser = {
        id: "virtual",
        tenantId,
        userId: user.id,
        role: TenantRole.SUPERADMIN,
        permissions: [],
      };
      return true;
    }

    // 3. Parent tenant agency role (agency managing child client)
    const requestedTenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { parentTenantId: true },
    });

    if (requestedTenant?.parentTenantId) {
      const parentTenantUser = await this.prisma.tenantUser.findUnique({
        where: {
          tenantId_userId: {
            tenantId: requestedTenant.parentTenantId,
            userId: user.id,
          },
        },
      });

      if (
        parentTenantUser &&
        (parentTenantUser.role === TenantRole.AGENCY_ADMIN ||
          parentTenantUser.role === TenantRole.AGENCY_EDITOR)
      ) {
        request.tenantUser = { ...parentTenantUser, tenantId };
        return true;
      }
    }

    // 4. ProjectAssignment (agency user assigned to client project)
    const projectAssignment = await this.prisma.projectAssignment.findUnique({
      where: { userId_tenantId: { tenantId, userId: user.id } },
    });

    if (projectAssignment && projectAssignment.status === "active") {
      request.tenantUser = {
        id: projectAssignment.id,
        tenantId,
        userId: user.id,
        role: projectAssignment.role,
        permissions: projectAssignment.permissions,
      };
      return true;
    }

    throw new ForbiddenException("You do not have access to this tenant");
  }
}
