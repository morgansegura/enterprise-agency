import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/services/prisma.service";
import {
  SiteConfigDto,
  UpdateHeaderConfigDto,
  UpdateFooterConfigDto,
  UpdateMenusConfigDto,
  UpdateLogosConfigDto,
} from "./dto/site-config.dto";
import { HeaderConfigDto } from "./dto/header-config.dto";
import { FooterConfigDto } from "./dto/footer-config.dto";
import { MenusConfigDto } from "./dto/menus-config.dto";
import { LogosConfigDto } from "./dto/logos-config.dto";

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
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    return {
      headerConfig: tenant.headerConfig as unknown as HeaderConfigDto,
      footerConfig: tenant.footerConfig as unknown as FooterConfigDto,
      menusConfig: tenant.menusConfig as unknown as MenusConfigDto,
      logosConfig: tenant.logosConfig as unknown as LogosConfigDto,
    };
  }

  /**
   * Update entire site configuration
   */
  async updateSiteConfig(
    tenantId: string,
    data: SiteConfigDto,
  ): Promise<SiteConfigDto> {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        headerConfig: data.headerConfig as unknown as Prisma.InputJsonValue,
        footerConfig: data.footerConfig as unknown as Prisma.InputJsonValue,
        menusConfig: data.menusConfig as unknown as Prisma.InputJsonValue,
        logosConfig: data.logosConfig as unknown as Prisma.InputJsonValue,
      },
      select: {
        headerConfig: true,
        footerConfig: true,
        menusConfig: true,
        logosConfig: true,
      },
    });

    return {
      headerConfig: tenant.headerConfig as unknown as HeaderConfigDto,
      footerConfig: tenant.footerConfig as unknown as FooterConfigDto,
      menusConfig: tenant.menusConfig as unknown as MenusConfigDto,
      logosConfig: tenant.logosConfig as unknown as LogosConfigDto,
    };
  }

  /**
   * Get header configuration
   */
  async getHeaderConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { headerConfig: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    return tenant.headerConfig;
  }

  /**
   * Update header configuration
   */
  async updateHeaderConfig(tenantId: string, data: UpdateHeaderConfigDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { headerConfig: data as unknown as Prisma.InputJsonValue },
      select: { headerConfig: true },
    });

    return tenant.headerConfig as unknown as HeaderConfigDto;
  }

  /**
   * Get footer configuration
   */
  async getFooterConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { footerConfig: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    return tenant.footerConfig;
  }

  /**
   * Update footer configuration
   */
  async updateFooterConfig(tenantId: string, data: UpdateFooterConfigDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { footerConfig: data as unknown as Prisma.InputJsonValue },
      select: { footerConfig: true },
    });

    return tenant.footerConfig as unknown as FooterConfigDto;
  }

  /**
   * Get menus configuration
   */
  async getMenusConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { menusConfig: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    return tenant.menusConfig;
  }

  /**
   * Update menus configuration
   */
  async updateMenusConfig(tenantId: string, data: UpdateMenusConfigDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { menusConfig: data as unknown as Prisma.InputJsonValue },
      select: { menusConfig: true },
    });

    return tenant.menusConfig as unknown as MenusConfigDto;
  }

  /**
   * Get logos configuration
   */
  async getLogosConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { logosConfig: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    return tenant.logosConfig;
  }

  /**
   * Update logos configuration
   */
  async updateLogosConfig(tenantId: string, data: UpdateLogosConfigDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { logosConfig: data as unknown as Prisma.InputJsonValue },
      select: { logosConfig: true },
    });

    return tenant.logosConfig as unknown as LogosConfigDto;
  }
}
