/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";
import { ImageIcon, Upload } from "lucide-react";
import { MediaLibraryPicker } from "@/components/ui/media-library/media-library-picker";

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

export default function ImageBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const params = useParams();
  const tenantId = params?.id as string;
  const [pickerOpen, setPickerOpen] = useState(false);

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

  // Edit mode: show media library picker
  if (!src && isEditing) {
    return (
      <>
        <div
          className="flex flex-col items-center justify-center gap-3 py-12 px-8 border-2 border-dashed border-(--border-default) rounded-[3px] cursor-pointer transition-colors duration-100 hover:border-(--accent-primary) hover:bg-(--accent-primary-subtle)/30"
          onClick={() => setPickerOpen(true)}
        >
          <Upload className="size-8 text-(--el-400)" />
          <div className="text-center">
            <p className="text-[14px] font-medium text-(--el-800)">
              Click to add an image
            </p>
            <p className="text-[12px] text-(--el-400)">
              Select from media library or upload
            </p>
          </div>
        </div>
        <MediaLibraryPicker
          tenantId={tenantId}
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          fileType="image"
          onSelect={(asset) => {
            if (onChange) {
              onChange({
                ...block,
                data: {
                  ...block.data,
                  src: asset.url,
                  alt: asset.altText || asset.fileName || "",
                },
              });
            }
            setPickerOpen(false);
          }}
        />
      </>
    );
  }

  if (!src) {
    return (
      <div className="flex items-center justify-center gap-2 bg-(--el-100) text-(--el-500) p-8 rounded-[3px]">
        <ImageIcon className="size-5" />
        <span className="text-[14px]">No image set</span>
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

  // In edit mode, click image to open media picker
  if (isEditing && onChange) {
    return (
      <>
        <figure className="relative group">
          <div
            className="cursor-pointer"
            onClick={() => setPickerOpen(true)}
          >
            {imageElement}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-100 flex items-center justify-center rounded-[3px]">
              <span className="opacity-0 group-hover:opacity-100 text-white text-[14px] font-medium bg-black/60 px-3 py-1.5 rounded-[3px] transition-opacity duration-100">
                Click to change
              </span>
            </div>
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-[14px] text-(--el-500)">
              {caption}
            </figcaption>
          )}
        </figure>
        <MediaLibraryPicker
          tenantId={tenantId}
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          fileType="image"
          currentUrl={src}
          onSelect={(asset) => {
            onChange({
              ...block,
              data: {
                ...block.data,
                src: asset.url,
                alt: asset.altText || asset.fileName || alt,
              },
            });
            setPickerOpen(false);
          }}
        />
      </>
    );
  }

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
        <figcaption className="mt-2 text-center text-[14px] text-(--el-500)">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return content;
}
