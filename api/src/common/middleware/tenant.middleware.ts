import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "@/common/services/prisma.service";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private slugCache = new Map<string, { id: string; expiry: number }>();
  private readonly CACHE_TTL = 60_000; // 60 seconds

  constructor(private readonly prisma: PrismaService) {}

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

  private async resolveSlugToId(slug: string): Promise<string | null> {
    const now = Date.now();
    const cached = this.slugCache.get(slug);
    if (cached && now < cached.expiry) return cached.id;

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (tenant) {
      this.slugCache.set(slug, { id: tenant.id, expiry: now + this.CACHE_TTL });
      return tenant.id;
    }

    return null;
  }

  async use(req: Request, _res: Response, next: NextFunction) {
    // Extract tenant from subdomain (e.g., demo.example.com)
    const host = req.get("host") || "";
    // Remove port from host (e.g., localhost:4000 -> localhost)
    const hostname = host.split(":")[0];
    const subdomain = hostname.split(".")[0];

    // Extract tenant from various sources (priority order)
    const tenantFromHeader = req.get("x-tenant-id");
    const rawTenantQuery = req.query.tenant;
    const tenantFromQuery =
      typeof rawTenantQuery === "string" ? rawTenantQuery : undefined;

    // Determine tenant identifier
    let tenantIdentifier: string | null = null;

    if (tenantFromHeader) {
      // Priority 1: x-tenant-id header (for builder/admin panel)
      tenantIdentifier = tenantFromHeader;
    } else if (tenantFromQuery) {
      // Priority 2: Query parameter
      tenantIdentifier = tenantFromQuery;
    } else if (
      subdomain &&
      subdomain !== "www" &&
      subdomain !== "localhost" &&
      subdomain !== "api"
    ) {
      // Priority 3: Subdomain
      tenantIdentifier = subdomain;
    }

    // SECURITY: Validate tenant ID format to prevent injection attacks
    if (tenantIdentifier) {
      const isUUID = this.isValidUUID(tenantIdentifier);
      const isSlug = this.isValidSlug(tenantIdentifier);

      if (!isUUID && !isSlug) {
        throw new BadRequestException(
          "Invalid tenant identifier format. Must be a valid UUID or slug.",
        );
      }

      // Resolve slug to UUID if needed
      let tenantId = tenantIdentifier;
      if (isSlug && !isUUID) {
        const resolvedId = await this.resolveSlugToId(tenantIdentifier);
        if (!resolvedId) {
          throw new BadRequestException(
            `Tenant not found: ${tenantIdentifier}`,
          );
        }
        tenantId = resolvedId;
      }

      (req as Request & { tenantId?: string }).tenantId = tenantId;
    } else if (process.env.NODE_ENV === "production") {
      throw new BadRequestException("Tenant identifier required");
    }

    next();
  }
}
