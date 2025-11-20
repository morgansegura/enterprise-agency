import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import {
  UpdateFeaturesDto,
  ToggleFeatureDto,
} from "../dto/feature-management.dto";
import { AuditLogService, AuditAction } from "./audit-log.service";

@Injectable()
export class AdminFeaturesService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async getTenantFeatures(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { enabledFeatures: true },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    return tenant.enabledFeatures as Record<string, boolean>;
  }

  async updateFeatures(
    tenantId: string,
    data: UpdateFeaturesDto,
    updatedBy: string,
  ) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { enabledFeatures: data.enabledFeatures },
    });

    await this.auditLog.log({
      action: AuditAction.FEATURE_ENABLED,
      performedBy: updatedBy,
      targetType: "tenant",
      targetId: tenantId,
      metadata: { features: data.enabledFeatures },
    });

    return tenant.enabledFeatures;
  }

  async toggleFeature(
    tenantId: string,
    data: ToggleFeatureDto,
    updatedBy: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    const currentFeatures =
      (tenant.enabledFeatures as Record<string, boolean>) || {};
    const updatedFeatures = {
      ...currentFeatures,
      [data.featureKey]: data.enabled,
    };

    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { enabledFeatures: updatedFeatures },
    });

    await this.auditLog.log({
      action: data.enabled
        ? AuditAction.FEATURE_ENABLED
        : AuditAction.FEATURE_DISABLED,
      performedBy: updatedBy,
      targetType: "feature",
      targetId: data.featureKey,
      metadata: { tenantId, enabled: data.enabled },
    });

    return updated.enabledFeatures;
  }

  async getAvailableFeatures() {
    // Define all available features in the system
    return {
      "pages.view": { name: "View Pages", description: "View existing pages" },
      "pages.edit": { name: "Edit Pages", description: "Edit page content" },
      "pages.create": { name: "Create Pages", description: "Create new pages" },
      "pages.delete": { name: "Delete Pages", description: "Delete pages" },
      "builder.access": {
        name: "Builder Access",
        description: "Access visual builder",
      },
      "builder.blocks": {
        name: "Custom Blocks",
        description: "Use custom blocks",
      },
      "builder.layout": {
        name: "Layout Control",
        description: "Control page layouts",
      },
      "config.header": {
        name: "Header Config",
        description: "Configure site header",
      },
      "config.footer": {
        name: "Footer Config",
        description: "Configure site footer",
      },
      "config.menus": {
        name: "Menu Config",
        description: "Configure navigation menus",
      },
      "config.logos": {
        name: "Logo Config",
        description: "Configure site logos",
      },
      "assets.upload": {
        name: "Upload Assets",
        description: "Upload media files",
      },
      "assets.delete": {
        name: "Delete Assets",
        description: "Delete media files",
      },
      "users.invite": { name: "Invite Users", description: "Invite new users" },
      "users.manage": {
        name: "Manage Users",
        description: "Manage user accounts",
      },
      "posts.create": {
        name: "Create Posts",
        description: "Create blog posts",
      },
      "posts.edit": { name: "Edit Posts", description: "Edit blog posts" },
      "posts.delete": {
        name: "Delete Posts",
        description: "Delete blog posts",
      },
    };
  }
}
