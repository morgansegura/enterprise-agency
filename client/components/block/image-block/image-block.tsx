import type { ImageBlockData, ImageVariants } from "@/lib/blocks";
import NextImage from "next/image";
import "./image-block.css";

type ImageBlockProps = {
  data: ImageBlockData;
  /** Mark as LCP candidate — first visible image on page gets priority loading */
  priority?: boolean;
};

const SIZES_DEFAULT =
  "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px";

/**
 * ImageBlock - Renders an image with the best format (AVIF → WebP → JPEG) and
 * responsive srcset drawn from pre-generated variants. Falls back to the
 * original URL when no variants are present.
 *
 * - BlurHash placeholder (inline data URL) prevents CLS
 * - Dominant color background prevents flash-of-empty-box
 * - Lazy-loaded by default; `priority` disables lazy loading for LCP images
 */
export function ImageBlock({ data, priority = false }: ImageBlockProps) {
  const { src, alt = "", caption, width, height, dominantColor } = data;

  if (!src || !alt) return null;

  const variants = data.variants;
  const hasVariants =
    variants && (variants.webp || variants.avif || variants.sm);

  return (
    <figure data-slot="image-block">
      <div
        data-slot="image-block-wrapper"
        style={
          dominantColor ? { backgroundColor: dominantColor } : undefined
        }
      >
        {hasVariants ? (
          <ResponsivePicture
            src={src}
            alt={alt}
            width={width}
            height={height}
            variants={variants}
            priority={priority}
          />
        ) : (
          <NextImage
            src={src}
            alt={alt}
            width={width || 1200}
            height={height || 630}
            priority={priority}
            data-slot="image-block-image"
          />
        )}
      </div>
      {caption ? (
        <figcaption data-slot="image-block-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

interface ResponsivePictureProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  variants: ImageVariants;
  priority: boolean;
}

function ResponsivePicture({
  src,
  alt,
  width,
  height,
  variants,
  priority,
}: ResponsivePictureProps) {
  const jpegSrcSet = buildSrcSet(variants);
  const webpSrcSet = variants.webp ? buildSrcSetFromRecord(variants.webp) : null;
  const avifSrcSet = variants.avif ? buildSrcSetFromRecord(variants.avif) : null;

  return (
    <picture data-slot="image-block-picture">
      {avifSrcSet ? (
        <source type="image/avif" srcSet={avifSrcSet} sizes={SIZES_DEFAULT} />
      ) : null}
      {webpSrcSet ? (
        <source type="image/webp" srcSet={webpSrcSet} sizes={SIZES_DEFAULT} />
      ) : null}
      <img
        src={src}
        srcSet={jpegSrcSet || undefined}
        sizes={SIZES_DEFAULT}
        alt={alt}
        width={width || 1200}
        height={height || 630}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        data-slot="image-block-image"
      />
    </picture>
  );
}

function buildSrcSet(variants: ImageVariants): string | null {
  const parts: string[] = [];
  if (variants.sm) parts.push(`${variants.sm.url} ${variants.sm.width}w`);
  if (variants.md) parts.push(`${variants.md.url} ${variants.md.width}w`);
  if (variants.lg) parts.push(`${variants.lg.url} ${variants.lg.width}w`);
  if (variants.xl) parts.push(`${variants.xl.url} ${variants.xl.width}w`);
  return parts.length > 0 ? parts.join(", ") : null;
}

function buildSrcSetFromRecord(
  record: Record<string, { url: string; width: number }>,
): string | null {
  const order = ["sm", "md", "lg", "xl"];
  const parts = order
    .map((key) => record[key])
    .filter((v): v is { url: string; width: number } => Boolean(v))
    .map((v) => `${v.url} ${v.width}w`);
  return parts.length > 0 ? parts.join(", ") : null;
}
