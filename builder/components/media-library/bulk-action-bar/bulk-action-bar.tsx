"use client";

import { FolderInput, Tag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./bulk-action-bar.css";

interface BulkActionBarProps {
  count: number;
  onMoveToFolder?: () => void;
  onAddTags?: () => void;
  onDelete?: () => void;
  onClear?: () => void;
}

export function BulkActionBar({
  count,
  onMoveToFolder,
  onAddTags,
  onDelete,
  onClear,
}: BulkActionBarProps) {
  if (count === 0) return null;

  return (
    <div data-slot="bulk-action-bar" role="toolbar" aria-label="Bulk actions">
      <span data-slot="bulk-action-count">
        {count} selected
      </span>
      {onMoveToFolder ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveToFolder}
          data-slot="bulk-action-btn"
        >
          <FolderInput aria-hidden="true" />
          Move
        </Button>
      ) : null}
      {onAddTags ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddTags}
          data-slot="bulk-action-btn"
        >
          <Tag aria-hidden="true" />
          Tag
        </Button>
      ) : null}
      {onDelete ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          data-slot="bulk-action-btn"
          data-variant="destructive"
        >
          <Trash2 aria-hidden="true" />
          Delete
        </Button>
      ) : null}
      <button
        type="button"
        data-slot="bulk-action-close"
        onClick={onClear}
        aria-label="Clear selection"
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
