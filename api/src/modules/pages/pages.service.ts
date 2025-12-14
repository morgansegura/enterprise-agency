import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { Prisma, TenantTier } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import { CreatePageDto } from "./dto/create-page.dto";
import { UpdatePageDto } from "./dto/update-page.dto";
import { StructureValidationService } from "./services/structure-validation.service";
import { RevalidationService } from "@/modules/revalidation/revalidation.service";

/**
 * Type alias for page content structure
 * Uses Record<string, unknown> for flexibility with JSONB storage
 */
type PageContent = Record<string, unknown> | null;

@Injectable()
export class PagesService {
  private readonly logger = new Logger(PagesService.name);

  constructor(
    private prisma: PrismaService,
    private structureValidation: StructureValidationService,
    private revalidationService: RevalidationService,
  ) {}

  async create(tenantId: string, userId: string, createData: CreatePageDto) {
    // Check if slug already exists for this tenant
    const existing = await this.prisma.page.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug: createData.slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException("Slug already exists for this tenant");
    }

    // If this page is being set as home, unset any existing home page
    if (createData.isHomePage) {
      await this.prisma.page.updateMany({
        where: {
          tenantId,
          isHomePage: true,
        },
        data: {
          isHomePage: false,
        },
      });
    }

    // Build content structure for sections and serialize to plain JSON
    const contentData = {
      sections: createData.sections || [],
      seo: createData.seo || {},
      accessibility: createData.accessibility || {},
      performance: createData.performance || {
        lazyLoadImages: true,
        preloadCritical: true,
        cacheStrategy: "static",
      },
    };

