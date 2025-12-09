"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, LayoutGrid, Plus } from "lucide-react";
import { BlockEditorRenderer } from "./block-editor-renderer";
import { blockRegistry } from "@/lib/editor/block-registry";
import { FormItem } from "@/components/ui/form";
import {
  ResponsiveField,
  useResponsiveChange,
} from "@/components/editor/responsive-field";
import {
  useCurrentBreakpoint,
  useCanSetResponsiveOverrides,
} from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";

interface Block {
  _key: string;
  _type: string;
  data: Record<string, unknown>;
}

interface GridBlockData {
  _key: string;
  _type: "grid-block";
  data: {
    columns: "1" | "2" | "3" | "4" | "5" | "6";
    gap: "none" | "sm" | "md" | "lg" | "xl";
    autoFlow: "row" | "column" | "dense";
    blocks: Block[];
    _responsive?: {
      tablet?: Partial<Omit<GridBlockData["data"], "blocks">>;
      mobile?: Partial<Omit<GridBlockData["data"], "blocks">>;
    };
  };
}

interface GridBlockEditorProps {
  block: GridBlockData;
  onChange: (block: GridBlockData) => void;
  onDelete: () => void;
}

export function GridBlockEditor({
  block,
  onChange,
  onDelete,
}: GridBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showBlockLibrary, setShowBlockLibrary] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as GridBlockData["data"] }),
  );

  const handleBlockChange = (index: number, updatedBlock: Block) => {
    const updatedBlocks = [...block.data.blocks];
    updatedBlocks[index] = updatedBlock;
    // Blocks are not responsive - directly update
    onChange({
      ...block,
      data: {
        ...block.data,
        blocks: updatedBlocks,
      },
    });
  };

  const handleBlockDelete = (index: number) => {
    const updatedBlocks = block.data.blocks.filter((_, i) => i !== index);
    onChange({
      ...block,
      data: {
        ...block.data,
        blocks: updatedBlocks,
      },
    });
  };

  const handleAddBlock = (blockType: string) => {
    const newBlock = blockRegistry.createDefault(blockType);
    if (newBlock) {
      onChange({
        ...block,
        data: {
          ...block.data,
          blocks: [...block.data.blocks, newBlock],
        },
      });
    }
    setShowBlockLibrary(false);
  };

  // Get responsive-aware values
  const columns =
    getResponsiveValue<string>(block.data, "columns", breakpoint) || "2";
  const gap = getResponsiveValue<string>(block.data, "gap", breakpoint) || "md";
  const autoFlow = block.data.autoFlow || "row";

  const availableBlocks = blockRegistry
    .getAll()
    .filter(
      (reg) =>
        reg.type !== "container-block" &&
        reg.type !== "stack-block" &&
        reg.type !== "flex-block" &&
        reg.type !== "grid-block" &&
        reg.type !== "columns-block",
    );

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-center gap-2 mb-2">
          <LayoutGrid className="h-4 w-4" />
          <span className="text-sm font-medium">Grid</span>
          <span className="text-xs text-muted-foreground">
            ({block.data.blocks.length} block
            {block.data.blocks.length !== 1 ? "s" : ""})
          </span>
        </div>
        <div className="rounded border border-dashed border-border/50 p-2 min-h-[60px]">
          <p className="text-xs text-muted-foreground">
            Grid: {columns} columns, {gap} gap
          </p>
        </div>
        <Button
          variant="destructive"
          size="icon-sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-2 border-primary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          Grid Block
          {canSetOverrides && breakpoint !== "desktop" && (
            <span className="text-xs font-normal text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
              Editing {breakpoint}
            </span>
          )}
        </h4>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsEditing(false)}>
            Done
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {/* Columns - Responsive aware (most important for grid!) */}
          <ResponsiveField
            fieldName="columns"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as GridBlockData["data"] })
            }
            label="Columns"
          >
            <Select
              value={columns}
              onValueChange={(value) => handleDataChange("columns", value)}
            >
              <SelectTrigger id="grid-columns">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          {/* Gap - Responsive aware */}
          <ResponsiveField
            fieldName="gap"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as GridBlockData["data"] })
            }
            label="Gap"
          >
            <Select
              value={gap}
              onValueChange={(value) => handleDataChange("gap", value)}
            >
              <SelectTrigger id="grid-gap">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          <FormItem>
            <Label htmlFor="grid-auto-flow">Auto Flow</Label>
            <Select
              value={autoFlow}
              onValueChange={(value) => handleDataChange("autoFlow", value)}
            >
              <SelectTrigger id="grid-auto-flow">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">Row</SelectItem>
                <SelectItem value="column">Column</SelectItem>
                <SelectItem value="dense">Dense</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <div className="border-t pt-3">
          <FormItem className="flex items-center justify-between mb-3">
            <Label>Nested Blocks ({block.data.blocks.length})</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowBlockLibrary(!showBlockLibrary)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Block
            </Button>
          </FormItem>

          {showBlockLibrary && (
            <div className="mb-3 p-3 border rounded-lg bg-muted/30">
              <p className="text-xs font-medium mb-2">Select a block to add:</p>
              <div className="grid grid-cols-3 gap-2">
                {availableBlocks.map((reg) => (
                  <Button
                    key={reg.type}
                    type="button"
                    onClick={() => handleAddBlock(reg.type)}
                    className="p-2 text-xs border rounded hover:bg-accent hover:border-primary transition-colors text-left"
                  >
                    <div className="font-medium">{reg.displayName}</div>
                    <div className="text-muted-foreground text-[10px]">
                      {reg.description}
                    </div>
                  </Button>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowBlockLibrary(false)}
                className="mt-2 w-full"
              >
                Cancel
              </Button>
            </div>
          )}

          {block.data.blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded">
              No blocks yet. Click "Add Block" to add content.
            </p>
          ) : (
            <div className="space-y-3">
              {block.data.blocks.map((childBlock, index) => (
                <BlockEditorRenderer
                  key={childBlock._key}
                  block={childBlock as any}
                  onChange={(updated) =>
                    handleBlockChange(index, updated as Block)
                  }
                  onDelete={() => handleBlockDelete(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <p className="text-xs">
            Grid: {columns} columns, {gap} gap, {autoFlow} auto-flow
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {block.data.blocks.length} nested block
            {block.data.blocks.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
