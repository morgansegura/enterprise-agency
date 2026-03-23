import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import { CreateFolderDto, UpdateFolderDto, MoveFolderDto } from "./dto";

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new folder
   */
  async create(tenantId: string, userId: string, dto: CreateFolderDto) {
    const slug = this.slugify(dto.name);

    // Build path
    let path = `/${slug}`;
    if (dto.parentId) {
      const parent = await this.prisma.mediaFolder.findFirst({
        where: { id: dto.parentId, tenantId },
      });
      if (!parent) {
        throw new NotFoundException("Parent folder not found");
      }
      path = `${parent.path}/${slug}`;
    }

    // Check for duplicate path
    const existing = await this.prisma.mediaFolder.findFirst({
      where: { tenantId, path },
    });
    if (existing) {
      throw new ConflictException(
        "A folder with this name already exists in this location",
      );
    }

    return this.prisma.mediaFolder.create({
      data: {
        tenantId,
        name: dto.name,
        slug,
        parentId: dto.parentId,
        path,
        createdBy: userId,
      },
      include: {
        _count: { select: { assets: true, children: true } },
      },
    });
  }

  /**
   * Get folder tree for a tenant
   */
  async getTree(tenantId: string) {
    const folders = await this.prisma.mediaFolder.findMany({
      where: { tenantId },
      include: {
        _count: { select: { assets: true, children: true } },
      },
      orderBy: { name: "asc" },
    });

    // Build tree structure
    return this.buildTree(folders);
  }

  /**
   * List folders (flat) with optional parent filter
   */
  async list(tenantId: string, parentId?: string | null) {
    return this.prisma.mediaFolder.findMany({
      where: {
        tenantId,
        parentId: parentId === null ? null : parentId,
      },
      include: {
        _count: { select: { assets: true, children: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get a single folder by ID
   */
  async findById(tenantId: string, id: string) {
    const folder = await this.prisma.mediaFolder.findFirst({
      where: { id, tenantId },
      include: {
        parent: true,
        children: {
          include: {
            _count: { select: { assets: true, children: true } },
          },
        },
        _count: { select: { assets: true, children: true } },
      },
    });

    if (!folder) {
      throw new NotFoundException("Folder not found");
    }

    return folder;
  }

  /**
   * Update folder (rename)
   */
  async update(tenantId: string, id: string, dto: UpdateFolderDto) {
    const folder = await this.prisma.mediaFolder.findFirst({
      where: { id, tenantId },
    });

    if (!folder) {
      throw new NotFoundException("Folder not found");
    }

    const newSlug = this.slugify(dto.name);
    const newPath = folder.path.replace(/\/[^/]+$/, `/${newSlug}`);

    // Check for conflicts
    if (newPath !== folder.path) {
      const existing = await this.prisma.mediaFolder.findFirst({
        where: { tenantId, path: newPath, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException("A folder with this name already exists");
      }
    }

    // Update this folder and all children paths
    await this.prisma.$transaction(async (tx) => {
      // Update this folder
      await tx.mediaFolder.update({
        where: { id },
        data: { name: dto.name, slug: newSlug, path: newPath },
      });

      // Update all descendant paths
      if (newPath !== folder.path) {
        const descendants = await tx.mediaFolder.findMany({
          where: {
            tenantId,
            path: { startsWith: `${folder.path}/` },
          },
        });

        for (const desc of descendants) {
          const updatedPath = desc.path.replace(folder.path, newPath);
          await tx.mediaFolder.update({
            where: { id: desc.id },
            data: { path: updatedPath },
          });
        }
      }
    });

    return this.findById(tenantId, id);
  }

  /**
   * Move folder to a new parent
   */
  async move(tenantId: string, id: string, dto: MoveFolderDto) {
    const folder = await this.prisma.mediaFolder.findFirst({
      where: { id, tenantId },
    });

    if (!folder) {
      throw new NotFoundException("Folder not found");
    }

    // Prevent moving to self or descendant
    if (dto.parentId === id) {
      throw new BadRequestException("Cannot move folder into itself");
    }

    let newPath: string;
    if (dto.parentId) {
      const parent = await this.prisma.mediaFolder.findFirst({
        where: { id: dto.parentId, tenantId },
      });
      if (!parent) {
        throw new NotFoundException("Target folder not found");
      }
      // Check if target is a descendant
      if (parent.path.startsWith(`${folder.path}/`)) {
        throw new BadRequestException(
          "Cannot move folder into its own descendant",
        );
      }
      newPath = `${parent.path}/${folder.slug}`;
    } else {
      newPath = `/${folder.slug}`;
    }

    // Check for conflicts
    const existing = await this.prisma.mediaFolder.findFirst({
      where: { tenantId, path: newPath, id: { not: id } },
    });
    if (existing) {
      throw new ConflictException(
        "A folder with this name already exists in the target location",
      );
    }

    // Move folder and update all descendant paths
    await this.prisma.$transaction(async (tx) => {
      const oldPath = folder.path;

      // Update this folder
      await tx.mediaFolder.update({
        where: { id },
        data: { parentId: dto.parentId ?? null, path: newPath },
      });

      // Update all descendant paths
      const descendants = await tx.mediaFolder.findMany({
        where: {
          tenantId,
          path: { startsWith: `${oldPath}/` },
        },
      });

      for (const desc of descendants) {
        const updatedPath = desc.path.replace(oldPath, newPath);
        await tx.mediaFolder.update({
          where: { id: desc.id },
          data: { path: updatedPath },
        });
      }
    });

    return this.findById(tenantId, id);
  }

  /**
   * Delete folder and optionally its contents
   */
  async delete(tenantId: string, id: string, deleteContents: boolean = false) {
    const folder = await this.prisma.mediaFolder.findFirst({
      where: { id, tenantId },
      include: {
        _count: { select: { assets: true, children: true } },
      },
    });

    if (!folder) {
      throw new NotFoundException("Folder not found");
    }

    // Check if folder has contents
    if (folder._count.assets > 0 || folder._count.children > 0) {
      if (!deleteContents) {
        throw new BadRequestException(
          "Folder is not empty. Set deleteContents=true to delete folder and all its contents.",
        );
      }
    }

    // Delete folder (cascade will handle children and unlink assets)
    await this.prisma.mediaFolder.delete({
      where: { id },
    });

    return { success: true, id };
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  private buildTree(
    folders: Array<{
      id: string;
      parentId: string | null;
      name: string;
      slug: string;
      path: string;
      _count: { assets: number; children: number };
    }>,
  ) {
    const map = new Map<
      string,
      (typeof folders)[0] & { children: typeof folders }
    >();
    const roots: Array<(typeof folders)[0] & { children: typeof folders }> = [];

    // Create map of all folders
    for (const folder of folders) {
      map.set(folder.id, { ...folder, children: [] });
    }

    // Build tree
    for (const folder of folders) {
      const node = map.get(folder.id)!;
      if (folder.parentId && map.has(folder.parentId)) {
        map.get(folder.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
}
