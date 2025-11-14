import type { EmbedBlockData } from "@/lib/blocks";
import "./embed-block.css";

type EmbedBlockProps = {
  data: EmbedBlockData;
};

/**
 * EmbedBlock - Renders generic iframe embeds
 * Content block (leaf node) - cannot have children
 */
export function EmbedBlock({ data }: EmbedBlockProps) {
  const { url, title, aspectRatio = "16:9", height } = data;

  return (
    <div data-slot="embed-block">
      <div
        data-slot="embed-block-wrapper"
        data-aspect-ratio={aspectRatio}
        style={height ? { height: `${height}px` } : undefined}
      >
        <iframe
          data-slot="embed-block-iframe"
          src={url}
          title={title || "Embedded content"}
          allowFullScreen
        />
      </div>
    </div>
  );
}
