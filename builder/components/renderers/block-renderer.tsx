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
import { cn } from "@/lib/utils";

interface Props {
  block: Block;
  breakpoint?: "desktop" | "tablet" | "mobile";
  onChange?: (updatedBlock: Block) => void;
  isEditing?: boolean;
}

const LABEL_OVERRIDES: Record<string, string> = {
  "container-block": "Box",
};

function getBlockLabel(type: string): string {
  return (
    LABEL_OVERRIDES[type] ??
    type
      .replace("-block", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/**
 * BlockRenderer — no wrapper div.
 *
 * Passes editorProps to each block renderer. The renderer spreads them
 * on its own root element so generated CSS applies directly —
 * no inheritance issues, no > * hacks, no preflight conflicts.
 */
export function BlockRenderer({
  block,
  breakpoint = "desktop",
  onChange,
  isEditing,
}: Props) {
  const [Component, setComponent] =
    React.useState<React.ComponentType<BlockRendererProps> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const blockType = block._type.endsWith("-block")
      ? block._type
      : `${block._type}-block`;

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

  // Build editor props — the renderer applies these on its root element
  const blockAny = block as Record<string, unknown>;
  const styles = blockAny.styles as Record<string, string> | undefined;
  const stylesBefore = blockAny.stylesBefore as
    | Record<string, string>
    | undefined;
  const stylesAfter = blockAny.stylesAfter as
    | Record<string, string>
    | undefined;
  const responsive = blockAny._responsive as
    | Record<string, unknown>
    | undefined;
  const hasResponsive =
    responsive &&
    (hasStyles(
      (responsive.tablet as Record<string, unknown>)?.styles as
        | Record<string, string>
        | undefined,
    ) ||
      hasStyles(
        (responsive.mobile as Record<string, unknown>)?.styles as
          | Record<string, string>
          | undefined,
      ));
  const styled =
    hasStyles(styles) ||
    hasStyles(stylesBefore) ||
    hasStyles(stylesAfter) ||
    hasResponsive;

  const editorProps = {
    className: styled ? getElementClass(block._key) : undefined,
    "data-block-key": block._key,
    "data-block-label": getBlockLabel(block._type),
    "data-element-type": "block" as const,
  };

  const content = (
    <Component
      block={block}
      breakpoint={breakpoint}
      onChange={onChange}
      isEditing={isEditing}
      editorProps={editorProps}
    />
  );

  // Link wrapper (read-only mode only)
  const link = (block.data as Record<string, unknown>)?._link as
    | Record<string, string>
    | undefined;
  const hasLink = link?.href && !isEditing;

  if (hasLink) {
    const isExternal =
      link.href.startsWith("http") || link.target === "_blank";
    const linkProps = {
      title: link.title || undefined,
      "aria-label": link.ariaLabel || undefined,
      style: {
        textDecoration: "none",
        color: "inherit",
      } as React.CSSProperties,
    };

    if (isExternal) {
      return (
        <a
          href={link.href}
          target={link.target || "_blank"}
          rel={
            link.rel && link.rel !== "inherit"
              ? link.rel
              : "noopener noreferrer"
          }
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

export { cn };

export async function preloadBlockRenderer(type: string): Promise<void> {
  await blockRendererRegistry.loadRenderer(type);
}

export function hasBlockRenderer(type: string): boolean {
  return blockRendererRegistry.has(type);
}
