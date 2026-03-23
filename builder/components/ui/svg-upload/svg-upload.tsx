"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Upload, X, Code, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface SvgUploadProps {
  label: string;
  description?: string;
  value?: string; // Raw SVG string
  onChange: (svg: string) => void;
  aspectRatio?: "square" | "wide";
  className?: string;
}

/**
 * Sanitize SVG by removing potentially harmful elements/attributes
 */
function sanitizeSvg(svg: string): string {
  // Remove script tags and event handlers
  const sanitized = svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "");

  return sanitized;
}

/**
 * Validate that string is valid SVG
 */
function isValidSvg(str: string): boolean {
  if (!str || typeof str !== "string") return false;

  const trimmed = str.trim();
  if (!trimmed.startsWith("<svg") && !trimmed.startsWith("<?xml")) return false;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "image/svg+xml");
    const parseError = doc.querySelector("parsererror");
    return !parseError;
  } catch {
    return false;
  }
}

/**
 * Extract viewBox or create one from width/height
 */
function normalizeSvg(svg: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const svgEl = doc.querySelector("svg");

  if (!svgEl) return svg;

  // Ensure viewBox exists
  if (!svgEl.getAttribute("viewBox")) {
    const width = svgEl.getAttribute("width") || "100";
    const height = svgEl.getAttribute("height") || "100";
    svgEl.setAttribute(
      "viewBox",
      `0 0 ${parseFloat(width)} ${parseFloat(height)}`,
    );
  }

  // Remove fixed width/height so SVG scales
  svgEl.removeAttribute("width");
  svgEl.removeAttribute("height");

  // Add currentColor support for fill if not set
  if (!svgEl.getAttribute("fill")) {
    svgEl.setAttribute("fill", "currentColor");
  }

  return svgEl.outerHTML;
}

export function SvgUpload({
  label,
  description,
  value,
  onChange,
  aspectRatio = "square",
  className,
}: SvgUploadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    if (!file.type.includes("svg")) {
      setError("Please upload an SVG file");
      return;
    }

    if (file.size > 100 * 1024) {
      setError("SVG must be under 100KB");
      return;
    }

    try {
      const text = await file.text();
      processSvg(text);
    } catch {
      setError("Failed to read file");
    }
  };

  const processSvg = (svg: string) => {
    const sanitized = sanitizeSvg(svg);

    if (!isValidSvg(sanitized)) {
      setError("Invalid SVG format");
      return;
    }

    const normalized = normalizeSvg(sanitized);
    onChange(normalized);
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handlePaste = () => {
    setEditValue(value || "");
    setIsEditing(true);
  };

  const handleSaveCode = () => {
    processSvg(editValue);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const previewClasses = cn(
    "relative flex items-center justify-center rounded-lg border-2 border-dashed transition-colors",
    aspectRatio === "square" ? "h-24 w-24" : "h-20 w-48",
    isDragging && "border-primary bg-primary/5",
    !isDragging &&
      !value &&
      "border-muted-foreground/25 hover:border-muted-foreground/50",
    value && "border-transparent bg-muted",
    className,
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex gap-1">
          {value && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handlePaste}
                className="h-6 px-2 text-xs text-muted-foreground"
              >
                <Code className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Paste SVG code here..."
            className="font-mono text-xs h-32"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveCode}>
              <Check className="h-3 w-3 mr-1" />
              Apply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={previewClasses}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
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
            accept=".svg,image/svg+xml"
            onChange={handleInputChange}
            className="sr-only"
          />

          {value ? (
            <div
              className={cn(
                "flex items-center justify-center text-foreground",
                aspectRatio === "square" ? "h-16 w-16" : "h-12 w-40",
              )}
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              {isDragging ? (
                <>
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Drop SVG</span>
                </>
              ) : (
                <>
                  <Code className="h-6 w-6" />
                  <span className="text-xs">Upload SVG</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {description && !isEditing && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
