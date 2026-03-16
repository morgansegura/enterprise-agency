"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Video, FileText, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MediaLibraryPicker } from "@/components/ui/media-library/media-library-picker";
import { useTenantStore } from "@/lib/stores/tenant-store";
import type { Asset } from "@/lib/hooks/use-assets";
import type { MediaFieldSchema } from "@/lib/schemas";

import "./media-field.css";

export interface MediaValue {
  id?: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  fileType?: string;
}

export interface MediaFieldProps {
  schema: MediaFieldSchema;
  value: MediaValue | MediaValue[] | string | undefined;
  onChange: (value: MediaValue | MediaValue[] | string | undefined) => void;
  error?: string;
  className?: string;
}

/**
 * MediaField — Field editor for selecting media from the library.
 * Uses the existing MediaLibraryPicker component.
 */
export function MediaField({
  schema,
  value,
  onChange,
  error,
  className,
}: MediaFieldProps) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const tenantId = useTenantStore((s) => s.activeTenantId) || "";
  const hasError = !!error;

  const normalizedValue = React.useMemo(() => {
    if (!value) return [];
    if (typeof value === "string") return [{ src: value }];
    if (Array.isArray(value)) return value;
    return [value];
  }, [value]);

  const handleSelect = (asset: Asset) => {
    const mediaValue: MediaValue = {
      id: asset.id,
      src: asset.url,
      alt: asset.altText || asset.fileName,
      width: asset.width,
      height: asset.height,
      fileType: asset.fileType,
    };

    if (schema.multiple) {
      onChange([...normalizedValue, mediaValue]);
    } else {
      onChange(mediaValue);
    }
    setPickerOpen(false);
  };

  const handleRemove = (index: number) => {
    if (schema.multiple) {
      const newValues = normalizedValue.filter((_, i) => i !== index);
      onChange(newValues.length > 0 ? newValues : undefined);
    } else {
      onChange(undefined);
    }
  };

  const resolveFileType = (): "image" | "video" | "audio" | "document" | undefined => {
    if (!schema.accept) return undefined;
    const first = schema.accept[0];
    if (first?.startsWith("image/")) return "image";
    if (first?.startsWith("video/")) return "video";
    if (first?.startsWith("audio/")) return "audio";
    return "document";
  };

  const getMediaIcon = (mediaValue: MediaValue) => {
    if (mediaValue.fileType?.startsWith("video/")) return Video;
    if (mediaValue.fileType?.startsWith("application/")) return FileText;
    return ImageIcon;
  };

  const canAddMore = schema.multiple
    ? !schema.maxFiles || normalizedValue.length < schema.maxFiles
    : normalizedValue.length === 0;

  return (
    <div className={cn("media-field", className)} data-width={schema.width}>
      <Label className="media-field__label">
        {schema.label}
        {schema.validation?.required && (
          <span className="media-field__required">*</span>
        )}
      </Label>

      <div className="media-field__content">
        {normalizedValue.length > 0 && (
          <div
            className={cn(
              "media-field__previews",
              schema.multiple && "media-field__previews--grid",
            )}
          >
            {normalizedValue.map((mediaValue, index) => {
              const Icon = getMediaIcon(mediaValue);
              const isImage =
                !mediaValue.fileType ||
                mediaValue.fileType.startsWith("image/");

              return (
                <div key={index} className="media-field__preview">
                  {isImage && mediaValue.src ? (
                    <img
                      src={mediaValue.src}
                      alt={mediaValue.alt || ""}
                      className="media-field__preview-image"
                    />
                  ) : (
                    <div className="media-field__preview-icon">
                      <Icon className="media-field__preview-icon-svg" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="media-field__remove"
                    aria-label="Remove media"
                  >
                    <X className="media-field__remove-icon" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {canAddMore && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setPickerOpen(true)}
            className={cn(
              "media-field__select-btn",
              hasError && "media-field__select-btn--error",
            )}
          >
            <Upload className="media-field__select-icon" />
            {normalizedValue.length === 0 ? "Select media" : "Add more"}
          </Button>
        )}
      </div>

      {schema.description && !hasError && (
        <p className="media-field__description">{schema.description}</p>
      )}

      {hasError && <p className="media-field__error">{error}</p>}

      <MediaLibraryPicker
        tenantId={tenantId}
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelect}
        fileType={resolveFileType()}
        title={`Select ${schema.label}`}
      />
    </div>
  );
}
