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
import { Trash2, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FormItem } from "@/components/ui/form";

interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}

interface MapBlockData {
  _key: string;
  _type: "map-block";
  data: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
    markers?: MapMarker[];
    height: "sm" | "md" | "lg" | "xl";
    style: "default" | "satellite" | "terrain";
    embedUrl?: string;
  };
}

interface MapBlockEditorProps {
  block: MapBlockData;
  onChange: (block: MapBlockData) => void;
  onDelete: () => void;
}

export function MapBlockEditor({
  block,
  onChange,
  onDelete,
}: MapBlockEditorProps) {
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

  const handleCenterChange = (field: "lat" | "lng", value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      ...block,
      data: {
        ...block.data,
        center: {
          ...block.data.center,
          [field]: numValue,
        },
      },
    });
  };

  const height = block.data.height || "md";
  const style = block.data.style || "default";
  const zoom = block.data.zoom || 12;

  const heightClasses = {
    sm: "h-64",
    md: "h-96",
    lg: "h-[32rem]",
    xl: "h-[40rem]",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div
          className={`${heightClasses[height]} bg-muted rounded flex items-center justify-center`}
        >
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {block.data.embedUrl
                ? "Embedded Map"
                : `Map: ${block.data.center.lat.toFixed(4)}, ${block.data.center.lng.toFixed(4)}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Zoom: {zoom} | Style: {style}
            </p>
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
          <MapPin className="h-4 w-4" />
          Map Block
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
          <Label htmlFor="map-embed">Embed URL (Google Maps iframe)</Label>
          <Textarea
            id="map-embed"
            value={block.data.embedUrl || ""}
            onChange={(e) => handleDataChange("embedUrl", e.target.value)}
            placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450"></iframe>'
            rows={3}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Paste Google Maps embed code or just the src URL
          </p>
        </FormItem>

        <div className="border-t pt-3">
          <p className="text-sm font-medium mb-2">Or configure manually:</p>

          <div className="grid grid-cols-2 gap-3">
            <FormItem>
              <Label htmlFor="map-lat">Latitude</Label>
              <Input
                id="map-lat"
                type="number"
                step="0.000001"
                value={block.data.center.lat}
                onChange={(e) => handleCenterChange("lat", e.target.value)}
                placeholder="40.7128"
              />
            </FormItem>

            <FormItem>
              <Label htmlFor="map-lng">Longitude</Label>
              <Input
                id="map-lng"
                type="number"
                step="0.000001"
                value={block.data.center.lng}
                onChange={(e) => handleCenterChange("lng", e.target.value)}
                placeholder="-74.0060"
              />
            </FormItem>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <FormItem>
            <Label htmlFor="map-zoom">Zoom Level</Label>
            <Input
              id="map-zoom"
              type="number"
              min="1"
              max="20"
              value={zoom}
              onChange={(e) =>
                handleDataChange("zoom", parseInt(e.target.value) || 12)
              }
            />
          </FormItem>

          <FormItem>
            <Label htmlFor="map-height">Height</Label>
            <Select
              value={height}
              onValueChange={(value) => handleDataChange("height", value)}
            >
              <SelectTrigger id="map-height">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <Label htmlFor="map-style">Style</Label>
            <Select
              value={style}
              onValueChange={(value) => handleDataChange("style", value)}
            >
              <SelectTrigger id="map-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="satellite">Satellite</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div
            className={`${heightClasses[height]} bg-muted rounded flex items-center justify-center`}
          >
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {block.data.embedUrl
                  ? "Embedded Map"
                  : `Map: ${block.data.center.lat.toFixed(4)}, ${block.data.center.lng.toFixed(4)}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Zoom: {zoom} | Style: {style} | Height: {height}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
