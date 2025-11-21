/**
 * Utilities for converting between TipTap JSON and our Block format
 */

import type { Block, TipTapJSON, TipTapNode } from "./types";

/**
 * Generate a unique key for blocks
 */
export function generateBlockKey(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract text content from TipTap nodes
 */
function extractText(nodes: TipTapNode[] = []): string {
  return nodes
    .map((node) => {
      if (node.text) return node.text;
      if (node.content) return extractText(node.content);
      return "";
    })
    .join("");
}

/**
 * Convert TipTap JSON to our Block format
 */
export function tiptapToBlocks(json: TipTapJSON): Block[] {
  if (!json.content) return [];

  return json.content
    .map((node) => tiptapNodeToBlock(node))
    .filter((block): block is Block => block !== null);
}

/**
 * Convert a single TipTap node to a Block
 */
function tiptapNodeToBlock(node: TipTapNode): Block | null {
  const key = generateBlockKey();

  switch (node.type) {
    case "heading": {
      const level = (node.attrs?.level as number) || 2;
      const text = extractText(node.content);

      return {
        _key: key,
        _type: "heading-block",
        data: {
          title: text,
          level: `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
          size: levelToSize(level),
          align: "left",
        },
      };
    }

    case "paragraph": {
      const text = extractText(node.content);

      return {
        _key: key,
        _type: "text-block",
        data: {
          content: text,
          size: "base",
          align: "left",
        },
      };
    }

    case "image": {
      return {
        _key: key,
        _type: "image-block",
        data: {
          url: node.attrs?.src || "",
          alt: node.attrs?.alt || "",
          width: node.attrs?.width,
          height: node.attrs?.height,
        },
      };
    }

    default:
      return null;
  }
}

/**
 * Convert heading level to size
 */
function levelToSize(level: number): "xl" | "2xl" | "3xl" | "4xl" {
  switch (level) {
    case 1:
      return "4xl";
    case 2:
      return "3xl";
    case 3:
      return "2xl";
    default:
      return "xl";
  }
}

/**
 * Convert our Block format to TipTap JSON
 */
export function blocksToTiptap(blocks: Block[]): TipTapJSON {
  return {
    type: "doc",
    content: blocks
      .map((block) => blockToTiptapNode(block))
      .filter((node): node is TipTapNode => node !== null),
  };
}

/**
 * Convert a single Block to TipTap node
 */
function blockToTiptapNode(block: Block): TipTapNode | null {
  switch (block._type) {
    case "heading-block": {
      const title = block.data.title as string;
      const level = block.data.level as string | undefined;
      const headingLevel = level ? parseInt(level.replace("h", "")) : 2;

      return {
        type: "heading",
        attrs: { level: headingLevel },
        content: [{ type: "text", text: title }],
      };
    }

    case "text-block": {
      const content = block.data.content as string;

      return {
        type: "paragraph",
        content: [{ type: "text", text: content }],
      };
    }

    case "image-block": {
      const url = block.data.url as string;
      const alt = block.data.alt as string | undefined;
      const width = block.data.width as number | undefined;
      const height = block.data.height as number | undefined;

      return {
        type: "image",
        attrs: {
          src: url,
          alt: alt || "",
          width,
          height,
        },
      };
    }

    default:
      return null;
  }
}
