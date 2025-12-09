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
import { Trash2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

interface ImageLinkData {
  href: string;
  openInNewTab?: boolean;
}

interface ImageBlockData {
  _key: string;
  _type: "image-block";
  data: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2" | "auto";
    objectFit?: "cover" | "contain" | "fill" | "none";
    rounded?: boolean;
    caption?: string;
    link?: ImageLinkData;
    _responsive?: {
      tablet?: Partial<ImageBlockData["data"]>;
      mobile?: Partial<ImageBlockData["data"]>;
    };
  };
}

interface ImageBlockEditorProps {
  block: ImageBlockData;
  onChange: (block: ImageBlockData) => void;
  onDelete: () => void;
}

export function ImageBlockEditor({
  block,
  onChange,
  onDelete,
}: ImageBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as ImageBlockData["data"] }),
  );

  const handleLinkChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        link: {
          ...block.data.link,
          [field]: value,
        } as ImageLinkData,
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

  // Get responsive-aware values
  const aspectRatio =
    getResponsiveValue<string>(block.data, "aspectRatio", breakpoint) || "16/9";
  const objectFit =
    getResponsiveValue<string>(block.data, "objectFit", breakpoint) || "cover";

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg overflow-hidden hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        {block.data.src ? (
          <div
            className={`relative ${aspectRatio !== "auto" ? "aspect-[var(--aspect)]" : ""}`}
            style={
              {
                "--aspect": aspectRatio.replace("/", " / "),
              } as React.CSSProperties
            }
          >
            <img
              src={block.data.src}
              alt={block.data.alt || "Image"}
              className={`w-full h-full object-${objectFit} ${block.data.rounded ? "rounded" : ""}`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 bg-muted/30">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No image set</p>
            </div>
          </div>
        )}
        {block.data.caption && (
          <p className="text-sm text-muted-foreground p-2 text-center">
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
          <ImageIcon className="h-4 w-4" />
          Image Block
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
          <Label htmlFor="image-src">Image URL</Label>
          <Input
            id="image-src"
            value={block.data.src}
            onChange={(e) => handleDataChange("src", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="image-alt">Alt Text (Required)</Label>
          <Input
            id="image-alt"
            value={block.data.alt}
            onChange={(e) => handleDataChange("alt", e.target.value)}
            placeholder="Describe the image for accessibility"
          />
        </FormItem>

        <div className="grid grid-cols-2 gap-3">
          {/* Aspect Ratio - Responsive aware */}
          <ResponsiveField
            fieldName="aspectRatio"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as ImageBlockData["data"] })
            }
            label="Aspect Ratio"
          >
            <Select
              value={aspectRatio}
              onValueChange={(value) => handleDataChange("aspectRatio", value)}
            >
              <SelectTrigger id="image-aspect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="4/3">4:3 (Standard)</SelectItem>
                <SelectItem value="1/1">1:1 (Square)</SelectItem>
                <SelectItem value="3/2">3:2 (Photo)</SelectItem>
                <SelectItem value="auto">Auto (Original)</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          {/* Object Fit - Responsive aware */}
          <ResponsiveField
            fieldName="objectFit"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as ImageBlockData["data"] })
            }
            label="Object Fit"
          >
            <Select
              value={objectFit}
              onValueChange={(value) => handleDataChange("objectFit", value)}
            >
              <SelectTrigger id="image-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover (Fill)</SelectItem>
                <SelectItem value="contain">Contain (Fit)</SelectItem>
                <SelectItem value="fill">Fill (Stretch)</SelectItem>
                <SelectItem value="none">None (Original)</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>
        </div>

        <FormItem>
          <Label htmlFor="image-caption">Caption (Optional)</Label>
          <Textarea
            id="image-caption"
            value={block.data.caption || ""}
            onChange={(e) => handleDataChange("caption", e.target.value)}
            placeholder="Image caption or description"
            rows={2}
          />
        </FormItem>

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
              <FormItem>
                <Label htmlFor="image-link-href">Link URL</Label>
                <Input
                  id="image-link-href"
                  value={block.data.link?.href || ""}
                  onChange={(e) => handleLinkChange("href", e.target.value)}
                  placeholder="https://example.com"
                />
              </FormItem>
              <FormItem className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  id="image-link-newtab"
                  checked={block.data.link?.openInNewTab || false}
                  onChange={(e) =>
                    handleLinkChange("openInNewTab", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="image-link-newtab" className="cursor-pointer">
                  Open in new tab
                </Label>
              </FormItem>
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

        {block.data.src && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">
              Preview ({breakpoint}):
            </p>
            <div
              className={`relative ${aspectRatio !== "auto" ? "aspect-[var(--aspect)]" : ""}`}
              style={
                {
                  "--aspect": aspectRatio.replace("/", " / "),
                } as React.CSSProperties
              }
            >
              <img
                src={block.data.src}
                alt={block.data.alt || "Image"}
                className={`w-full h-full object-${objectFit} ${block.data.rounded ? "rounded" : ""}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
