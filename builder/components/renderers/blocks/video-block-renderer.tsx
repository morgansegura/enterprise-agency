import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

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

export default function VideoBlockRenderer({
  block,
  onChange: _onChange,
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

  if (!url) {
    if (isEditing) {
      return (
        <div
          className="flex flex-col items-center justify-center gap-2 bg-(--el-100) text-(--el-500) p-8 rounded-[3px] aspect-video cursor-pointer hover:bg-(--accent-primary-subtle)/30"
          onClick={() => {
            // Block click-to-select will open settings panel
          }}
        >
          <span className="text-[14px] font-medium text-(--el-800)">
            Click to select, then set URL in Settings
          </span>
          <span className="text-[12px]">
            YouTube, Vimeo, or direct URL via Settings panel
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center bg-(--el-100) text-(--el-500) p-8 rounded-[3px] aspect-video">
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
        <figure data-slot="video-block">
          <div
            data-slot="video-block-wrapper"
            data-aspect-ratio={aspectRatio}
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
        <figure data-slot="video-block">
          <div
            data-slot="video-block-wrapper"
            data-aspect-ratio={aspectRatio}
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
    <figure data-slot="video-block">
      <div data-slot="video-block-wrapper" data-aspect-ratio={aspectRatio}>
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
