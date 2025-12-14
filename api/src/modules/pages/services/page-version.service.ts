import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";

interface CreateVersionOptions {
  pageId: string;
  userId: string;
  changeNote?: string;
}

export interface PageVersionSummary {
  id: string;
  version: number;
  title: string;
  createdAt: Date;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  changeNote: string | null;
}

@Injectable()
export class PageVersionService {
  private readonly logger = new Logger(PageVersionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new version snapshot of a page
   * Called automatically on save
   */
  async createVersion(options: CreateVersionOptions): Promise<void> {
    const { pageId, userId, changeNote } = options;

    // Get the current page content
    const page = await this.prisma.page.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        content: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
      },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    // Get the latest version number for this page
    const latestVersion = await this.prisma.pageVersion.findFirst({
      where: { pageId },
      orderBy: { version: "desc" },
      select: { version: true },
    });

    const nextVersion = (latestVersion?.version || 0) + 1;

    // Create the version snapshot
    await this.prisma.pageVersion.create({
      data: {
        pageId,
        version: nextVersion,
        content: page.content ?? undefined,
        title: page.title,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        createdBy: userId,
        changeNote,
      },
    });

    this.logger.log(`Created version ${nextVersion} for page ${pageId}`);

    // Optionally prune old versions (keep last 50)
    await this.pruneOldVersions(pageId, 50);
  }

  /**
   * List all versions for a page
   */
  async listVersions(
    tenantId: string,
    pageId: string,
  ): Promise<PageVersionSummary[]> {
    // Verify page belongs to tenant
    const page = await this.prisma.page.findFirst({
      where: { id: pageId, tenantId },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    const versions = await this.prisma.pageVersion.findMany({
      where: { pageId },
      orderBy: { version: "desc" },
      select: {
        id: true,
        version: true,
        title: true,
        createdAt: true,
        changeNote: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return versions;
  }

  /**
   * Get a specific version's full content
   */
  async getVersion(tenantId: string, pageId: string, versionId: string) {
    // Verify page belongs to tenant
    const page = await this.prisma.page.findFirst({
      where: { id: pageId, tenantId },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    const version = await this.prisma.pageVersion.findUnique({
      where: { id: versionId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!version || version.pageId !== pageId) {
      throw new NotFoundException("Version not found");
    }

    return version;
  }

  /**
   * Restore a page to a previous version
   */
  async restoreVersion(
    tenantId: string,
    pageId: string,
    versionId: string,
    userId: string,
  ) {
    // Get the version to restore
    const version = await this.getVersion(tenantId, pageId, versionId);

    // Create a new version snapshot before restoring (so current state is preserved)
    await this.createVersion({
      pageId,
      userId,
      changeNote: `Before restoring to version ${version.version}`,
    });

    // Update the page with the version's content
    const restoredPage = await this.prisma.page.update({
      where: { id: pageId },
      data: {
        content: version.content ?? undefined,
        title: version.title,
        metaTitle: version.metaTitle,
        metaDescription: version.metaDescription,
      },
    });

    // Create another version snapshot after restoring
    await this.createVersion({
      pageId,
      userId,
      changeNote: `Restored from version ${version.version}`,
    });

    this.logger.log(
      `Restored page ${pageId} to version ${version.version} by user ${userId}`,
    );

    return restoredPage;
  }

  /**
   * Compare two versions (returns the content of both for client-side diff)
   */
  async compareVersions(
    tenantId: string,
    pageId: string,
    versionIdA: string,
    versionIdB: string,
  ) {
    const [versionA, versionB] = await Promise.all([
      this.getVersion(tenantId, pageId, versionIdA),
      this.getVersion(tenantId, pageId, versionIdB),
    ]);

    return {
      versionA,
      versionB,
    };
  }

  /**
   * Delete old versions to keep storage manageable
   */
  private async pruneOldVersions(
    pageId: string,
    keepCount: number,
  ): Promise<void> {
    const versions = await this.prisma.pageVersion.findMany({
      where: { pageId },
      orderBy: { version: "desc" },
      skip: keepCount,
      select: { id: true },
    });

    if (versions.length > 0) {
      await this.prisma.pageVersion.deleteMany({
        where: {
          id: { in: versions.map((v) => v.id) },
        },
      });

      this.logger.log(
        `Pruned ${versions.length} old versions for page ${pageId}`,
      );
    }
  }
}
