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
import { Trash2, Columns3, Plus } from "lucide-react";
import { BlockEditorRenderer } from "./block-editor-renderer";
import { blockRegistry } from "@/lib/editor/block-registry";

interface Block {
  _key: string;
  _type: string;
  data: Record<string, unknown>;
}

interface ColumnsBlockData {
  _key: string;
  _type: "columns-block";
  data: {
    count: "2" | "3" | "4";
    gap: "none" | "sm" | "md" | "lg" | "xl";
    responsive: boolean;
    blocks: Block[];
  };
}

interface ColumnsBlockEditorProps {
  block: ColumnsBlockData;
  onChange: (block: ColumnsBlockData) => void;
  onDelete: () => void;
}

export function ColumnsBlockEditor({
  block,
  onChange,
  onDelete,
}: ColumnsBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showBlockLibrary, setShowBlockLibrary] = useState(false);

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  const handleBlockChange = (index: number, updatedBlock: Block) => {
    const updatedBlocks = [...block.data.blocks];
    updatedBlocks[index] = updatedBlock;
    handleDataChange("blocks", updatedBlocks);
  };

  const handleBlockDelete = (index: number) => {
    const updatedBlocks = block.data.blocks.filter((_, i) => i !== index);
    handleDataChange("blocks", updatedBlocks);
  };

  const handleAddBlock = (blockType: string) => {
    const newBlock = blockRegistry.createDefault(blockType);
    if (newBlock) {
      handleDataChange("blocks", [...block.data.blocks, newBlock]);
    }
    setShowBlockLibrary(false);
  };

  const count = block.data.count || "2";
  const gap = block.data.gap || "md";
  const responsive = block.data.responsive ?? true;

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
          <Columns3 className="h-4 w-4" />
          <span className="text-sm font-medium">Columns</span>
          <span className="text-xs text-muted-foreground">
            ({block.data.blocks.length} block
            {block.data.blocks.length !== 1 ? "s" : ""})
          </span>
        </div>
        <div className="rounded border border-dashed border-border/50 p-2 min-h-[60px]">
          <p className="text-xs text-muted-foreground">
            {count} columns, {gap} gap{responsive && ", responsive"}
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
          <Columns3 className="h-4 w-4" />
          Columns Block
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="columns-count">Column Count</Label>
            <Select
              value={count}
              onValueChange={(value) => handleDataChange("count", value)}
            >
              <SelectTrigger id="columns-count">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="columns-gap">Gap</Label>
            <Select
              value={gap}
              onValueChange={(value) => handleDataChange("gap", value)}
            >
              <SelectTrigger id="columns-gap">
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="columns-responsive"
            checked={responsive}
            onChange={(e) => handleDataChange("responsive", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="columns-responsive" className="cursor-pointer">
            Responsive (stack on mobile)
          </Label>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-3">
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
          </div>

          {showBlockLibrary && (
            <div className="mb-3 p-3 border rounded-lg bg-muted/30">
              <p className="text-xs font-medium mb-2">Select a block to add:</p>
              <div className="grid grid-cols-3 gap-2">
                {availableBlocks.map((reg) => (
                  <button
                    key={reg.type}
                    type="button"
                    onClick={() => handleAddBlock(reg.type)}
                    className="p-2 text-xs border rounded hover:bg-accent hover:border-primary transition-colors text-left"
                  >
                    <div className="font-medium">{reg.displayName}</div>
                    <div className="text-muted-foreground text-[10px]">
                      {reg.description}
                    </div>
                  </button>
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
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <p className="text-xs">
            Columns: {count} columns, {gap} gap{responsive && ", responsive"}
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
