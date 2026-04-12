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

// ---------------------------------------------------------------------------
// Style extraction from Figma nodes
// ---------------------------------------------------------------------------

/** Generate a unique key for a Figma node */
let _keyCounter = 0;
function genKey(prefix = "figma"): string {
  return `${prefix}-${Date.now()}-${++_keyCounter}`;
}

/**
 * Extract CSS styles from a Figma node's visual properties.
 * Does NOT set fixed width/height — uses auto sizing for responsive layouts.
 */
export function extractStyles(n: FigmaNode): Record<string, string> {
  const styles: Record<string, string> = {};

  // Typography
  if (n.style?.fontFamily)
    styles.fontFamily = `'${n.style.fontFamily}', sans-serif`;
  if (n.style?.fontSize) styles.fontSize = `${n.style.fontSize}px`;
  if (n.style?.fontWeight) styles.fontWeight = `${n.style.fontWeight}`;
  if (n.style?.lineHeightPx)
    styles.lineHeight = `${n.style.lineHeightPx}px`;
  if (n.style?.letterSpacing)
    styles.letterSpacing = `${n.style.letterSpacing}px`;
  if (n.style?.textAlignHorizontal)
    styles.textAlign = n.style.textAlignHorizontal.toLowerCase();

  // Colors from fills
  if (n.fills) {
    const solidFill = n.fills.find((f) => f.type === "SOLID" && f.color);
    if (solidFill?.color) {
      const hex = figmaColorToHex(solidFill.color);
      if (n.type === "TEXT") {
        styles.color = hex;
      } else {
        styles.backgroundColor = hex;
      }
    }
    // Gradient fills
    const gradientFill = n.fills.find(
      (f) => f.type === "GRADIENT_LINEAR" || f.type === "GRADIENT_RADIAL",
    );
    if (gradientFill && !solidFill) {
      // Mark for gradient — the exact CSS gradient would need gradient stop data
      // which requires extended Figma node properties. For now, export as image.
    }
  }

  // Spacing from auto-layout
  if (n.paddingTop) styles.paddingTop = `${n.paddingTop}px`;
  if (n.paddingRight) styles.paddingRight = `${n.paddingRight}px`;
  if (n.paddingBottom) styles.paddingBottom = `${n.paddingBottom}px`;
  if (n.paddingLeft) styles.paddingLeft = `${n.paddingLeft}px`;
  if (n.itemSpacing) styles.gap = `${n.itemSpacing}px`;

  // Border radius
  if (n.cornerRadius) styles.borderRadius = `${n.cornerRadius}px`;

  // Strokes as borders
  if (n.strokes && n.strokes.length > 0 && n.strokeWeight) {
    const stroke = n.strokes[0];
    if (stroke.type === "SOLID" && stroke.color) {
      styles.borderWidth = `${n.strokeWeight}px`;
      styles.borderStyle = "solid";
      styles.borderColor = figmaColorToHex(stroke.color);
    }
  }

  // Layout (flex)
  if (n.layoutMode === "HORIZONTAL") {
    styles.display = "flex";
    styles.flexDirection = "row";
  } else if (n.layoutMode === "VERTICAL") {
    styles.display = "flex";
    styles.flexDirection = "column";
  }

  if (n.primaryAxisAlignItems) {
    const map: Record<string, string> = {
      MIN: "flex-start",
      CENTER: "center",
      MAX: "flex-end",
      SPACE_BETWEEN: "space-between",
    };
    if (map[n.primaryAxisAlignItems])
      styles.justifyContent = map[n.primaryAxisAlignItems];
  }
  if (n.counterAxisAlignItems) {
    const map: Record<string, string> = {
      MIN: "flex-start",
      CENTER: "center",
      MAX: "flex-end",
    };
    if (map[n.counterAxisAlignItems])
      styles.alignItems = map[n.counterAxisAlignItems];
  }

  return Object.fromEntries(
    Object.entries(styles).filter(([, v]) => v !== undefined && v !== ""),
  );
}

// ---------------------------------------------------------------------------
// Node type detection
// ---------------------------------------------------------------------------

/** Is this a button? Frame/component with a solid fill, border-radius, and
 *  contains only 1-2 text children (label + maybe icon placeholder). */
function isButton(n: FigmaNode): boolean {
  if (n.type !== "FRAME" && n.type !== "COMPONENT" && n.type !== "INSTANCE")
    return false;
  if (!n.fills?.some((f) => f.type === "SOLID" && f.color)) return false;
  if (!n.children || n.children.length === 0 || n.children.length > 3)
    return false;
  const textChildren = n.children.filter((c) => c.type === "TEXT");
  return textChildren.length >= 1;
}

/** Is this a frame with an image fill? */
function isImageFrame(n: FigmaNode): boolean {
  return (
    (n.type === "RECTANGLE" ||
      n.type === "FRAME" ||
      n.type === "INSTANCE") &&
    !!n.fills?.some((f) => f.type === "IMAGE")
  );
}

