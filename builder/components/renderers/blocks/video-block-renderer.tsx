import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface VideoBlockData {
  url: string;
  provider?: "youtube" | "vimeo" | "direct";
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9";
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  title?: string;
}

const aspectRatioClasses = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
};

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

export default function VideoBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as VideoBlockData;
  const {
    url,
    provider = "youtube",
    aspectRatio = "16/9",
    controls = true,
    autoplay = false,
    muted = false,
    loop = false,
    title = "Video",
  } = data;

  if (!url) {
    return (
      <div className="flex items-center justify-center bg-muted text-muted-foreground p-8 rounded-md aspect-video">
        No video URL set
      </div>
    );
  }

  const containerClass = cn(
    "w-full overflow-hidden rounded-lg",
    aspectRatioClasses[aspectRatio],
  );

  // YouTube embed
  if (provider === "youtube") {
    const videoId = getYouTubeId(url);
    if (!videoId) {
      return (
        <div className={cn(containerClass, "flex items-center justify-center bg-muted text-muted-foreground")}>
          Invalid YouTube URL
        </div>
      );
    }

    const params = new URLSearchParams();
    if (!controls) params.set("controls", "0");
    if (autoplay) params.set("autoplay", "1");
    if (muted) params.set("mute", "1");
    if (loop) params.set("loop", "1");

    return (
      <iframe
        className={containerClass}
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // Vimeo embed
  if (provider === "vimeo") {
    const videoId = getVimeoId(url);
    if (!videoId) {
      return (
        <div className={cn(containerClass, "flex items-center justify-center bg-muted text-muted-foreground")}>
          Invalid Vimeo URL
        </div>
      );
    }

    const params = new URLSearchParams();
    if (autoplay) params.set("autoplay", "1");
    if (muted) params.set("muted", "1");
    if (loop) params.set("loop", "1");

    return (
      <iframe
        className={containerClass}
        src={`https://player.vimeo.com/video/${videoId}?${params.toString()}`}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // Direct video
  return (
    <video
      className={containerClass}
      src={url}
      controls={controls}
      autoPlay={autoplay}
      muted={muted}
      loop={loop}
      playsInline
    >
      Your browser does not support the video tag.
    </video>
  );
}
