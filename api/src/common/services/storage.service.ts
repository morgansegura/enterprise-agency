import { Injectable } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

export interface UploadResult {
  key: string;
  url: string;
  size: number;
}

export interface StorageOptions {
  generatePublicUrl?: boolean;
  expiresIn?: number; // For presigned URLs
}

/**
 * Storage Service - Abstraction for local and cloud storage
 *
 * Supports:
 * - Local filesystem (development)
 * - Cloudflare R2 (production)
 * - AWS S3 (if needed)
 *
 * Configuration via environment variables:
 * - STORAGE_PROVIDER: 'local' | 'r2' | 's3'
 * - R2_ACCOUNT_ID: Cloudflare account ID
 * - R2_ACCESS_KEY_ID: R2 access key
 * - R2_SECRET_ACCESS_KEY: R2 secret key
 * - R2_BUCKET_NAME: R2 bucket name
 * - R2_PUBLIC_URL: Optional custom domain for public access
 */
@Injectable()
export class StorageService {
  private s3Client: S3Client | null = null;
  private provider: "local" | "r2" | "s3";
  private bucketName: string;
  private publicUrl: string;
  private uploadDir = path.join(process.cwd(), "uploads");

  constructor() {
    this.provider =
      (process.env.STORAGE_PROVIDER as "local" | "r2" | "s3") || "local";
    this.bucketName =
      process.env.R2_BUCKET_NAME || process.env.S3_BUCKET_NAME || "assets";
    this.publicUrl =
      process.env.R2_PUBLIC_URL || process.env.S3_PUBLIC_URL || "";

    if (this.provider === "r2") {
      this.initializeR2();
    } else if (this.provider === "s3") {
      this.initializeS3();
    } else {
      this.ensureLocalUploadDir();
    }
  }

  /**
   * Initialize Cloudflare R2 client
   */
  private initializeR2() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "R2 credentials not configured. Check R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY",
      );
    }

    this.s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Initialize AWS S3 client
   */
  private initializeS3() {
    const accessKeyId =
      process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey =
      process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;
    const region =
      process.env.AWS_REGION || process.env.S3_REGION || "us-east-1";

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("S3 credentials not configured");
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Ensure local upload directory exists
   */
  private ensureLocalUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Generate unique file key with tenant isolation
   */
  generateFileKey(
    tenantId: string,
    originalName: string,
    prefix?: string,
  ): string {
    const ext = path.extname(originalName);
    const uniqueId = crypto.randomUUID();
    const fileName = `${uniqueId}${ext}`;

    if (prefix) {
      return `${tenantId}/${prefix}/${fileName}`;
    }

    return `${tenantId}/${fileName}`;
  }

  /**
   * Upload file to storage
   */
  async upload(
    buffer: Buffer,
    key: string,
    contentType: string,
    options?: StorageOptions,
  ): Promise<UploadResult> {
    if (this.provider === "local") {
      return this.uploadLocal(buffer, key, contentType, options);
    } else {
      return this.uploadCloud(buffer, key, contentType, options);
    }
  }

  /**
   * Upload to local filesystem
   */
  private async uploadLocal(
    buffer: Buffer,
    key: string,
    _contentType: string,
    _options?: StorageOptions,
  ): Promise<UploadResult> {
    this.ensureLocalUploadDir();

    const filePath = path.join(this.uploadDir, key);
    const dirPath = path.dirname(filePath);

    // Create directories if they don't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    await fs.promises.writeFile(filePath, buffer);

    const baseUrl = process.env.API_URL || "http://localhost:4000";
    const url = `${baseUrl}/uploads/${key}`;

    return {
      key,
      url,
      size: buffer.length,
    };
  }

  /**
   * Upload to cloud storage (R2 or S3)
   */
  private async uploadCloud(
    buffer: Buffer,
    key: string,
    contentType: string,
    options?: StorageOptions,
  ): Promise<UploadResult> {
    if (!this.s3Client) {
      throw new Error("Cloud storage client not initialized");
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // Cache control for performance
      CacheControl: "public, max-age=31536000", // 1 year
    });

    await this.s3Client.send(command);

    // Generate public URL
    let url: string;

    if (this.publicUrl) {
      // Use custom domain if configured
      url = `${this.publicUrl}/${key}`;
    } else if (options?.generatePublicUrl === false) {
      // Generate presigned URL
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      url = await getSignedUrl(this.s3Client, getCommand, {
        expiresIn: options?.expiresIn || 3600,
      });
    } else {
      // Default: R2 public bucket URL
      const accountId = process.env.R2_ACCOUNT_ID;
      url = `https://pub-${accountId}.r2.dev/${key}`;
    }

    return {
      key,
      url,
      size: buffer.length,
    };
  }

  /**
   * Delete file from storage
   */
  async delete(key: string): Promise<void> {
    if (this.provider === "local") {
      return this.deleteLocal(key);
    } else {
      return this.deleteCloud(key);
    }
  }

  /**
   * Delete from local filesystem
   */
  private async deleteLocal(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  /**
   * Delete from cloud storage
   */
  private async deleteCloud(key: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error("Cloud storage client not initialized");
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(key: string): string {
    if (this.provider === "local") {
      const baseUrl = process.env.API_URL || "http://localhost:4000";
      return `${baseUrl}/uploads/${key}`;
    }

    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }

    // Default R2 public URL
    const accountId = process.env.R2_ACCOUNT_ID;
    return `https://pub-${accountId}.r2.dev/${key}`;
  }

  /**
   * Generate presigned URL for temporary access
   */
  async getPresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    if (this.provider === "local") {
      // Local files are always accessible
      return this.getPublicUrl(key);
    }

    if (!this.s3Client) {
      throw new Error("Cloud storage client not initialized");
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Get MIME type from file extension
   */
  getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".avif": "image/avif",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".csv": "text/csv",
      ".txt": "text/plain",
      ".zip": "application/zip",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mp3": "audio/mpeg",
    };
    return mimeTypes[ext] || "application/octet-stream";
  }

  /**
   * Validate file type
   */
  isValidFileType(mimeType: string, allowedTypes?: string[]): boolean {
    if (!allowedTypes) {
      // Default allowed types for media library
      allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/avif",
        "image/svg+xml",
        "application/pdf",
        "video/mp4",
        "video/webm",
      ];
    }
    return allowedTypes.includes(mimeType);
  }

  /**
   * Validate file size
   */
  isValidFileSize(size: number, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }
}
