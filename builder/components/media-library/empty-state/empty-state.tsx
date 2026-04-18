"use client";

import { Upload, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./empty-state.css";

interface EmptyStateProps {
  variant?: "no-results" | "empty" | "filtered";
  onUploadClick?: () => void;
  onClearFilters?: () => void;
}

export function EmptyState({
  variant = "empty",
  onUploadClick,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div data-slot="empty-state" data-variant={variant}>
      <div data-slot="empty-state-icon">
        <ImageOff aria-hidden="true" />
      </div>
      <h3 data-slot="empty-state-title">
        {variant === "no-results"
          ? "No media found"
          : variant === "filtered"
            ? "No matches"
            : "Your library is empty"}
      </h3>
      <p data-slot="empty-state-description">
        {variant === "no-results"
          ? "Try adjusting your search or filters."
          : variant === "filtered"
            ? "Try adjusting your filters or clear them to see all media."
            : "Upload images, videos, and files to get started."}
      </p>
      {variant === "empty" && onUploadClick ? (
        <Button onClick={onUploadClick} size="sm">
          <Upload aria-hidden="true" />
          Upload files
        </Button>
      ) : null}
      {variant === "filtered" && onClearFilters ? (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
