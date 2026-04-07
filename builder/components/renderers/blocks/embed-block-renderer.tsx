import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface EmbedBlockData {
  html?: string;
  url?: string;
  title?: string;
  aspectRatio?: "auto" | "16:9" | "4:3" | "1:1";
  height?: number;
}

export default function EmbedBlockRenderer({
  block,
  onChange: _onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as EmbedBlockData;
  const { html, url, title, aspectRatio = "16:9", height } = data;

  if (!html && !url) {
    if (isEditing) {
      return (
        <div data-slot="embed-block">
          <div
            data-slot="embed-block-placeholder"
            onClick={() => {
              // Block click-to-select opens settings panel
            }}
          >
            <span data-slot="embed-block-placeholder-title">
              Click to select, then set code in Settings
            </span>
            <span data-slot="embed-block-placeholder-hint">
              Paste embed code via Settings panel
            </span>
          </div>
        </div>
      );
    }
    return (
      <div data-slot="embed-block">
        <div data-slot="embed-block-placeholder">No embed code set</div>
      </div>
    );
  }

  // If we have a URL, render as iframe (matching client)
  if (url) {
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

  // If we have raw HTML, render it
  return (
    <div data-slot="embed-block">
      <div
        data-slot="embed-block-wrapper"
        data-aspect-ratio={aspectRatio}
        dangerouslySetInnerHTML={{ __html: html! }}
      />
    </div>
  );
}
