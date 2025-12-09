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
import { Trash2, Quote } from "lucide-react";
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

interface QuoteBlockData {
  _key: string;
  _type: "quote-block";
  data: {
    text: string;
    author?: string;
    title?: string;
    size?: "sm" | "md" | "lg";
    align?: "left" | "center" | "right";
    variant?: "default" | "bordered" | "highlighted";
    _responsive?: {
      tablet?: Partial<Omit<QuoteBlockData["data"], "_responsive">>;
      mobile?: Partial<Omit<QuoteBlockData["data"], "_responsive">>;
    };
  };
}

interface QuoteBlockEditorProps {
  block: QuoteBlockData;
  onChange: (block: QuoteBlockData) => void;
  onDelete: () => void;
}

export function QuoteBlockEditor({
  block,
  onChange,
  onDelete,
}: QuoteBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as QuoteBlockData["data"] }),
  );

  // Get responsive-aware size
  const size =
    getResponsiveValue<string>(block.data, "size", breakpoint) || "md";
  const align = block.data.align || "left";
  const variant = block.data.variant || "default";

  const sizeMap = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const variantStyles = {
    default: "border-l-4 border-primary pl-4",
    bordered: "border-2 border-border rounded-lg p-4",
    highlighted: "bg-muted/50 border-l-4 border-primary pl-4 py-2",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <blockquote
          className={`${variantStyles[variant]} ${sizeMap[size]} ${alignMap[align]}`}
        >
          <p className="italic">
            {block.data.text || "Quote text will appear here..."}
          </p>
          {(block.data.author || block.data.title) && (
            <footer className="mt-2 text-sm text-muted-foreground">
              {block.data.author && <span>— {block.data.author}</span>}
              {block.data.title && (
                <span className="text-xs block ml-4">{block.data.title}</span>
              )}
            </footer>
          )}
        </blockquote>
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
          <Quote className="h-4 w-4" />
          Quote Block
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
          <Label htmlFor="quote-text">Quote Text</Label>
          <Textarea
            id="quote-text"
            value={block.data.text}
            onChange={(e) => handleDataChange("text", e.target.value)}
            placeholder="Enter quote text..."
            rows={4}
          />
        </FormItem>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="quote-author">Author (Optional)</Label>
            <Input
              id="quote-author"
              value={block.data.author || ""}
              onChange={(e) => handleDataChange("author", e.target.value)}
              placeholder="e.g., John Doe"
            />
          </FormItem>

          <FormItem>
            <Label htmlFor="quote-title">Title/Role (Optional)</Label>
            <Input
              id="quote-title"
              value={block.data.title || ""}
              onChange={(e) => handleDataChange("title", e.target.value)}
              placeholder="e.g., CEO, Company Name"
            />
          </FormItem>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Size - Responsive aware */}
          <ResponsiveField
            fieldName="size"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as QuoteBlockData["data"] })
            }
            label="Size"
          >
            <Select
              value={size}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger id="quote-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          <FormItem>
            <Label htmlFor="quote-align">Alignment</Label>
            <Select
              value={align}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger id="quote-align">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <Label htmlFor="quote-variant">Style</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="quote-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="highlighted">Highlighted</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <blockquote
            className={`${variantStyles[variant]} ${sizeMap[size]} ${alignMap[align]}`}
          >
            <p className="italic">
              {block.data.text || "Quote text will appear here..."}
            </p>
            {(block.data.author || block.data.title) && (
              <footer className="mt-2 text-sm text-muted-foreground">
                {block.data.author && <span>— {block.data.author}</span>}
                {block.data.title && (
                  <span className="text-xs block ml-4">{block.data.title}</span>
                )}
              </footer>
            )}
          </blockquote>
        </div>
      </div>
    </div>
  );
}
