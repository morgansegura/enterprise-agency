import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";
import { SiteConfigService } from "./site-config.service";
import {
  SiteConfigDto,
  UpdateHeaderConfigDto,
  UpdateFooterConfigDto,
  UpdateMenusConfigDto,
  UpdateLogosConfigDto,
} from "./dto/site-config.dto";
import { UpdateDesignTokensDto } from "./dto/design-tokens.dto";
import { UpdateThemeConfigDto } from "./dto/theme-config.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";

@Controller("tenants/:tenantId/config")
@UseGuards(JwtAuthGuard, TenantAccessGuard, PermissionGuard)
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  /**
   * GET /api/tenants/:tenantId/config
   * Get all site configuration
   */
  @Get()
  @Permissions(Permission.SETTINGS_VIEW)
  async getSiteConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getSiteConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config
   * Update entire site configuration
   */
  @Put()
  @Permissions(Permission.SETTINGS_EDIT)
  async updateSiteConfig(
    @Param("tenantId") tenantId: string,
    @Body() data: SiteConfigDto,
  ) {
    return this.siteConfigService.updateSiteConfig(tenantId, data);
  }

  /**
   * GET /api/tenants/:tenantId/config/header
   * Get header configuration
   */
  @Get("header")
  @Permissions(Permission.SETTINGS_VIEW)
  async getHeaderConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getHeaderConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/header
   * Update header configuration
   */
  @Put("header")
  @Permissions(Permission.SETTINGS_EDIT)
  async updateHeaderConfig(
    @Param("tenantId") tenantId: string,
    @Body() data: UpdateHeaderConfigDto,
  ) {
    return this.siteConfigService.updateHeaderConfig(tenantId, data);
  }

  /**
   * GET /api/tenants/:tenantId/config/footer
   * Get footer configuration
   */
  @Get("footer")
  @Permissions(Permission.SETTINGS_VIEW)
  async getFooterConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getFooterConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/footer
   * Update footer configuration
   */
  @Put("footer")
  @Permissions(Permission.SETTINGS_EDIT)
  async updateFooterConfig(
    @Param("tenantId") tenantId: string,
    @Body() data: UpdateFooterConfigDto,
  ) {
    return this.siteConfigService.updateFooterConfig(tenantId, data);
  }

  /**
   * GET /api/tenants/:tenantId/config/menus
   * Get menus configuration
   */
  @Get("menus")
  @Permissions(Permission.SETTINGS_VIEW)
  async getMenusConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getMenusConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/menus
   * Update menus configuration
   */
  @Put("menus")
  @Permissions(Permission.SETTINGS_EDIT)
  async updateMenusConfig(
    @Param("tenantId") tenantId: string,
    @Body() data: UpdateMenusConfigDto,
  ) {
    return this.siteConfigService.updateMenusConfig(tenantId, data);
  }

  /**
   * GET /api/tenants/:tenantId/config/logos
   * Get logos configuration
   */
  @Get("logos")
  @Permissions(Permission.SETTINGS_VIEW)
  async getLogosConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getLogosConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/logos
   * Update logos configuration
   */
  @Put("logos")
  @Permissions(Permission.SETTINGS_EDIT)
  async updateLogosConfig(
    @Param("tenantId") tenantId: string,
    @Body() data: UpdateLogosConfigDto,
  ) {
    return this.siteConfigService.updateLogosConfig(tenantId, data);
  }

  /**
   * GET /api/tenants/:tenantId/config/design-tokens
   * Get design tokens
   */
  @Get("design-tokens")
  @Permissions(Permission.SETTINGS_VIEW)
  async getDesignTokens(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getDesignTokens(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/design-tokens
   * Update design tokens
   */
  @Put("design-tokens")
  @Permissions(Permission.SETTINGS_EDIT)
  async updateDesignTokens(
    @Param("tenantId") tenantId: string,
    @Body() data: UpdateDesignTokensDto,
  ) {
    return this.siteConfigService.updateDesignTokens(tenantId, data);
  }

  /**
   * GET /api/tenants/:tenantId/config/theme
   * Get theme configuration
   */
  @Get("theme")
  @Permissions(Permission.SETTINGS_VIEW)
  async getThemeConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getThemeConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/theme
   * Update theme configuration
   */
  @Put("theme")
  @Permissions(Permission.SETTINGS_EDIT)
  async updateThemeConfig(
    @Param("tenantId") tenantId: string,
    @Body() data: UpdateThemeConfigDto,
  ) {
    return this.siteConfigService.updateThemeConfig(tenantId, data);
  }
}