/** Is this a vector/boolean that should be exported as SVG? */
function isVectorNode(n: FigmaNode): boolean {
  return (
    n.type === "VECTOR" ||
    n.type === "BOOLEAN_OPERATION" ||
    n.type === "STAR" ||
    n.type === "POLYGON" ||
    n.type === "ELLIPSE" ||
    n.type === "LINE"
  );
}

/** Is this a frame with auto-layout (container)? */
function isContainer(n: FigmaNode): boolean {
  return (
    (n.type === "FRAME" ||
      n.type === "COMPONENT" ||
      n.type === "INSTANCE") &&
    (n.layoutMode === "HORIZONTAL" || n.layoutMode === "VERTICAL") &&
    !!n.children?.length
  );
}

// ---------------------------------------------------------------------------
// Figma → Block mapping
// ---------------------------------------------------------------------------

type MappedBlock = {
  _key: string;
  _type: string;
  data: Record<string, unknown>;
  styles?: Record<string, string>;
};

/**
 * Map a single Figma node to a block.
 * Returns null if the node should be skipped.
 */
function mapNodeToBlock(n: FigmaNode): MappedBlock | null {
  const nodeStyles = extractStyles(n);
  const addStyles = (block: MappedBlock) => {
    if (Object.keys(nodeStyles).length > 0) block.styles = nodeStyles;
    return block;
  };

  // TEXT → heading or text block
  if (n.type === "TEXT" && n.characters) {
    const fontSize = n.style?.fontSize || 16;
    const isHeading = fontSize >= 24;
    const align = n.style?.textAlignHorizontal?.toLowerCase() || "left";

    return addStyles({
      _key: genKey("heading"),
      _type: isHeading ? "heading-block" : "text-block",
      data: isHeading
        ? {
            text: n.characters,
            level:
              fontSize >= 40 ? "h1" : fontSize >= 32 ? "h2" : "h3",
            size:
              fontSize >= 48
                ? "4xl"
                : fontSize >= 40
                  ? "3xl"
                  : fontSize >= 32
                    ? "2xl"
                    : "xl",
            weight:
              (n.style?.fontWeight || 400) >= 700 ? "bold" : "semibold",
            align,
          }
        : {
            text: n.characters,
            html: `<p>${n.characters}</p>`,
            size: fontSize >= 18 ? "lg" : fontSize >= 16 ? "md" : "sm",
            align,
          },
    });
  }

  // Button detection — frame with fill + text child
  if (isButton(n)) {
    const textChild = n.children!.find((c) => c.type === "TEXT");
    return addStyles({
      _key: genKey("button"),
      _type: "button-block",
      data: {
        text: textChild?.characters || "Button",
        variant: "default",
        size: "md",
      },
    });
  }

  // Image fill → image block
  if (isImageFrame(n)) {
    return addStyles({
      _key: genKey("image"),
      _type: "image-block",
      data: {
        src: "",
        alt: n.name,
        _figmaNodeId: n.id,
      },
    });
  }

  // Vector/shape → icon or image (exported as SVG later)
  if (isVectorNode(n)) {
    return addStyles({
      _key: genKey("icon"),
      _type: "image-block",
      data: {
        src: "",
        alt: n.name,
        _figmaNodeId: n.id,
      },
    });
  }

  // Divider (line with no children)
  if (n.type === "LINE") {
    return {
      _key: genKey("divider"),
      _type: "divider-block",
      data: { variant: "default" },
    };
  }

  return null;
}

/**
 * Map Figma nodes to our block structure with proper nesting.
 * Frames with auto-layout become containers; leaf elements become blocks.
 */
export function mapFigmaToBlocks(
  node: FigmaNode,
): MappedBlock[] {
  const blocks: MappedBlock[] = [];

  function processNode(n: FigmaNode) {
    // Try mapping as a leaf block first
    const block = mapNodeToBlock(n);
    if (block) {
      blocks.push(block);
      return;
    }

    // Frame without auto-layout and with children — recurse into children
    if (n.children) {
      n.children.forEach(processNode);
    }
  }

  processNode(node);
  return blocks;
}

// ---------------------------------------------------------------------------
// Container building from auto-layout frames
// ---------------------------------------------------------------------------

interface MappedContainer {
  _type: "container";
  _key: string;
  layout?: Record<string, unknown>;
  styles?: Record<string, string>;
  blocks: MappedBlock[];
}

