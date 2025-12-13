import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface MapBlockData {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: "sm" | "md" | "lg" | "xl";
  style?: "default" | "satellite" | "terrain";
  marker?: boolean;
}

const heightClasses = {
  sm: "h-48",
  md: "h-64",
  lg: "h-80",
  xl: "h-96",
};

export default function MapBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as MapBlockData;
  const {
    center,
    zoom = 12,
    height = "md",
    marker = true,
  } = data;

  if (!center?.lat || !center?.lng) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground rounded-lg",
          heightClasses[height],
        )}
      >
        No location set
      </div>
    );
  }

  // Using OpenStreetMap embed (free, no API key required)
  const markerParam = marker ? `&marker=${center.lat},${center.lng}` : "";
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.02},${center.lat - 0.02},${center.lng + 0.02},${center.lat + 0.02}&layer=mapnik${markerParam}`;

  return (
    <iframe
      className={cn("w-full rounded-lg border-0", heightClasses[height])}
      src={embedUrl}
      title="Map"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
