/**
 * Figma API Client
 *
 * Fetches file structure, exports images, and extracts design tokens
 * from a Figma file using the REST API.
 *
 * Requires a personal access token from Figma (read-only).
 */

const FIGMA_API = "https://api.figma.com/v1";

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  fills?: Array<{
    type: string;
    color?: { r: number; g: number; b: number; a: number };
    imageRef?: string;
  }>;
  strokes?: Array<{
    type: string;
    color?: { r: number; g: number; b: number; a: number };
  }>;
  strokeWeight?: number;
  cornerRadius?: number;
  characters?: string;
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    textAlignHorizontal?: string;
    lineHeightPx?: number;
    letterSpacing?: number;
  };
  layoutMode?: "HORIZONTAL" | "VERTICAL" | "NONE";
  itemSpacing?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
}

export interface FigmaFile {
  name: string;
  document: FigmaNode;
  styles: Record<
    string,
    { key: string; name: string; styleType: string; description: string }
  >;
}

export interface FigmaColor {
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaTextStyle {
  name: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight?: number;
  letterSpacing?: number;
}

/**
 * Extract file key from Figma URL
 * Supports: figma.com/file/KEY/..., figma.com/design/KEY/...
 */
export function extractFileKey(url: string): string | null {
  const match = url.match(
    /figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/,
  );
  return match?.[1] || null;
}

/**
 * Fetch a Figma file's full structure
 */
export async function fetchFigmaFile(
  fileKey: string,
  token: string,
): Promise<FigmaFile> {
  const res = await fetch(`${FIGMA_API}/files/${fileKey}`, {
    headers: { "X-Figma-Token": token },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Figma API error: ${res.status} ${error}`);
  }

  return res.json();
}

/**
 * Export images from Figma (for image blocks)
 */
export async function exportFigmaImages(
  fileKey: string,
  nodeIds: string[],
  token: string,
  format: "png" | "jpg" | "svg" = "png",
  scale: number = 2,
): Promise<Record<string, string>> {
  if (nodeIds.length === 0) return {};

  const ids = nodeIds.join(",");
  const res = await fetch(
    `${FIGMA_API}/images/${fileKey}?ids=${ids}&format=${format}&scale=${scale}`,
    { headers: { "X-Figma-Token": token } },
  );

  if (!res.ok) {
    throw new Error(`Figma image export failed: ${res.status}`);
  }

  const data = await res.json();
  return data.images || {};
}

/**
 * Convert Figma RGBA to hex
 */
export function figmaColorToHex(color: {
  r: number;
  g: number;
  b: number;
  a?: number;
}): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Extract colors from Figma file (from fills and styles)
 */
export function extractColors(node: FigmaNode): FigmaColor[] {
  const colors: FigmaColor[] = [];
  const seen = new Set<string>();

  function walk(n: FigmaNode) {
    if (n.fills) {
      for (const fill of n.fills) {
        if (fill.type === "SOLID" && fill.color) {
          const hex = figmaColorToHex(fill.color);
          if (!seen.has(hex)) {
            seen.add(hex);
            colors.push({
              name: n.name,
              hex,
              r: fill.color.r,
              g: fill.color.g,
              b: fill.color.b,
              a: fill.color.a ?? 1,
            });
          }
        }
      }
    }
    n.children?.forEach(walk);
  }

  walk(node);
  return colors;
}

/**
 * Extract text styles from Figma file
 */
export function extractTextStyles(node: FigmaNode): FigmaTextStyle[] {
  const styles: FigmaTextStyle[] = [];
  const seen = new Set<string>();

  function walk(n: FigmaNode) {
    if (n.type === "TEXT" && n.style) {
      const key = `${n.style.fontFamily}-${n.style.fontSize}-${n.style.fontWeight}`;
      if (!seen.has(key)) {
        seen.add(key);
        styles.push({
          name: n.name,
          fontFamily: n.style.fontFamily || "Inter",
          fontSize: n.style.fontSize || 16,
          fontWeight: n.style.fontWeight || 400,
          lineHeight: n.style.lineHeightPx,
          letterSpacing: n.style.letterSpacing,
        });
      }
    }
    n.children?.forEach(walk);
  }

  walk(node);
  return styles.sort((a, b) => b.fontSize - a.fontSize);
}

/**
 * Map Figma nodes to our block structure
 */
export function mapFigmaToBlocks(
  node: FigmaNode,
): Array<{ _key: string; _type: string; data: Record<string, unknown> }> {
  const blocks: Array<{
    _key: string;
    _type: string;
    data: Record<string, unknown>;
  }> = [];

  function processNode(n: FigmaNode) {
    const ts = Date.now() + Math.random() * 1000;

    // Text nodes → heading or text block
    if (n.type === "TEXT" && n.characters) {
      const fontSize = n.style?.fontSize || 16;
      const isHeading = fontSize >= 24;

      blocks.push({
        _key: `figma-${ts}`,
        _type: isHeading ? "heading-block" : "text-block",
        data: {
          text: n.characters,
          ...(isHeading
            ? {
                level: fontSize >= 36 ? "h1" : fontSize >= 28 ? "h2" : "h3",
                size:
                  fontSize >= 48
                    ? "4xl"
                    : fontSize >= 36
                      ? "3xl"
                      : fontSize >= 28
                        ? "2xl"
                        : "xl",
                weight:
                  (n.style?.fontWeight || 400) >= 700 ? "bold" : "semibold",
                align:
                  n.style?.textAlignHorizontal?.toLowerCase() || "left",
              }
            : {
                size:
                  fontSize >= 18
                    ? "lg"
                    : fontSize >= 16
                      ? "md"
                      : "sm",
                align:
                  n.style?.textAlignHorizontal?.toLowerCase() || "left",
              }),
        },
      });
      return;
    }

    // Frames with image fills → image block
    if (
      (n.type === "RECTANGLE" || n.type === "FRAME") &&
      n.fills?.some((f) => f.type === "IMAGE")
    ) {
      blocks.push({
        _key: `figma-${ts}`,
        _type: "image-block",
        data: {
          src: "", // Will be filled after image export
          alt: n.name,
          _figmaNodeId: n.id, // Track for image export
        },
      });
      return;
    }

    // Process children
    n.children?.forEach(processNode);
  }

  processNode(node);
  return blocks;
}

/**
 * Map a Figma page to our page structure
 */
export function mapFigmaPageToSections(
  page: FigmaNode,
): Array<{
  _type: "section";
  _key: string;
  width: string;
  paddingY: string;
  containers: Array<{
    _type: "container";
    _key: string;
    blocks: Array<{
      _key: string;
      _type: string;
      data: Record<string, unknown>;
    }>;
  }>;
}> {
  const sections: Array<{
    _type: "section";
    _key: string;
    width: string;
    paddingY: string;
    containers: Array<{
      _type: "container";
      _key: string;
      blocks: Array<{
        _key: string;
        _type: string;
        data: Record<string, unknown>;
      }>;
    }>;
  }> = [];

  // Each top-level frame in the page becomes a section
  const topFrames =
    page.children?.filter(
      (c) => c.type === "FRAME" || c.type === "COMPONENT",
    ) || [];

  for (const frame of topFrames) {
    const ts = Date.now() + Math.random() * 10000;
    const blocks = mapFigmaToBlocks(frame);

    if (blocks.length > 0) {
      sections.push({
        _type: "section",
        _key: `figma-section-${ts}`,
        width: "container",
        paddingY: "lg",
        containers: [
          {
            _type: "container",
            _key: `figma-container-${ts}`,
            blocks,
          },
        ],
      });
    }
  }

  return sections;
}
