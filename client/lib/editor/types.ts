/**
 * Editor types for TipTap integration
 */

import type { HeadingBlockData } from "@/lib/blocks";

// Base block structure
export type Block = {
  _key: string;
  _type: string;
  data: Record<string, unknown>;
};

// Specific block types
export type HeadingBlock = {
  _key: string;
  _type: "heading-block";
  data: HeadingBlockData;
};

export type TextBlock = {
  _key: string;
  _type: "text-block";
  data: {
    content: string;
    size?: "sm" | "base" | "lg";
    align?: "left" | "center" | "right" | "justify";
  };
};

export type ImageBlock = {
  _key: string;
  _type: "image-block";
  data: {
    url: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
  };
};

// Union of all block types
export type EditorBlock = HeadingBlock | TextBlock | ImageBlock;

// Editor state
export type EditorContent = {
  blocks: Block[];
};

// TipTap JSON format (simplified)
export type TipTapJSON = {
  type: "doc";
  content: TipTapNode[];
};

export type TipTapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
};

export type TipTapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};
