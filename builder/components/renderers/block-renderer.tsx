"use client";

import * as React from "react";
import type { Block } from "@/lib/hooks/use-pages";
import {
  blockRendererRegistry,
  type BlockRendererProps,
} from "@/lib/renderer/block-renderer-registry";
import { allStylesToCSSVars, hasStyles, mergeStyles } from "@/lib/types/section";

interface Props {
  block: Block;
  breakpoint?: "desktop" | "tablet" | "mobile";
  onChange?: (updatedBlock: Block) => void;
  isEditing?: boolean;
}

/**
 * BlockRenderer - Dynamically renders any block type
 *
 * Uses the block renderer registry to lazy-load the appropriate
 * renderer component based on block._type
 */
export function BlockRenderer({ block, breakpoint = "desktop", onChange, isEditing }: Props) {
  const [Component, setComponent] =
    React.useState<React.ComponentType<BlockRendererProps> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    blockRendererRegistry
      .loadRenderer(block._type)
      .then((comp) => {
        if (mounted) {
          if (comp) {
            setComponent(() => comp);
            setError(null);
          } else {
            setError(`No renderer found for block type: ${block._type}`);
          }
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(`Failed to load renderer: ${err.message}`);
        }
      });

    return () => {
      mounted = false;
    };
  }, [block._type]);

  if (error) {
    return (
      <div className="bg-(--status-error)/10 text-(--status-error) text-sm p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (!Component) {
    return <div className="animate-pulse bg-(--el-100) h-12 rounded-md" />;
  }

  const label = block._type
    .replace("-block", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const blockAny = block as Record<string, unknown>;
  const responsive = blockAny._responsive as Record<string, Record<string, unknown>> | undefined;

  // Merge responsive overrides: desktop styles + breakpoint overrides
  const baseStyles = blockAny.styles as Record<string, string> | undefined;
  const bpOverrides = breakpoint !== "desktop" && responsive?.[breakpoint]?.styles as Record<string, string> | undefined;
  const styles = bpOverrides ? mergeStyles(baseStyles, bpOverrides) : baseStyles;

  const baseBefore = blockAny.stylesBefore as Record<string, string> | undefined;
  const bpBefore = breakpoint !== "desktop" && responsive?.[breakpoint]?.stylesBefore as Record<string, string> | undefined;
  const stylesBefore = bpBefore ? mergeStyles(baseBefore, bpBefore) : baseBefore;

  const baseAfter = blockAny.stylesAfter as Record<string, string> | undefined;
  const bpAfter = breakpoint !== "desktop" && responsive?.[breakpoint]?.stylesAfter as Record<string, string> | undefined;
  const stylesAfter = bpAfter ? mergeStyles(baseAfter, bpAfter) : baseAfter;

  const cssVars = allStylesToCSSVars(styles, stylesBefore, stylesAfter);
  const styled = hasStyles(styles) || hasStyles(stylesBefore) || hasStyles(stylesAfter);

  // Check if block has a link wrapper
  const link = (block.data as Record<string, unknown>)?._link as Record<string, string> | undefined;
  const hasLink = link?.href && !isEditing;

  const content = (
    <div
      data-block-key={block._key}
      data-block-label={label}
      data-styled={styled || undefined}
      data-has-before={hasStyles(stylesBefore) || undefined}
      data-has-after={hasStyles(stylesAfter) || undefined}
      style={styled ? (cssVars as React.CSSProperties) : undefined}
    >
      <Component block={block} breakpoint={breakpoint} onChange={onChange} isEditing={isEditing} />
    </div>
  );

  if (hasLink) {
    return (
      <a
        href={link.href}
        target={link.target || "_self"}
        rel={link.rel && link.rel !== "inherit" ? link.rel : (link.target === "_blank" ? "noopener noreferrer" : undefined)}
        title={link.title || undefined}
        aria-label={link.ariaLabel || undefined}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {content}
      </a>
    );
  }

  return content;
}

/**
 * Pre-load a block renderer for faster rendering
 */
export async function preloadBlockRenderer(type: string): Promise<void> {
  await blockRendererRegistry.loadRenderer(type);
}

/**
 * Check if a block type has a renderer registered
 */
export function hasBlockRenderer(type: string): boolean {
  return blockRendererRegistry.has(type);
}
