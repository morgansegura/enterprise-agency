import { Injectable, Logger } from "@nestjs/common";
import { encode as encodeBlurHash } from "blurhash";
import * as sharp from "sharp";
import * as exifr from "exifr";
import DOMPurify from "isomorphic-dompurify";
import { StorageService } from "./storage.service";

export interface ImageVariant {
  key: string;
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
  format: "jpeg" | "webp" | "avif";
}

export interface ImageVariants {
  thumbnail?: ImageVariant;
  sm?: ImageVariant;
  md?: ImageVariant;
  lg?: ImageVariant;
  xl?: ImageVariant;
  webp?: Record<string, ImageVariant>;
  avif?: Record<string, ImageVariant>;
}

export interface ProcessedImage {
  width: number;
  height: number;
  aspectRatio: string;
  blurHash: string | null;
  dominantColor: string | null;
  palette: string[] | null;
  exif: Record<string, unknown> | null;
  thumbnailUrl: string | null;
  variants: ImageVariants | null;
}

const VARIANT_WIDTHS = {
  sm: 640,
  md: 1024,
  lg: 1600,
  xl: 2400,
} as const;

type VariantKey = keyof typeof VARIANT_WIDTHS;

const JPEG_QUALITY = 82;
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 60;
const THUMB_SIZE = 320;
const BLURHASH_SIZE = 32;

@Injectable()
export class ImageProcessorService {
  private readonly logger = new Logger(ImageProcessorService.name);

  constructor(private storage: StorageService) {}

  async process(
    buffer: Buffer,
    tenantId: string,
    fileName: string,
    mimeType: string,
  ): Promise<ProcessedImage> {
    const result: ProcessedImage = {
      width: 0,
      height: 0,
      aspectRatio: "1:1",
      blurHash: null,
      dominantColor: null,
      palette: null,
      exif: null,
      thumbnailUrl: null,
      variants: null,
    };

    const isSvg = mimeType === "image/svg+xml";

    const metadata = await this.safe("metadata", () =>
      sharp(buffer, { failOn: "none" }).metadata(),
    );
    if (metadata) {
      result.width = metadata.width ?? 0;
      result.height = metadata.height ?? 0;
      result.aspectRatio = this.computeAspectRatio(result.width, result.height);
    }

    if (isSvg) {
      return result;
    }

    const [thumbnail, blurHashValue, stats, exifData, variants] =
      await Promise.all([
        this.generateThumbnail(buffer, tenantId, fileName),
        this.generateBlurHash(buffer),
        this.extractDominantColor(buffer),
        this.extractExif(buffer),
        this.generateVariants(buffer, tenantId, fileName),
      ]);

    result.thumbnailUrl = thumbnail?.url ?? null;
    result.blurHash = blurHashValue;
    result.dominantColor = stats?.dominantColor ?? null;
    result.palette = stats?.palette ?? null;
    result.exif = exifData;
    result.variants = variants;

    if (thumbnail) {
      result.variants = { ...(result.variants ?? {}), thumbnail };
    }

    return result;
  }

  async crop(
    buffer: Buffer,
    box: { x: number; y: number; width: number; height: number },
  ): Promise<Buffer> {
    return sharp(buffer, { failOn: "none" })
      .extract({
        left: Math.max(0, Math.round(box.x)),
        top: Math.max(0, Math.round(box.y)),
        width: Math.max(1, Math.round(box.width)),
        height: Math.max(1, Math.round(box.height)),
      })
      .toBuffer();
  }

  sanitizeSvg(buffer: Buffer): Buffer {
    const input = buffer.toString("utf8");
    const clean = DOMPurify.sanitize(input, {
      USE_PROFILES: { svg: true, svgFilters: true },
      FORBID_TAGS: ["script", "foreignObject"],
      FORBID_ATTR: ["onload", "onerror", "onclick"],
    });
    return Buffer.from(clean, "utf8");
  }

  // --------------------------------------------------------------------------
  // Private — individual processing steps (each isolated from failure)
  // --------------------------------------------------------------------------

