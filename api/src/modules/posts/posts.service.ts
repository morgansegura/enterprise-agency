import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, userId: string, createData: CreatePostDto) {
    // Check if slug already exists for this tenant
    const existing = await this.prisma.post.findUnique({
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

    const post = await this.prisma.post.create({
      data: {
        tenantId,
        authorId: userId,
        slug: createData.slug,
        title: createData.title,
        excerpt: createData.excerpt,
        content: createData.content,
        featuredImageId: createData.featuredImageId,
        category: createData.category,
        tags: createData.tags || [],
        metaTitle: createData.metaTitle || createData.title,
        metaDescription: createData.metaDescription || createData.excerpt,
        status: createData.status || "draft",
        publishedAt: createData.status === "published" ? new Date() : null,
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
        featuredImage: true,
      },
    });

    this.logger.log(`Post created: ${post.slug} by user ${userId}`);
    return post;
  }

  async findAll(
    tenantId: string,
    filters?: {
      status?: string;
      category?: string;
      tags?: string[];
      search?: string;
    },
  ) {
    const where: Record<string, unknown> = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      };
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
        { excerpt: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const posts = await this.prisma.post.findMany({
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
        featuredImage: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  }

  async findOne(tenantId: string, id: string) {
    const post = await this.prisma.post.findFirst({
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
        featuredImage: true,
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  async findBySlug(tenantId: string, slug: string) {
    const post = await this.prisma.post.findUnique({
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
        featuredImage: true,
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    // Increment view count
    await this.prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async update(tenantId: string, id: string, updateData: UpdatePostDto) {
    // Verify post belongs to tenant
    await this.findOne(tenantId, id);

    // If slug is being updated, check it's not taken
    if (updateData.slug) {
      const existing = await this.findOne(tenantId, id);

      if (updateData.slug !== existing.slug) {
        const slugTaken = await this.prisma.post.findUnique({
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
    }

    // Build update data with timestamps
    const updateDataWithTimestamps: Record<string, unknown> = { ...updateData };

    // Set publishedAt timestamp if status is being updated to published
    if (
      updateData.status === "published" &&
      !updateDataWithTimestamps.publishedAt
    ) {
      updateDataWithTimestamps.publishedAt = new Date();
    }

    const post = await this.prisma.post.update({
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
        featuredImage: true,
      },
    });

    this.logger.log(`Post updated: ${post.slug}`);
    return post;
  }

  async remove(tenantId: string, id: string) {
    // Verify post belongs to tenant
    await this.findOne(tenantId, id);

    await this.prisma.post.delete({
      where: { id },
    });

    this.logger.log(`Post deleted: ${id}`);
    return { success: true, id };
  }

  async publish(tenantId: string, id: string) {
    const post = await this.update(tenantId, id, {
      status: "published",
    });

    this.logger.log(`Post published: ${post.slug}`);
    return post;
  }

  async unpublish(tenantId: string, id: string) {
    const post = await this.update(tenantId, id, {
      status: "draft",
    });

    this.logger.log(`Post unpublished: ${post.slug}`);
    return post;
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

    const duplicated = await this.prisma.post.create({
      data: {
        tenantId,
        authorId: userId,
        slug: newSlug,
        title: `${original.title} (Copy)`,
        excerpt: original.excerpt,
        content: original.content,
        featuredImageId: original.featuredImageId,
        category: original.category,
        tags: original.tags,
        metaTitle: original.metaTitle,
        metaDescription: original.metaDescription,
        status: "draft",
        viewCount: 0,
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
        featuredImage: true,
      },
    });

    this.logger.log(`Post duplicated: ${original.slug} -> ${duplicated.slug}`);
    return duplicated;
  }

  async getCategories(tenantId: string) {
    const posts = await this.prisma.post.findMany({
      where: { tenantId },
      select: { category: true },
      distinct: ["category"],
    });

    return posts.map((p) => p.category).filter(Boolean);
  }

  async getTags(tenantId: string) {
    const posts = await this.prisma.post.findMany({
      where: { tenantId },
      select: { tags: true },
    });

    const allTags = posts.flatMap((p) => p.tags);
    return [...new Set(allTags)];
  }
}
