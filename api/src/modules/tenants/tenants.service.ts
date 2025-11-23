import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/common/services/prisma.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { CreateDomainDto } from "./dto/create-domain.dto";

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
}
