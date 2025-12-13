import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface AudioBlockData {
  src: string;
  title?: string;
  artist?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

export default function AudioBlockRenderer({ block }: BlockRendererProps) {
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
    return (
      <div className="flex items-center justify-center bg-muted text-muted-foreground p-4 rounded-md">
        No audio file set
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {(title || artist) && (
        <div className="mb-3">
          {title && <h4 className="font-medium text-foreground">{title}</h4>}
          {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
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
