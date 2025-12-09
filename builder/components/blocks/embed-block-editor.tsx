"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Code } from "lucide-react";
import {
  ResponsiveField,
  useResponsiveChange,
} from "@/components/editor/responsive-field";
import {
  useCurrentBreakpoint,
  useCanSetResponsiveOverrides,
} from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";

interface EmbedBlockData {
  _key: string;
  _type: "embed-block";
  data: {
    html: string;
    aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
    caption?: string;
    _responsive?: {
      tablet?: Partial<Omit<EmbedBlockData["data"], "_responsive">>;
      mobile?: Partial<Omit<EmbedBlockData["data"], "_responsive">>;
    };
  };
}

interface EmbedBlockEditorProps {
  block: EmbedBlockData;
  onChange: (block: EmbedBlockData) => void;
  onDelete: () => void;
}

export function EmbedBlockEditor({
  block,
  onChange,
  onDelete,
}: EmbedBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as EmbedBlockData["data"] }),
  );

  // Get responsive-aware aspect ratio
  const aspectRatio =
    getResponsiveValue<string>(block.data, "aspectRatio", breakpoint) || "16/9";

  const aspectRatioMap = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    auto: "",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div
          className={`relative ${aspectRatioMap[aspectRatio]} bg-muted rounded overflow-hidden ${aspectRatio === "auto" ? "min-h-[200px]" : ""}`}
        >
          {block.data.html ? (
            <div className="flex items-center justify-center h-full">
              <Code className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Embedded content
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No embed code set
                </p>
              </div>
            </div>
          )}
        </div>
        {block.data.caption && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {block.data.caption}
          </p>
        )}
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
          <Code className="h-4 w-4" />
          Embed Block
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
        <div>
          <Label htmlFor="embed-html">Embed Code (HTML/iframe)</Label>
          <Textarea
            id="embed-html"
            value={block.data.html}
            onChange={(e) => handleDataChange("html", e.target.value)}
            placeholder='<iframe src="..." width="100%" height="400"></iframe>'
            rows={6}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Paste embed code from platforms like YouTube, Twitter, CodePen, etc.
          </p>
        </div>

        {/* Aspect Ratio - Responsive aware */}
        <ResponsiveField
          fieldName="aspectRatio"
          data={block.data}
          onChange={(newData) =>
            onChange({ ...block, data: newData as EmbedBlockData["data"] })
          }
          label="Aspect Ratio"
        >
          <Select
            value={aspectRatio}
            onValueChange={(value) => handleDataChange("aspectRatio", value)}
          >
            <SelectTrigger id="embed-aspect">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16/9">16:9 (Video)</SelectItem>
              <SelectItem value="4/3">4:3 (Standard)</SelectItem>
              <SelectItem value="1/1">1:1 (Square)</SelectItem>
              <SelectItem value="auto">Auto (No aspect ratio)</SelectItem>
            </SelectContent>
          </Select>
        </ResponsiveField>

        <div>
          <Label htmlFor="embed-caption">Caption (Optional)</Label>
          <Input
            id="embed-caption"
            value={block.data.caption || ""}
            onChange={(e) => handleDataChange("caption", e.target.value)}
            placeholder="e.g., Video: Product demo"
          />
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <div
            className={`relative ${aspectRatioMap[aspectRatio]} bg-muted rounded overflow-hidden ${aspectRatio === "auto" ? "min-h-[200px]" : ""}`}
          >
            <div className="flex items-center justify-center h-full">
              <Code className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                {block.data.html ? "Embedded content" : "No embed code"}
              </span>
            </div>
          </div>
          {block.data.caption && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {block.data.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
