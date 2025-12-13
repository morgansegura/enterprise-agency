"use client";

import * as React from "react";
import type { Block } from "@/lib/hooks/use-pages";
import {
  blockRendererRegistry,
  type BlockRendererProps,
} from "@/lib/renderer/block-renderer-registry";

interface Props {
  block: Block;
  breakpoint?: "desktop" | "tablet" | "mobile";
}

/**
 * BlockRenderer - Dynamically renders any block type
 *
 * Uses the block renderer registry to lazy-load the appropriate
 * renderer component based on block._type
 */
export function BlockRenderer({ block, breakpoint = "desktop" }: Props) {
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
      <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (!Component) {
    return <div className="animate-pulse bg-muted h-12 rounded-md" />;
  }

  return <Component block={block} breakpoint={breakpoint} />;
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
