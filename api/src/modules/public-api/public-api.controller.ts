import {
  Controller,
  Get,
  Param,
  Query,
  Header,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { PublicApiService } from "./public-api.service";
import { PublicPageDto, PublicPagesListDto } from "./dto/public-page.dto";
import { PublicPostDto, PublicPostsListDto } from "./dto/public-post.dto";
import { PublicSiteConfigDto } from "./dto/public-site-config.dto";

/**
 * Public API Controller
 *
 * Enterprise practices:
 * - Unauthenticated endpoints for client frontends
 * - Rate limiting to prevent abuse (100 req/min per IP)
 * - HTTP caching headers for CDN/browser caching
 * - OpenAPI/Swagger documentation
 * - Standardized error responses
 * - Tenant isolation via slug parameter
 */
@ApiTags("Public API")
@Controller("public")
@Public() // No authentication required
@Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  /**
   * Resolve tenant from domain
   * GET /api/v1/public/resolve?domain=example.com
   *
   * Used by client middleware to determine which tenant to serve
   * Falls back to primary tenant if domain not found
   * Cache: 5 minutes
   */
  @Get("resolve")
  @Header("Cache-Control", "public, max-age=300") // 5 minutes
  @ApiOperation({
    summary: "Resolve tenant from domain",
    description:
      "Returns tenant slug for a given domain, or the primary tenant if not found",
  })
  @ApiQuery({
    name: "domain",
    required: false,
    type: String,
    example: "example.com",
  })
  @ApiResponse({
    status: 200,
    description: "Tenant resolved successfully",
  })
  async resolveTenant(
    @Query("domain") domain?: string,
  ): Promise<{ slug: string; isPrimary: boolean }> {
    return this.publicApiService.resolveTenant(domain);
  }

  /**
   * Get the primary/marketing site tenant slug
   * GET /api/v1/public/primary
   *
   * Cache: 5 minutes
   */
  @Get("primary")
  @Header("Cache-Control", "public, max-age=300") // 5 minutes
  @ApiOperation({
    summary: "Get primary tenant",
    description: "Returns the primary/marketing site tenant slug",
  })
  @ApiResponse({
    status: 200,
    description: "Primary tenant retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Primary tenant not configured" })
  async getPrimaryTenant(): Promise<{ slug: string }> {
    return this.publicApiService.getPrimaryTenantSlug();
  }

  /**
   * Get tenant design tokens
   * GET /api/v1/public/:tenantSlug/tokens
   *
   * Returns: Design token overrides for the tenant
   * Cache: 5 minutes (tokens change infrequently)
   */
  @Get(":tenantSlug/tokens")
  @Header("Cache-Control", "public, max-age=300") // 5 minutes
  @ApiOperation({
    summary: "Get tenant design tokens",
    description:
      "Returns design token overrides for the tenant (header, menu, footer, section tokens)",
  })
  @ApiParam({
    name: "tenantSlug",
    description: "Tenant slug identifier",
    example: "acme-consulting",
  })
  @ApiResponse({
    status: 200,
    description: "Design tokens retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Tenant not found" })
  async getDesignTokens(
    @Param("tenantSlug") tenantSlug: string,
  ): Promise<Record<string, unknown>> {
    return this.publicApiService.getDesignTokens(tenantSlug);
  }

  /**
   * Get site configuration
   * GET /api/v1/public/:tenantSlug/config
   *
   * Returns: Branding, navigation, contact info
   * Cache: 5 minutes (config changes infrequently)
   */
  @Get(":tenantSlug/config")
  @Header("Cache-Control", "public, max-age=300") // 5 minutes
  @ApiOperation({
    summary: "Get site configuration",
    description:
      "Returns public site configuration including branding, navigation, and contact information",
  })
  @ApiParam({
    name: "tenantSlug",
    description: "Tenant slug identifier",
    example: "acme-consulting",
  })
  @ApiResponse({
    status: 200,
    description: "Site configuration retrieved successfully",
    type: PublicSiteConfigDto,
  })
  @ApiResponse({ status: 404, description: "Tenant not found" })
  async getSiteConfig(
    @Param("tenantSlug") tenantSlug: string,
  ): Promise<PublicSiteConfigDto> {
    return this.publicApiService.getSiteConfig(tenantSlug);
  }

  /**
   * List published pages
   * GET /api/v1/public/:tenantSlug/pages
   *
   * Cache: 2 minutes (pages updated less frequently than posts)
   */
  @Get(":tenantSlug/pages")
  @Header("Cache-Control", "public, max-age=120") // 2 minutes
  @ApiOperation({
    summary: "List published pages",
    description: "Returns paginated list of all published pages for a tenant",
  })
  @ApiParam({
    name: "tenantSlug",
    example: "acme-consulting",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: "Pages retrieved successfully",
    type: PublicPagesListDto,
  })
  async listPages(
    @Param("tenantSlug") tenantSlug: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ): Promise<PublicPagesListDto> {
    return this.publicApiService.listPages(tenantSlug, page, limit);
  }

  /**
   * Get single page by slug
   * GET /api/v1/public/:tenantSlug/pages/:pageSlug
   *
   * Cache: 2 minutes
   */
  @Get(":tenantSlug/pages/:pageSlug")
  @Header("Cache-Control", "public, max-age=120") // 2 minutes
  @ApiOperation({
    summary: "Get page by slug",
    description: "Returns a single published page",
  })
  @ApiParam({
    name: "tenantSlug",
    example: "acme-consulting",
  })
  @ApiParam({
    name: "pageSlug",
    example: "about-us",
  })
  @ApiResponse({
    status: 200,
    description: "Page retrieved successfully",
    type: PublicPageDto,
  })
  @ApiResponse({ status: 404, description: "Page not found" })
  async getPageBySlug(
    @Param("tenantSlug") tenantSlug: string,
    @Param("pageSlug") pageSlug: string,
  ): Promise<PublicPageDto> {
    return this.publicApiService.getPageBySlug(tenantSlug, pageSlug);
  }

  /**
   * List published posts
   * GET /api/v1/public/:tenantSlug/posts
   *
   * Supports filtering by category and tags
   * Cache: 1 minute (posts updated more frequently)
   */
  @Get(":tenantSlug/posts")
  @Header("Cache-Control", "public, max-age=60") // 1 minute
  @ApiOperation({
    summary: "List published posts",
    description:
      "Returns paginated list of published posts with optional filtering",
  })
  @ApiParam({
    name: "tenantSlug",
    example: "acme-consulting",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    example: 20,
  })
  @ApiQuery({
    name: "category",
    required: false,
    type: String,
    example: "announcements",
  })
  @ApiQuery({
    name: "tags",
    required: false,
    type: [String],
    example: ["product", "news"],
  })
  @ApiResponse({
    status: 200,
    description: "Posts retrieved successfully",
    type: PublicPostsListDto,
  })
  async listPosts(
    @Param("tenantSlug") tenantSlug: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query("category") category?: string,
    @Query("tags") tags?: string | string[],
  ): Promise<PublicPostsListDto> {
    // Handle tags as array
    const tagsArray = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;

    return this.publicApiService.listPosts(tenantSlug, {
      page,
      limit,
      category,
      tags: tagsArray,
    });
  }

  /**
   * Get single post by slug
   * GET /api/v1/public/:tenantSlug/posts/:postSlug
   *
   * Also increments view count
   * Cache: 1 minute
   */
  @Get(":tenantSlug/posts/:postSlug")
  @Header("Cache-Control", "public, max-age=60") // 1 minute
  @ApiOperation({
    summary: "Get post by slug",
    description: "Returns a single published post and increments view count",
  })
  @ApiParam({
    name: "tenantSlug",
    example: "acme-consulting",
  })
  @ApiParam({
    name: "postSlug",
    example: "product-launch-2024",
  })
  @ApiResponse({
    status: 200,
    description: "Post retrieved successfully",
    type: PublicPostDto,
  })
  @ApiResponse({ status: 404, description: "Post not found" })
  async getPostBySlug(
    @Param("tenantSlug") tenantSlug: string,
    @Param("postSlug") postSlug: string,
  ): Promise<PublicPostDto> {
    return this.publicApiService.getPostBySlug(tenantSlug, postSlug);
  }
}
