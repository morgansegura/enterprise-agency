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
 * Guard to enforce tenant tier requirements and provide tenant context
 *
 * This guard performs two functions:
 * 1. Always fetches and attaches tenant info to the request (if tenantId exists)
 * 2. Optionally enforces tier requirements when @RequireTier decorator is used
 *
 * The tenant info is made available via @CurrentTenant() decorator for
 * tier-aware operations in controllers and services.
 *
 * Usage:
 * @UseGuards(TierGuard)
 * @RequireTier('BUILDER')  // Optional - enforces tier requirement
 */
@Injectable()
export class TierGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenantId;

    // Get required tiers from decorator (if any)
    const requiredTiers = this.reflector.getAllAndOverride<string[]>(TIER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no tenantId, skip tenant fetching
    // Only throw error if tier requirement is specified
    if (!tenantId) {
      if (requiredTiers && requiredTiers.length > 0) {
        throw new ForbiddenException("Tenant context required");
      }
      return true;
    }

    // Always fetch tenant to make it available via @CurrentTenant()
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, tier: true, businessName: true },
    });

    if (!tenant) {
      if (requiredTiers && requiredTiers.length > 0) {
        throw new ForbiddenException("Tenant not found");
      }
      return true;
    }

    // Attach tenant to request for downstream use via @CurrentTenant()
    request.tenant = tenant;

    // If tier requirement is specified, enforce it
    if (requiredTiers && requiredTiers.length > 0) {
      if (!requiredTiers.includes(tenant.tier)) {
        throw new ForbiddenException(
          `This feature requires ${requiredTiers.join(" or ")} tier. Current tier: ${tenant.tier}. Please upgrade to access this feature.`,
        );
      }
    }

    return true;
  }
}
