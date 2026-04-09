import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

interface VideoBlockData {
  url: string;
  provider?: "youtube" | "vimeo" | "native" | "direct";
  aspectRatio?: "16:9" | "4:3" | "1:1" | "21:9";
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  title?: string;
  caption?: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  );
  return match?.[1] || null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] || null;
}

function buildYouTubeUrl(videoId: string, data: VideoBlockData): string {
  const params = new URLSearchParams();
  if (!data.controls) params.set("controls", "0");
  if (data.autoplay) params.set("autoplay", "1");
  if (data.muted) params.set("mute", "1");
  if (data.loop) params.set("loop", "1");
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function buildVimeoUrl(videoId: string, data: VideoBlockData): string {
  const params = new URLSearchParams();
  if (data.autoplay) params.set("autoplay", "1");
  if (data.muted) params.set("muted", "1");
  if (data.loop) params.set("loop", "1");
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

function detectProvider(
  url: string,
): "youtube" | "vimeo" | "native" {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/vimeo\.com/.test(url)) return "vimeo";
  return "native";
}

export default function VideoBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as VideoBlockData;
  const {
    url,
    provider = "native",
    aspectRatio = "16:9",
    controls = true,
    autoplay = false,
    muted = false,
    loop = false,
    caption,
    title = "Video",
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const handleUrlChange = (newUrl: string) => {
    if (!onChange) return;
    onChange({
      ...block,
      data: {
        ...block.data,
        url: newUrl,
        provider: detectProvider(newUrl),
      },
    });
  };

  if (!url) {
    if (isEditing) {
      return (
        <div
          className={`${elementClass} flex flex-col items-center justify-center gap-3 bg-(--el-50) border border-dashed border-(--border-default) text-(--el-500) p-8 rounded-md aspect-video`}
          data-slot="video-block"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-sm font-medium text-(--el-800)">
            Paste a video URL
          </span>
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            className="w-full max-w-md h-9 px-3 text-xs font-mono bg-(--el-0) border border-(--border-default) rounded-md outline-none focus:border-(--accent-primary)"
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value) handleUrlChange(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) handleUrlChange(value);
              }
            }}
          />
          <span className="text-[11px] text-(--el-400)">
            YouTube, Vimeo, or direct video URL — auto-detected
          </span>
        </div>
      );
    }
    return (
      <div
        className={`${elementClass} flex items-center justify-center bg-(--el-100) text-(--el-500) p-8 rounded-md aspect-video`}
        data-slot="video-block"
      >
        No video URL set
      </div>
    );
  }

  // Resolve embed URL for YouTube/Vimeo
  let embedUrl = url;
  let isEmbed = false;

  if (provider === "youtube") {
    const videoId = getYouTubeId(url);
    if (!videoId) {
      return (
        <figure className={elementClass} data-slot="video-block">
          <div
            data-slot="video-block-wrapper"
            data-aspect-ratio={hasStyle("aspectRatio") ? undefined : aspectRatio}
            className="flex items-center justify-center bg-(--el-100) text-(--el-500)"
          >
            Invalid YouTube URL
          </div>
        </figure>
      );
    }
    embedUrl = buildYouTubeUrl(videoId, data);
    isEmbed = true;
  } else if (provider === "vimeo") {
    const videoId = getVimeoId(url);
    if (!videoId) {
      return (
        <figure className={elementClass} data-slot="video-block">
          <div
            data-slot="video-block-wrapper"
            data-aspect-ratio={hasStyle("aspectRatio") ? undefined : aspectRatio}
            className="flex items-center justify-center bg-(--el-100) text-(--el-500)"
          >
            Invalid Vimeo URL
          </div>
        </figure>
      );
    }
    embedUrl = buildVimeoUrl(videoId, data);
    isEmbed = true;
  }

  return (
    <figure className={elementClass} data-slot="video-block">
      <div
        data-slot="video-block-wrapper"
        data-aspect-ratio={hasStyle("aspectRatio") ? undefined : aspectRatio}
      >
        {isEmbed ? (
          <iframe
            data-slot="video-block-iframe"
            src={embedUrl}
            title={caption || title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            data-slot="video-block-video"
            src={url}
            controls={controls}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
          />
        )}
      </div>
      {caption ? (
        <figcaption data-slot="video-block-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
