"use client";

/* eslint-disable @next/next/no-img-element -- dynamic CMS images */

import * as React from "react";
import { useParams } from "next/navigation";
import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaLibraryPicker } from "@/components/ui/media-library/media-library-picker";
import "./image-picker-field.css";

interface ImagePickerFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Filter: "image" | "audio" | "video" */
  fileType?: "image" | "audio" | "video" | "document";
}

/**
 * ImagePickerField — replaces raw URL text inputs with a media library picker.
 * Shows a thumbnail preview when an image is selected.
 */
export function ImagePickerField({
  value,
  onChange,
  label,
  fileType = "image",
}: ImagePickerFieldProps) {
  const params = useParams();
  const tenantId = params?.id as string;
  const [open, setOpen] = React.useState(false);

  return (
    <div className="image-picker-field">
      {label && <span className="image-picker-label">{label}</span>}

      {value ? (
        <div className="image-picker-preview">
          {fileType === "image" ? (
            <img src={value} alt="" className="image-picker-thumb" />
          ) : (
            <div className="image-picker-file">
              <ImageIcon className="size-4" />
              <span className="image-picker-filename">
                {value.split("/").pop()}
              </span>
            </div>
          )}
          <div className="image-picker-actions">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[11px]"
              onClick={() => setOpen(true)}
            >
              Change
            </Button>
            <button
              type="button"
              className="image-picker-remove"
              onClick={() => onChange("")}
              title="Remove"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="image-picker-empty"
          onClick={() => setOpen(true)}
        >
          <ImageIcon className="size-4" />
          <span>Choose {fileType}</span>
        </button>
      )}

      <MediaLibraryPicker
        tenantId={tenantId}
        open={open}
        onOpenChange={setOpen}
        onSelect={(asset) => {
          onChange(asset.url);
          setOpen(false);
        }}
        fileType={fileType}
      />
    </div>
  );
}
