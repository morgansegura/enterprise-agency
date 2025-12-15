import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import type { Prisma } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import { CreateFooterDto } from "./dto/create-footer.dto";
import { UpdateFooterDto } from "./dto/update-footer.dto";

@Injectable()
export class FootersService {
  private readonly logger = new Logger(FootersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new footer
   */
  async create(tenantId: string, dto: CreateFooterDto) {
    // Check for duplicate slug
    const existing = await this.prisma.footer.findUnique({
      where: { tenantId_slug: { tenantId, slug: dto.slug } },
    });

    if (existing) {
      throw new ConflictException(
        `Footer with slug "${dto.slug}" already exists`,
      );
    }

    // If this is being set as default, unset any existing default
    if (dto.isDefault) {
      await this.prisma.footer.updateMany({
        where: { tenantId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const footer = await this.prisma.footer.create({
      data: {
        tenantId,
        name: dto.name,
        slug: dto.slug,
        layout: dto.layout || "SIMPLE",
        zones: (dto.zones || {}) as unknown as Prisma.InputJsonValue,
        style: (dto.style || {}) as unknown as Prisma.InputJsonValue,
        isDefault: dto.isDefault || false,
      },
    });

    this.logger.log(`Created footer "${dto.name}" for tenant ${tenantId}`);
    return footer;
  }

  /**
   * List all footers for a tenant
   */
  async findAll(tenantId: string) {
    return this.prisma.footer.findMany({
      where: { tenantId },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });
  }

  /**
   * Get a single footer by ID
   */
  async findOne(tenantId: string, id: string) {
    const footer = await this.prisma.footer.findFirst({
      where: { id, tenantId },
    });

    if (!footer) {
      throw new NotFoundException("Footer not found");
    }

    return footer;
  }

  /**
   * Get a footer by slug
   */
  async findBySlug(tenantId: string, slug: string) {
    const footer = await this.prisma.footer.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (!footer) {
      throw new NotFoundException("Footer not found");
    }

    return footer;
  }

  /**
   * Get the default footer for a tenant
   */
  async findDefault(tenantId: string) {
    const footer = await this.prisma.footer.findFirst({
      where: { tenantId, isDefault: true },
    });

    return footer; // Can be null if no default set
  }

  /**
   * Update a footer
   */
  async update(tenantId: string, id: string, dto: UpdateFooterDto) {
    // Verify footer exists and belongs to tenant
    await this.findOne(tenantId, id);

    // Check for slug conflict if slug is being changed
    if (dto.slug) {
      const existing = await this.prisma.footer.findFirst({
        where: {
          tenantId,
          slug: dto.slug,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Footer with slug "${dto.slug}" already exists`,
        );
      }
    }

    // If this is being set as default, unset any existing default
    if (dto.isDefault) {
      await this.prisma.footer.updateMany({
        where: { tenantId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const footer = await this.prisma.footer.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.layout && { layout: dto.layout }),
        ...(dto.zones !== undefined && {
          zones: dto.zones as unknown as Prisma.InputJsonValue,
        }),
        ...(dto.style !== undefined && {
          style: dto.style as unknown as Prisma.InputJsonValue,
        }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });

    this.logger.log(`Updated footer ${id} for tenant ${tenantId}`);
    return footer;
  }

  /**
   * Delete a footer
   */
  async remove(tenantId: string, id: string) {
    // Verify footer exists and belongs to tenant
    const footer = await this.findOne(tenantId, id);

    await this.prisma.footer.delete({
      where: { id },
    });

    this.logger.log(`Deleted footer "${footer.name}" for tenant ${tenantId}`);
    return { success: true };
  }

  /**
   * Duplicate a footer
   */
  async duplicate(tenantId: string, id: string, newName?: string) {
    const original = await this.findOne(tenantId, id);

    // Generate unique slug
    const baseSlug = `${original.slug}-copy`;
    let slug = baseSlug;
    let counter = 1;

    while (
      await this.prisma.footer.findUnique({
        where: { tenantId_slug: { tenantId, slug } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const duplicated = await this.prisma.footer.create({
      data: {
        tenantId,
        name: newName || `${original.name} (Copy)`,
        slug,
        layout: original.layout,
        zones: original.zones as object,
        style: original.style as object,
        isDefault: false, // Never duplicate as default
      },
    });

    this.logger.log(
      `Duplicated footer ${id} as ${duplicated.id} for tenant ${tenantId}`,
    );
    return duplicated;
  }

  /**
   * Save footer to library
   */
  async saveToLibrary(
    tenantId: string,
    id: string,
    options: { name?: string; description?: string } = {},
  ) {
    const footer = await this.findOne(tenantId, id);

    // Create library component
    const component = await this.prisma.libraryComponent.create({
      data: {
        tenantId,
        name: options.name || footer.name,
        slug: `footer-${footer.slug}-${Date.now()}`,
        description: options.description,
        scope: "TENANT",
        type: "FOOTER",
        content: {
          layout: footer.layout,
          zones: footer.zones,
          style: footer.style,
        },
        category: "footers",
        isFavorite: true,
      },
    });

    this.logger.log(
      `Saved footer ${id} to library as component ${component.id}`,
    );
    return component;
  }
}
