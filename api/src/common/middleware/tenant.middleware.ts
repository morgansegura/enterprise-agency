import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private isValidUUID(str: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  private isValidSlug(str: string): boolean {
    // Slug: lowercase alphanumeric with hyphens, 3-63 chars
    const slugRegex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
    return slugRegex.test(str);
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from subdomain (e.g., demo.example.com)
    const host = req.get("host") || "";
    // Remove port from host (e.g., localhost:4000 -> localhost)
    const hostname = host.split(":")[0];
    const subdomain = hostname.split(".")[0];

    // Extract tenant from various sources (priority order)
    const tenantFromHeader = req.get("x-tenant-id");
    const tenantFromQuery = req.query.tenant as string;

    // Determine tenant ID
    let tenantId: string | null = null;

    if (tenantFromHeader) {
      // Priority 1: x-tenant-id header (for builder/admin panel)
      tenantId = tenantFromHeader;
    } else if (tenantFromQuery) {
      // Priority 2: Query parameter
      tenantId = tenantFromQuery;
    } else if (subdomain && subdomain !== "www" && subdomain !== "localhost") {
      // Priority 3: Subdomain
      tenantId = subdomain;
    }

    // SECURITY: Validate tenant ID format to prevent injection attacks
    if (tenantId) {
      const isUUID = this.isValidUUID(tenantId);
      const isSlug = this.isValidSlug(tenantId);

      if (!isUUID && !isSlug) {
        throw new BadRequestException(
          "Invalid tenant identifier format. Must be a valid UUID or slug.",
        );
      }
    }

    // For development: allow requests without tenant for health checks
    // In production, all routes except health should require a tenant
    if (!tenantId && process.env.NODE_ENV === "production") {
      throw new BadRequestException("Tenant identifier required");
    }

    // Attach tenant to request object for use in controllers/services
    (req as Request & { tenantId?: string }).tenantId = tenantId || undefined;

    next();
  }
}
