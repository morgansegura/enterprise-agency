import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface EmbedBlockData {
  html: string;
  aspectRatio?: "auto" | "16/9" | "4/3" | "1/1";
}

const aspectRatioClasses = {
  auto: "",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

export default function EmbedBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as EmbedBlockData;
  const { html, aspectRatio = "auto" } = data;

  if (!html) {
    return (
      <div className="flex items-center justify-center bg-muted text-muted-foreground p-8 rounded-md">
        No embed code set
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg",
        aspectRatioClasses[aspectRatio],
        "[&>iframe]:w-full [&>iframe]:h-full",
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
