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
import { Trash2, MousePointer } from "lucide-react";
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
    _responsive?: {
      tablet?: Partial<ButtonBlockData["data"]>;
      mobile?: Partial<ButtonBlockData["data"]>;
    };
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
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as ButtonBlockData["data"] }),
  );

  // Get responsive-aware values
  const size =
    (getResponsiveValue<string>(block.data, "size", breakpoint) as
      | "default"
      | "sm"
      | "lg") || "default";
  const fullWidth =
    getResponsiveValue<boolean>(block.data, "fullWidth", breakpoint) || false;

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <Button
          variant={block.data.variant || "default"}
          size={size}
          className={`pointer-events-none ${fullWidth ? "w-full" : ""}`}
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
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <MousePointer className="h-4 w-4" />
          Button Block
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
          <Label htmlFor="button-text">Button Text</Label>
          <Input
            id="button-text"
            value={block.data.text}
            onChange={(e) => handleDataChange("text", e.target.value)}
            placeholder="Click me"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="button-href">Link URL</Label>
          <Input
            id="button-href"
            value={block.data.href}
            onChange={(e) => handleDataChange("href", e.target.value)}
            placeholder="https://example.com"
          />
        </FormItem>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
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
          </FormItem>

          {/* Size - Responsive aware */}
          <ResponsiveField
            fieldName="size"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as ButtonBlockData["data"] })
            }
            label="Size"
          >
            <Select
              value={size}
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
          </ResponsiveField>
        </div>

        {/* Full Width - Responsive aware */}
        <ResponsiveField
          fieldName="fullWidth"
          data={block.data}
          onChange={(newData) =>
            onChange({ ...block, data: newData as ButtonBlockData["data"] })
          }
          label="Full Width"
        >
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="button-fullwidth"
              checked={fullWidth}
              onChange={(e) => handleDataChange("fullWidth", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="button-fullwidth" className="cursor-pointer">
              Make button full width
            </Label>
          </div>
        </ResponsiveField>

        {/* Preview */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <Button
            variant={block.data.variant || "default"}
            size={size}
            className={`pointer-events-none ${fullWidth ? "w-full" : ""}`}
          >
            {block.data.text || "Button"}
          </Button>
        </div>
      </div>
    </div>
  );
}
