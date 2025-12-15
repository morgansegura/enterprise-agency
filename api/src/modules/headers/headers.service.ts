import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import type { Prisma } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import { CreateHeaderDto, UpdateHeaderDto } from "./dto";

@Injectable()
export class HeadersService {
  private readonly logger = new Logger(HeadersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new header
   */
  async create(tenantId: string, dto: CreateHeaderDto) {
    // Check for duplicate slug
    const existing = await this.prisma.header.findUnique({
      where: { tenantId_slug: { tenantId, slug: dto.slug } },
    });

    if (existing) {
      throw new ConflictException(
        `Header with slug "${dto.slug}" already exists`,
      );
    }

    // If this is being set as default, unset any existing default
    if (dto.isDefault) {
      await this.prisma.header.updateMany({
        where: { tenantId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const header = await this.prisma.header.create({
      data: {
        tenantId,
        name: dto.name,
        slug: dto.slug,
        behavior: dto.behavior || "STATIC",
        scrollThreshold: dto.scrollThreshold,
        animation: dto.animation || "none",
        zones: (dto.zones || {}) as unknown as Prisma.InputJsonValue,
        style: (dto.style || {}) as unknown as Prisma.InputJsonValue,
        transparentStyle: dto.transparentStyle
          ? (dto.transparentStyle as unknown as Prisma.InputJsonValue)
          : undefined,
        mobileMenu: dto.mobileMenu
          ? (dto.mobileMenu as unknown as Prisma.InputJsonValue)
          : undefined,
        menuId: dto.menuId,
        isDefault: dto.isDefault || false,
      },
      include: {
        menu: true,
      },
    });

    this.logger.log(`Created header "${dto.name}" for tenant ${tenantId}`);
    return header;
  }

  /**
   * List all headers for a tenant
   */
  async findAll(tenantId: string) {
    return this.prisma.header.findMany({
      where: { tenantId },
      include: {
        menu: true,
      },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });
  }

  /**
   * Get a single header by ID
   */
  async findOne(tenantId: string, id: string) {
    const header = await this.prisma.header.findFirst({
      where: { id, tenantId },
      include: {
        menu: true,
      },
    });

    if (!header) {
      throw new NotFoundException("Header not found");
    }

    return header;
  }

  /**
   * Get a header by slug
   */
  async findBySlug(tenantId: string, slug: string) {
    const header = await this.prisma.header.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      include: {
        menu: true,
      },
    });

    if (!header) {
      throw new NotFoundException("Header not found");
    }

    return header;
  }

  /**
   * Get the default header for a tenant
   */
  async findDefault(tenantId: string) {
    const header = await this.prisma.header.findFirst({
      where: { tenantId, isDefault: true },
      include: {
        menu: true,
      },
    });

    return header; // Can be null if no default set
  }

  /**
   * Update a header
   */
  async update(tenantId: string, id: string, dto: UpdateHeaderDto) {
    // Verify header exists and belongs to tenant
    await this.findOne(tenantId, id);

    // Check for slug conflict if slug is being changed
    if (dto.slug) {
      const existing = await this.prisma.header.findFirst({
        where: {
          tenantId,
          slug: dto.slug,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Header with slug "${dto.slug}" already exists`,
        );
      }
    }

    // If this is being set as default, unset any existing default
    if (dto.isDefault) {
      await this.prisma.header.updateMany({
        where: { tenantId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const header = await this.prisma.header.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.behavior && { behavior: dto.behavior }),
        ...(dto.scrollThreshold !== undefined && {
          scrollThreshold: dto.scrollThreshold,
        }),
        ...(dto.animation && { animation: dto.animation }),
        ...(dto.zones !== undefined && {
          zones: dto.zones as unknown as Prisma.InputJsonValue,
        }),
        ...(dto.style !== undefined && {
          style: dto.style as unknown as Prisma.InputJsonValue,
        }),
        ...(dto.transparentStyle !== undefined && {
          transparentStyle:
            dto.transparentStyle as unknown as Prisma.InputJsonValue,
        }),
        ...(dto.mobileMenu !== undefined && {
          mobileMenu: dto.mobileMenu as unknown as Prisma.InputJsonValue,
        }),
        ...(dto.menuId !== undefined && { menuId: dto.menuId }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
      include: {
        menu: true,
      },
    });

    this.logger.log(`Updated header ${id} for tenant ${tenantId}`);
    return header;
  }

  /**
   * Delete a header
   */
  async remove(tenantId: string, id: string) {
    // Verify header exists and belongs to tenant
    const header = await this.findOne(tenantId, id);

    await this.prisma.header.delete({
      where: { id },
    });

    this.logger.log(`Deleted header "${header.name}" for tenant ${tenantId}`);
    return { success: true };
  }

  /**
   * Duplicate a header
   */
  async duplicate(tenantId: string, id: string, newName?: string) {
    const original = await this.findOne(tenantId, id);

    // Generate unique slug
    const baseSlug = `${original.slug}-copy`;
    let slug = baseSlug;
    let counter = 1;

    while (
      await this.prisma.header.findUnique({
        where: { tenantId_slug: { tenantId, slug } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const duplicated = await this.prisma.header.create({
      data: {
        tenantId,
        name: newName || `${original.name} (Copy)`,
        slug,
        behavior: original.behavior,
        scrollThreshold: original.scrollThreshold,
        animation: original.animation,
        zones: original.zones as object,
        style: original.style as object,
        transparentStyle: original.transparentStyle as object | undefined,
        mobileMenu: original.mobileMenu as object | undefined,
        menuId: original.menuId,
        isDefault: false, // Never duplicate as default
      },
      include: {
        menu: true,
      },
    });

    this.logger.log(
      `Duplicated header ${id} as ${duplicated.id} for tenant ${tenantId}`,
    );
    return duplicated;
  }

  /**
   * Save header to library
   */
  async saveToLibrary(
    tenantId: string,
    id: string,
    options: { name?: string; description?: string } = {},
  ) {
    const header = await this.findOne(tenantId, id);

    // Create library component
    const component = await this.prisma.libraryComponent.create({
      data: {
        tenantId,
        name: options.name || header.name,
        slug: `header-${header.slug}-${Date.now()}`,
        description: options.description,
        scope: "TENANT",
        type: "HEADER",
        content: {
          behavior: header.behavior,
          scrollThreshold: header.scrollThreshold,
          animation: header.animation,
          zones: header.zones,
          style: header.style,
          transparentStyle: header.transparentStyle,
          mobileMenu: header.mobileMenu,
        },
        category: "headers",
        isFavorite: true,
      },
    });

    this.logger.log(
      `Saved header ${id} to library as component ${component.id}`,
    );
    return component;
  }
}
