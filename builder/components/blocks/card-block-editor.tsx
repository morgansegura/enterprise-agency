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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Trash2,
  CreditCard,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
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

interface CardImage {
  src: string;
  alt: string;
  aspectRatio?: string;
}

interface CardLink {
  href: string;
  text?: string;
  openInNewTab?: boolean;
}

interface CardBlockData {
  _key: string;
  _type: "card-block";
  data: {
    image?: CardImage;
    title: string;
    description?: string;
    footer?: string;
    link?: CardLink;
    variant?: "default" | "bordered" | "elevated";
    padding?: "none" | "sm" | "md" | "lg";
    _responsive?: {
      tablet?: Partial<CardBlockData["data"]>;
      mobile?: Partial<CardBlockData["data"]>;
    };
  };
}

interface CardBlockEditorProps {
  block: CardBlockData;
  onChange: (block: CardBlockData) => void;
  onDelete: () => void;
}

export function CardBlockEditor({
  block,
  onChange,
  onDelete,
}: CardBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as CardBlockData["data"] }),
  );

  const handleImageChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        image: {
          ...block.data.image,
          [field]: value,
        } as CardImage,
      },
    });
  };

  const handleLinkChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        link: {
          ...block.data.link,
          [field]: value,
        } as CardLink,
      },
    });
  };

  const removeImage = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        image: undefined,
      },
    });
  };

  const removeLink = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        link: undefined,
      },
    });
  };

  const variant = block.data.variant || "default";
  // Get responsive-aware values
  const padding =
    getResponsiveValue<string>(block.data, "padding", breakpoint) || "md";

  const variantStyles = {
    default: "border",
    bordered: "border-2 border-border",
    elevated: "shadow-lg border",
  };

  const paddingMap = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div className={`${variantStyles[variant]} rounded-lg overflow-hidden`}>
          {block.data.image && (
            <div className="relative aspect-video">
              <img
                src={block.data.image.src}
                alt={block.data.image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={paddingMap[padding]}>
            <h3 className="font-semibold text-lg">
              {block.data.title || "Card Title"}
            </h3>
            {block.data.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {block.data.description}
              </p>
            )}
            {block.data.footer && (
              <p className="text-xs text-muted-foreground mt-2">
                {block.data.footer}
              </p>
            )}
            {block.data.link && (
              <a
                href={block.data.link.href}
                className="text-sm text-primary mt-2 inline-block"
              >
                {block.data.link.text || "Learn more →"}
              </a>
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
          <CreditCard className="h-4 w-4" />
          Card Block
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
          <Label htmlFor="card-title">Title</Label>
          <Input
            id="card-title"
            value={block.data.title}
            onChange={(e) => handleDataChange("title", e.target.value)}
            placeholder="Card title"
          />
        </div>

        <div>
          <Label htmlFor="card-description">Description (Optional)</Label>
          <Textarea
            id="card-description"
            value={block.data.description || ""}
            onChange={(e) => handleDataChange("description", e.target.value)}
            placeholder="Card description..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="card-footer">Footer (Optional)</Label>
          <Input
            id="card-footer"
            value={block.data.footer || ""}
            onChange={(e) => handleDataChange("footer", e.target.value)}
            placeholder="e.g., Posted on Jan 1, 2025"
          />
        </div>

        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="image" className="border-0">
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {block.data.image ? "Edit Image" : "Add Image"}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-3">
              <div>
                <Label htmlFor="card-image-src">Image URL</Label>
                <Input
                  id="card-image-src"
                  value={block.data.image?.src || ""}
                  onChange={(e) => handleImageChange("src", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="card-image-alt">Image Alt Text</Label>
                <Input
                  id="card-image-alt"
                  value={block.data.image?.alt || ""}
                  onChange={(e) => handleImageChange("alt", e.target.value)}
                  placeholder="Describe the image"
                />
              </div>
              {block.data.image?.src && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  className="w-full"
                >
                  Remove Image
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="link" className="border-0">
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {block.data.link ? "Edit Link" : "Add Link"}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-3">
              <div>
                <Label htmlFor="card-link-href">Link URL</Label>
                <Input
                  id="card-link-href"
                  value={block.data.link?.href || ""}
                  onChange={(e) => handleLinkChange("href", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="card-link-text">Link Text (Optional)</Label>
                <Input
                  id="card-link-text"
                  value={block.data.link?.text || ""}
                  onChange={(e) => handleLinkChange("text", e.target.value)}
                  placeholder="e.g., Learn more"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="card-link-newtab"
                  checked={block.data.link?.openInNewTab || false}
                  onChange={(e) =>
                    handleLinkChange("openInNewTab", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="card-link-newtab" className="cursor-pointer">
                  Open in new tab
                </Label>
              </div>
              {block.data.link?.href && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeLink}
                  className="w-full"
                >
                  Remove Link
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="card-variant">Variant</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="card-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="elevated">Elevated</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {/* Padding - Responsive aware */}
          <ResponsiveField
            fieldName="padding"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as CardBlockData["data"] })
            }
            label="Padding"
          >
            <Select
              value={padding}
              onValueChange={(value) => handleDataChange("padding", value)}
            >
              <SelectTrigger id="card-padding">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div
            className={`${variantStyles[variant]} rounded-lg overflow-hidden bg-background`}
          >
            {block.data.image && block.data.image.src && (
              <div className="relative aspect-video">
                <img
                  src={block.data.image.src}
                  alt={block.data.image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className={paddingMap[padding]}>
              <h3 className="font-semibold text-lg">
                {block.data.title || "Card Title"}
              </h3>
              {block.data.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {block.data.description}
                </p>
              )}
              {block.data.footer && (
                <p className="text-xs text-muted-foreground mt-2">
                  {block.data.footer}
                </p>
              )}
              {block.data.link && block.data.link.href && (
                <a
                  href={block.data.link.href}
                  className="text-sm text-primary mt-2 inline-block"
                >
                  {block.data.link.text || "Learn more →"}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
