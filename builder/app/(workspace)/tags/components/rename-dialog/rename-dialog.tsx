"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Tag } from "@/lib/hooks/use-tags";

import "./rename-dialog.css";

interface RenameDialogProps {
  tag: Tag;
  newName: string;
  onNewNameChange: (value: string) => void;
  onRename: () => void;
  onClose: () => void;
  isPending: boolean;
}

export function RenameDialog({
  tag,
  newName,
  onNewNameChange,
  onRename,
  onClose,
  isPending,
}: RenameDialogProps) {
  return (
    <div className="tags-rename-overlay" onClick={onClose}>
      <div className="tags-rename-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Rename Tag</h3>
        <Input
          value={newName}
          onChange={(e) => onNewNameChange(e.target.value)}
          placeholder="New tag name"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") onRename();
            if (e.key === "Escape") onClose();
          }}
        />
        {tag.count > 0 && (
          <p className="tags-rename-hint">
            This will update {tag.count} post(s) using this tag.
          </p>
        )}
        <div className="tags-rename-dialog-actions">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onRename}
            disabled={!newName.trim() || newName === tag.name || isPending}
          >
            {isPending ? "Renaming..." : "Rename"}
          </Button>
        </div>
      </div>
    </div>
  );
}
