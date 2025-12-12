import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Prisma } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { CreateDomainDto } from "./dto/create-domain.dto";
import { UpdateDesignTokensDto } from "./dto/update-design-tokens.dto";

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const tenants = await this.prisma.tenant.findMany({
      include: {
        domains: true,
        tenantUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            pages: true,
            posts: true,
            assets: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return tenants;
  }

  async create(createData: CreateTenantDto, creatorUserId: string) {
    // Check if slug is already taken
    const existing = await this.prisma.tenant.findUnique({
      where: { slug: createData.slug },
    });

    if (existing) {
      throw new ConflictException("Tenant slug already exists");
    }

    // Create tenant with creator as owner
    const tenant = await this.prisma.tenant.create({
      data: {
        slug: createData.slug,
        businessName: createData.businessName,
        businessType: createData.businessType,
        contactEmail: createData.contactEmail,
        contactPhone: createData.contactPhone,
        enabledFeatures: (createData.enabledFeatures ||
          {}) as Prisma.InputJsonValue,
        themeConfig: (createData.themeConfig || {}) as Prisma.InputJsonValue,
        planLimits: (createData.planLimits || {}) as Prisma.InputJsonValue,
        tenantUsers: {
          create: {
            userId: creatorUserId,
            role: "owner",
            permissions: {
              pages: { view: true, create: true, edit: true, delete: true },
              posts: { view: true, create: true, edit: true, delete: true },
              assets: { view: true, create: true, edit: true, delete: true },
              settings: { view: true, edit: true },
            },
          },
        },
      },
      include: {
        tenantUsers: true,
        domains: true,
      },
    });

    return tenant;
  }

  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        domains: true,
        tenantUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    return tenant;
  }

  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        domains: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    return tenant;
  }

  async update(id: string, updateData: UpdateTenantDto) {
    const updateFields: Record<string, unknown> = {};

    if (updateData.businessName !== undefined)
      updateFields.businessName = updateData.businessName;
    if (updateData.businessType !== undefined)
      updateFields.businessType = updateData.businessType;
    if (updateData.contactEmail !== undefined)
      updateFields.contactEmail = updateData.contactEmail;
    if (updateData.contactPhone !== undefined)
      updateFields.contactPhone = updateData.contactPhone;
    if (updateData.logoUrl !== undefined)
      updateFields.logoUrl = updateData.logoUrl;
    if (updateData.metaDescription !== undefined)
      updateFields.metaDescription = updateData.metaDescription;
    if (updateData.enabledFeatures !== undefined)
      updateFields.enabledFeatures =
        updateData.enabledFeatures as Prisma.InputJsonValue;
    if (updateData.themeConfig !== undefined)
      updateFields.themeConfig =
        updateData.themeConfig as Prisma.InputJsonValue;
    if (updateData.planLimits !== undefined)
      updateFields.planLimits = updateData.planLimits as Prisma.InputJsonValue;

    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: updateFields,
      include: {
        domains: true,
      },
    });

    return tenant;
  }

  async addDomain(tenantId: string, domainData: CreateDomainDto) {
    // Check if domain already exists
    const existing = await this.prisma.tenantDomain.findUnique({
      where: { domain: domainData.domain },
    });

    if (existing) {
      throw new ConflictException("Domain already exists");
    }

    const domain = await this.prisma.tenantDomain.create({
      data: {
        ...domainData,
        tenantId,
      },
    });

    return domain;
  }

  async removeDomain(tenantId: string, domainId: string) {
    const domain = await this.prisma.tenantDomain.findFirst({
      where: {
        id: domainId,
        tenantId,
      },
    });

    if (!domain) {
      throw new NotFoundException("Domain not found");
    }

    await this.prisma.tenantDomain.delete({
      where: { id: domainId },
    });

    return { success: true };
  }

  async addUser(tenantId: string, userId: string, role: string) {
    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if user already has access
    const existing = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException("User already has access to this tenant");
    }

    // Add user to tenant
    const tenantUser = await this.prisma.tenantUser.create({
      data: {
        tenantId,
        userId,
        role,
        permissions: {
          pages: {
            view: true,
            create: role === "owner" || role === "admin",
            edit: role === "owner" || role === "admin",
            delete: role === "owner",
          },
          posts: {
            view: true,
            create: role === "owner" || role === "admin",
            edit: role === "owner" || role === "admin",
            delete: role === "owner",
          },
          assets: {
            view: true,
            create: role === "owner" || role === "admin",
            edit: role === "owner" || role === "admin",
            delete: role === "owner",
          },
          settings: {
            view: true,
            edit: role === "owner" || role === "admin",
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return tenantUser;
  }

  /**
   * Get all users for a tenant
   */
  async getUsers(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    const tenantUsers = await this.prisma.tenantUser.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            status: true,
          },
        },
        inviter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return tenantUsers;
  }

  /**
   * Update user role/permissions in tenant
   */
  async updateUser(
    tenantId: string,
    userId: string,
    data: { role?: string; permissions?: Record<string, unknown> },
  ) {
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    if (!tenantUser) {
      throw new NotFoundException("User not found in this tenant");
    }

    // Don't allow changing the owner's role
    if (tenantUser.role === "owner" && data.role && data.role !== "owner") {
      throw new ConflictException("Cannot change the owner's role");
    }

    const updateData: Record<string, unknown> = {};

    if (data.role) {
      updateData.role = data.role;
      // Auto-update permissions based on role if not explicitly provided
      if (!data.permissions) {
        updateData.permissions = {
          pages: {
            view: true,
            create: data.role === "owner" || data.role === "admin",
            edit: data.role === "owner" || data.role === "admin",
            delete: data.role === "owner",
          },
          posts: {
            view: true,
            create: data.role === "owner" || data.role === "admin",
            edit: data.role === "owner" || data.role === "admin",
            delete: data.role === "owner",
          },
          assets: {
            view: true,
            create: data.role === "owner" || data.role === "admin",
            edit: data.role === "owner" || data.role === "admin",
            delete: data.role === "owner",
          },
          settings: {
            view: true,
            edit: data.role === "owner" || data.role === "admin",
          },
        };
      }
    }

    if (data.permissions) {
      updateData.permissions = data.permissions as Prisma.InputJsonValue;
    }

    const updated = await this.prisma.tenantUser.update({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Remove user from tenant
   */
  async removeUser(tenantId: string, userId: string) {
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    if (!tenantUser) {
      throw new NotFoundException("User not found in this tenant");
    }

    // Don't allow removing the owner
    if (tenantUser.role === "owner") {
      throw new ConflictException("Cannot remove the owner from the tenant");
    }

    await this.prisma.tenantUser.delete({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    return { success: true };
  }

  /**
   * Get tenant design tokens
   */
  async getDesignTokens(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        slug: true,
        designTokens: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    // Return empty object if no tokens are set
    return tenant.designTokens || {};
  }

  /**
   * Update tenant design tokens
   */
  async updateDesignTokens(
    tenantId: string,
    tokensData: UpdateDesignTokensDto,
  ) {
    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    // Update design tokens
    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        designTokens: tokensData as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        slug: true,
        designTokens: true,
      },
    });

    return updated.designTokens || {};
  }

  /**
   * Get tenant statistics/analytics
   */
  async getStats(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        createdAt: true,
        _count: {
          select: {
            pages: true,
            posts: true,
            assets: true,
            tenantUsers: true,
            products: true,
            orders: true,
            customers: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    // Get published vs draft counts
    const [publishedPages, draftPages, publishedPosts, draftPosts] =
      await Promise.all([
        this.prisma.page.count({
          where: { tenantId, status: "published" },
        }),
        this.prisma.page.count({
          where: { tenantId, status: "draft" },
        }),
        this.prisma.post.count({
          where: { tenantId, status: "published" },
        }),
        this.prisma.post.count({
          where: { tenantId, status: "draft" },
        }),
      ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentPages, recentPosts, recentAssets] = await Promise.all([
      this.prisma.page.count({
        where: { tenantId, updatedAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.post.count({
        where: { tenantId, updatedAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.asset.count({
        where: { tenantId, createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    // Get storage usage (sum of asset sizes)
    const storageResult = await this.prisma.asset.aggregate({
      where: { tenantId },
      _sum: { sizeBytes: true },
    });

    const storageBytesUsed = storageResult._sum.sizeBytes || BigInt(0);

    return {
      totals: {
        pages: tenant._count.pages,
        posts: tenant._count.posts,
        assets: tenant._count.assets,
        teamMembers: tenant._count.tenantUsers,
        products: tenant._count.products,
        orders: tenant._count.orders,
        customers: tenant._count.customers,
      },
      content: {
        publishedPages,
        draftPages,
        publishedPosts,
        draftPosts,
      },
      recentActivity: {
        pagesUpdated: recentPages,
        postsUpdated: recentPosts,
        assetsUploaded: recentAssets,
      },
      storage: {
        bytesUsed: storageBytesUsed.toString(),
        mbUsed: Number(storageBytesUsed) / (1024 * 1024),
      },
      memberSince: tenant.createdAt,
    };
  }

  /**
   * Get health overview for all tenants (agency dashboard)
   */
  async getAllTenantsHealth() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tenants = await this.prisma.tenant.findMany({
      select: {
        id: true,
        slug: true,
        businessName: true,
        status: true,
        tier: true,
        createdAt: true,
        _count: {
          select: {
            pages: true,
            posts: true,
            assets: true,
            tenantUsers: true,
            products: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get recent activity for each tenant
    const healthData = await Promise.all(
      tenants.map(async (tenant) => {
        const [recentPageUpdates, recentPostUpdates, recentAssetUploads] =
          await Promise.all([
            this.prisma.page.count({
              where: { tenantId: tenant.id, updatedAt: { gte: sevenDaysAgo } },
            }),
            this.prisma.post.count({
              where: { tenantId: tenant.id, updatedAt: { gte: sevenDaysAgo } },
            }),
            this.prisma.asset.count({
              where: { tenantId: tenant.id, createdAt: { gte: sevenDaysAgo } },
            }),
          ]);

        // Get last activity date
        const [lastPage, lastPost, lastAsset] = await Promise.all([
          this.prisma.page.findFirst({
            where: { tenantId: tenant.id },
            orderBy: { updatedAt: "desc" },
            select: { updatedAt: true },
          }),
          this.prisma.post.findFirst({
            where: { tenantId: tenant.id },
            orderBy: { updatedAt: "desc" },
            select: { updatedAt: true },
          }),
          this.prisma.asset.findFirst({
            where: { tenantId: tenant.id },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);

        const activityDates = [
          lastPage?.updatedAt,
          lastPost?.updatedAt,
          lastAsset?.createdAt,
        ].filter(Boolean) as Date[];

        const lastActivity =
          activityDates.length > 0
            ? new Date(Math.max(...activityDates.map((d) => d.getTime())))
            : null;

        const recentActivityCount =
          recentPageUpdates + recentPostUpdates + recentAssetUploads;

        // Determine health status
        let healthStatus: "active" | "idle" | "inactive" = "inactive";
        if (lastActivity) {
          if (lastActivity >= sevenDaysAgo) {
            healthStatus = "active";
          } else if (lastActivity >= thirtyDaysAgo) {
            healthStatus = "idle";
          }
        }

        return {
          id: tenant.id,
          slug: tenant.slug,
          businessName: tenant.businessName,
          status: tenant.status,
          tier: tenant.tier,
          createdAt: tenant.createdAt,
          counts: {
            pages: tenant._count.pages,
            posts: tenant._count.posts,
            assets: tenant._count.assets,
            teamMembers: tenant._count.tenantUsers,
            products: tenant._count.products,
            orders: tenant._count.orders,
          },
          recentActivity: {
            total: recentActivityCount,
            pages: recentPageUpdates,
            posts: recentPostUpdates,
            assets: recentAssetUploads,
          },
          lastActivity,
          healthStatus,
        };
      }),
    );

    // Summary stats
    const summary = {
      totalTenants: tenants.length,
      activeTenants: healthData.filter((t) => t.healthStatus === "active")
        .length,
      idleTenants: healthData.filter((t) => t.healthStatus === "idle").length,
      inactiveTenants: healthData.filter((t) => t.healthStatus === "inactive")
        .length,
      builderTier: tenants.filter((t) => t.tier === "BUILDER").length,
      contentEditorTier: tenants.filter((t) => t.tier === "CONTENT_EDITOR")
        .length,
    };

    return {
      summary,
      tenants: healthData,
    };
  }
}
