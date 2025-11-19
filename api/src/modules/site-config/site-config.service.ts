import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/services/prisma.service'
import { SiteConfigDto, UpdateHeaderConfigDto, UpdateFooterConfigDto, UpdateMenusConfigDto, UpdateLogosConfigDto } from './dto/site-config.dto'

@Injectable()
export class SiteConfigService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all site configuration for a tenant
   */
  async getSiteConfig(tenantId: string): Promise<SiteConfigDto> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        headerConfig: true,
        footerConfig: true,
        menusConfig: true,
        logosConfig: true,
      },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`)
    }

    return {
      headerConfig: tenant.headerConfig as any,
      footerConfig: tenant.footerConfig as any,
      menusConfig: tenant.menusConfig as any,
      logosConfig: tenant.logosConfig as any,
    }
  }

  /**
   * Update entire site configuration
   */
  async updateSiteConfig(tenantId: string, data: SiteConfigDto): Promise<SiteConfigDto> {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        headerConfig: data.headerConfig as any,
        footerConfig: data.footerConfig as any,
        menusConfig: data.menusConfig as any,
        logosConfig: data.logosConfig as any,
      },
      select: {
        headerConfig: true,
        footerConfig: true,
        menusConfig: true,
        logosConfig: true,
      },
    })

    return {
      headerConfig: tenant.headerConfig as any,
      footerConfig: tenant.footerConfig as any,
      menusConfig: tenant.menusConfig as any,
      logosConfig: tenant.logosConfig as any,
    }
  }

  /**
   * Get header configuration
   */
  async getHeaderConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { headerConfig: true },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`)
    }

    return tenant.headerConfig
  }

  /**
   * Update header configuration
   */
  async updateHeaderConfig(tenantId: string, data: UpdateHeaderConfigDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { headerConfig: data as any },
      select: { headerConfig: true },
    })

    return tenant.headerConfig
  }

  /**
   * Get footer configuration
   */
  async getFooterConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { footerConfig: true },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`)
    }

    return tenant.footerConfig
  }

  /**
   * Update footer configuration
   */
  async updateFooterConfig(tenantId: string, data: UpdateFooterConfigDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { footerConfig: data as any },
      select: { footerConfig: true },
    })

    return tenant.footerConfig
  }

  /**
   * Get menus configuration
   */
  async getMenusConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { menusConfig: true },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`)
    }

    return tenant.menusConfig
  }

  /**
   * Update menus configuration
   */
  async updateMenusConfig(tenantId: string, data: UpdateMenusConfigDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { menusConfig: data as any },
      select: { menusConfig: true },
    })

    return tenant.menusConfig
  }

  /**
   * Get logos configuration
   */
  async getLogosConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { logosConfig: true },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`)
    }

    return tenant.logosConfig
  }

  /**
   * Update logos configuration
   */
  async updateLogosConfig(tenantId: string, data: UpdateLogosConfigDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { logosConfig: data as any },
      select: { logosConfig: true },
    })

    return tenant.logosConfig
  }
}
