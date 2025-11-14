import type { AudioBlockData } from "@/lib/blocks";
import "./audio-block.css";

type AudioBlockProps = {
  data: AudioBlockData;
};

/**
 * AudioBlock - Renders audio player
 * Content block (leaf node) - cannot have children
 */
export function AudioBlock({ data }: AudioBlockProps) {
  const {
    url,
    title,
    artist,
    controls = true,
    autoplay = false,
    loop = false,
  } = data;

  return (
    <figure data-slot="audio-block">
      {title || artist ? (
        <div data-slot="audio-block-meta">
          {title ? <div data-slot="audio-block-title">{title}</div> : null}
          {artist ? <div data-slot="audio-block-artist">{artist}</div> : null}
        </div>
      ) : null}
      <audio
        data-slot="audio-block-player"
        src={url}
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
      />
    </figure>
  );
}
