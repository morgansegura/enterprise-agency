import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "@/common/services/prisma.service";

export const ROLES_KEY = "roles";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.tenantId;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    if (!tenantId) {
      throw new ForbiddenException("Tenant context required");
    }

    // user.id is already the database user ID from JWT strategy validation
    // Check if user has access via TenantUser (client users) or ProjectAssignment (agency users)
    const [tenantUser, projectAssignment] = await Promise.all([
      this.prisma.tenantUser.findUnique({
        where: {
          tenantId_userId: {
            tenantId,
            userId: user.id,
          },
        },
      }),
      this.prisma.projectAssignment.findUnique({
        where: {
          userId_tenantId: {
            tenantId,
            userId: user.id,
          },
        },
      }),
    ]);

    // User must have either TenantUser or ProjectAssignment record
    if (!tenantUser && !projectAssignment) {
      throw new ForbiddenException("You do not have access to this tenant");
    }

    // Get the role from whichever record exists (ProjectAssignment takes priority for agency users)
    const userRole = projectAssignment?.role || tenantUser?.role;

    // Check if user's role is in required roles
    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Insufficient permissions. Required roles: ${requiredRoles.join(", ")}`,
      );
    }

    // Attach tenant user info to request (prefer tenantUser if both exist)
    request.tenantUser = tenantUser || {
      role: userRole,
      permissions: projectAssignment?.permissions,
    };

    return true;
  }
}
