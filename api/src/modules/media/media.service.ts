import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import { StorageService } from "@/common/services/storage.service";
import * as sharp from "sharp";
import {
  MediaQueryDto,
  UpdateMediaDto,
  MoveMediaDto,
  BulkMoveDto,
  BulkDeleteDto,
  BulkTagDto,
  CropMediaDto,
  UploadMediaDto,
  MediaType,
  MediaSortBy,
} from "./dto";

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  // ============================================================================
  // QUERY OPERATIONS
  // ============================================================================

  /**
   * List media with filters, pagination, and sorting
   */
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

  /**
   * Get a single media item by ID
   */
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
  // UPLOAD OPERATIONS
  // ============================================================================

  /**
   * Upload a file with metadata
   */
  async upload(
    file: Express.Multer.File,
    tenantId: string,
    uploadedBy: string,
    metadata?: UploadMediaDto,
  ) {
    // Validate file
    if (!this.storage.isValidFileType(file.mimetype)) {
      throw new BadRequestException("Invalid file type");
    }

    if (!this.storage.isValidFileSize(file.size)) {
      throw new BadRequestException("File size exceeds maximum allowed");
    }

    const fileKey = this.storage.generateFileKey(tenantId, file.originalname);
    const fileType = this.getFileType(file.mimetype);

    // Process image-specific data
    let width: number | undefined;
    let height: number | undefined;
    let aspectRatio: string | undefined;
    let blurHash: string | undefined;
    let thumbnailUrl: string | undefined;
    let variants: Record<string, string> | undefined;

    if (fileType === "image") {
      const imageData = await this.processImage(file, tenantId);
      width = imageData.width;
      height = imageData.height;
      aspectRatio = imageData.aspectRatio;
      blurHash = imageData.blurHash;
      thumbnailUrl = imageData.thumbnailUrl;
      variants = imageData.variants;
    }

    // Upload original file
    const uploadResult = await this.storage.upload(
      file.buffer,
      fileKey,
      file.mimetype,
    );

    // Create database record
    const asset = await this.prisma.asset.create({
      data: {
        tenantId,
        uploadedBy,
        fileKey: uploadResult.key,
        fileName: file.originalname,
        originalName: file.originalname,
        fileType,
        mimeType: file.mimetype,
        sizeBytes: BigInt(file.size),
        width,
        height,
        aspectRatio,
        blurHash,
        url: uploadResult.url,
        thumbnailUrl,
        variants: variants ? variants : undefined,
        title: metadata?.title,
        altText: metadata?.altText,
        folderId: metadata?.folderId,
        usageContext: metadata?.usageContext,
        status: "ready",
      },
      include: {
        folder: { select: { id: true, name: true, path: true } },
      },
    });

    return this.serializeAsset(asset);
  }

  // ============================================================================
  // UPDATE OPERATIONS
  // ============================================================================

  /**
   * Update media metadata
   */
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
      },
      include: {
        folder: { select: { id: true, name: true, path: true } },
      },
    });

    return this.serializeAsset(updated);
  }

  /**
   * Move media to a folder
   */
  async move(tenantId: string, id: string, dto: MoveMediaDto) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
    });

    if (!asset) {
      throw new NotFoundException("Media not found");
    }

    // Validate folder if provided
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

    return this.serializeAsset(updated);
  }

  /**
   * Crop an image
   */
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

    // Download original image
    const originalBuffer = await this.storage.download(asset.fileKey);

    // Crop image
    const croppedBuffer = await sharp(originalBuffer)
      .extract({
        left: Math.round(dto.x),
        top: Math.round(dto.y),
        width: Math.round(dto.width),
        height: Math.round(dto.height),
      })
      .toBuffer();

    // Generate new file key
    const newFileKey = this.storage.generateFileKey(tenantId, asset.fileName);

    // Upload cropped image
    const uploadResult = await this.storage.upload(
      croppedBuffer,
      newFileKey,
      asset.mimeType || "image/jpeg",
    );

    // Process new image for thumbnail and variants
    const imageData = await this.processImageBuffer(
      croppedBuffer,
      tenantId,
      asset.fileName,
      asset.mimeType || "image/jpeg",
    );

    // Update record
    const updated = await this.prisma.asset.update({
      where: { id },
      data: {
        fileKey: uploadResult.key,
        url: uploadResult.url,
        width: dto.width,
        height: dto.height,
        aspectRatio: dto.aspectRatio || `${dto.width}:${dto.height}`,
        thumbnailUrl: imageData.thumbnailUrl,
        blurHash: imageData.blurHash,
        variants: imageData.variants,
        sizeBytes: BigInt(croppedBuffer.length),
      },
      include: {
        folder: { select: { id: true, name: true, path: true } },
      },
    });

    // Delete old file
    await this.storage.delete(asset.fileKey).catch(() => {});

    return this.serializeAsset(updated);
  }

  // ============================================================================
  // DELETE OPERATIONS
  // ============================================================================

  /**
   * Delete a media item
   */
  async delete(tenantId: string, id: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
    });

    if (!asset) {
      throw new NotFoundException("Media not found");
    }

    // Delete files from storage
    await this.storage.delete(asset.fileKey).catch(() => {});
    if (asset.thumbnailUrl) {
      const thumbnailKey = this.storage.generateFileKey(
        tenantId,
        asset.fileName,
        "thumbnails",
      );
      await this.storage.delete(thumbnailKey).catch(() => {});
    }

    // Delete record
    await this.prisma.asset.delete({ where: { id } });

    return { success: true, id };
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk move media to a folder
   */
  async bulkMove(tenantId: string, dto: BulkMoveDto) {
    // Validate folder if provided
    if (dto.folderId) {
      const folder = await this.prisma.mediaFolder.findFirst({
        where: { id: dto.folderId, tenantId },
      });
      if (!folder) {
        throw new NotFoundException("Folder not found");
      }
    }

    const result = await this.prisma.asset.updateMany({
      where: {
        id: { in: dto.mediaIds },
        tenantId,
      },
      data: { folderId: dto.folderId ?? null },
    });

    return {
      successIds: dto.mediaIds,
      failedIds: [],
      total: result.count,
    };
  }

  /**
   * Bulk delete media
   */
  async bulkDelete(tenantId: string, dto: BulkDeleteDto) {
    const assets = await this.prisma.asset.findMany({
      where: {
        id: { in: dto.ids },
        tenantId,
      },
    });

    const successIds: string[] = [];
    const failedIds: { id: string; error: string }[] = [];

    for (const asset of assets) {
      try {
        await this.storage.delete(asset.fileKey).catch(() => {});
        await this.prisma.asset.delete({ where: { id: asset.id } });
        successIds.push(asset.id);
      } catch (error) {
        failedIds.push({
          id: asset.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return { successIds, failedIds, total: assets.length };
  }

  /**
   * Bulk add tags to media
   */
  async bulkTag(tenantId: string, dto: BulkTagDto) {
    const assets = await this.prisma.asset.findMany({
      where: {
        id: { in: dto.mediaIds },
        tenantId,
      },
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

    return { successIds, failedIds: [], total: assets.length };
  }

  /**
   * Bulk remove tags from media
   */
  async bulkUntag(tenantId: string, dto: BulkTagDto) {
    const assets = await this.prisma.asset.findMany({
      where: {
        id: { in: dto.mediaIds },
        tenantId,
      },
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

    return { successIds, failedIds: [], total: assets.length };
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private getFileType(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "document";
  }

  private async processImage(file: Express.Multer.File, tenantId: string) {
    return this.processImageBuffer(
      file.buffer,
      tenantId,
      file.originalname,
      file.mimetype,
    );
  }

  private async processImageBuffer(
    buffer: Buffer,
    tenantId: string,
    fileName: string,
    mimeType: string,
  ) {
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    // Calculate aspect ratio
    const gcd = this.gcd(width, height);
    const aspectRatio = `${width / gcd}:${height / gcd}`;

    // Generate thumbnail
    const thumbnailKey = this.storage.generateFileKey(
      tenantId,
      fileName,
      "thumbnails",
    );
    const thumbnailBuffer = await sharp(buffer)
      .resize(300, 300, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbnailResult = await this.storage.upload(
      thumbnailBuffer,
      thumbnailKey,
      "image/jpeg",
    );

    // TODO: Generate BlurHash (requires blurhash library)
    // const blurHash = await this.generateBlurHash(buffer);
    const blurHash = undefined;

    // TODO: Generate responsive variants
    // const variants = await this.generateVariants(buffer, tenantId, fileName);
    const variants = undefined;

    return {
      width,
      height,
      aspectRatio,
      blurHash,
      thumbnailUrl: thumbnailResult.url,
      variants,
    };
  }

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
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