    const page = await this.prisma.page.create({
      data: {
        tenantId,
        authorId: userId,
        slug: createData.slug,
        title: createData.title,
        content: JSON.parse(
          JSON.stringify(contentData),
        ) as Prisma.InputJsonValue,
        metaTitle: createData.seo?.metaTitle || createData.title,
        metaDescription: createData.seo?.metaDescription,
        status: createData.status || "draft",
        template: createData.template || "default",
        publishedAt: createData.status === "published" ? new Date() : null,
        isHomePage: createData.isHomePage || false,
        pageType: createData.pageType,
        isSystemPage: createData.isSystemPage || false,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    this.logger.log(`Page created: ${page.slug} by user ${userId}`);
    return page;
  }

  async findAll(
    tenantId: string,
    filters?: {
      status?: string;
      template?: string;
      search?: string;
    },
  ) {
    const where: Record<string, unknown> = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.template) {
      where.template = filters.template;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const pages = await this.prisma.page.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return pages;
  }

  async findOne(tenantId: string, id: string) {
    const page = await this.prisma.page.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    return page;
  }

  async findBySlug(tenantId: string, slug: string) {
    const page = await this.prisma.page.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    return page;
  }

  /**
   * Updates a page with tier-aware validation
   * Content Editor tier can only modify block data, not structure
   * Builder tier can modify everything
   *
   * @param tenantId - The tenant ID
   * @param id - The page ID
   * @param updateData - The update payload
   * @param tenantTier - Optional tenant tier for structure validation
   */
  async update(
    tenantId: string,
    id: string,
    updateData: UpdatePageDto,
    tenantTier?: TenantTier,
  ) {
    // Verify page belongs to tenant and get existing data
    const existing = await this.findOne(tenantId, id);

    // If slug is being updated, check it's not taken
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugTaken = await this.prisma.page.findUnique({
        where: {
          tenantId_slug: {
            tenantId,
            slug: updateData.slug,
          },
        },
      });

      if (slugTaken) {
        throw new ConflictException("Slug already exists for this tenant");
      }
    }

    // If this page is being set as home, unset any existing home page first
    if (updateData.isHomePage === true && !existing.isHomePage) {
      await this.prisma.page.updateMany({
        where: {
          tenantId,
          isHomePage: true,
          id: { not: id }, // Don't update the current page
        },
        data: {
          isHomePage: false,
        },
      });
    }

    // Validate structure changes if tier is provided and sections are being updated
    if (tenantTier && updateData.sections !== undefined) {
      const existingContent = (existing.content ?? null) as PageContent;
      const updatedContent = { sections: updateData.sections } as PageContent;
      this.structureValidation.validateContentChanges(
        tenantTier,
        existingContent,
        updatedContent,
      );
    }

    // Build updated content structure
    const updateDataWithTimestamps: Record<string, unknown> = { ...updateData };

    if (
      updateData.sections ||
      updateData.seo ||
      updateData.accessibility ||
      updateData.performance
    ) {
      const existingContent = (existing.content || {}) as Record<
        string,
        unknown
      >;

      // Serialize to plain JSON objects
      const contentData = {
        sections: updateData.sections || existingContent.sections || [],
        seo: updateData.seo || existingContent.seo || {},
        accessibility:
          updateData.accessibility || existingContent.accessibility || {},
        performance:
          updateData.performance || existingContent.performance || {},
      };

      updateDataWithTimestamps.content = JSON.parse(
        JSON.stringify(contentData),
      ) as Prisma.InputJsonValue;

      delete updateDataWithTimestamps.sections;
      delete updateDataWithTimestamps.seo;
      delete updateDataWithTimestamps.accessibility;
      delete updateDataWithTimestamps.performance;
    }

    // Set publishedAt timestamp if status is being updated to published
    if (
      updateData.status === "published" &&
      !updateDataWithTimestamps.publishedAt
    ) {
      updateDataWithTimestamps.publishedAt = new Date();
    }

    // Update metaTitle from SEO if provided
    if (updateData.seo?.metaTitle) {
      updateDataWithTimestamps.metaTitle = updateData.seo.metaTitle;
    }

    if (updateData.seo?.metaDescription) {
      updateDataWithTimestamps.metaDescription = updateData.seo.metaDescription;
    }

    const page = await this.prisma.page.update({
      where: { id },
      data: updateDataWithTimestamps,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    this.logger.log(`Page updated: ${page.slug}`);
    return page;
  }

  async remove(tenantId: string, id: string) {
    // Verify page belongs to tenant
    await this.findOne(tenantId, id);

    await this.prisma.page.delete({
      where: { id },
    });

    this.logger.log(`Page deleted: ${id}`);
    return { success: true, id };
  }

  async publish(tenantId: string, id: string) {
    const page = await this.update(tenantId, id, {
      status: "published",
    });

    // Trigger cache revalidation (fire and forget)
    this.revalidationService
      .revalidatePage(tenantId, page.slug)
      .catch((err) => {
        this.logger.error(`Failed to revalidate page ${page.slug}:`, err);
      });

    this.logger.log(`Page published: ${page.slug}`);
    return page;
  }

  async unpublish(tenantId: string, id: string) {
    const page = await this.update(tenantId, id, {
      status: "draft",
    });

    // Trigger cache revalidation (fire and forget)
    this.revalidationService
      .revalidatePage(tenantId, page.slug)
      .catch((err) => {
        this.logger.error(`Failed to revalidate page ${page.slug}:`, err);
      });

    this.logger.log(`Page unpublished: ${page.slug}`);
    return page;
  }

  async duplicate(tenantId: string, userId: string, id: string) {
    const original = await this.findOne(tenantId, id);

    // Generate unique slug
    let newSlug = `${original.slug}-copy`;
    let counter = 1;
    while (true) {
      try {
        await this.findBySlug(tenantId, newSlug);
        newSlug = `${original.slug}-copy-${counter++}`;
      } catch {
        break;
      }
    }

    const duplicated = await this.prisma.page.create({
      data: {
        tenantId,
        authorId: userId,
        slug: newSlug,
        title: `${original.title} (Copy)`,
        content: original.content
          ? (JSON.parse(
              JSON.stringify(original.content),
            ) as Prisma.InputJsonValue)
          : undefined,
        metaTitle: original.metaTitle,
        metaDescription: original.metaDescription,
        status: "draft",
        template: original.template,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    this.logger.log(`Page duplicated: ${original.slug} -> ${duplicated.slug}`);
    return duplicated;
  }
}
