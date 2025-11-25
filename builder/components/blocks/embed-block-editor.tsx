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

interface EmbedBlockData {
  _key: string;
  _type: "embed-block";
  data: {
    html: string;
    aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
    caption?: string;
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

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  const aspectRatio = block.data.aspectRatio || "16/9";

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

        <div>
          <Label htmlFor="embed-aspect">Aspect Ratio</Label>
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
        </div>

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
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
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
