import type { ImageBlockData } from "@/lib/blocks";
import Image from "next/image";
import "./image-block.css";

type ImageBlockProps = {
  data: ImageBlockData;
};

/**
 * ImageBlock - Renders images with optional captions
 * Content block (leaf node) - cannot have children
 */
export function ImageBlock({ data }: ImageBlockProps) {
  const { url, alt = "", caption, width, height, objectFit = "cover" } = data;

  return url && alt ? (
    <figure data-slot="image-block">
      <div data-slot="image-block-wrapper" data-object-fit={objectFit}>
        <Image
          src={url}
          alt={alt}
          width={width || 1200}
          height={height || 630}
          data-slot="image-block-image"
        />
      </div>
      {caption ? (
        <figcaption data-slot="image-block-caption">{caption}</figcaption>
      ) : null}
    </figure>
  ) : null;
}
