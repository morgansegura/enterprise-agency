"use client";

import * as React from "react";
import Link from "next/link";
import type { Block } from "@/lib/hooks/use-pages";
import {
  blockRendererRegistry,
  type BlockRendererProps,
} from "@/lib/renderer/block-renderer-registry";
import { hasStyles } from "@/lib/types/section";
import { getElementClass } from "@enterprise/tokens";

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

    // Normalize: ensure block type ends with "-block"
    const blockType = block._type.endsWith("-block") ? block._type : `${block._type}-block`;

    blockRendererRegistry
      .loadRenderer(blockType)
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
  }, [block._type]); // blockType is derived from block._type

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
  const styles = blockAny.styles as Record<string, string> | undefined;
  const stylesBefore = blockAny.stylesBefore as Record<string, string> | undefined;
  const stylesAfter = blockAny.stylesAfter as Record<string, string> | undefined;
  const styled = hasStyles(styles) || hasStyles(stylesBefore) || hasStyles(stylesAfter);

  // Check if block has a link wrapper
  const link = (block.data as Record<string, unknown>)?._link as Record<string, string> | undefined;
  const hasLink = link?.href && !isEditing;

  const content = (
    <div
      className={styled ? getElementClass(block._key) : undefined}
      data-block-key={block._key}
      data-block-label={label}
    >
      <Component block={block} breakpoint={breakpoint} onChange={onChange} isEditing={isEditing} />
    </div>
  );

  if (hasLink) {
    const isExternal = link.href.startsWith("http") || link.target === "_blank";
    const linkProps = {
      title: link.title || undefined,
      "aria-label": link.ariaLabel || undefined,
      style: { textDecoration: "none", color: "inherit" } as React.CSSProperties,
    };

    if (isExternal) {
      return (
        <a
          href={link.href}
          target={link.target || "_blank"}
          rel={link.rel && link.rel !== "inherit" ? link.rel : "noopener noreferrer"}
          {...linkProps}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={link.href} {...linkProps}>
        {content}
      </Link>
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
