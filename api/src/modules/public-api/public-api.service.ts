import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import { PublicPageDto, PublicPagesListDto } from "./dto/public-page.dto";
import { PublicPostDto, PublicPostsListDto } from "./dto/public-post.dto";
import { PublicSiteConfigDto } from "./dto/public-site-config.dto";

/**
 * Public API Service
 *
 * Enterprise practices:
 * - Tenant isolation (only serve data for requested tenant)
 * - Published content only (status = 'published')
 * - No sensitive data exposure
 * - Optimized queries with selective field loading
 * - Pagination for large datasets
 * - Cache-friendly responses
 */
@Injectable()
export class PublicApiService {
  private readonly logger = new Logger(PublicApiService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get tenant by slug
   * Used internally to validate tenant exists and is active
   */
  private async getTenantBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      select: { id: true, status: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant not found: ${slug}`);
    }

    if (tenant.status !== "active") {
      throw new NotFoundException(`Tenant is not active: ${slug}`);
    }

    return tenant;
  }

  /**
   * Get tenant design tokens
   * GET /api/v1/public/:tenantSlug/tokens
   */
  async getDesignTokens(tenantSlug: string): Promise<Record<string, unknown>> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: {
        designTokens: true,
        status: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Site not found: ${tenantSlug}`);
    }

    if (tenant.status !== "active") {
      throw new NotFoundException(`Site is not active: ${tenantSlug}`);
    }

    // Return empty object if no tokens are set
    return (tenant.designTokens as Record<string, unknown>) || {};
  }

  /**
   * Get site configuration
   * GET /api/v1/public/:tenantSlug/config
   */
  async getSiteConfig(tenantSlug: string): Promise<PublicSiteConfigDto> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: {
        slug: true,
        businessName: true,
        businessType: true,
        logoUrl: true,
        metaDescription: true,
        contactEmail: true,
        contactPhone: true,
        headerConfig: true,
        footerConfig: true,
        menusConfig: true,
        logosConfig: true,
        themeConfig: true,
        updatedAt: true,
        status: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Site not found: ${tenantSlug}`);
    }

    if (tenant.status !== "active") {
      throw new NotFoundException(`Site is not active: ${tenantSlug}`);
    }

    return {
      slug: tenant.slug,
      businessName: tenant.businessName,
      businessType: tenant.businessType || "",
      logoUrl: tenant.logoUrl ?? undefined,
      metaDescription: tenant.metaDescription ?? undefined,
      contactEmail: tenant.contactEmail ?? undefined,
      contactPhone: tenant.contactPhone ?? undefined,
      headerConfig: tenant.headerConfig ?? undefined,
      footerConfig: tenant.footerConfig ?? undefined,
      menusConfig: tenant.menusConfig ?? undefined,
      logosConfig: tenant.logosConfig ?? undefined,
      themeConfig: tenant.themeConfig ?? undefined,
      updatedAt: tenant.updatedAt.toISOString(),
    };
  }

  /**
   * List all published pages for a tenant
   * GET /api/v1/public/:tenantSlug/pages
   */
  async listPages(
    tenantSlug: string,
    page: number = 1,
    limit: number = 100,
  ): Promise<PublicPagesListDto> {
    const tenant = await this.getTenantBySlug(tenantSlug);

    const skip = (page - 1) * limit;

    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        where: {
          tenantId: tenant.id,
          status: "published",
        },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          metaTitle: true,
          metaDescription: true,
          template: true,
          publishedAt: true,
          updatedAt: true,
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.page.count({
        where: {
          tenantId: tenant.id,
          status: "published",
        },
      }),
    ]);

    return {
      pages: pages.map((page) => ({
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
        metaTitle: page.metaTitle ?? undefined,
        metaDescription: page.metaDescription ?? undefined,
        template: page.template ?? undefined,
        publishedAt: page.publishedAt?.toISOString() || "",
        updatedAt: page.updatedAt.toISOString(),
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single published page by slug
   * GET /api/v1/public/:tenantSlug/pages/:pageSlug
   */
  async getPageBySlug(
    tenantSlug: string,
    pageSlug: string,
  ): Promise<PublicPageDto> {
    const tenant = await this.getTenantBySlug(tenantSlug);

    const page = await this.prisma.page.findFirst({
      where: {
        tenantId: tenant.id,
        slug: pageSlug,
        status: "published",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        metaTitle: true,
        metaDescription: true,
        template: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    if (!page) {
      throw new NotFoundException(`Page not found: ${tenantSlug}/${pageSlug}`);
    }

    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle ?? undefined,
      metaDescription: page.metaDescription ?? undefined,
      template: page.template ?? undefined,
      publishedAt: page.publishedAt?.toISOString() || "",
      updatedAt: page.updatedAt.toISOString(),
    };
  }

  /**
   * List published posts for a tenant with filters
   * GET /api/v1/public/:tenantSlug/posts
   */
  async listPosts(
    tenantSlug: string,
    options: {
      page?: number;
      limit?: number;
      category?: string;
      tags?: string[];
    } = {},
  ): Promise<PublicPostsListDto> {
    const tenant = await this.getTenantBySlug(tenantSlug);

    const page = options.page || 1;
    const limit = Math.min(options.limit || 20, 100); // Max 100 per page
    const skip = (page - 1) * limit;

    // Build where clause with filters
    const where: Prisma.PostWhereInput = {
      tenantId: tenant.id,
      status: "published",
    };

    if (options.category) {
      where.category = options.category;
    }

    if (options.tags && options.tags.length > 0) {
      where.tags = {
        hasSome: options.tags,
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          content: true,
          category: true,
          tags: true,
          metaTitle: true,
          metaDescription: true,
          viewCount: true,
          publishedAt: true,
          updatedAt: true,
          featuredImage: {
            select: {
              url: true,
              altText: true,
            },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? undefined,
        content: post.content ?? undefined,
        featuredImageUrl: post.featuredImage?.url ?? undefined,
        category: post.category ?? undefined,
        tags: post.tags,
        metaTitle: post.metaTitle ?? undefined,
        metaDescription: post.metaDescription ?? undefined,
        viewCount: post.viewCount,
        publishedAt: post.publishedAt?.toISOString() || "",
        updatedAt: post.updatedAt.toISOString(),
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      category: options.category,
      tags: options.tags,
    };
  }

  /**
   * Get single published post by slug
   * GET /api/v1/public/:tenantSlug/posts/:postSlug
   * Also increments view count
   */
  async getPostBySlug(
    tenantSlug: string,
    postSlug: string,
  ): Promise<PublicPostDto> {
    const tenant = await this.getTenantBySlug(tenantSlug);

    const post = await this.prisma.post.findFirst({
      where: {
        tenantId: tenant.id,
        slug: postSlug,
        status: "published",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        tags: true,
        metaTitle: true,
        metaDescription: true,
        viewCount: true,
        publishedAt: true,
        updatedAt: true,
        featuredImage: {
          select: {
            url: true,
            altText: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post not found: ${tenantSlug}/${postSlug}`);
    }

    // Increment view count asynchronously (don't await)
    this.prisma.post
      .update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => {
        // Log error but don't fail the request
        this.logger.error("Failed to increment view count:", err);
      });

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? undefined,
      content: post.content ?? undefined,
      featuredImageUrl: post.featuredImage?.url ?? undefined,
      category: post.category ?? undefined,
      tags: post.tags,
      metaTitle: post.metaTitle ?? undefined,
      metaDescription: post.metaDescription ?? undefined,
      viewCount: post.viewCount,
      publishedAt: post.publishedAt?.toISOString() || "",
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