/** Build a container from a Figma auto-layout frame */
function buildContainer(frame: FigmaNode): MappedContainer {
  const containerStyles = extractStyles(frame);
  // Remove layout-related styles — they go in the layout object
  const { display: _, flexDirection: __, justifyContent: ___, alignItems: ____, gap: _____, ...visualStyles } = containerStyles;

  const layout: Record<string, unknown> = {};
  if (frame.layoutMode === "HORIZONTAL" || frame.layoutMode === "VERTICAL") {
    layout.type = "flex";
    layout.direction = frame.layoutMode === "HORIZONTAL" ? "row" : "column";
    if (frame.itemSpacing) {
      layout.gap =
        frame.itemSpacing >= 32 ? "lg"
          : frame.itemSpacing >= 16 ? "md"
          : frame.itemSpacing >= 8 ? "sm"
          : "xs";
    }
    if (frame.primaryAxisAlignItems) {
      const map: Record<string, string> = {
        MIN: "start", CENTER: "center", MAX: "end", SPACE_BETWEEN: "between",
      };
      layout.justify = map[frame.primaryAxisAlignItems] || "start";
    }
    if (frame.counterAxisAlignItems) {
      const map: Record<string, string> = {
        MIN: "start", CENTER: "center", MAX: "end",
      };
      layout.align = map[frame.counterAxisAlignItems] || "stretch";
    }
  }

  // Process children: auto-layout children that are also containers become
  // nested blocks; leaf nodes become content blocks.
  const blocks: MappedBlock[] = [];
  for (const child of frame.children || []) {
    const block = mapNodeToBlock(child);
    if (block) {
      blocks.push(block);
    } else if (child.children) {
      // Recurse into non-leaf frames
      child.children.forEach((grandchild) => {
        const b = mapNodeToBlock(grandchild);
        if (b) blocks.push(b);
        else if (grandchild.children) {
          blocks.push(...mapFigmaToBlocks(grandchild));
        }
      });
    }
  }

  return {
    _type: "container",
    _key: genKey("container"),
    ...(Object.keys(layout).length > 0 ? { layout } : {}),
    ...(Object.keys(visualStyles).length > 0 ? { styles: visualStyles } : {}),
    blocks,
  };
}

// ---------------------------------------------------------------------------
// Section mapping — top-level frames → sections
// ---------------------------------------------------------------------------

interface MappedSection {
  _type: "section";
  _key: string;
  width: string;
  paddingY: string;
  align?: string;
  background?: { type: "color"; color: string };
  styles?: Record<string, string>;
  containers: MappedContainer[];
}

/**
 * Map a Figma page/frame to our page structure.
 * Each top-level frame becomes a section. Auto-layout children become
 * containers. Content nodes become blocks. All styles are preserved as
 * element styles for the generated CSS system.
 */
export function mapFigmaPageToSections(
  page: FigmaNode,
): MappedSection[] {
  const sections: MappedSection[] = [];

  // Each top-level frame in the page becomes a section
  let topFrames =
    page.children?.filter(
      (c) =>
        c.type === "FRAME" ||
        c.type === "COMPONENT" ||
        c.type === "INSTANCE",
    ) || [];

  // If no child frames found, treat the node itself as the content
  if (topFrames.length === 0 && page.children?.length) {
    topFrames = [page];
  }

  for (const frame of topFrames) {
    // Extract section-level styles (background, text color for cascade)
    const sectionStyles: Record<string, string> = {};
    const bgFill = frame.fills?.find((f) => f.type === "SOLID" && f.color);
    let background: { type: "color"; color: string } | undefined;

    if (bgFill?.color) {
      const hex = figmaColorToHex(bgFill.color);
      background = { type: "color", color: hex };
      sectionStyles.backgroundColor = hex;

      // If dark background, set section text color to white for cascade
      const r = bgFill.color.r * 255;
      const g = bgFill.color.g * 255;
      const b = bgFill.color.b * 255;
      const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      if (luminance < 0.5) {
        sectionStyles.color = "#ffffff";
      }
    }

    // Section padding from frame auto-layout
    if (frame.paddingTop) sectionStyles.paddingTop = `${frame.paddingTop}px`;
    if (frame.paddingBottom)
      sectionStyles.paddingBottom = `${frame.paddingBottom}px`;
    if (frame.paddingLeft)
      sectionStyles.paddingLeft = `${frame.paddingLeft}px`;
    if (frame.paddingRight)
      sectionStyles.paddingRight = `${frame.paddingRight}px`;

    // Map Figma width
    const frameWidth = frame.absoluteBoundingBox?.width || 0;
    const width = frameWidth >= 1200 ? "full" : "container";

    // Build containers from child frames
    const containers: MappedContainer[] = [];
    const looseBlocks: MappedBlock[] = [];

    for (const child of frame.children || []) {
      if (isContainer(child)) {
        // Auto-layout child → becomes its own container
        containers.push(buildContainer(child));
      } else {
        // Leaf node or non-auto-layout frame → collect as loose block
        const block = mapNodeToBlock(child);
        if (block) {
          looseBlocks.push(block);
        } else if (child.children) {
          looseBlocks.push(...mapFigmaToBlocks(child));
        }
      }
    }

    // If there are loose blocks (not inside a container), wrap them
    if (looseBlocks.length > 0) {
      containers.push({
        _type: "container",
        _key: genKey("container"),
        layout: {
          type: "stack",
          gap: "md",
        },
        blocks: looseBlocks,
      });
    }

    if (containers.length > 0) {
      sections.push({
        _type: "section",
        _key: genKey("section"),
        width,
        paddingY: "none",
        ...(background ? { background } : {}),
        ...(Object.keys(sectionStyles).length > 0
          ? { styles: sectionStyles }
          : {}),
        containers,
      });
    }
  }

  return sections;
}
