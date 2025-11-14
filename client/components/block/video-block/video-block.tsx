import type { VideoBlockData } from "@/lib/blocks";
import "./video-block.css";

type VideoBlockProps = {
  data: VideoBlockData;
};

/**
 * VideoBlock - Renders video content (YouTube, Vimeo, or native)
 * Content block (leaf node) - cannot have children
 * Data should contain pre-processed embed URL
 */
export function VideoBlock({ data }: VideoBlockProps) {
  const {
    url,
    provider = "native",
    aspectRatio = "16:9",
    autoplay = false,
    controls = true,
    muted = false,
    loop = false,
    caption,
  } = data;

  return (
    <figure data-slot="video-block">
      <div data-slot="video-block-wrapper" data-aspect-ratio={aspectRatio}>
        {provider === "native" ? (
          <video
            data-slot="video-block-video"
            src={url}
            controls={controls}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
          />
        ) : (
          <iframe
            data-slot="video-block-iframe"
            src={url}
            title={caption || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      {caption && (
        <figcaption data-slot="video-block-caption">{caption}</figcaption>
      )}
    </figure>
  );
}
