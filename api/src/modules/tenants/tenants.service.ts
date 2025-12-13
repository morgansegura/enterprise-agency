import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { Prisma, TenantType } from "@prisma";
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
        parent: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            tenantType: true,
          },
        },
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
            children: true,
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

    // Validate parent tenant if provided
    if (createData.parentTenantId) {
      const parentTenant = await this.prisma.tenant.findUnique({
        where: { id: createData.parentTenantId },
      });

      if (!parentTenant) {
        throw new NotFoundException("Parent tenant not found");
      }

      // Validate hierarchy rules:
      // - AGENCY can have CLIENT children
      // - CLIENT can have SUB_CLIENT children
      // - SUB_CLIENT cannot have children
      if (parentTenant.tenantType === "SUB_CLIENT") {
        throw new BadRequestException("Sub-clients cannot have child tenants");
      }

      // Auto-set tenant type based on parent
      if (!createData.tenantType) {
        createData.tenantType =
          parentTenant.tenantType === "AGENCY" ? "CLIENT" : "SUB_CLIENT";
      }
    }

    // Create tenant with creator as owner and default Coming Soon page
    const tenant = await this.prisma.tenant.create({
      data: {
        slug: createData.slug,
        businessName: createData.businessName,
        businessType: createData.businessType,
        contactEmail: createData.contactEmail,
        contactPhone: createData.contactPhone,
        // Hierarchy fields
        parentTenantId: createData.parentTenantId,
        tenantType: createData.tenantType || "CLIENT",
        clientType: createData.clientType,
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
        // Create default Coming Soon page as the home page
        pages: {
          create: {
            slug: "coming-soon",
            title: "Coming Soon",
            authorId: creatorUserId,
            status: "published",
            publishedAt: new Date(),
            isHomePage: true,
            pageType: "coming-soon",
            isSystemPage: true,
            metaTitle: `Coming Soon - ${createData.businessName}`,
            metaDescription: `${createData.businessName} website is coming soon. Check back for updates.`,
            content: {
              sections: [
                {
                  _type: "section",
                  _key: "coming-soon-hero",
                  background: "default",
                  spacing: "2xl",
                  width: "narrow",
                  align: "center",
                  blocks: [
                    {
                      _type: "heading",
                      _key: "coming-soon-title",
                      level: "h1",
                      text: createData.businessName,
                      size: "5xl",
                      align: "center",
                    },
                    {
                      _type: "text",
                      _key: "coming-soon-subtitle",
                      text: "We're working on something amazing. Check back soon!",
                      variant: "lead",
                      align: "center",
                    },
                    {
                      _type: "text",
                      _key: "coming-soon-body",
                      text: "Our website is currently under construction. We're putting the finishing touches on a great experience for you.",
                      variant: "muted",
                      align: "center",
                    },
                  ],
                },
              ],
            } as Prisma.InputJsonValue,
          },
        },
      },
      include: {
        tenantUsers: true,
        domains: true,
        pages: true,
        parent: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            tenantType: true,
          },
        },
      },
    });

    return tenant;
  }

  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        domains: true,
        parent: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            tenantType: true,
          },
        },
        children: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            tenantType: true,
            clientType: true,
            status: true,
          },
        },
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

  /**
   * Find the primary/marketing site tenant
   */
  async findPrimary() {
    const tenant = await this.prisma.tenant.findFirst({
      where: { isPrimaryTenant: true },
      include: {
        domains: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException("Primary tenant not found");
    }

    return tenant;
  }

  /**
   * Find tenant by domain
   */
  async findByDomain(domain: string) {
    const tenantDomain = await this.prisma.tenantDomain.findUnique({
      where: { domain },
      include: {
        tenant: {
          include: {
            domains: true,
          },
        },
      },
    });

    if (!tenantDomain) {
      throw new NotFoundException("Tenant not found for domain");
    }

    return tenantDomain.tenant;
  }

  /**
   * Set a tenant as the primary/marketing site (only one can be primary)
   */
  async setPrimary(tenantId: string) {
    // First, unset any existing primary tenant
    await this.prisma.tenant.updateMany({
      where: { isPrimaryTenant: true },
      data: { isPrimaryTenant: false },
    });

    // Set the new primary tenant
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { isPrimaryTenant: true },
      include: {
        domains: true,
      },
    });

    return tenant;
  }

  async update(id: string, updateData: UpdateTenantDto) {
    const updateFields: Record<string, unknown> = {};

    // Handle slug update with uniqueness check
    if (updateData.slug !== undefined) {
      // Check if slug is already taken by another tenant
      const existingWithSlug = await this.prisma.tenant.findUnique({
        where: { slug: updateData.slug },
      });

      if (existingWithSlug && existingWithSlug.id !== id) {
        throw new ConflictException("Tenant slug already exists");
      }

      updateFields.slug = updateData.slug;
    }

    // Handle parent tenant update with validation
    if (updateData.parentTenantId !== undefined) {
      if (updateData.parentTenantId === null) {
        // Allow clearing parent (only for AGENCY tenant type)
        updateFields.parentTenantId = null;
      } else {
        // Prevent circular references
        if (updateData.parentTenantId === id) {
          throw new BadRequestException("Tenant cannot be its own parent");
        }

        const parentTenant = await this.prisma.tenant.findUnique({
          where: { id: updateData.parentTenantId },
        });

        if (!parentTenant) {
          throw new NotFoundException("Parent tenant not found");
        }

        // Prevent setting sub-client as parent
        if (parentTenant.tenantType === "SUB_CLIENT") {
          throw new BadRequestException(
            "Sub-clients cannot have child tenants",
          );
        }

        // Check for circular reference (parent's parent chain shouldn't include this tenant)
        let currentParent = parentTenant;
        while (currentParent.parentTenantId) {
          if (currentParent.parentTenantId === id) {
            throw new BadRequestException(
              "Cannot create circular tenant hierarchy",
            );
          }
          const nextParent = await this.prisma.tenant.findUnique({
            where: { id: currentParent.parentTenantId },
          });
          if (!nextParent) break;
          currentParent = nextParent;
        }

        updateFields.parentTenantId = updateData.parentTenantId;
      }
    }

    if (updateData.tenantType !== undefined)
      updateFields.tenantType = updateData.tenantType;
    if (updateData.clientType !== undefined)
      updateFields.clientType = updateData.clientType;
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
        parent: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            tenantType: true,
          },
        },
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

  // ============================================
  // TENANT HIERARCHY METHODS
  // ============================================

  /**
   * Get the agency tenant (root of all tenants)
   */
  async getAgencyTenant() {
    const agencyTenant = await this.prisma.tenant.findFirst({
      where: { tenantType: "AGENCY" },
      include: {
        domains: true,
        children: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            tenantType: true,
            clientType: true,
            status: true,
          },
        },
        _count: {
          select: {
            children: true,
            pages: true,
            posts: true,
            assets: true,
          },
        },
      },
    });

    if (!agencyTenant) {
      throw new NotFoundException("Agency tenant not found");
    }

    return agencyTenant;
  }

  /**
   * Get all child tenants of a parent tenant
   */
  async getChildTenants(parentTenantId: string) {
    // Verify parent exists
    const parent = await this.prisma.tenant.findUnique({
      where: { id: parentTenantId },
    });

    if (!parent) {
      throw new NotFoundException("Parent tenant not found");
    }

    const children = await this.prisma.tenant.findMany({
      where: { parentTenantId },
      include: {
        domains: true,
        _count: {
          select: {
            children: true,
            pages: true,
            posts: true,
            assets: true,
            tenantUsers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return children;
  }

  /**
   * Get all tenants of a specific type
   */
  async findByTenantType(tenantType: TenantType) {
    const tenants = await this.prisma.tenant.findMany({
      where: { tenantType },
      include: {
        parent: {
          select: {
            id: true,
            slug: true,
            businessName: true,
          },
        },
        domains: true,
        _count: {
          select: {
            children: true,
            pages: true,
            posts: true,
            assets: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return tenants;
  }

  /**
   * Get full tenant hierarchy (parent chain + immediate children)
   */
  async getTenantHierarchy(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        parent: {
          include: {
            parent: {
              select: {
                id: true,
                slug: true,
                businessName: true,
                tenantType: true,
              },
            },
          },
        },
        children: {
          include: {
            _count: {
              select: {
                children: true,
              },
            },
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    // Build the ancestor chain
    const ancestors: Array<{
      id: string;
      slug: string;
      businessName: string;
      tenantType: string;
    }> = [];

    if (tenant.parent) {
      ancestors.push({
        id: tenant.parent.id,
        slug: tenant.parent.slug,
        businessName: tenant.parent.businessName,
        tenantType: tenant.parent.tenantType,
      });

      if (tenant.parent.parent) {
        ancestors.push({
          id: tenant.parent.parent.id,
          slug: tenant.parent.parent.slug,
          businessName: tenant.parent.parent.businessName,
          tenantType: tenant.parent.parent.tenantType,
        });
      }
    }

    return {
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        businessName: tenant.businessName,
        tenantType: tenant.tenantType,
        clientType: tenant.clientType,
      },
      ancestors: ancestors.reverse(), // Root first
      children: tenant.children.map((child) => ({
        id: child.id,
        slug: child.slug,
        businessName: child.businessName,
        tenantType: child.tenantType,
        clientType: child.clientType,
        hasChildren: child._count.children > 0,
      })),
    };
  }

  /**
   * Get all tenants accessible to a user (for tenant switcher)
   * Returns tenants where user has TenantUser access OR ProjectAssignment
   */
  async getAccessibleTenants(userId: string) {
    // Get tenants via TenantUser
    const tenantUserAccess = await this.prisma.tenantUser.findMany({
      where: { userId },
      include: {
        tenant: {
          include: {
            parent: {
              select: {
                id: true,
                slug: true,
                businessName: true,
                tenantType: true,
              },
            },
            _count: {
              select: {
                children: true,
                pages: true,
              },
            },
          },
        },
      },
    });

    // Get tenants via ProjectAssignment (agency team working on client sites)
    const projectAssignments = await this.prisma.projectAssignment.findMany({
      where: { userId },
      include: {
        tenant: {
          include: {
            parent: {
              select: {
                id: true,
                slug: true,
                businessName: true,
                tenantType: true,
              },
            },
            _count: {
              select: {
                children: true,
                pages: true,
              },
            },
          },
        },
      },
    });

    // Combine and deduplicate
    const tenantMap = new Map();

    for (const tu of tenantUserAccess) {
      tenantMap.set(tu.tenant.id, {
        ...tu.tenant,
        accessType: "member",
        role: tu.role,
      });
    }

    for (const pa of projectAssignments) {
      if (!tenantMap.has(pa.tenant.id)) {
        tenantMap.set(pa.tenant.id, {
          ...pa.tenant,
          accessType: "assigned",
          role: pa.role,
        });
      }
    }

    // Sort by tenant type (AGENCY first), then by name
    const tenants = Array.from(tenantMap.values()).sort((a, b) => {
      const typeOrder = { AGENCY: 0, CLIENT: 1, SUB_CLIENT: 2 };
      const aOrder = typeOrder[a.tenantType as keyof typeof typeOrder] ?? 99;
      const bOrder = typeOrder[b.tenantType as keyof typeof typeOrder] ?? 99;

      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.businessName.localeCompare(b.businessName);
    });

    return tenants;
  }

  /**
   * Check if a user has access to a tenant (either via TenantUser or ProjectAssignment)
   */
  async checkUserTenantAccess(
    userId: string,
    tenantId: string,
  ): Promise<{
    hasAccess: boolean;
    accessType: string | null;
    role: string | null;
  }> {
    // Check TenantUser access
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: { tenantId, userId },
      },
    });

    if (tenantUser) {
      return { hasAccess: true, accessType: "member", role: tenantUser.role };
    }

    // Check ProjectAssignment access
    const projectAssignment = await this.prisma.projectAssignment.findFirst({
      where: { tenantId, userId },
    });

    if (projectAssignment) {
      return {
        hasAccess: true,
        accessType: "assigned",
        role: projectAssignment.role,
      };
    }

    // Check if user is super admin (has access to everything)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isSuperAdmin: true },
    });

    if (user?.isSuperAdmin) {
      return { hasAccess: true, accessType: "superadmin", role: "admin" };
    }

    return { hasAccess: false, accessType: null, role: null };
  }
}
