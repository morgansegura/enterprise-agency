import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

export class FileStorageUtil {
  private static uploadDir = path.join(process.cwd(), "uploads");

  /**
   * Ensure upload directory exists
   */
  static ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Generate unique filename
   */
  static generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const uniqueId = crypto.randomUUID();
    return `${uniqueId}${ext}`;
  }

  /**
   * Save file to local storage
   * Returns the file key (relative path)
   */
  static async saveFile(
    buffer: Buffer,
    fileName: string,
    tenantId: string,
  ): Promise<string> {
    this.ensureUploadDir();

    // Create tenant-specific subdirectory
    const tenantDir = path.join(this.uploadDir, tenantId);
    if (!fs.existsSync(tenantDir)) {
      fs.mkdirSync(tenantDir, { recursive: true });
    }

    const filePath = path.join(tenantDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    // Return relative path as file key
    return `${tenantId}/${fileName}`;
  }

  /**
   * Delete file from storage
   */
  static async deleteFile(fileKey: string): Promise<void> {
    const filePath = path.join(this.uploadDir, fileKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  /**
   * Get full URL for a file
   */
  static getFileUrl(fileKey: string): string {
    // For local development, return localhost URL
    // In production, this would be CloudFlare R2 or S3 URL
    const baseUrl = process.env.API_URL || "http://localhost:4000";
    return `${baseUrl}/uploads/${fileKey}`;
  }

  /**
   * Get MIME type from extension
   */
  static getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".zip": "application/zip",
    };
    return mimeTypes[ext] || "application/octet-stream";
  }

  /**
   * Validate file type
   */
  static isValidFileType(mimeType: string, allowedTypes?: string[]): boolean {
    if (!allowedTypes) {
      // Default allowed types
      allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "application/pdf",
      ];
    }
    return allowedTypes.includes(mimeType);
  }

  /**
   * Validate file size
   */
  static isValidFileSize(size: number, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }
}
