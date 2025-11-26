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
import { Trash2, Layers, Plus } from "lucide-react";
import { BlockEditorRenderer } from "./block-editor-renderer";
import { blockRegistry } from "@/lib/editor/block-registry";

interface Block {
  _key: string;
  _type: string;
  data: Record<string, unknown>;
}

interface FlexBlockData {
  _key: string;
  _type: "flex-block";
  data: {
    direction: "row" | "column" | "row-reverse" | "column-reverse";
    justify: "start" | "center" | "end" | "between" | "around" | "evenly";
    align: "start" | "center" | "end" | "stretch" | "baseline";
    gap: "none" | "sm" | "md" | "lg" | "xl";
    wrap: boolean;
    blocks: Block[];
  };
}

interface FlexBlockEditorProps {
  block: FlexBlockData;
  onChange: (block: FlexBlockData) => void;
  onDelete: () => void;
}

export function FlexBlockEditor({
  block,
  onChange,
  onDelete,
}: FlexBlockEditorProps) {
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

  const direction = block.data.direction || "row";
  const justify = block.data.justify || "start";
  const align = block.data.align || "start";
  const gap = block.data.gap || "md";
  const wrap = block.data.wrap ?? false;

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
          <Layers className="h-4 w-4" />
          <span className="text-sm font-medium">Flex</span>
          <span className="text-xs text-muted-foreground">
            ({block.data.blocks.length} block
            {block.data.blocks.length !== 1 ? "s" : ""})
          </span>
        </div>
        <div className="rounded border border-dashed border-border/50 p-2 min-h-[60px]">
          <p className="text-xs text-muted-foreground">
            Flex: {direction}, justify-{justify}, align-{align}
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
          <Layers className="h-4 w-4" />
          Flex Block
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
            <Label htmlFor="flex-direction">Direction</Label>
            <Select
              value={direction}
              onValueChange={(value) => handleDataChange("direction", value)}
            >
              <SelectTrigger id="flex-direction">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">Row</SelectItem>
                <SelectItem value="column">Column</SelectItem>
                <SelectItem value="row-reverse">Row Reverse</SelectItem>
                <SelectItem value="column-reverse">Column Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="flex-justify">Justify</Label>
            <Select
              value={justify}
              onValueChange={(value) => handleDataChange("justify", value)}
            >
              <SelectTrigger id="flex-justify">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="between">Between</SelectItem>
                <SelectItem value="around">Around</SelectItem>
                <SelectItem value="evenly">Evenly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="flex-align">Align</Label>
            <Select
              value={align}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger id="flex-align">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
                <SelectItem value="baseline">Baseline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="flex-gap">Gap</Label>
            <Select
              value={gap}
              onValueChange={(value) => handleDataChange("gap", value)}
            >
              <SelectTrigger id="flex-gap">
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
            id="flex-wrap"
            checked={wrap}
            onChange={(e) => handleDataChange("wrap", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="flex-wrap" className="cursor-pointer">
            Allow wrapping
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
            Flex: {direction}, justify-{justify}, align-{align}, gap-{gap}
            {wrap && ", wrap"}
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
