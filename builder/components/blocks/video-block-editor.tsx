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

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  const provider = block.data.provider || "youtube";
  const aspectRatio = block.data.aspectRatio || "16/9";
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
        <div className={`relative ${aspectRatioMap[aspectRatio]} bg-muted rounded overflow-hidden`}>
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
                <p className="text-sm text-muted-foreground">No video URL set</p>
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
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
          </div>

          <div>
            <Label htmlFor="video-aspect">Aspect Ratio</Label>
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
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="video-autoplay"
              checked={autoplay}
              onChange={(e) => handleDataChange("autoplay", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="video-autoplay" className="cursor-pointer">
              Autoplay
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="video-muted"
              checked={muted}
              onChange={(e) => handleDataChange("muted", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="video-muted" className="cursor-pointer">
              Muted
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="video-controls"
              checked={controls}
              onChange={(e) => handleDataChange("controls", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="video-controls" className="cursor-pointer">
              Show controls
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="video-loop"
              checked={loop}
              onChange={(e) => handleDataChange("loop", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="video-loop" className="cursor-pointer">
              Loop video
            </Label>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div className={`relative ${aspectRatioMap[aspectRatio]} bg-muted rounded overflow-hidden`}>
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
