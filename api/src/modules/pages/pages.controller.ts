import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { TenantTier } from "@prisma";
import { PagesService } from "./pages.service";
import { CreatePageDto } from "./dto/create-page.dto";
import { UpdatePageDto } from "./dto/update-page.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantGuard } from "@/common/guards/tenant.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { TierGuard } from "@/common/guards/tier.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { RequireTier } from "@/common/decorators/tier.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { CurrentTenant } from "@/common/decorators/current-tenant.decorator";

/**
 * Tenant information populated by TierGuard
 */
interface TenantInfo {
  id: string;
  tier: TenantTier;
  businessName: string;
}

/**
 * Pages Controller
 *
 * Manages page CRUD operations with role-based and tier-based access control.
 *
 * Tier restrictions:
 * - CONTENT_EDITOR: Can view and update pages (content only, no structural changes)
 * - BUILDER: Full access including create, delete, duplicate, and structural changes
 */
@Controller("pages")
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard, TierGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  /**
   * Create a new page
   * Requires BUILDER tier - Content Editors cannot create new pages
   */
  @Post()
  @Roles("owner", "admin", "editor")
  @RequireTier("BUILDER")
  create(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string; sessionId: string },
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.create(tenantId, user.id, createPageDto);
  }

  /**
   * List all pages for a tenant
   * Available to both tiers
   */
  @Get()
  @Roles("owner", "admin", "editor", "viewer")
  findAll(
    @TenantId() tenantId: string,
    @Query("status") status?: string,
    @Query("template") template?: string,
    @Query("search") search?: string,
  ) {
    return this.pagesService.findAll(tenantId, { status, template, search });
  }

  /**
   * Get a single page by ID
   * Available to both tiers
   */
  @Get(":id")
  @Roles("owner", "admin", "editor", "viewer")
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.findOne(tenantId, id);
  }

  /**
   * Get a single page by slug
   * Available to both tiers
   */
  @Get("slug/:slug")
  @Roles("owner", "admin", "editor", "viewer")
  findBySlug(@TenantId() tenantId: string, @Param("slug") slug: string) {
    return this.pagesService.findBySlug(tenantId, slug);
  }

  /**
   * Update a page
   * Available to both tiers, but Content Editors can only modify content (not structure)
   * The service layer validates structural changes based on tier
   */
  @Patch(":id")
  @Roles("owner", "admin", "editor")
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updatePageDto: UpdatePageDto,
    @CurrentTenant() tenant?: TenantInfo,
  ) {
    return this.pagesService.update(tenantId, id, updatePageDto, tenant?.tier);
  }

  /**
   * Delete a page
   * Requires BUILDER tier - Content Editors cannot delete pages
   */
  @Delete(":id")
  @Roles("owner", "admin")
  @RequireTier("BUILDER")
  remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.remove(tenantId, id);
  }

  /**
   * Publish a page
   * Available to both tiers - publishing doesn't change structure
   */
  @Post(":id/publish")
  @Roles("owner", "admin", "editor")
  publish(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.publish(tenantId, id);
  }

  /**
   * Unpublish a page
   * Available to both tiers - unpublishing doesn't change structure
   */
  @Post(":id/unpublish")
  @Roles("owner", "admin", "editor")
  unpublish(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.unpublish(tenantId, id);
  }

  /**
   * Duplicate a page
   * Requires BUILDER tier - Content Editors cannot create new pages
   */
  @Post(":id/duplicate")
  @Roles("owner", "admin", "editor")
  @RequireTier("BUILDER")
  duplicate(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string; sessionId: string },
    @Param("id") id: string,
  ) {
    return this.pagesService.duplicate(tenantId, user.id, id);
  }
}
