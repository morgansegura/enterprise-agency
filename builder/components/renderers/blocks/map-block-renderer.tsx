import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface MapBlockData {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: "sm" | "md" | "lg" | "xl";
  style?: "default" | "satellite" | "terrain";
  marker?: boolean;
  embedUrl?: string;
}

const heightMap: Record<string, string> = {
  sm: "250px",
  md: "400px",
  lg: "550px",
  xl: "700px",
};

export default function MapBlockRenderer({
  block,
  onChange: _onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as MapBlockData;
  const {
    center,
    zoom: _zoom = 12,
    height = "md",
    marker = true,
    embedUrl,
  } = data;

  const resolvedHeight = heightMap[height];

  if (embedUrl) {
    return (
      <div data-slot="map-block" data-height={height}>
        <iframe
          data-slot="map-block-iframe"
          src={embedUrl}
          style={{ height: resolvedHeight }}
          title="Embedded map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  if (!center?.lat || !center?.lng) {
    if (isEditing) {
      return (
        <div data-slot="map-block" data-height={height}>
          <div
            data-slot="map-block-placeholder"
            onClick={() => {
              // Block click-to-select opens settings panel for coordinates
            }}
          >
            <span data-slot="map-block-placeholder-title">
              Click to select, then set location in Settings
            </span>
            <span data-slot="map-block-placeholder-hint">
              Set coordinates via Settings panel
            </span>
          </div>
        </div>
      );
    }
    return (
      <div data-slot="map-block-error">
        <p>Map location data is missing or invalid.</p>
      </div>
    );
  }

  // Using OpenStreetMap embed (free, no API key required)
  const markerParam = marker
    ? `&marker=${center.lat},${center.lng}`
    : "";
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.02},${center.lat - 0.02},${center.lng + 0.02},${center.lat + 0.02}&layer=mapnik${markerParam}`;

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
