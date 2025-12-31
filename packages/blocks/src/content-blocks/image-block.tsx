import { cn } from "@enterprise/tokens";
import type { BlockRendererProps } from "../types";

interface ImageBlockData {
  src: string;
  alt?: string;
  caption?: string;
  aspectRatio?: "auto" | "1/1" | "4/3" | "16/9" | "21/9";
  objectFit?: "cover" | "contain" | "fill" | "none";
  rounded?: boolean;
  href?: string;
}

const aspectRatioClasses = {
  auto: "",
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
};

const objectFitClasses = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
};

export function ImageBlock({ block }: BlockRendererProps) {
  const data = block.data as unknown as ImageBlockData;
  const {
    src,
    alt = "",
    caption,
    aspectRatio = "auto",
    objectFit = "cover",
    rounded = false,
    href,
  } = data;

  if (!src) {
    return (
      <div className="flex items-center justify-center bg-muted text-muted-foreground p-8 rounded-md">
        No image set
      </div>
    );
  }

  const imageElement = (
    <img
      src={src}
      alt={alt}
      className={cn(
        "w-full",
        aspectRatioClasses[aspectRatio],
        objectFitClasses[objectFit],
        rounded && "rounded-lg",
      )}
    />
  );

  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {imageElement}
    </a>
  ) : (
    imageElement
  );

  if (caption) {
    return (
      <figure>
        {content}
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return content;
}
