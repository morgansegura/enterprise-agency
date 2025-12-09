"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Video } from "lucide-react";
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

interface VideoBlockData {
  _key: string;
  _type: "video-block";
  data: {
    url: string;
    provider?: "youtube" | "vimeo" | "direct";
    aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9";
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
    _responsive?: {
      tablet?: Partial<Omit<VideoBlockData["data"], "_responsive">>;
      mobile?: Partial<Omit<VideoBlockData["data"], "_responsive">>;
    };
  };
}

interface VideoBlockEditorProps {
  block: VideoBlockData;
  onChange: (block: VideoBlockData) => void;
  onDelete: () => void;
}

export function VideoBlockEditor({
  block,
  onChange,
  onDelete,
}: VideoBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as VideoBlockData["data"] }),
  );

  const provider = block.data.provider || "youtube";
  // Get responsive-aware aspect ratio
  const aspectRatio =
    getResponsiveValue<string>(block.data, "aspectRatio", breakpoint) || "16/9";
  const autoplay = block.data.autoplay ?? false;
  const muted = block.data.muted ?? false;
  const controls = block.data.controls ?? true;
  const loop = block.data.loop ?? false;

  const aspectRatioMap = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "21/9": "aspect-[21/9]",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div
          className={`relative ${aspectRatioMap[aspectRatio]} bg-muted rounded overflow-hidden`}
        >
          {block.data.url ? (
            <div className="flex items-center justify-center h-full">
              <Video className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Video: {provider}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No video URL set
                </p>
              </div>
            </div>
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
          <Video className="h-4 w-4" />
          Video Block
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
        <FormItem>
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            value={block.data.url}
            onChange={(e) => handleDataChange("url", e.target.value)}
            placeholder="https://youtube.com/watch?v=... or direct video URL"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supports YouTube, Vimeo, or direct video URLs
          </p>
        </FormItem>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="video-provider">Provider</Label>
            <Select
              value={provider}
              onValueChange={(value) => handleDataChange("provider", value)}
            >
              <SelectTrigger id="video-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
                <SelectItem value="direct">Direct URL</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {/* Aspect Ratio - Responsive aware */}
          <ResponsiveField
            fieldName="aspectRatio"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as VideoBlockData["data"] })
            }
            label="Aspect Ratio"
          >
            <Select
              value={aspectRatio}
              onValueChange={(value) => handleDataChange("aspectRatio", value)}
            >
              <SelectTrigger id="video-aspect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="4/3">4:3 (Standard)</SelectItem>
                <SelectItem value="1/1">1:1 (Square)</SelectItem>
                <SelectItem value="21/9">21:9 (Ultrawide)</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>
        </div>

        <div className="space-y-2">
          <FormItem className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="video-autoplay"
              checked={autoplay}
              onChange={(e) => handleDataChange("autoplay", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="video-autoplay" className="cursor-pointer">
              Autoplay
            </Label>
          </FormItem>

          <FormItem className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="video-muted"
              checked={muted}
              onChange={(e) => handleDataChange("muted", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="video-muted" className="cursor-pointer">
              Muted
            </Label>
          </FormItem>

          <FormItem className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="video-controls"
              checked={controls}
              onChange={(e) => handleDataChange("controls", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="video-controls" className="cursor-pointer">
              Show controls
            </Label>
          </FormItem>

          <FormItem className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="video-loop"
              checked={loop}
              onChange={(e) => handleDataChange("loop", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="video-loop" className="cursor-pointer">
              Loop video
            </Label>
          </FormItem>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <div
            className={`relative ${aspectRatioMap[aspectRatio]} bg-muted rounded overflow-hidden`}
          >
            <div className="flex items-center justify-center h-full">
              <Video className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                {block.data.url ? `Video: ${provider}` : "No video URL"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
