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
import { Trash2, Heading } from "lucide-react";

interface HeadingBlockData {
  _key: string;
  _type: "heading-block";
  data: {
    text: string;
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    size?:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl";
    align?: "left" | "center" | "right";
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: "default" | "primary" | "secondary" | "muted";
  };
}

interface HeadingBlockEditorProps {
  block: HeadingBlockData;
  onChange: (block: HeadingBlockData) => void;
  onDelete: () => void;
}

export function HeadingBlockEditor({
  block,
  onChange,
  onDelete,
}: HeadingBlockEditorProps) {
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

  const level = block.data.level;
  const size = block.data.size || "2xl";
  const align = block.data.align || "left";
  const weight = block.data.weight || "semibold";
  const color = block.data.color || "default";

  const sizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
  };

  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const weightMap = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorMap = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted-foreground",
  };

  const HeadingTag = level;

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        {HeadingTag === "h1" && (
          <h1
            className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
          >
            {block.data.text || "Heading"}
          </h1>
        )}
        {HeadingTag === "h2" && (
          <h2
            className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
          >
            {block.data.text || "Heading"}
          </h2>
        )}
        {HeadingTag === "h3" && (
          <h3
            className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
          >
            {block.data.text || "Heading"}
          </h3>
        )}
        {HeadingTag === "h4" && (
          <h4
            className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
          >
            {block.data.text || "Heading"}
          </h4>
        )}
        {HeadingTag === "h5" && (
          <h5
            className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
          >
            {block.data.text || "Heading"}
          </h5>
        )}
        {HeadingTag === "h6" && (
          <h6
            className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
          >
            {block.data.text || "Heading"}
          </h6>
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
          <Heading className="h-4 w-4" />
          Heading Block
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
          <Label htmlFor="heading-text">Heading Text</Label>
          <Input
            id="heading-text"
            value={block.data.text}
            onChange={(e) => handleDataChange("text", e.target.value)}
            placeholder="Enter heading..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="heading-level">Semantic Level</Label>
            <Select
              value={level}
              onValueChange={(value) => handleDataChange("level", value)}
            >
              <SelectTrigger id="heading-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1 (Page Title)</SelectItem>
                <SelectItem value="h2">H2 (Section)</SelectItem>
                <SelectItem value="h3">H3 (Subsection)</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
                <SelectItem value="h5">H5</SelectItem>
                <SelectItem value="h6">H6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="heading-size">Visual Size</Label>
            <Select
              value={size}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger id="heading-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
                <SelectItem value="3xl">3XL</SelectItem>
                <SelectItem value="4xl">4XL</SelectItem>
                <SelectItem value="5xl">5XL</SelectItem>
                <SelectItem value="6xl">6XL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="heading-align">Alignment</Label>
            <Select
              value={align}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger id="heading-align">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="heading-weight">Weight</Label>
            <Select
              value={weight}
              onValueChange={(value) => handleDataChange("weight", value)}
            >
              <SelectTrigger id="heading-weight">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="semibold">Semibold</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="heading-color">Color</Label>
            <Select
              value={color}
              onValueChange={(value) => handleDataChange("color", value)}
            >
              <SelectTrigger id="heading-color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          {HeadingTag === "h1" && (
            <h1
              className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
            >
              {block.data.text || "Heading"}
            </h1>
          )}
          {HeadingTag === "h2" && (
            <h2
              className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
            >
              {block.data.text || "Heading"}
            </h2>
          )}
          {HeadingTag === "h3" && (
            <h3
              className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
            >
              {block.data.text || "Heading"}
            </h3>
          )}
          {HeadingTag === "h4" && (
            <h4
              className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
            >
              {block.data.text || "Heading"}
            </h4>
          )}
          {HeadingTag === "h5" && (
            <h5
              className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
            >
              {block.data.text || "Heading"}
            </h5>
          )}
          {HeadingTag === "h6" && (
            <h6
              className={`${sizeMap[size]} ${alignMap[align]} ${weightMap[weight]} ${colorMap[color]}`}
            >
              {block.data.text || "Heading"}
            </h6>
          )}
        </div>
      </div>
    </div>
  );
}
