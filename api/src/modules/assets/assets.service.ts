import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import {
  AuditLogService,
  AuditAction,
} from "@/common/services/audit-log.service";
import { PaginatedResponse } from "@/common/dto/response.dto";
import { StorageService } from "@/common/services/storage.service";
import { UpdateAssetDto } from "./dto/update-asset.dto";
import * as sharp from "sharp";

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private audit: AuditLogService,
  ) {}

  async upload(
    file: Express.Multer.File,
    tenantId: string,
    uploadedBy: string,
    metadata?: { altText?: string; usageContext?: string },
  ) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    // Validate file type
    if (!this.storage.isValidFileType(file.mimetype)) {
      throw new BadRequestException("Invalid file type");
    }

    // Validate file size (10MB default)
    if (!this.storage.isValidFileSize(file.size)) {
      throw new BadRequestException("File size exceeds maximum allowed (10MB)");
    }

    // Generate unique file key with tenant isolation
    const fileKey = this.storage.generateFileKey(tenantId, file.originalname);

    // Determine file type
    const fileType = this.getFileType(file.mimetype);

    // Process image if it's an image file
    let width: number | undefined;
    let height: number | undefined;
    let thumbnailUrl: string | undefined;
    let variants: Record<string, string> | undefined;

    if (fileType === "image") {
      try {
        const imageMetadata = await sharp(file.buffer).metadata();
        width = imageMetadata.width;
        height = imageMetadata.height;

        // Generate thumbnail
        const thumbnailKey = this.storage.generateFileKey(
          tenantId,
          file.originalname,
          "thumbnails",
        );
        const thumbnailBuffer = await sharp(file.buffer)
          .resize(300, 300, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        const thumbnailResult = await this.storage.upload(
          thumbnailBuffer,
          thumbnailKey,
          "image/jpeg",
        );
        thumbnailUrl = thumbnailResult.url;

        // Generate WebP variant
        try {
          const webpKey = this.storage.generateFileKey(
            tenantId,
            file.originalname.replace(/\.\w+$/, ".webp"),
            "variants",
          );
          const webpBuffer = await sharp(file.buffer)
            .webp({ quality: 80 })
            .toBuffer();
          const webpResult = await this.storage.upload(
            webpBuffer,
            webpKey,
            "image/webp",
          );
          variants = { webp: webpResult.url };
        } catch (webpError) {
          this.logger.warn("Failed to generate WebP variant", webpError);
        }
      } catch (imageError) {
        this.logger.warn("Failed to process image, uploading raw", imageError);
      }
    }

    // Upload file to storage (local or R2)
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
        fileType,
        mimeType: file.mimetype,
        sizeBytes: BigInt(file.size),
        width,
        height,
        url: uploadResult.url,
        thumbnailUrl,
        variants: variants
          ? (variants as unknown as import("@prisma").Prisma.InputJsonValue)
          : undefined,
        altText: metadata?.altText,
        usageContext: metadata?.usageContext,
      },
    });

    this.audit.log({
      tenantId,
      action: AuditAction.UPLOADED,
      resourceType: "asset",
      resourceId: asset.id,
    });

    return asset;
  }

  async list(
    tenantId: string,
    filters?: {
      fileType?: string;
      usageContext?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const where: {
      tenantId: string;
      fileType?: string;
      usageContext?: string;
    } = { tenantId };

    if (filters?.fileType) {
      where.fileType = filters.fileType;
    }

    if (filters?.usageContext) {
      where.usageContext = filters.usageContext;
    }

    const [assets, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.asset.count({ where }),
    ]);

    // Convert BigInt to number for JSON serialization
    const data = assets.map((asset) => ({
      ...asset,
      sizeBytes: asset.sizeBytes ? Number(asset.sizeBytes) : null,
    }));

    return new PaginatedResponse(data, total, page, limit);
  }

  async findById(id: string, tenantId: string) {
    const asset = await this.prisma.asset.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!asset) {
      throw new NotFoundException("Asset not found");
    }

    return {
      ...asset,
      sizeBytes: asset.sizeBytes ? Number(asset.sizeBytes) : null,
    };
  }

  async update(id: string, tenantId: string, updateData: UpdateAssetDto) {
    const asset = await this.prisma.asset.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!asset) {
      throw new NotFoundException("Asset not found");
    }

    const updated = await this.prisma.asset.update({
      where: { id },
      data: updateData,
    });

    this.audit.log({
      tenantId,
      action: AuditAction.UPDATED,
      resourceType: "asset",
      resourceId: updated.id,
    });

    return {
      ...updated,
      sizeBytes: updated.sizeBytes ? Number(updated.sizeBytes) : null,
    };
  }

  async delete(id: string, tenantId: string) {
    const asset = await this.prisma.asset.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!asset) {
      throw new NotFoundException("Asset not found");
    }

    // Delete file from storage
    await this.storage.delete(asset.fileKey);

    // Delete thumbnail if exists
    if (asset.thumbnailUrl) {
      // Extract thumbnail key from URL or reconstruct it
      const thumbnailKey = this.storage.generateFileKey(
        tenantId,
        asset.fileName,
        "thumbnails",
      );
      await this.storage.delete(thumbnailKey).catch(() => {
        // Ignore errors if thumbnail doesn't exist
      });
    }

    // Delete database record
    await this.prisma.asset.delete({
      where: { id },
    });

    this.audit.log({
      tenantId,
      action: AuditAction.DELETED,
      resourceType: "asset",
      resourceId: id,
    });

    return { success: true, id };
  }

  private getFileType(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType === "application/pdf") return "document";
    if (
      mimeType.includes("word") ||
      mimeType.includes("excel") ||
      mimeType.includes("powerpoint") ||
      mimeType.includes("text/")
    ) {
      return "document";
    }
    return "other";
  }
}
