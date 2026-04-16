import type { ImageBlockData } from "@/lib/blocks";
import Image from "next/image";
import "./image-block.css";

type ImageBlockProps = {
  data: ImageBlockData;
  /** Mark as LCP candidate — first visible image on page gets priority loading */
  priority?: boolean;
};

/**
 * ImageBlock - Renders images with optional captions
 * Content block (leaf node) - cannot have children
 */
export function ImageBlock({ data, priority = false }: ImageBlockProps) {
  const { src, alt = "", caption, width, height } = data;

  if (!src || !alt) return null;

  return (
    <figure data-slot="image-block">
      <div data-slot="image-block-wrapper">
        <Image
          src={src}
          alt={alt}
          width={width || 1200}
          height={height || 630}
          priority={priority}
          data-slot="image-block-image"
        />
      </div>
      {caption ? (
        <figcaption data-slot="image-block-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
