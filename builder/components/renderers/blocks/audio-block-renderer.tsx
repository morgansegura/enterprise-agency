"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { Music } from "lucide-react";
import { MediaLibraryPicker } from "@/components/ui/media-library/media-library-picker";
import { getElementClass } from "@enterprise/tokens";

interface AudioBlockData {
  src?: string;
  url?: string;
  title?: string;
  artist?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

export default function AudioBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const params = useParams();
  const tenantId = params?.id as string;
  const [pickerOpen, setPickerOpen] = useState(false);

  const data = block.data as unknown as AudioBlockData;
  const {
    src,
    url,
    title,
    artist,
    controls = true,
    autoplay = false,
    loop = false,
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const _hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const audioUrl = src || url;

  if (!audioUrl) {
    if (isEditing) {
      return (
        <>
          <div
            className="flex flex-col items-center justify-center gap-2 bg-(--el-100) text-(--el-500) p-6 rounded-[3px] cursor-pointer hover:bg-(--accent-primary-subtle)/30"
            onClick={() => setPickerOpen(true)}
          >
            <Music className="size-6 text-(--el-400)" />
            <span className="text-[14px] font-medium text-(--el-800)">
              Click to add audio
            </span>
            <span className="text-[12px]">Select from media library</span>
          </div>
          <MediaLibraryPicker
            tenantId={tenantId}
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            fileType="audio"
            onSelect={(asset) => {
              if (onChange) {
                onChange({
                  ...block,
                  data: {
                    ...block.data,
                    src: asset.url,
                    title: asset.fileName || title,
                  },
                });
              }
              setPickerOpen(false);
            }}
          />
        </>
      );
    }
    return (
      <div className="flex items-center justify-center bg-(--el-100) text-(--el-500) p-4 rounded-[3px]">
        No audio file set
      </div>
    );
  }

  return (
    <figure className={elementClass} data-slot="audio-block">
      {title || artist ? (
        <div data-slot="audio-block-meta">
          {title ? (
            <div data-slot="audio-block-title">{title}</div>
          ) : null}
          {artist ? (
            <div data-slot="audio-block-artist">{artist}</div>
          ) : null}
        </div>
      ) : null}
      <audio
        data-slot="audio-block-player"
        src={audioUrl}
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
      />
    </figure>
  );
}
