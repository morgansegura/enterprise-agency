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
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import { TenantTier } from "@prisma";
import { PagesService } from "./pages.service";
import { PageVersionService } from "./services/page-version.service";
import { CreatePageDto } from "./dto/create-page.dto";
import { UpdatePageDto } from "./dto/update-page.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { TierGuard } from "@/common/guards/tier.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
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
@UseGuards(JwtAuthGuard, TenantAccessGuard, TierGuard, PermissionGuard)
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly pageVersionService: PageVersionService,
  ) {}

  /**
   * Create a new page
   * Requires BUILDER tier - Content Editors cannot create new pages
   */
  @Post()
  @Permissions(Permission.PAGES_CREATE)
  @RequireTier("BUILDER")
  create(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string },
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.create(tenantId, user.id, createPageDto);
  }

  /**
   * List all pages for a tenant
   * Available to both tiers
   */
  @Get()
  @Permissions(Permission.PAGES_VIEW)
  findAll(
    @TenantId() tenantId: string,
    @Query("status") status?: string,
    @Query("template") template?: string,
    @Query("search") search?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.pagesService.findAll(tenantId, {
      status,
      template,
      search,
      page,
      limit,
    });
  }

  /**
   * Get a single page by ID
   * Available to both tiers
   */
  @Get(":id")
  @Permissions(Permission.PAGES_VIEW)
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.findOne(tenantId, id);
  }

  /**
   * Get a single page by slug
   * Available to both tiers
   */
  @Get("slug/:slug")
  @Permissions(Permission.PAGES_VIEW)
  findBySlug(@TenantId() tenantId: string, @Param("slug") slug: string) {
    return this.pagesService.findBySlug(tenantId, slug);
  }

  /**
   * Update a page
   * Available to both tiers, but Content Editors can only modify content (not structure)
   * The service layer validates structural changes based on tier
   */
  @Patch(":id")
  @Permissions(Permission.PAGES_EDIT)
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updatePageDto: UpdatePageDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant?: TenantInfo,
  ) {
    return this.pagesService.update(
      tenantId,
      id,
      updatePageDto,
      tenant?.tier,
      user.id,
    );
  }

  /**
   * Delete a page
   * Requires BUILDER tier - Content Editors cannot delete pages
   */
  @Delete(":id")
  @Permissions(Permission.PAGES_DELETE)
  @RequireTier("BUILDER")
  remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.remove(tenantId, id);
  }

  /**
   * Publish a page
   * Available to both tiers - publishing doesn't change structure
   */
  @Post(":id/publish")
  @Permissions(Permission.PAGES_PUBLISH)
  publish(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.pagesService.publish(tenantId, id, user.id);
  }

  /**
   * Unpublish a page
   * Available to both tiers - unpublishing doesn't change structure
   */
  @Post(":id/unpublish")
  @Permissions(Permission.PAGES_PUBLISH)
  unpublish(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.unpublish(tenantId, id);
  }

  /**
   * Duplicate a page
   * Requires BUILDER tier - Content Editors cannot create new pages
   */
  @Post(":id/duplicate")
  @Permissions(Permission.PAGES_CREATE)
  @RequireTier("BUILDER")
  duplicate(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string },
    @Param("id") id: string,
  ) {
    return this.pagesService.duplicate(tenantId, user.id, id);
  }

  // ===========================================================================
  // Version History
  // ===========================================================================

  /**
   * List all versions of a page
   */
  @Get(":id/versions")
  @Permissions(Permission.PAGES_VIEW)
  listVersions(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pageVersionService.listVersions(tenantId, id);
  }

  /**
   * Get a specific version
   */
  @Get(":id/versions/:versionId")
  @Permissions(Permission.PAGES_VIEW)
  getVersion(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Param("versionId") versionId: string,
  ) {
    return this.pageVersionService.getVersion(tenantId, id, versionId);
  }

  /**
   * Restore a page to a previous version
   */
  @Post(":id/versions/:versionId/restore")
  @Permissions(Permission.PAGES_EDIT)
  restoreVersion(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string },
    @Param("id") id: string,
    @Param("versionId") versionId: string,
  ) {
    return this.pageVersionService.restoreVersion(
      tenantId,
      id,
      versionId,
      user.id,
    );
  }

  /**
   * Compare two versions
   */
  @Get(":id/versions/compare")
  @Permissions(Permission.PAGES_VIEW)
  compareVersions(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Query("versionA") versionIdA: string,
    @Query("versionB") versionIdB: string,
  ) {
    return this.pageVersionService.compareVersions(
      tenantId,
      id,
      versionIdA,
      versionIdB,
    );
  }
}
