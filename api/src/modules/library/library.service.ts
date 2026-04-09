import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { Prisma } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import {
  AuditLogService,
  AuditAction,
} from "@/common/services/audit-log.service";

// Schema enum supports SECTION and BLOCK for the library API
// (HEADER/FOOTER/MENU have their own modules)
export type LibraryItemType = "SECTION" | "BLOCK";

export interface ListLibraryOptions {
  type?: LibraryItemType;
  category?: string;
  search?: string;
  scope?: "TENANT" | "GLOBAL" | "ALL";
}

@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
  ) {}

  /**
   * List library items for a tenant.
   * Includes the tenant's own saved items plus optionally global items.
   */
  async list(tenantId: string, options: ListLibraryOptions = {}) {
    const where: Prisma.LibraryComponentWhereInput = {};

    // Scope filter
    if (options.scope === "TENANT") {
      where.tenantId = tenantId;
    } else if (options.scope === "GLOBAL") {
      where.scope = "GLOBAL";
      where.tenantId = null;
    } else {
      // Default: tenant items + global items
      where.OR = [{ tenantId }, { scope: "GLOBAL", tenantId: null }];
    }

    // Restrict to SECTION/BLOCK for the library API
    if (options.type) {
      where.type = options.type;
    } else {
      where.type = { in: ["SECTION", "BLOCK"] };
    }

    if (options.category) {
      where.category = options.category;
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ];
    }

    return this.prisma.libraryComponent.findMany({
      where,
      orderBy: [
        { isFavorite: "desc" },
        { usageCount: "desc" },
        { createdAt: "desc" },
      ],
    });
  }

  /**
   * Get a single library item by ID.
   */
  async findOne(tenantId: string, id: string) {
    const item = await this.prisma.libraryComponent.findFirst({
      where: {
        id,
        OR: [{ tenantId }, { scope: "GLOBAL", tenantId: null }],
      },
    });

    if (!item) {
      throw new NotFoundException(`Library item ${id} not found`);
    }

    return item;
  }

  /**
   * Save a section or block to the library.
   */
  async create(
    tenantId: string,
    data: {
      name: string;
      description?: string;
      type: LibraryItemType;
      content: Record<string, unknown>;
      category?: string;
      tags?: string[];
      thumbnailUrl?: string;
    },
    userId?: string,
  ) {
    if (!data.name?.trim()) {
      throw new BadRequestException("Name is required");
    }

    const slug = `${data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)}-${Date.now()}`;

    const item = await this.prisma.libraryComponent.create({
      data: {
        tenantId,
        name: data.name.trim(),
        slug,
        description: data.description?.trim(),
        scope: "TENANT",
        type: data.type,
        content: data.content as Prisma.InputJsonValue,
        category: data.category,
        tags: data.tags ?? [],
        thumbnailUrl: data.thumbnailUrl,
      },
    });

    this.logger.log(`Created library item ${item.id} (${item.type})`);
    void this.audit.log({
      tenantId,
      userId,
      action: AuditAction.CREATED,
      resourceType: "library",
      resourceId: item.id,
      metadata: { name: item.name, type: item.type },
    });

    return item;
  }

  /**
   * Update library item metadata.
   */
  async update(
    tenantId: string,
    id: string,
    data: {
      name?: string;
      description?: string;
      category?: string;
      tags?: string[];
      isFavorite?: boolean;
      thumbnailUrl?: string;
    },
    userId?: string,
  ) {
    const existing = await this.prisma.libraryComponent.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException(`Library item ${id} not found`);
    }

    const item = await this.prisma.libraryComponent.update({
      where: { id },
      data,
    });

    void this.audit.log({
      tenantId,
      userId,
      action: AuditAction.UPDATED,
      resourceType: "library",
      resourceId: id,
      changes: data as Record<string, unknown>,
    });

    return item;
  }

  /**
   * Delete a library item.
   */
  async delete(tenantId: string, id: string, userId?: string) {
    const existing = await this.prisma.libraryComponent.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException(`Library item ${id} not found`);
    }

    await this.prisma.libraryComponent.delete({ where: { id } });

    void this.audit.log({
      tenantId,
      userId,
      action: AuditAction.DELETED,
      resourceType: "library",
      resourceId: id,
      metadata: { name: existing.name, type: existing.type },
    });

    return { success: true };
  }

  /**
   * Increment usage count when an item is inserted into a page.
   */
  async incrementUsage(tenantId: string, id: string) {
    await this.prisma.libraryComponent.updateMany({
      where: { id, OR: [{ tenantId }, { scope: "GLOBAL" }] },
      data: { usageCount: { increment: 1 } },
    });
  }
}
