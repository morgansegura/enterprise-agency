import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";
import { SiteConfigService } from "./site-config.service";
import {
  SiteConfigDto,
  UpdateHeaderConfigDto,
  UpdateFooterConfigDto,
  UpdateMenusConfigDto,
  UpdateLogosConfigDto,
} from "./dto/site-config.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("tenants/:tenantId/config")
@UseGuards(JwtAuthGuard)
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  /**
   * GET /api/tenants/:tenantId/config
   * Get all site configuration
   */
  @Get()
  async getSiteConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getSiteConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config
   * Update entire site configuration
   */
  @Put()
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
  async getHeaderConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getHeaderConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/header
   * Update header configuration
   */
  @Put("header")
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
  async getFooterConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getFooterConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/footer
   * Update footer configuration
   */
  @Put("footer")
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
  async getMenusConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getMenusConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/menus
   * Update menus configuration
   */
  @Put("menus")
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
  async getLogosConfig(@Param("tenantId") tenantId: string) {
    return this.siteConfigService.getLogosConfig(tenantId);
  }

  /**
   * PUT /api/tenants/:tenantId/config/logos
   * Update logos configuration
   */
  @Put("logos")
  async updateLogosConfig(
    @Param("tenantId") tenantId: string,
    @Body() data: UpdateLogosConfigDto,
  ) {
    return this.siteConfigService.updateLogosConfig(tenantId, data);
  }
}
