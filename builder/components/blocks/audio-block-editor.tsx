"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Music } from "lucide-react";
import { FormItem } from "@/components/ui/form";

interface AudioBlockData {
  _key: string;
  _type: "audio-block";
  data: {
    src: string;
    title?: string;
    artist?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
  };
}

interface AudioBlockEditorProps {
  block: AudioBlockData;
  onChange: (block: AudioBlockData) => void;
  onDelete: () => void;
}

export function AudioBlockEditor({
  block,
  onChange,
  onDelete,
}: AudioBlockEditorProps) {
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

  const controls = block.data.controls ?? true;
  const autoplay = block.data.autoplay ?? false;
  const loop = block.data.loop ?? false;

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-center gap-3">
          <Music className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {block.data.title || block.data.artist ? (
              <>
                <p className="font-medium text-sm truncate">
                  {block.data.title || "Untitled"}
                </p>
                {block.data.artist && (
                  <p className="text-xs text-muted-foreground truncate">
                    {block.data.artist}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {block.data.src ? "Audio file" : "No audio file set"}
              </p>
            )}
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
          <Music className="h-4 w-4" />
          Audio Block
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
          <Label htmlFor="audio-src">Audio URL</Label>
          <Input
            id="audio-src"
            value={block.data.src}
            onChange={(e) => handleDataChange("src", e.target.value)}
            placeholder="https://example.com/audio.mp3"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supports MP3, WAV, OGG formats
          </p>
        </FormItem>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="audio-title">Title (Optional)</Label>
            <Input
              id="audio-title"
              value={block.data.title || ""}
              onChange={(e) => handleDataChange("title", e.target.value)}
              placeholder="Track title"
            />
          </FormItem>

          <FormItem>
            <Label htmlFor="audio-artist">Artist (Optional)</Label>
            <Input
              id="audio-artist"
              value={block.data.artist || ""}
              onChange={(e) => handleDataChange("artist", e.target.value)}
              placeholder="Artist name"
            />
          </FormItem>
        </div>

        <div className="space-y-2">
          <FormItem className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="audio-controls"
              checked={controls}
              onChange={(e) => handleDataChange("controls", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="audio-controls" className="cursor-pointer">
              Show controls
            </Label>
          </FormItem>

          <FormItem className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="audio-autoplay"
              checked={autoplay}
              onChange={(e) => handleDataChange("autoplay", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="audio-autoplay" className="cursor-pointer">
              Autoplay
            </Label>
          </FormItem>

          <FormItem className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="audio-loop"
              checked={loop}
              onChange={(e) => handleDataChange("loop", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="audio-loop" className="cursor-pointer">
              Loop audio
            </Label>
          </FormItem>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              {block.data.title || block.data.artist ? (
                <>
                  <p className="font-medium text-sm truncate">
                    {block.data.title || "Untitled"}
                  </p>
                  {block.data.artist && (
                    <p className="text-xs text-muted-foreground truncate">
                      {block.data.artist}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {block.data.src ? "Audio file" : "No audio file set"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
