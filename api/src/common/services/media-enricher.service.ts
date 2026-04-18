import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/**
 * Walks a page/post content JSON tree and enriches image blocks with
 * variant metadata (variants, blurHash, dominantColor, aspectRatio) by
 * looking up Asset records that match the block's `src` field.
 *
 * This lets us keep stored block data minimal (just `src`) while still
 * delivering fully-optimized <picture> elements to the client.
 */
@Injectable()
export class MediaEnricherService {
  private readonly logger = new Logger(MediaEnricherService.name);

  constructor(private prisma: PrismaService) {}

  async enrich(tenantId: string, content: unknown): Promise<unknown> {
    if (!content || typeof content !== "object") return content;

    const urls = new Set<string>();
    this.collectUrls(content, urls);

    if (urls.size === 0) return content;

    const assets = await this.prisma.asset.findMany({
      where: {
        tenantId,
        fileType: "image",
        url: { in: Array.from(urls) },
      },
      select: {
        url: true,
        width: true,
        height: true,
        aspectRatio: true,
        blurHash: true,
        dominantColor: true,
        focalX: true,
        focalY: true,
        variants: true,
      },
    });

    if (assets.length === 0) return content;

    const byUrl = new Map<string, (typeof assets)[number]>();
    for (const a of assets) byUrl.set(a.url, a);

    return this.applyEnrichment(content, byUrl);
  }

  private collectUrls(node: unknown, acc: Set<string>): void {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const item of node) this.collectUrls(item, acc);
      return;
    }
    if (typeof node !== "object") return;

    const obj = node as Record<string, unknown>;

    if (obj._type === "image-block" && obj.data) {
      const data = obj.data as { src?: string };
      if (typeof data.src === "string" && data.src) acc.add(data.src);
    }

    for (const value of Object.values(obj)) this.collectUrls(value, acc);
  }

  private applyEnrichment(
    node: unknown,
    byUrl: Map<string, AssetMetadata>,
  ): unknown {
    if (!node) return node;
    if (Array.isArray(node)) {
      return node.map((item) => this.applyEnrichment(item, byUrl));
    }
    if (typeof node !== "object") return node;

    const obj = node as Record<string, unknown>;

    if (obj._type === "image-block" && obj.data) {
      const data = obj.data as {
        src?: string;
        width?: number;
        height?: number;
        variants?: unknown;
        blurHash?: string;
        dominantColor?: string;
        aspectRatio?: string;
        focalX?: number;
        focalY?: number;
      };
      const asset = typeof data.src === "string" ? byUrl.get(data.src) : null;
      if (asset) {
        return {
          ...obj,
          data: {
            ...data,
            width: data.width ?? asset.width ?? undefined,
            height: data.height ?? asset.height ?? undefined,
            aspectRatio: data.aspectRatio ?? asset.aspectRatio ?? undefined,
            blurHash: data.blurHash ?? asset.blurHash ?? undefined,
            dominantColor:
              data.dominantColor ?? asset.dominantColor ?? undefined,
            focalX: data.focalX ?? asset.focalX ?? undefined,
            focalY: data.focalY ?? asset.focalY ?? undefined,
            variants: data.variants ?? asset.variants ?? undefined,
          },
        };
      }
    }

    const next: Record<string, unknown> = {};
    let changed = false;
    for (const [key, value] of Object.entries(obj)) {
      const enriched = this.applyEnrichment(value, byUrl);
      if (enriched !== value) changed = true;
      next[key] = enriched;
    }

    return changed ? next : obj;
  }
}

interface AssetMetadata {
  url: string;
  width: number | null;
  height: number | null;
  aspectRatio: string | null;
  blurHash: string | null;
  dominantColor: string | null;
  focalX: number | null;
  focalY: number | null;
  variants: unknown;
}
