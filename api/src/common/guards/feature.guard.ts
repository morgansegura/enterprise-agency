import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "@/common/services/prisma.service";
import { FEATURE_KEY } from "@/common/decorators/feature.decorator";

/**
 * Guard to enforce tenant feature requirements
 * Checks if the tenant has the required features enabled
 *
 * Supports nested features using dot notation:
 * - 'shop' checks tenant.features.shop
 * - 'payments.stripe' checks tenant.features.payments.stripe
 *
 * Usage:
 * @UseGuards(FeatureGuard)
 * @RequireFeature('shop')
 *
 * @UseGuards(FeatureGuard)
 * @RequireFeature('shop', 'payments.stripe')
 */
@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeatures = this.reflector.getAllAndOverride<string[]>(
      FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no feature requirement is specified, allow access
    if (!requiredFeatures || requiredFeatures.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenantId;

    if (!tenantId) {
      throw new ForbiddenException("Tenant context required");
    }

    // Fetch tenant with features
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        businessName: true,
        enabledFeatures: true,
      },
    });

    if (!tenant) {
      throw new ForbiddenException("Tenant not found");
    }

    // Check if tenant has all required features
    const missingFeatures: string[] = [];
    const features = tenant.enabledFeatures as Record<string, unknown> | null;

    for (const feature of requiredFeatures) {
      if (!features || !this.hasFeature(features, feature)) {
        missingFeatures.push(feature);
      }
    }

    if (missingFeatures.length > 0) {
      throw new ForbiddenException(
        `Missing required features: ${missingFeatures.join(", ")}. Please contact support to enable these features.`,
      );
    }

    // Attach tenant to request for downstream use
    request.tenant = tenant;

    return true;
  }

  /**
   * Check if a feature is enabled, supporting nested features
   * @param features - The tenant's features object
   * @param feature - The feature key (supports dot notation for nested features)
   */
  private hasFeature(
    features: Record<string, unknown>,
    feature: string,
  ): boolean {
    if (!features) {
      return false;
    }

    // Support nested features (e.g., 'payments.stripe')
    const keys = feature.split(".");
    let value: unknown = features;

    for (const key of keys) {
      if (
        typeof value === "object" &&
        value !== null &&
        key in (value as Record<string, unknown>)
      ) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return false;
      }
    }

    // Feature must be explicitly true
    return value === true;
  }
}
