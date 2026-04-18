import {
  Injectable,
  NotFoundException,
  BadRequestException,
  PayloadTooLargeException,
  Logger,
} from "@nestjs/common";
import * as crypto from "crypto";
import { PrismaService } from "@/common/services/prisma.service";
import {
  AuditLogService,
  AuditAction,
} from "@/common/services/audit-log.service";
import { StorageService } from "@/common/services/storage.service";
import { Prisma } from "@prisma";
import {
  ImageProcessorService,
  ImageVariants,
} from "@/common/services/image-processor.service";
import { VideoProcessorService } from "@/common/services/video-processor.service";
import {
  MediaQueryDto,
  UpdateMediaDto,
  MoveMediaDto,
  BulkMoveDto,
  BulkDeleteDto,
  BulkTagDto,
  CropMediaDto,
  UploadMediaDto,
  MediaSortBy,
} from "./dto";

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private imageProcessor: ImageProcessorService,
    private videoProcessor: VideoProcessorService,
    private audit: AuditLogService,
  ) {}

  // ============================================================================
  // QUERY OPERATIONS
  // ============================================================================

  async list(tenantId: string, query: MediaQueryDto) {
    const {
      type,
      folderId,
      search,
      tags,
      sortBy = MediaSortBy.CREATED_AT,
      sortOrder = "desc",
      page = 1,
      pageSize = 50,
    } = query;

    const where: Record<string, unknown> = { tenantId };

    if (type) {
      where.fileType = type.toLowerCase();
    }

    if (folderId !== undefined) {
      where.folderId = folderId || null;
    }

    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
        { caption: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const [items, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        include: {
          folder: { select: { id: true, name: true, path: true } },
          uploader: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.asset.count({ where }),
    ]);

    return {
      items: items.map(this.serializeAsset),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(tenantId: string, id: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
      include: {
        folder: { select: { id: true, name: true, path: true } },
        uploader: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!asset) {
      throw new NotFoundException("Media not found");
    }

    return this.serializeAsset(asset);
  }

  // ============================================================================
  // UPLOAD
  // ============================================================================

  async upload(
    file: Express.Multer.File,
    tenantId: string,
    uploadedBy: string,
    metadata?: UploadMediaDto,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException("No file provided");
    }

    if (!this.storage.isValidFileType(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);
    }

    if (!this.storage.isValidFileSize(file.size)) {
      throw new PayloadTooLargeException(
        `File exceeds maximum size (${this.storage.getMaxSizeMB()}MB)`,
      );
    }

    let buffer = file.buffer;
    const mimeType = file.mimetype;
    let sizeBytes = file.size;

    // Sanitize SVGs before storing — strips <script>, event handlers, etc.
    if (mimeType === "image/svg+xml") {
      buffer = this.imageProcessor.sanitizeSvg(buffer);
      sizeBytes = buffer.length;
    }

    // Content hash for dedup (sha256 of sanitized bytes)
    const contentHash = crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex");

    const existing = await this.prisma.asset.findFirst({
      where: { tenantId, contentHash },
      include: {
        folder: { select: { id: true, name: true, path: true } },
      },
    });
    if (existing) {
      return this.serializeAsset(existing);
    }

    await this.assertQuota(tenantId, sizeBytes);

    const fileType = this.getFileType(mimeType);
    const fileKey = this.storage.generateFileKey(tenantId, file.originalname);

    const uploadResult = await this.storage.upload(buffer, fileKey, mimeType);

    let width: number | undefined;
    let height: number | undefined;
    let aspectRatio: string | undefined;
    let duration: number | undefined;
    let blurHash: string | null = null;
    let dominantColor: string | null = null;
    let palette: string[] | null = null;
    let exifData: Record<string, unknown> | null = null;
    let thumbnailUrl: string | null = null;
    let variants: ImageVariants | null = null;
    let status = "ready";
    let processingError: string | null = null;

    if (fileType === "image") {
      try {
        const processed = await this.imageProcessor.process(
          buffer,
          tenantId,
          file.originalname,
          mimeType,
        );
        width = processed.width || undefined;
        height = processed.height || undefined;
        aspectRatio = processed.aspectRatio;
        blurHash = processed.blurHash;
        dominantColor = processed.dominantColor;
        palette = processed.palette;
        exifData = processed.exif;
        thumbnailUrl = processed.thumbnailUrl;
        variants = processed.variants;
      } catch (err) {
        this.logger.error(
          `Image processing failed for ${file.originalname} — ${err instanceof Error ? err.message : String(err)}`,
        );
        status = "error";
        processingError =
          err instanceof Error ? err.message : "Unknown processing error";
      }
    } else if (fileType === "video") {
      const processed = await this.videoProcessor.process(
        buffer,
        tenantId,
        file.originalname,
      );
      width = processed.width ?? undefined;
      height = processed.height ?? undefined;
      aspectRatio = processed.aspectRatio ?? undefined;
      duration = processed.duration ?? undefined;
      thumbnailUrl = processed.thumbnailUrl;
    }

    const asset = await this.prisma.$transaction(async (tx) => {
      const created = await tx.asset.create({
        data: {
          tenantId,
          uploadedBy,
          fileKey: uploadResult.key,
          fileName: file.originalname,
          originalName: file.originalname,
          fileType,
          mimeType,
          sizeBytes: BigInt(sizeBytes),
          contentHash,
          storageProvider: this.storage.getProvider(),
          width,
          height,
          aspectRatio,
          duration,
          blurHash,
          dominantColor,
          palette: (palette ?? undefined) as Prisma.InputJsonValue | undefined,
          exif: (exifData ?? undefined) as Prisma.InputJsonValue | undefined,
          url: uploadResult.url,
          thumbnailUrl,
          variants: (variants ?? undefined) as
            | Prisma.InputJsonValue
            | undefined,
          title: metadata?.title,
          altText: metadata?.altText,
          folderId: metadata?.folderId,
          usageContext: metadata?.usageContext,
          status,
          processingError,
        },
        include: {
          folder: { select: { id: true, name: true, path: true } },
        },
      });

      await tx.tenant.update({
        where: { id: tenantId },
        data: { storageUsedBytes: { increment: BigInt(sizeBytes) } },
      });

      return created;
    });

    this.audit.log({
      tenantId,
      action: AuditAction.UPLOADED,
      resourceType: "asset",
      resourceId: asset.id,
    });

    return this.serializeAsset(asset);
  }

  // ============================================================================
  // UPDATE
  // ============================================================================

  async update(tenantId: string, id: string, dto: UpdateMediaDto) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
    });

    if (!asset) {
      throw new NotFoundException("Media not found");
    }

    const updated = await this.prisma.asset.update({
      where: { id },
      data: {
        title: dto.title,
        altText: dto.altText,
        caption: dto.caption,
        tags: dto.tags,
        usageContext: dto.usageContext,
        focalX: dto.focalX,
        focalY: dto.focalY,
      },
      include: {
        folder: { select: { id: true, name: true, path: true } },
      },
    });

    this.audit.log({
      tenantId,
      action: AuditAction.UPDATED,
      resourceType: "asset",
      resourceId: updated.id,
    });

    return this.serializeAsset(updated);
  }

  async move(tenantId: string, id: string, dto: MoveMediaDto) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
    });

    if (!asset) {
      throw new NotFoundException("Media not found");
    }

    if (dto.folderId) {
      const folder = await this.prisma.mediaFolder.findFirst({
        where: { id: dto.folderId, tenantId },
      });
      if (!folder) {
        throw new NotFoundException("Folder not found");
      }
    }

    const updated = await this.prisma.asset.update({
      where: { id },
      data: { folderId: dto.folderId ?? null },
      include: {
        folder: { select: { id: true, name: true, path: true } },
      },
    });

    this.audit.log({
      tenantId,
      action: AuditAction.UPDATED,
      resourceType: "asset",
      resourceId: updated.id,
    });

    return this.serializeAsset(updated);
  }

  async crop(tenantId: string, id: string, dto: CropMediaDto) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
    });

    if (!asset) {
      throw new NotFoundException("Media not found");
    }

    if (asset.fileType !== "image") {
      throw new BadRequestException("Only images can be cropped");
    }

    const originalBuffer = await this.storage.download(asset.fileKey);
    const croppedBuffer = await this.imageProcessor.crop(originalBuffer, {
      x: dto.x,
      y: dto.y,
      width: dto.width,
      height: dto.height,
    });

    const newFileKey = this.storage.generateFileKey(tenantId, asset.fileName);
    const uploadResult = await this.storage.upload(
      croppedBuffer,
      newFileKey,
      asset.mimeType || "image/jpeg",
    );

    const processed = await this.imageProcessor.process(
      croppedBuffer,
      tenantId,
      asset.fileName,
      asset.mimeType || "image/jpeg",
    );

    const updated = await this.prisma.$transaction(async (tx) => {
      const sizeDelta =
        BigInt(croppedBuffer.length) - (asset.sizeBytes ?? BigInt(0));

      const next = await tx.asset.update({
        where: { id },
        data: {
          fileKey: uploadResult.key,
          url: uploadResult.url,
          width: dto.width,
          height: dto.height,
          aspectRatio: dto.aspectRatio || `${dto.width}:${dto.height}`,
          thumbnailUrl: processed.thumbnailUrl,
          blurHash: processed.blurHash,
          dominantColor: processed.dominantColor,
          palette: (processed.palette ?? undefined) as
            | Prisma.InputJsonValue
            | undefined,
          variants: (processed.variants ?? undefined) as
            | Prisma.InputJsonValue
            | undefined,
          sizeBytes: BigInt(croppedBuffer.length),
        },
        include: {
          folder: { select: { id: true, name: true, path: true } },
        },
      });

      await tx.tenant.update({
        where: { id: tenantId },
        data: { storageUsedBytes: { increment: sizeDelta } },
      });

      return next;
    });

    await this.storage.delete(asset.fileKey).catch(() => undefined);

    this.audit.log({
      tenantId,
      action: AuditAction.UPDATED,
      resourceType: "asset",
      resourceId: updated.id,
    });

    return this.serializeAsset(updated);
  }

  // ============================================================================
  // DELETE
  // ============================================================================

  async delete(tenantId: string, id: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
    });

    if (!asset) {
      throw new NotFoundException("Media not found");
    }

    await this.deleteAssetFiles(asset);

    await this.prisma.$transaction(async (tx) => {
      await tx.asset.delete({ where: { id } });
      if (asset.sizeBytes) {
        await tx.tenant.update({
          where: { id: tenantId },
          data: { storageUsedBytes: { decrement: asset.sizeBytes } },
        });
      }
    });

    this.audit.log({
      tenantId,
      action: AuditAction.DELETED,
      resourceType: "asset",
      resourceId: id,
    });

    return { success: true, id };
  }

  // ============================================================================
  // BULK
  // ============================================================================

  async bulkMove(tenantId: string, dto: BulkMoveDto) {
    if (dto.folderId) {
      const folder = await this.prisma.mediaFolder.findFirst({
        where: { id: dto.folderId, tenantId },
      });
      if (!folder) {
        throw new NotFoundException("Folder not found");
      }
    }

    const result = await this.prisma.asset.updateMany({
      where: { id: { in: dto.mediaIds }, tenantId },
      data: { folderId: dto.folderId ?? null },
    });

    this.audit.log({
      tenantId,
      action: AuditAction.BULK_MOVED,
      resourceType: "asset",
      metadata: { mediaIds: dto.mediaIds, folderId: dto.folderId },
    });

    return {
      successIds: dto.mediaIds,
      failedIds: [],
      total: result.count,
    };
  }

  async bulkDelete(tenantId: string, dto: BulkDeleteDto) {
    const assets = await this.prisma.asset.findMany({
      where: { id: { in: dto.ids }, tenantId },
    });

    const successIds: string[] = [];
    const failedIds: { id: string; error: string }[] = [];
    let freedBytes = BigInt(0);

    for (const asset of assets) {
      try {
        await this.deleteAssetFiles(asset);
        await this.prisma.asset.delete({ where: { id: asset.id } });
        if (asset.sizeBytes) freedBytes += asset.sizeBytes;
        successIds.push(asset.id);
      } catch (err) {
        failedIds.push({
          id: asset.id,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    if (freedBytes > BigInt(0)) {
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { storageUsedBytes: { decrement: freedBytes } },
      });
    }

    this.audit.log({
      tenantId,
      action: AuditAction.BULK_DELETED,
      resourceType: "asset",
      metadata: { successIds, failedIds: failedIds.map((f) => f.id) },
    });

    return { successIds, failedIds, total: assets.length };
  }

  async bulkTag(tenantId: string, dto: BulkTagDto) {
    const assets = await this.prisma.asset.findMany({
      where: { id: { in: dto.mediaIds }, tenantId },
    });

    const successIds: string[] = [];

    for (const asset of assets) {
      const existingTags = asset.tags || [];
      const newTags = [...new Set([...existingTags, ...dto.tags])];
      await this.prisma.asset.update({
        where: { id: asset.id },
        data: { tags: newTags },
      });
      successIds.push(asset.id);
    }

    this.audit.log({
      tenantId,
      action: AuditAction.UPDATED,
      resourceType: "asset",
      metadata: { operation: "bulkTag", mediaIds: successIds, tags: dto.tags },
    });

    return { successIds, failedIds: [], total: assets.length };
  }

  async bulkUntag(tenantId: string, dto: BulkTagDto) {
    const assets = await this.prisma.asset.findMany({
      where: { id: { in: dto.mediaIds }, tenantId },
    });

    const successIds: string[] = [];

    for (const asset of assets) {
      const existingTags = asset.tags || [];
      const newTags = existingTags.filter((t) => !dto.tags.includes(t));
      await this.prisma.asset.update({
        where: { id: asset.id },
        data: { tags: newTags },
      });
      successIds.push(asset.id);
    }

    this.audit.log({
      tenantId,
      action: AuditAction.UPDATED,
      resourceType: "asset",
      metadata: {
        operation: "bulkUntag",
        mediaIds: successIds,
        tags: dto.tags,
      },
    });

    return { successIds, failedIds: [], total: assets.length };
  }

  // ============================================================================
  // PRESIGNED UPLOADS (direct-to-cloud for large files)
  // ============================================================================

  /**
   * Step 1: Reserve an asset record and return a presigned PUT URL.
   * The client then uploads the file directly to R2/S3, then calls finalize.
   */
  async presign(
    tenantId: string,
    uploadedBy: string,
    input: {
      fileName: string;
      mimeType: string;
      fileSize: number;
      folderId?: string;
    },
  ) {
    if (!this.storage.supportsPresignedUploads()) {
      throw new BadRequestException(
        "Presigned uploads are not supported for local storage",
      );
    }
    if (!this.storage.isValidFileType(input.mimeType)) {
      throw new BadRequestException(`Unsupported file type: ${input.mimeType}`);
    }
    if (!this.storage.isValidFileSize(input.fileSize)) {
      throw new PayloadTooLargeException(
        `File exceeds maximum size (${this.storage.getMaxSizeMB()}MB)`,
      );
    }

    await this.assertQuota(tenantId, input.fileSize);

    const fileType = this.getFileType(input.mimeType);
    const fileKey = this.storage.generateFileKey(tenantId, input.fileName);
    const uploadUrl = await this.storage.getPresignedUploadUrl(
      fileKey,
      input.mimeType,
    );

    const asset = await this.prisma.asset.create({
      data: {
        tenantId,
        uploadedBy,
        fileKey,
        fileName: input.fileName,
        originalName: input.fileName,
        fileType,
        mimeType: input.mimeType,
        sizeBytes: BigInt(input.fileSize),
        storageProvider: this.storage.getProvider(),
        url: this.storage.getPublicUrl(fileKey),
        folderId: input.folderId,
        status: "processing",
      },
    });

    return {
      assetId: asset.id,
      uploadUrl,
      fileKey,
      expiresIn: 600,
    };
  }

  /**
   * Step 2: Client confirms the upload completed. Download from storage,
   * run processing, update the asset to ready.
   */
  async finalize(tenantId: string, assetId: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id: assetId, tenantId, status: "processing" },
    });
    if (!asset) {
      throw new NotFoundException("Pending asset not found");
    }

    let buffer: Buffer;
    try {
      buffer = await this.storage.download(asset.fileKey);
    } catch (err) {
      this.logger.error(
        `finalize: download failed for ${asset.fileKey} — ${err instanceof Error ? err.message : String(err)}`,
      );
      await this.prisma.asset.update({
        where: { id: asset.id },
        data: {
          status: "error",
          processingError: "Upload was never completed",
        },
      });
      throw new BadRequestException("Upload not found in storage");
    }

    const contentHash = crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex");
    const sizeBytes = buffer.length;

    const duplicate = await this.prisma.asset.findFirst({
      where: {
        tenantId,
        contentHash,
        id: { not: asset.id },
      },
      include: {
        folder: { select: { id: true, name: true, path: true } },
      },
    });
    if (duplicate) {
      await this.storage.delete(asset.fileKey).catch(() => undefined);
      await this.prisma.asset.delete({ where: { id: asset.id } });
      return this.serializeAsset(duplicate);
    }

    let width: number | undefined;
    let height: number | undefined;
    let aspectRatio: string | undefined;
    let duration: number | undefined;
    let blurHash: string | null = null;
    let dominantColor: string | null = null;
    let palette: string[] | null = null;
    let exifData: Record<string, unknown> | null = null;
    let thumbnailUrl: string | null = null;
    let variants: ImageVariants | null = null;
    let status = "ready";
    let processingError: string | null = null;

    if (asset.fileType === "image") {
      try {
        const processed = await this.imageProcessor.process(
          buffer,
          tenantId,
          asset.fileName,
          asset.mimeType || "image/jpeg",
        );
        width = processed.width || undefined;
        height = processed.height || undefined;
        aspectRatio = processed.aspectRatio;
        blurHash = processed.blurHash;
        dominantColor = processed.dominantColor;
        palette = processed.palette;
        exifData = processed.exif;
        thumbnailUrl = processed.thumbnailUrl;
        variants = processed.variants;
      } catch (err) {
        status = "error";
        processingError =
          err instanceof Error ? err.message : "Unknown processing error";
      }
    } else if (asset.fileType === "video") {
      const processed = await this.videoProcessor.process(
        buffer,
        tenantId,
        asset.fileName,
      );
      width = processed.width ?? undefined;
      height = processed.height ?? undefined;
      aspectRatio = processed.aspectRatio ?? undefined;
      duration = processed.duration ?? undefined;
      thumbnailUrl = processed.thumbnailUrl;
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.asset.update({
        where: { id: asset.id },
        data: {
          sizeBytes: BigInt(sizeBytes),
          contentHash,
          width,
          height,
          aspectRatio,
          duration,
          blurHash,
          dominantColor,
          palette: (palette ?? undefined) as Prisma.InputJsonValue | undefined,
          exif: (exifData ?? undefined) as Prisma.InputJsonValue | undefined,
          thumbnailUrl,
          variants: (variants ?? undefined) as
            | Prisma.InputJsonValue
            | undefined,
          status,
          processingError,
        },
        include: {
          folder: { select: { id: true, name: true, path: true } },
        },
      });

      await tx.tenant.update({
        where: { id: tenantId },
        data: {
          storageUsedBytes: {
            increment: BigInt(sizeBytes) - (asset.sizeBytes ?? BigInt(0)),
          },
        },
      });

      return next;
    });

    this.audit.log({
      tenantId,
      action: AuditAction.UPLOADED,
      resourceType: "asset",
      resourceId: updated.id,
    });

    return this.serializeAsset(updated);
  }

  // ============================================================================
  // STORAGE DASHBOARD QUERIES
  // ============================================================================

  /**
   * Top-N largest assets for storage insight.
   */
  async getLargestAssets(tenantId: string, limit = 20) {
    const assets = await this.prisma.asset.findMany({
      where: { tenantId },
      orderBy: { sizeBytes: "desc" },
      take: limit,
      select: {
        id: true,
        fileName: true,
        fileType: true,
        mimeType: true,
        sizeBytes: true,
        url: true,
        thumbnailUrl: true,
        width: true,
        height: true,
        createdAt: true,
      },
    });
    return assets.map((a) => ({
      ...a,
      sizeBytes: a.sizeBytes ? Number(a.sizeBytes) : null,
    }));
  }

  /**
   * Assets not referenced by any page/post content — candidates for cleanup.
   */
  async getOrphanAssets(tenantId: string, limit = 100) {
    const assets = await this.prisma.asset.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        mimeType: true,
        sizeBytes: true,
        url: true,
        thumbnailUrl: true,
        fileKey: true,
        createdAt: true,
      },
    });

    if (assets.length === 0) return [];

    const urls = assets.flatMap((a) =>
      [a.url, a.fileKey, a.thumbnailUrl].filter((v): v is string => Boolean(v)),
    );

    if (urls.length === 0) return [];

    const likeClauses = urls
      .map((_, i) => `content::text ILIKE $${i + 2}`)
      .join(" OR ");

    const referencedUrlRows = await this.prisma
      .$queryRawUnsafe<Array<{ url: string }>>(
        `SELECT DISTINCT match.url FROM (
         SELECT unnest(ARRAY[${urls.map((_, i) => `$${i + 2}`).join(",")}]) AS url
       ) match
       WHERE EXISTS (
         SELECT 1 FROM pages WHERE tenant_id = $1 AND (${likeClauses})
       )`,
        tenantId,
        ...urls.map((u) => `%${u}%`),
      )
      .catch(() => []);

    const referenced = new Set<string>(
      referencedUrlRows.map((r) => r.url).filter(Boolean),
    );

    const orphans = assets.filter(
      (a) => !referenced.has(a.url) && !referenced.has(a.fileKey),
    );

    return orphans.slice(0, limit).map((a) => ({
      ...a,
      sizeBytes: a.sizeBytes ? Number(a.sizeBytes) : null,
    }));
  }

  // ============================================================================
  // USAGE REFERENCES
  // ============================================================================

  /**
   * Find pages and posts that reference this asset by URL or fileKey.
   * Uses a text cast + ILIKE scan against JSONB content columns — acceptable
   * for a detail-drawer lookup; a dedicated reference table would be needed
   * for high-frequency queries.
   */
  async findReferences(tenantId: string, id: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
      select: { url: true, fileKey: true, thumbnailUrl: true },
    });
    if (!asset) throw new NotFoundException("Media not found");

    const needles = [asset.url, asset.fileKey, asset.thumbnailUrl].filter(
      (v): v is string => Boolean(v),
    );

    if (needles.length === 0) {
      return { pages: [], posts: [] };
    }

    const likeClauses = needles
      .map((_, i) => `content::text ILIKE $${i + 2}`)
      .join(" OR ");

    const pages = await this.prisma.$queryRawUnsafe<
      Array<{ id: string; slug: string; title: string; status: string }>
    >(
      `SELECT id, slug, title, status FROM pages WHERE tenant_id = $1 AND (${likeClauses}) LIMIT 50`,
      tenantId,
      ...needles.map((n) => `%${n}%`),
    );

    const postLikeClauses = needles
      .map((_, i) => `content::text ILIKE $${i + 2}`)
      .join(" OR ");

    const posts = await this.prisma.$queryRawUnsafe<
      Array<{ id: string; slug: string; title: string; status: string }>
    >(
      `SELECT id, slug, title, status FROM posts WHERE tenant_id = $1 AND (${postLikeClauses}) LIMIT 50`,
      tenantId,
      ...needles.map((n) => `%${n}%`),
    );

    return { pages, posts };
  }

  // ============================================================================
  // QUOTA / USAGE
  // ============================================================================

  async getUsage(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { storageQuotaBytes: true, storageUsedBytes: true },
    });
    if (!tenant) throw new NotFoundException("Tenant not found");

    const [imageCount, videoCount, documentCount, audioCount] =
      await Promise.all([
        this.prisma.asset.count({
          where: { tenantId, fileType: "image" },
        }),
        this.prisma.asset.count({
          where: { tenantId, fileType: "video" },
        }),
        this.prisma.asset.count({
          where: { tenantId, fileType: "document" },
        }),
        this.prisma.asset.count({
          where: { tenantId, fileType: "audio" },
        }),
      ]);

    return {
      quotaBytes: Number(tenant.storageQuotaBytes),
      usedBytes: Number(tenant.storageUsedBytes),
      unlimited: tenant.storageQuotaBytes === BigInt(0),
      counts: {
        images: imageCount,
        videos: videoCount,
        documents: documentCount,
        audio: audioCount,
        total: imageCount + videoCount + documentCount + audioCount,
      },
    };
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private async assertQuota(tenantId: string, addBytes: number) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { storageQuotaBytes: true, storageUsedBytes: true },
    });
    if (!tenant) throw new NotFoundException("Tenant not found");

    if (tenant.storageQuotaBytes === BigInt(0)) return;

    const next = tenant.storageUsedBytes + BigInt(addBytes);
    if (next > tenant.storageQuotaBytes) {
      throw new PayloadTooLargeException(
        "Storage quota exceeded for this tenant",
      );
    }
  }

  private async deleteAssetFiles(asset: {
    fileKey: string;
    thumbnailUrl: string | null;
    variants: unknown;
  }) {
    await this.storage.delete(asset.fileKey).catch(() => undefined);

    const variants = asset.variants as ImageVariants | null;
    if (!variants) return;

    const keys = this.collectVariantKeys(variants);
    await Promise.all(
      keys.map((k) => this.storage.delete(k).catch(() => undefined)),
    );
  }

  private collectVariantKeys(variants: ImageVariants): string[] {
    const keys: string[] = [];
    const push = (v?: { key?: string }) => {
      if (v?.key) keys.push(v.key);
    };

    push(variants.thumbnail);
    push(variants.sm);
    push(variants.md);
    push(variants.lg);
    push(variants.xl);
    for (const v of Object.values(variants.webp ?? {})) push(v);
    for (const v of Object.values(variants.avif ?? {})) push(v);
    return keys;
  }

  private getFileType(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "document";
  }

  private serializeAsset(asset: {
    sizeBytes?: bigint | null;
    [key: string]: unknown;
  }) {
    return {
      ...asset,
      sizeBytes: asset.sizeBytes ? Number(asset.sizeBytes) : null,
    };
  }
}
