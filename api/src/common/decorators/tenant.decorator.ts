import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId;
  },
);

// Alias for TenantId - used in media controller
export const CurrentTenant = TenantId;
