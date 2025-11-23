"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ButtonBlockData {
  _key: string;
  _type: "button-block";
  data: {
    text: string;
    href: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg";
    fullWidth?: boolean;
    openInNewTab?: boolean;
  };
}

interface ButtonBlockEditorProps {
  block: ButtonBlockData;
  onChange: (block: ButtonBlockData) => void;
  onDelete: () => void;
}

export function ButtonBlockEditor({
  block,
  onChange,
  onDelete,
}: ButtonBlockEditorProps) {
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

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <Button
          variant={block.data.variant || "default"}
          size={block.data.size || "default"}
          className="pointer-events-none"
        >
          {block.data.text || "Button"}
        </Button>
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
        <h4 className="font-semibold text-sm">Button Block</h4>
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
          <Label htmlFor="button-text">Button Text</Label>
          <Input
            id="button-text"
            value={block.data.text}
            onChange={(e) => handleDataChange("text", e.target.value)}
            placeholder="Click me"
          />
        </div>

        <div>
          <Label htmlFor="button-href">Link URL</Label>
          <Input
            id="button-href"
            value={block.data.href}
            onChange={(e) => handleDataChange("href", e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <Label htmlFor="button-variant">Variant</Label>
          <Select
            value={block.data.variant || "default"}
            onValueChange={(value) => handleDataChange("variant", value)}
          >
            <SelectTrigger id="button-variant">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="button-size">Size</Label>
          <Select
            value={block.data.size || "default"}
            onValueChange={(value) => handleDataChange("size", value)}
          >
            <SelectTrigger id="button-size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
