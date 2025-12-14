import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import type { Prisma } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import { CreateMenuDto, UpdateMenuDto } from "./dto";

@Injectable()
export class MenusService {
  private readonly logger = new Logger(MenusService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new menu
   */
  async create(tenantId: string, dto: CreateMenuDto) {
    // Check for duplicate slug
    const existing = await this.prisma.menu.findUnique({
      where: { tenantId_slug: { tenantId, slug: dto.slug } },
    });

    if (existing) {
      throw new ConflictException(
        `Menu with slug "${dto.slug}" already exists`,
      );
    }

    // If this is being set as default, unset any existing default
    if (dto.isDefault) {
      await this.prisma.menu.updateMany({
        where: { tenantId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const menu = await this.prisma.menu.create({
      data: {
        tenantId,
        name: dto.name,
        slug: dto.slug,
        type: dto.type || "horizontal",
        items: (dto.items || []) as unknown as Prisma.InputJsonValue,
        style: (dto.style || {}) as unknown as Prisma.InputJsonValue,
        isDefault: dto.isDefault || false,
      },
    });

    this.logger.log(`Created menu "${dto.name}" for tenant ${tenantId}`);
    return menu;
  }

  /**
   * List all menus for a tenant
   */
  async findAll(tenantId: string) {
    return this.prisma.menu.findMany({
      where: { tenantId },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });
  }

  /**
   * Get a single menu by ID
   */
  async findOne(tenantId: string, id: string) {
    const menu = await this.prisma.menu.findFirst({
      where: { id, tenantId },
    });

    if (!menu) {
      throw new NotFoundException("Menu not found");
    }

    return menu;
  }

  /**
   * Get a menu by slug
   */
  async findBySlug(tenantId: string, slug: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (!menu) {
      throw new NotFoundException("Menu not found");
    }

    return menu;
  }

  /**
   * Get the default menu for a tenant
   */
  async findDefault(tenantId: string) {
    const menu = await this.prisma.menu.findFirst({
      where: { tenantId, isDefault: true },
    });

    return menu; // Can be null if no default set
  }

  /**
   * Update a menu
   */
  async update(tenantId: string, id: string, dto: UpdateMenuDto) {
    // Verify menu exists and belongs to tenant
    await this.findOne(tenantId, id);

    // Check for slug conflict if slug is being changed
    if (dto.slug) {
      const existing = await this.prisma.menu.findFirst({
        where: {
          tenantId,
          slug: dto.slug,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Menu with slug "${dto.slug}" already exists`,
        );
      }
    }

    // If this is being set as default, unset any existing default
    if (dto.isDefault) {
      await this.prisma.menu.updateMany({
        where: { tenantId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const menu = await this.prisma.menu.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.type && { type: dto.type }),
        ...(dto.items !== undefined && {
          items: dto.items as unknown as Prisma.InputJsonValue,
        }),
        ...(dto.style !== undefined && {
          style: dto.style as unknown as Prisma.InputJsonValue,
        }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });

    this.logger.log(`Updated menu ${id} for tenant ${tenantId}`);
    return menu;
  }

  /**
   * Delete a menu
   */
  async remove(tenantId: string, id: string) {
    // Verify menu exists and belongs to tenant
    const menu = await this.findOne(tenantId, id);

    await this.prisma.menu.delete({
      where: { id },
    });

    this.logger.log(`Deleted menu "${menu.name}" for tenant ${tenantId}`);
    return { success: true };
  }

  /**
   * Duplicate a menu
   */
  async duplicate(tenantId: string, id: string, newName?: string) {
    const original = await this.findOne(tenantId, id);

    // Generate unique slug
    const baseSlug = `${original.slug}-copy`;
    let slug = baseSlug;
    let counter = 1;

    while (
      await this.prisma.menu.findUnique({
        where: { tenantId_slug: { tenantId, slug } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const duplicated = await this.prisma.menu.create({
      data: {
        tenantId,
        name: newName || `${original.name} (Copy)`,
        slug,
        type: original.type,
        items: original.items as object,
        style: original.style as object,
        isDefault: false, // Never duplicate as default
      },
    });

    this.logger.log(
      `Duplicated menu ${id} as ${duplicated.id} for tenant ${tenantId}`,
    );
    return duplicated;
  }

  /**
   * Save menu to library
   */
  async saveToLibrary(
    tenantId: string,
    id: string,
    options: { name?: string; description?: string } = {},
  ) {
    const menu = await this.findOne(tenantId, id);

    // Create library component
    const component = await this.prisma.libraryComponent.create({
      data: {
        tenantId,
        name: options.name || menu.name,
        slug: `menu-${menu.slug}-${Date.now()}`,
        description: options.description,
        scope: "TENANT",
        type: "MENU",
        content: {
          type: menu.type,
          items: menu.items,
          style: menu.style,
        },
        category: "menus",
        isFavorite: true,
      },
    });

    this.logger.log(`Saved menu ${id} to library as component ${component.id}`);
    return component;
  }
}
