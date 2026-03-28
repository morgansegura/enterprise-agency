import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface AudioBlockData {
  src: string;
  title?: string;
  artist?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

export default function AudioBlockRenderer({ block, onChange, isEditing }: BlockRendererProps) {
  const data = block.data as unknown as AudioBlockData;
  const {
    src,
    title,
    artist,
    controls = true,
    autoplay = false,
    loop = false,
  } = data;

  if (!src) {
    if (isEditing) {
      return (
        <div
          className="flex flex-col items-center justify-center gap-2 bg-(--el-100) text-(--el-500) p-6 rounded-[3px] cursor-pointer hover:bg-(--accent-primary-subtle)/30"
          onClick={() => {
            const url = window.prompt("Audio URL:", "");
            if (url && onChange) {
              onChange({ ...block, data: { ...block.data, src: url } });
            }
          }}
        >
          <span className="text-[14px] font-medium text-(--el-800)">Click to add audio</span>
          <span className="text-[12px]">Enter an audio file URL</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center bg-(--el-100) text-(--el-500) p-4 rounded-[3px]">
        No audio file set
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {(title || artist) && (
        <div className="mb-3">
          {title && <h4 className="font-medium text-[var(--el-800)]">{title}</h4>}
          {artist && <p className="text-sm text-[var(--el-500)]">{artist}</p>}
        </div>
      )}
      <audio
        className="w-full"
        src={src}
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
