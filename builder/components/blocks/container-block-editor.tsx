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
import { Trash2, Box, Plus } from "lucide-react";
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

interface ContainerBlockData {
  _key: string;
  _type: "container-block";
  data: {
    maxWidth: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    padding: "none" | "sm" | "md" | "lg" | "xl";
    background: "none" | "muted" | "accent";
    blocks: Block[];
    _responsive?: {
      tablet?: Partial<Omit<ContainerBlockData["data"], "blocks">>;
      mobile?: Partial<Omit<ContainerBlockData["data"], "blocks">>;
    };
  };
}

interface ContainerBlockEditorProps {
  block: ContainerBlockData;
  onChange: (block: ContainerBlockData) => void;
  onDelete: () => void;
}

export function ContainerBlockEditor({
  block,
  onChange,
  onDelete,
}: ContainerBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showBlockLibrary, setShowBlockLibrary] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as ContainerBlockData["data"] }),
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
  const maxWidth =
    getResponsiveValue<string>(block.data, "maxWidth", breakpoint) || "full";
  const padding =
    getResponsiveValue<string>(block.data, "padding", breakpoint) || "md";
  const background = block.data.background || "none";

  const maxWidthClasses = {
    none: "",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "p-0",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const backgroundClasses = {
    none: "",
    muted: "bg-muted",
    accent: "bg-accent",
  };

  // Get available blocks (exclude layout containers to prevent deep nesting)
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
          <Box className="h-4 w-4" />
          <span className="text-sm font-medium">Container</span>
          <span className="text-xs text-muted-foreground">
            ({block.data.blocks.length} block
            {block.data.blocks.length !== 1 ? "s" : ""})
          </span>
        </div>
        <div
          className={`${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${backgroundClasses[background]} rounded border border-dashed border-border/50 min-h-[60px] flex items-center justify-center`}
        >
          {block.data.blocks.length === 0 ? (
            <p className="text-xs text-muted-foreground">Empty container</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {block.data.blocks.length} nested block
              {block.data.blocks.length !== 1 ? "s" : ""}
            </p>
          )}
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
          <Box className="h-4 w-4" />
          Container Block
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
          {/* Max Width - Responsive aware */}
          <ResponsiveField
            fieldName="maxWidth"
            data={block.data}
            onChange={(newData) =>
              onChange({
                ...block,
                data: newData as ContainerBlockData["data"],
              })
            }
            label="Max Width"
          >
            <Select
              value={maxWidth}
              onValueChange={(value) => handleDataChange("maxWidth", value)}
            >
              <SelectTrigger id="container-max-width">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          {/* Padding - Responsive aware */}
          <ResponsiveField
            fieldName="padding"
            data={block.data}
            onChange={(newData) =>
              onChange({
                ...block,
                data: newData as ContainerBlockData["data"],
              })
            }
            label="Padding"
          >
            <Select
              value={padding}
              onValueChange={(value) => handleDataChange("padding", value)}
            >
              <SelectTrigger id="container-padding">
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
            <Label htmlFor="container-background">Background</Label>
            <Select
              value={background}
              onValueChange={(value) => handleDataChange("background", value)}
            >
              <SelectTrigger id="container-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
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
              No blocks yet. Click &quot;Add Block&quot; to add content.
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
          <div
            className={`${maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] || ""} ${paddingClasses[padding as keyof typeof paddingClasses] || ""} ${backgroundClasses[background]} border rounded min-h-[60px]`}
          >
            <p className="text-xs text-muted-foreground">
              Container: {maxWidth} width, {padding} padding, {background}{" "}
              background
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {block.data.blocks.length} nested block
              {block.data.blocks.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
