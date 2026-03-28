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

export default function EmbedBlockRenderer({ block, onChange: _onChange, isEditing }: BlockRendererProps) {
  const data = block.data as unknown as EmbedBlockData;
  const { html, aspectRatio = "auto" } = data;

  if (!html) {
    if (isEditing) {
      return (
        <div
          className="flex flex-col items-center justify-center gap-2 bg-(--el-100) text-(--el-500) p-8 rounded-[3px] cursor-pointer hover:bg-(--accent-primary-subtle)/30"
          onClick={() => {
            // Block click-to-select opens settings panel
          }}
        >
          <span className="text-[14px] font-medium text-(--el-800)">Click to select, then set code in Settings</span>
          <span className="text-[12px]">Paste embed code via Settings panel</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center bg-(--el-100) text-(--el-500) p-8 rounded-[3px]">
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
