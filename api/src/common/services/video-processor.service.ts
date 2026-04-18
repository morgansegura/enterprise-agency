import { Injectable, Logger } from "@nestjs/common";
import * as ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as crypto from "crypto";
import { StorageService } from "./storage.service";

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export interface ProcessedVideo {
  duration: number | null;
  width: number | null;
  height: number | null;
  aspectRatio: string | null;
  thumbnailUrl: string | null;
  thumbnailKey: string | null;
}

@Injectable()
export class VideoProcessorService {
  private readonly logger = new Logger(VideoProcessorService.name);

  constructor(private storage: StorageService) {}

  async process(
    buffer: Buffer,
    tenantId: string,
    fileName: string,
  ): Promise<ProcessedVideo> {
    const scratchDir = path.join(os.tmpdir(), "ea-media");
    await fs.promises.mkdir(scratchDir, { recursive: true });

    const tmpId = crypto.randomUUID();
    const ext = path.extname(fileName) || ".mp4";
    const inputPath = path.join(scratchDir, `${tmpId}${ext}`);
    const thumbPath = path.join(scratchDir, `${tmpId}.jpg`);

    await fs.promises.writeFile(inputPath, buffer);

    try {
      const metadata = await this.probeMetadata(inputPath);
      await this.extractThumbnail(inputPath, thumbPath);

      let thumbnailUrl: string | null = null;
      let thumbnailKey: string | null = null;

      if (fs.existsSync(thumbPath)) {
        const thumbBuffer = await fs.promises.readFile(thumbPath);
        const key = this.storage.generateFileKey(
          tenantId,
          fileName.replace(/\.[^.]+$/, ".jpg"),
          "thumbnails",
        );
        const upload = await this.storage.upload(
          thumbBuffer,
          key,
          "image/jpeg",
        );
        thumbnailUrl = upload.url;
        thumbnailKey = upload.key;
      }

      return {
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height,
        aspectRatio: metadata.aspectRatio,
        thumbnailUrl,
        thumbnailKey,
      };
    } catch (err) {
      this.logger.warn(
        `video-processor failed — ${err instanceof Error ? err.message : String(err)}`,
      );
      return {
        duration: null,
        width: null,
        height: null,
        aspectRatio: null,
        thumbnailUrl: null,
        thumbnailKey: null,
      };
    } finally {
      await Promise.all([
        fs.promises.unlink(inputPath).catch(() => undefined),
        fs.promises.unlink(thumbPath).catch(() => undefined),
      ]);
    }
  }

  private probeMetadata(inputPath: string): Promise<{
    duration: number | null;
    width: number | null;
    height: number | null;
    aspectRatio: string | null;
  }> {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(inputPath, (err, data) => {
        if (err || !data) {
          return resolve({
            duration: null,
            width: null,
            height: null,
            aspectRatio: null,
          });
        }
        const videoStream = data.streams.find((s) => s.codec_type === "video");
        const duration = data.format?.duration ?? null;
        const width = videoStream?.width ?? null;
        const height = videoStream?.height ?? null;
        const aspectRatio =
          width && height ? this.computeAspectRatio(width, height) : null;

        resolve({
          duration:
            typeof duration === "number"
              ? duration
              : duration
                ? Number(duration)
                : null,
          width,
          height,
          aspectRatio,
        });
      });
    });
  }

  private extractThumbnail(
    inputPath: string,
    thumbPath: string,
  ): Promise<void> {
    return new Promise((resolve) => {
      ffmpeg(inputPath)
        .on("end", () => resolve())
        .on("error", () => resolve())
        .screenshots({
          count: 1,
          timestamps: ["10%"],
          filename: path.basename(thumbPath),
          folder: path.dirname(thumbPath),
          size: "1280x?",
        });
    });
  }

  private computeAspectRatio(width: number, height: number): string {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const d = gcd(width, height);
    return `${width / d}:${height / d}`;
  }
}
