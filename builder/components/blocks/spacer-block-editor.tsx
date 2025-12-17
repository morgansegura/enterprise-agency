"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, MoveVertical } from "lucide-react";
import {
  ResponsiveField,
  useResponsiveChange,
} from "@/components/editor/responsive-field";
import {
  useCurrentBreakpoint,
  useCanSetResponsiveOverrides,
} from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";

interface SpacerBlockData {
  _key: string;
  _type: "spacer-block";
  data: {
    height: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    _responsive?: {
      tablet?: Partial<Omit<SpacerBlockData["data"], "_responsive">>;
      mobile?: Partial<Omit<SpacerBlockData["data"], "_responsive">>;
    };
  };
}

interface SpacerBlockEditorProps {
  block: SpacerBlockData;
  onChange: (block: SpacerBlockData) => void;
  onDelete: () => void;
}

/**
 * Spacer Block Editor
 *
 * Simplest block editor - just a height selector for vertical spacing.
 * Used to create breathing room between content sections.
 */
export function SpacerBlockEditor({
  block,
  onChange,
  onDelete,
}: SpacerBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as SpacerBlockData["data"] }),
  );

  // Get responsive-aware height
  const height =
    getResponsiveValue<string>(block.data, "height", breakpoint) ||
    block.data.height;

  // Height values mapped to visual representation
  const heightMap: Record<string, string> = {
    xs: "16px",
    sm: "24px",
    md: "32px",
    lg: "48px",
    xl: "64px",
    "2xl": "96px",
    "3xl": "128px",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
        style={{ height: heightMap[height] }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MoveVertical className="h-4 w-4" />
            <span>Spacer ({height})</span>
          </div>
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
          <MoveVertical className="h-4 w-4" />
          Spacer Block
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
        {/* Height - Responsive aware */}
        <ResponsiveField
          fieldName="height"
          data={block.data}
          onChange={(newData) =>
            onChange({ ...block, data: newData as SpacerBlockData["data"] })
          }
          label="Height"
        >
          <Select
            value={height}
            onValueChange={(value) => handleDataChange("height", value)}
          >
            <SelectTrigger id="spacer-height">
              <SelectValue placeholder="Select height" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">Extra Small (16px)</SelectItem>
              <SelectItem value="sm">Small (24px)</SelectItem>
              <SelectItem value="md">Medium (32px)</SelectItem>
              <SelectItem value="lg">Large (48px)</SelectItem>
              <SelectItem value="xl">Extra Large (64px)</SelectItem>
              <SelectItem value="2xl">2X Large (96px)</SelectItem>
              <SelectItem value="3xl">3X Large (128px)</SelectItem>
            </SelectContent>
          </Select>
        </ResponsiveField>
        <p className="text-xs text-muted-foreground">
          Creates vertical spacing between content blocks
        </p>

        {/* Visual preview */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <div
            className="bg-primary/10 border-2 border-dashed border-primary/30 rounded"
            style={{ height: heightMap[height] }}
          />
        </div>
      </div>
    </div>
  );
}
