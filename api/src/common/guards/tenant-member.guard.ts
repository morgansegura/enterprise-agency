import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";

@Injectable()
export class TenantMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.tenantId;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    if (!tenantId) {
      throw new ForbiddenException("Tenant context required");
    }

    // user.id is the database user ID from JWT strategy validation
    // Check if user is member of tenant
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId: user.id,
        },
      },
    });

    if (!tenantUser) {
      throw new ForbiddenException("You do not have access to this tenant");
    }

    // Attach tenant user info to request for use in controllers
    request.tenantUser = tenantUser;

    return true;
  }
}
