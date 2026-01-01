/**
 * BlurHash Utilities
 *
 * Canvas-based BlurHash decoding for progressive image loading.
 *
 * @module @enterprise/media/utils
 */

import { decode } from "blurhash";

// ============================================================================
// TYPES
// ============================================================================

export interface BlurHashOptions {
  /** Width of the decoded image (default: 32) */
  width?: number;
  /** Height of the decoded image (default: 32) */
  height?: number;
  /** Punch factor for saturation (default: 1) */
  punch?: number;
}

export interface DecodedBlurHash {
  /** Base64 data URL of the decoded image */
  dataUrl: string;
  /** Width of the decoded image */
  width: number;
  /** Height of the decoded image */
  height: number;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Check if a string is a valid BlurHash
 *
 * @example
 * isValidBlurHash("LEHV6nWB2yk8pyo0adR*.7kCMdnj") // true
 * isValidBlurHash("invalid") // false
 */
export function isValidBlurHash(hash: string): boolean {
  if (!hash || typeof hash !== "string") return false;

  // BlurHash must be at least 6 characters
  if (hash.length < 6) return false;

  // Check for valid Base83 characters
  const base83Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~";

  for (const char of hash) {
    if (!base83Chars.includes(char)) return false;
  }

  return true;
}

// ============================================================================
// DECODING
// ============================================================================

/**
 * Decode a BlurHash to pixel data
 *
 * @example
 * const pixels = decodeBlurHashToPixels("LEHV6nWB2yk8pyo0adR*.7kCMdnj", 32, 32);
 */
export function decodeBlurHashToPixels(
  hash: string,
  width: number,
  height: number,
  punch = 1,
): Uint8ClampedArray | null {
  if (!isValidBlurHash(hash)) return null;

  try {
    return decode(hash, width, height, punch);
  } catch {
    return null;
  }
}

/**
 * Decode a BlurHash to a canvas-based data URL
 *
 * @example
 * const result = decodeBlurHash("LEHV6nWB2yk8pyo0adR*.7kCMdnj");
 * // Use result.dataUrl as image src
 */
export function decodeBlurHash(
  hash: string,
  options: BlurHashOptions = {},
): DecodedBlurHash | null {
  const { width = 32, height = 32, punch = 1 } = options;

  // Check for canvas support (SSR safety)
  if (typeof document === "undefined") {
    return null;
  }

  const pixels = decodeBlurHashToPixels(hash, width, height, punch);
  if (!pixels) return null;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    return {
      dataUrl: canvas.toDataURL(),
      width,
      height,
    };
  } catch {
    return null;
  }
}

/**
 * Decode BlurHash asynchronously (for large sizes)
 */
export async function decodeBlurHashAsync(
  hash: string,
  options: BlurHashOptions = {},
): Promise<DecodedBlurHash | null> {
  return new Promise((resolve) => {
    // Use requestAnimationFrame to avoid blocking
    if (typeof requestAnimationFrame !== "undefined") {
      requestAnimationFrame(() => {
        resolve(decodeBlurHash(hash, options));
      });
    } else {
      resolve(decodeBlurHash(hash, options));
    }
  });
}

// ============================================================================
// EXTRACTION (Server-side)
// ============================================================================

/**
 * Extract dimensions from a BlurHash
 *
 * @example
 * getBlurHashDimensions("LEHV6nWB2yk8pyo0adR*.7kCMdnj")
 * // { componentsX: 4, componentsY: 3 }
 */
export function getBlurHashDimensions(
  hash: string,
): { componentsX: number; componentsY: number } | null {
  if (!isValidBlurHash(hash) || hash.length < 1) return null;

  const base83Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~";

  const sizeFlag = base83Chars.indexOf(hash[0]);
  const componentsY = Math.floor(sizeFlag / 9) + 1;
  const componentsX = (sizeFlag % 9) + 1;

  return { componentsX, componentsY };
}

// ============================================================================
// CSS UTILITIES
// ============================================================================

/**
 * Generate CSS for a BlurHash placeholder
 *
 * @example
 * const css = getBlurHashCss("LEHV6nWB2yk8pyo0adR*.7kCMdnj");
 * // { backgroundImage: "url(...)", backgroundSize: "cover" }
 */
export function getBlurHashCss(
  hash: string,
  options: BlurHashOptions = {},
): { backgroundImage: string; backgroundSize: string } | null {
  const result = decodeBlurHash(hash, options);
  if (!result) return null;

  return {
    backgroundImage: `url(${result.dataUrl})`,
    backgroundSize: "cover",
  };
}

/**
 * Generate inline style object for BlurHash placeholder
 */
export function getBlurHashStyle(
  hash: string,
  options: BlurHashOptions = {},
): React.CSSProperties | null {
  const css = getBlurHashCss(hash, options);
  if (!css) return null;

  return {
    backgroundImage: css.backgroundImage,
    backgroundSize: css.backgroundSize,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}
