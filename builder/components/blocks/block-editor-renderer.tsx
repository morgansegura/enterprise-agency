"use client";

import * as React from "react";
import { blockRegistry, type BlockEditorProps } from "@/lib/editor";
import type { Block } from "@/lib/hooks/use-pages";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useIsBuilder } from "@/lib/hooks/use-tier";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface BlockEditorRendererProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
  tenantId?: string;
}

/**
 * Block Editor Renderer
 *
 * Dynamically loads and renders the appropriate block editor
 * based on block type using the block registry.
 *
 * Enterprise benefits:
 * - Automatic lazy loading for performance
 * - No need to modify this component when adding new blocks
 * - Consistent loading and error states
 * - Type-safe editor components
 *
 * Usage:
 * ```tsx
 * <BlockEditorRenderer
 *   block={block}
 *   onChange={handleChange}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function BlockEditorRenderer({
  block,
  onChange,
  onDelete,
  tenantId,
}: BlockEditorRendererProps) {
  const [EditorComponent, setEditorComponent] =
    React.useState<React.ComponentType<BlockEditorProps> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const isBuilder = tenantId ? useIsBuilder(tenantId) : true; // Default to true if no tenantId provided

  // Lazy load the editor component
  React.useEffect(() => {
    setIsLoading(true);
    setError(null);

    blockRegistry
      .loadEditor(block._type)
      .then((component) => {
        if (!component) {
          setError(`Editor not found for block type: ${block._type}`);
        } else {
          setEditorComponent(() => component);
        }
      })
      .catch((err) => {
        logger.error(`Failed to load editor for ${block._type}`, err as Error);
        setError(`Failed to load editor: ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [block._type]);

  // Wrap onDelete with tier check
  const handleDelete = React.useCallback(() => {
    if (!isBuilder) {
      toast.error("Delete blocks is a Builder-tier feature", {
        description:
          "Upgrade to Builder tier to add, remove, and rearrange blocks.",
      });
      return;
    }
    onDelete();
  }, [isBuilder, onDelete]);

  // Loading state
  if (isLoading) {
    return (
      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
        <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-r-transparent" />
        <p className="mt-2 text-sm text-muted-foreground">
          Loading {block._type} editor...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !EditorComponent) {
    return (
      <div className="border-2 border-destructive/50 rounded-lg p-4 bg-destructive/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-destructive">
              {error || "Editor not available"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Block type: <code className="font-mono">{block._type}</code>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    );
  }

  // Render the loaded editor component
  return (
    <EditorComponent
      block={block}
      onChange={onChange}
      onDelete={handleDelete}
    />
  );
}
