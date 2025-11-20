import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import { StorageService } from "@/common/services/storage.service";
import { UpdateAssetDto } from "./dto/update-asset.dto";
import * as sharp from "sharp";

@Injectable()
export class AssetsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async upload(
    file: Express.Multer.File,
    tenantId: string,
    uploadedBy: string,
    metadata?: { altText?: string; usageContext?: string },
  ) {
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

    if (fileType === "image") {
      const imageMetadata = await sharp(file.buffer).metadata();
      width = imageMetadata.width;
      height = imageMetadata.height;

      // Generate thumbnail for images
      const thumbnailKey = this.storage.generateFileKey(
        tenantId,
        file.originalname,
        "thumbnails",
      );
      const thumbnailBuffer = await sharp(file.buffer)
        .resize(300, 300, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();

      const thumbnailResult = await this.storage.upload(
        thumbnailBuffer,
        thumbnailKey,
        "image/jpeg", // Thumbnails always as JPEG for consistency
      );
      thumbnailUrl = thumbnailResult.url;
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
        altText: metadata?.altText,
        usageContext: metadata?.usageContext,
      },
    });

    return asset;
  }

  async list(
    tenantId: string,
    filters?: { fileType?: string; usageContext?: string },
  ) {
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

    const assets = await this.prisma.asset.findMany({
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
    });

    // Convert BigInt to number for JSON serialization
    return assets.map((asset) => ({
      ...asset,
      sizeBytes: asset.sizeBytes ? Number(asset.sizeBytes) : null,
    }));
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
