import type { MapBlockData } from "@/lib/blocks";
import "./map-block.css";

type MapBlockProps = {
  data: MapBlockData;
};

const heightMap: Record<MapBlockData["height"], string> = {
  sm: "250px",
  md: "400px",
  lg: "550px",
  xl: "700px",
};

/**
 * MapBlock - Renders location maps
 * Content block (leaf node) - cannot have children
 */
export function MapBlock({ data }: MapBlockProps) {
  const {
    center,
    zoom = 12,
    height = "md",
    embedUrl,
  } = data;

  const resolvedHeight = heightMap[height];

  if (embedUrl) {
    const src = extractIframeSrc(embedUrl);
    return (
      <div data-slot="map-block" data-height={height}>
        <iframe
          data-slot="map-block-iframe"
          src={src}
          style={{ height: resolvedHeight }}
          title="Embedded map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  if (!center) {
    return (
      <div data-slot="map-block-error">
        <p>Map location data is missing or invalid.</p>
      </div>
    );
  }

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.01},${center.lat - 0.01},${center.lng + 0.01},${center.lat + 0.01}&layer=mapnik&marker=${center.lat},${center.lng}`;

  return (
    <div data-slot="map-block" data-height={height}>
      <iframe
        data-slot="map-block-iframe"
        src={osmUrl}
        style={{ height: resolvedHeight }}
        title={`Map: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}

/**
 * Extracts the src URL from an iframe string,
 * or returns the value as-is if it's already a URL.
 */
function extractIframeSrc(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("<")) {
    const match = trimmed.match(/src=["']([^"']+)["']/);
    return match?.[1] ?? trimmed;
  }
  return trimmed;
}
