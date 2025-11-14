import type { MapBlockData } from "@/lib/blocks";
import "./map-block.css";

type MapBlockProps = {
  data: MapBlockData;
};

/**
 * MapBlock - Renders location maps
 * Content block (leaf node) - cannot have children
 */
export function MapBlock({ data }: MapBlockProps) {
  const {
    address,
    latitude,
    longitude,
    zoom = 15,
    height = 400,
    provider = "openstreetmap",
  } = data;

  // Build embed URL based on provider
  const getEmbedUrl = () => {
    if (provider === "google" && (latitude || address)) {
      const q = latitude
        ? `${latitude},${longitude}`
        : encodeURIComponent(address || "");
      return `https://maps.google.com/maps?q=${q}&z=${zoom}&output=embed`;
    }

    // OpenStreetMap
    if (latitude && longitude) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
    }

    return null;
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div data-slot="map-block-error">
        <p>Map location data is missing or invalid.</p>
      </div>
    );
  }

  return (
    <div data-slot="map-block">
      <iframe
        data-slot="map-block-iframe"
        src={embedUrl}
        style={{ height: `${height}px` }}
        title={address || "Map location"}
        loading="lazy"
      />
    </div>
  );
}