  private async generateThumbnail(
    buffer: Buffer,
    tenantId: string,
    fileName: string,
  ): Promise<ImageVariant | undefined> {
    return this.safe("thumbnail", async () => {
      const processed = await sharp(buffer, { failOn: "none" })
        .rotate()
        .resize(THUMB_SIZE, THUMB_SIZE, {
          fit: "cover",
          withoutEnlargement: true,
        })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });

      const jpegName = fileName.replace(/\.[^.]+$/, ".jpg");
      const key = this.storage.generateFileKey(
        tenantId,
        jpegName,
        "thumbnails",
      );
      const upload = await this.storage.upload(
        processed.data,
        key,
        "image/jpeg",
      );

      return {
        key: upload.key,
        url: upload.url,
        width: processed.info.width,
        height: processed.info.height,
        sizeBytes: processed.info.size,
        format: "jpeg" as const,
      };
    });
  }

  private async generateVariants(
    buffer: Buffer,
    tenantId: string,
    fileName: string,
  ): Promise<ImageVariants> {
    const originalMeta = await this.safe("variant-metadata", () =>
      sharp(buffer, { failOn: "none" }).metadata(),
    );
    const originalWidth = originalMeta?.width ?? 0;

    const variants: ImageVariants = { webp: {}, avif: {} };
    const jobs: Promise<void>[] = [];

    for (const key of Object.keys(VARIANT_WIDTHS) as VariantKey[]) {
      const targetWidth = VARIANT_WIDTHS[key];
      if (originalWidth > 0 && targetWidth > originalWidth) continue;

      jobs.push(
        this.generateSizedVariant(buffer, tenantId, fileName, key, targetWidth)
          .then((v) => {
            if (v) variants[key] = v;
          })
          .catch((err) => {
            this.logger.warn(`variant:${key} failed — ${err}`);
          }),
      );

      jobs.push(
        this.generateFormatVariant(
          buffer,
          tenantId,
          fileName,
          key,
          targetWidth,
          "webp",
        )
          .then((v) => {
            if (v && variants.webp) variants.webp[key] = v;
          })
          .catch((err) => {
            this.logger.warn(`variant:${key}:webp failed — ${err}`);
          }),
      );

      jobs.push(
        this.generateFormatVariant(
          buffer,
          tenantId,
          fileName,
          key,
          targetWidth,
          "avif",
        )
          .then((v) => {
            if (v && variants.avif) variants.avif[key] = v;
          })
          .catch((err) => {
            this.logger.warn(`variant:${key}:avif failed — ${err}`);
          }),
      );
    }

    await Promise.all(jobs);
    return variants;
  }

  private async generateSizedVariant(
    buffer: Buffer,
    tenantId: string,
    fileName: string,
    label: VariantKey,
    targetWidth: number,
  ): Promise<ImageVariant | undefined> {
    const processed = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize(targetWidth, null, { withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    // Variant bytes are always JPEG — force .jpg so the file key matches
    // the content type served to the browser.
    const jpegName = fileName.replace(/\.[^.]+$/, ".jpg");
    const key = this.storage.generateFileKey(
      tenantId,
      jpegName,
      `variants/${label}`,
    );
    const upload = await this.storage.upload(processed.data, key, "image/jpeg");

    return {
      key: upload.key,
      url: upload.url,
      width: processed.info.width,
      height: processed.info.height,
      sizeBytes: processed.info.size,
      format: "jpeg",
    };
  }

  private async generateFormatVariant(
    buffer: Buffer,
    tenantId: string,
    fileName: string,
    label: VariantKey,
    targetWidth: number,
    format: "webp" | "avif",
  ): Promise<ImageVariant | undefined> {
    const pipeline = sharp(buffer, { failOn: "none" })
      .rotate()
      .resize(targetWidth, null, { withoutEnlargement: true });

    const encoded =
      format === "webp"
        ? pipeline.webp({ quality: WEBP_QUALITY, effort: 4 })
        : pipeline.avif({ quality: AVIF_QUALITY, effort: 4 });

    const processed = await encoded.toBuffer({ resolveWithObject: true });
    const key = this.storage.generateFileKey(
      tenantId,
      fileName.replace(/\.[^.]+$/, `.${format}`),
      `variants/${label}-${format}`,
    );
    const upload = await this.storage.upload(
      processed.data,
      key,
      format === "webp" ? "image/webp" : "image/avif",
    );

    return {
      key: upload.key,
      url: upload.url,
      width: processed.info.width,
      height: processed.info.height,
      sizeBytes: processed.info.size,
      format,
    };
  }

  private async generateBlurHash(buffer: Buffer): Promise<string | null> {
    return (
      (await this.safe("blurhash", async () => {
        const { data, info } = await sharp(buffer, { failOn: "none" })
          .rotate()
          .resize(BLURHASH_SIZE, BLURHASH_SIZE, { fit: "inside" })
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

        return encodeBlurHash(
          new Uint8ClampedArray(data),
          info.width,
          info.height,
          4,
          4,
        );
      })) ?? null
    );
  }

  private async extractDominantColor(
    buffer: Buffer,
  ): Promise<{ dominantColor: string; palette: string[] } | undefined> {
    return this.safe("dominant-color", async () => {
      const stats = await sharp(buffer, { failOn: "none" }).stats();
      const { r, g, b } = stats.dominant;
      const dominantColor = this.rgbToHex(r, g, b);

      const palette = stats.channels
        .slice(0, 3)
        .map((c) => Math.round(c.mean))
        .reduce<number[][]>((acc, _, i, arr) => {
          if (i === 0) acc.push(arr);
          return acc;
        }, [])
        .map(([pr, pg, pb]) => this.rgbToHex(pr, pg, pb));

      return { dominantColor, palette };
    });
  }

  private async extractExif(
    buffer: Buffer,
  ): Promise<Record<string, unknown> | null> {
    return (
      (await this.safe("exif", async () => {
        const data = await exifr.parse(buffer, {
          gps: false,
          tiff: true,
          exif: true,
          translateKeys: true,
          translateValues: true,
          reviveValues: true,
          sanitize: true,
        });
        if (!data || typeof data !== "object") return null;
        return this.normalizeExif(data as Record<string, unknown>);
      })) ?? null
    );
  }

  private normalizeExif(raw: Record<string, unknown>): Record<string, unknown> {
    const keep = [
      "Make",
      "Model",
      "LensModel",
      "FNumber",
      "ExposureTime",
      "ISO",
      "FocalLength",
      "FocalLengthIn35mmFormat",
      "DateTimeOriginal",
      "Orientation",
      "ColorSpace",
      "WhiteBalance",
      "Flash",
      "ExposureProgram",
      "MeteringMode",
    ];
    const out: Record<string, unknown> = {};
    for (const key of keep) {
      if (raw[key] !== undefined) out[key] = raw[key];
    }
    return out;
  }

  private computeAspectRatio(width: number, height: number): string {
    if (!width || !height) return "1:1";
    const gcd = this.gcd(width, height);
    return `${width / gcd}:${height / gcd}`;
  }

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const hex = (n: number) =>
      Math.max(0, Math.min(255, Math.round(n)))
        .toString(16)
        .padStart(2, "0");
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }

  private async safe<T>(
    label: string,
    fn: () => Promise<T>,
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (err) {
      this.logger.warn(
        `image-processor:${label} failed — ${err instanceof Error ? err.message : String(err)}`,
      );
      return undefined;
    }
  }
}
