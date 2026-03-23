/**
 * Convert an SVG string to a favicon-compatible format.
 *
 * Modern browsers support SVG favicons directly, but for broader
 * compatibility we also generate PNG data URLs at multiple sizes.
 */

export interface FaviconResult {
  /** Original SVG as a data URL */
  svg: string;
  /** PNG at 32x32 (standard favicon) */
  png32: string;
  /** PNG at 180x180 (Apple touch icon) */
  png180: string;
}

/**
 * Convert SVG string to data URL
 */
export function svgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Convert SVG to PNG data URL at specified size using canvas.
 * Returns a Promise since canvas operations are async.
 */
export async function svgToPng(svg: string, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create an image from the SVG
    const img = new Image();
    img.width = size;
    img.height = size;

    img.onload = () => {
      // Create canvas at the desired size
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Draw the SVG image onto the canvas
      ctx.drawImage(img, 0, 0, size, size);

      // Convert to PNG data URL
      const pngDataUrl = canvas.toDataURL("image/png");
      resolve(pngDataUrl);
    };

    img.onerror = () => {
      reject(new Error("Failed to load SVG as image"));
    };

    // Load the SVG as a data URL
    img.src = svgToDataUrl(svg);
  });
}

/**
 * Generate all favicon formats from an SVG string.
 * Call this on the client side only (uses canvas/Image).
 */
export async function generateFavicons(svg: string): Promise<FaviconResult> {
  const [png32, png180] = await Promise.all([
    svgToPng(svg, 32),
    svgToPng(svg, 180),
  ]);

  return {
    svg: svgToDataUrl(svg),
    png32,
    png180,
  };
}

/**
 * Apply favicon to the document head.
 * Handles both SVG (for modern browsers) and PNG fallback.
 */
export function applyFavicon(svg: string): void {
  // For modern browsers, we can use SVG directly
  const svgDataUrl = svgToDataUrl(svg);

  // Find or create the favicon link
  let link = document.querySelector(
    'link[rel="icon"]',
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  // Set SVG favicon (works in Chrome, Firefox, Edge, Safari 15+)
  link.type = "image/svg+xml";
  link.href = svgDataUrl;

  // Also generate and set Apple touch icon for iOS
  svgToPng(svg, 180)
    .then((png180) => {
      let appleLink = document.querySelector(
        'link[rel="apple-touch-icon"]',
      ) as HTMLLinkElement | null;
      if (!appleLink) {
        appleLink = document.createElement("link");
        appleLink.rel = "apple-touch-icon";
        document.head.appendChild(appleLink);
      }
      appleLink.href = png180;
    })
    .catch(() => {
      // Silently fail - not critical
    });
}
