import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@/common/services/prisma.service';
import { getRoleLevel } from '@/common/permissions';

export const ROLES_KEY = 'roles';

/**
 * Checks if the user's role is in the allowed roles list.
 *
 * Resolution order:
 * 1. request.tenantUser.role (fast path — set by TenantAccessGuard)
 * 2. Tenant-scoped DB lookup via route param :id or :tenantId
 * 3. User's highest role across ALL tenants (for platform-admin routes)
 *
 * Usage: @Roles(TenantRole.AGENCY_ADMIN, TenantRole.SUPERADMIN)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id) {
      throw new ForbiddenException('Authentication required');
    }

    // Fast path: TenantAccessGuard already resolved the role
    if (request.tenantUser?.role) {
      if (requiredRoles.includes(request.tenantUser.role)) return true;
      throw new ForbiddenException('Insufficient role');
    }

    // Fallback: resolve role from DB
    const tenantId = request.params?.tenantId ?? request.params?.id;

    let role: string | null = null;

    if (tenantId) {
      // Tenant-scoped: look up role for this specific tenant
      const tu = await this.prisma.tenantUser.findUnique({
        where: { tenantId_userId: { tenantId, userId: user.id } },
        select: { role: true },
      });
      role = tu?.role ?? null;
    }

    if (!role) {
      // Platform-wide: find user's highest role across all tenants
      const tenantUsers = await this.prisma.tenantUser.findMany({
        where: { userId: user.id },
        select: { role: true },
      });
      role = tenantUsers.reduce<string | null>((highest, tu) => {
        if (!highest) return tu.role;
        return getRoleLevel(tu.role as string) > getRoleLevel(highest)
          ? tu.role
          : highest;
      }, null);
    }

    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
