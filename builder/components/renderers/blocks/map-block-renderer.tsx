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

export default function MapBlockRenderer({ block, onChange: _onChange, isEditing }: BlockRendererProps) {
  const data = block.data as unknown as MapBlockData;
  const { center, zoom: _zoom = 12, height = "md", marker = true } = data;

  if (!center?.lat || !center?.lng) {
    if (isEditing) {
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2 bg-[var(--el-100)] text-[var(--el-500)] rounded-lg cursor-pointer hover:bg-[var(--accent-primary-subtle)]/30",
            heightClasses[height],
          )}
          onClick={() => {
            // Block click-to-select opens settings panel for coordinates
          }}
        >
          <span className="text-[14px] font-medium text-[var(--el-800)]">Click to select, then set location in Settings</span>
          <span className="text-[12px]">Set coordinates via Settings panel</span>
        </div>
      );
    }
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[var(--el-100)] text-[var(--el-500)] rounded-lg",
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
