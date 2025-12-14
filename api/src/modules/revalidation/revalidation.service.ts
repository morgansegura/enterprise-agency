import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@/common/services/prisma.service";

@Injectable()
export class RevalidationService {
  private readonly logger = new Logger(RevalidationService.name);
  private readonly revalidateSecret: string;
  private readonly defaultClientUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.revalidateSecret =
      this.configService.get<string>("REVALIDATE_SECRET") || "";
    this.defaultClientUrl =
      this.configService.get<string>("CLIENT_APP_URL") ||
      "http://localhost:3000";
  }

  /**
   * Revalidate a page after publish/unpublish
   */
  async revalidatePage(tenantId: string, pageSlug: string): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;

    const baseUrl = this.getClientBaseUrl(tenant);

    // Revalidate by path
    await this.revalidatePath(baseUrl, `/${pageSlug}`);

    // If it's the home page, also revalidate root
    if (pageSlug === "home") {
      await this.revalidatePath(baseUrl, "/");
    }

    this.logger.log(`Revalidated page: ${pageSlug} for tenant: ${tenant.slug}`);
  }

  /**
   * Revalidate a post after publish/unpublish
   */
  async revalidatePost(tenantId: string, postSlug: string): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;

    const baseUrl = this.getClientBaseUrl(tenant);

    // Revalidate the post page
    await this.revalidatePath(baseUrl, `/blog/${postSlug}`);

    // Revalidate the blog index
    await this.revalidatePath(baseUrl, "/blog");

    // Revalidate by tag for cache invalidation
    await this.revalidateTag(baseUrl, "posts-list");

    this.logger.log(`Revalidated post: ${postSlug} for tenant: ${tenant.slug}`);
  }

  /**
   * Revalidate site config (header, footer, menus, etc.)
   */
  async revalidateSiteConfig(tenantId: string): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;

    const baseUrl = this.getClientBaseUrl(tenant);

    // Revalidate by tag - affects all pages
    await this.revalidateTag(baseUrl, "site-config");

    this.logger.log(`Revalidated site config for tenant: ${tenant.slug}`);
  }

  /**
   * Revalidate by path
   */
  private async revalidatePath(
    baseUrl: string,
    path: string,
  ): Promise<boolean> {
    if (!this.revalidateSecret) {
      this.logger.warn(
        "REVALIDATE_SECRET not configured, skipping revalidation",
      );
      return false;
    }

    try {
      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": this.revalidateSecret,
        },
        body: JSON.stringify({ path }),
      });

      if (!response.ok) {
        this.logger.error(
          `Failed to revalidate path ${path}: ${response.status} ${response.statusText}`,
        );
        return false;
      }

      this.logger.debug(`Revalidated path: ${path}`);
      return true;
    } catch (error) {
      this.logger.error(`Error revalidating path ${path}:`, error);
      return false;
    }
  }

  /**
   * Revalidate by tag
   */
  private async revalidateTag(baseUrl: string, tag: string): Promise<boolean> {
    if (!this.revalidateSecret) {
      this.logger.warn(
        "REVALIDATE_SECRET not configured, skipping revalidation",
      );
      return false;
    }

    try {
      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": this.revalidateSecret,
        },
        body: JSON.stringify({ tag }),
      });

      if (!response.ok) {
        this.logger.error(
          `Failed to revalidate tag ${tag}: ${response.status} ${response.statusText}`,
        );
        return false;
      }

      this.logger.debug(`Revalidated tag: ${tag}`);
      return true;
    } catch (error) {
      this.logger.error(`Error revalidating tag ${tag}:`, error);
      return false;
    }
  }

  /**
   * Get tenant with domain info
   */
  private async getTenant(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        slug: true,
        domains: {
          where: { isPrimary: true },
          select: { domain: true },
        },
      },
    });
  }

  /**
   * Get client base URL for a tenant
   * Priority: custom domain > subdomain > default
   */
  private getClientBaseUrl(tenant: {
    slug: string;
    domains: { domain: string }[];
  }): string {
    // Check for custom domain first
    if (tenant.domains.length > 0 && tenant.domains[0].domain) {
      return `https://${tenant.domains[0].domain}`;
    }

    // Fall back to subdomain pattern or default
    const baseUrl = this.defaultClientUrl;

    // If the default URL contains a placeholder for tenant, replace it
    if (baseUrl.includes("{tenant}")) {
      return baseUrl.replace("{tenant}", tenant.slug);
    }

    // Otherwise return the default URL (for local development)
    return baseUrl;
  }
}
