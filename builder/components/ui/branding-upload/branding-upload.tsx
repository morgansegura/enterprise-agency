"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BrandingUploadProps {
  label: string;
  description?: string;
  value?: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<{ url: string }>;
  accept?: string;
  aspectRatio?: "square" | "wide";
  maxSizeKB?: number;
  disabled?: boolean;
  className?: string;
}

export function BrandingUpload({
  label,
  description,
  value,
  onChange,
  onUpload,
  accept = "image/svg+xml,image/png,image/jpeg,image/webp",
  aspectRatio = "square",
  maxSizeKB = 500,
  disabled = false,
  className,
}: BrandingUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate file size
    if (file.size > maxSizeKB * 1024) {
      setError(`File must be under ${maxSizeKB}KB`);
      return;
    }

    // Validate file type
    const validTypes = accept.split(",").map((t) => t.trim());
    if (!validTypes.some((type) => file.type === type || type === "*/*")) {
      setError("Invalid file type");
      return;
    }

    try {
      setIsUploading(true);
      const result = await onUpload(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const previewClasses = cn(
    "relative flex items-center justify-center rounded-lg border-2 border-dashed transition-colors",
    aspectRatio === "square" ? "h-24 w-24" : "h-20 w-40",
    isDragging && "border-primary bg-primary/5",
    !isDragging && !value && "border-muted-foreground/25 hover:border-muted-foreground/50",
    value && "border-transparent bg-muted",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isUploading}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3 mr-1" />
            Remove
          </Button>
        )}
      </div>

      <div
        className={previewClasses}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          className="sr-only"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xs">Uploading...</span>
          </div>
        ) : value ? (
          <img
            src={value}
            alt={label}
            className={cn(
              "object-contain",
              aspectRatio === "square" ? "h-20 w-20" : "h-16 w-36"
            )}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            {isDragging ? (
              <>
                <Upload className="h-6 w-6" />
                <span className="text-xs">Drop to upload</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Click or drag</span>
              </>
            )}
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
