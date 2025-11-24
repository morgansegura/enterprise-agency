import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "@/common/services/prisma.service";
import { TIER_KEY } from "@/common/decorators/tier.decorator";

/**
 * Guard to enforce tenant tier requirements
 * Checks if the tenant has the required tier (CONTENT_EDITOR or BUILDER)
 *
 * Usage:
 * @UseGuards(TierGuard)
 * @RequireTier('BUILDER')
 */
@Injectable()
export class TierGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredTiers = this.reflector.getAllAndOverride<string[]>(TIER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no tier requirement is specified, allow access
    if (!requiredTiers || requiredTiers.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenantId;

    if (!tenantId) {
      throw new ForbiddenException("Tenant context required");
    }

    // Fetch tenant to check tier
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, tier: true, businessName: true },
    });

    if (!tenant) {
      throw new ForbiddenException("Tenant not found");
    }

    // Check if tenant tier is in required tiers
    if (!requiredTiers.includes(tenant.tier)) {
      throw new ForbiddenException(
        `This feature requires ${requiredTiers.join(" or ")} tier. Current tier: ${tenant.tier}. Please upgrade to access this feature.`,
      );
    }

    // Attach tenant to request for downstream use
    request.tenant = tenant;

    return true;
  }
}
