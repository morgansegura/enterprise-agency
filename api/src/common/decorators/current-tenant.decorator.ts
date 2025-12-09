import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Parameter decorator to extract the current tenant from the request
 *
 * The tenant is attached to the request by TierGuard when tier validation is performed.
 * This provides access to tenant information including the tier.
 *
 * Usage:
 * ```typescript
 * @Get()
 * findAll(@CurrentTenant() tenant: TenantInfo) {
 *   console.log(tenant.tier); // 'CONTENT_EDITOR' | 'BUILDER'
 * }
 *
 * // Or get a specific property
 * @Get()
 * findAll(@CurrentTenant('tier') tier: TenantTier) {
 *   console.log(tier);
 * }
 * ```
 */
export const CurrentTenant = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tenant = request.tenant;

    if (!tenant) {
      return undefined;
    }

    return data ? tenant[data] : tenant;
  },
);
