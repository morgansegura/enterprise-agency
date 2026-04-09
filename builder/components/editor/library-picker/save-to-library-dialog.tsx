"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useCreateLibraryItem,
  type LibraryItemType,
} from "@/lib/hooks/use-library";

interface SaveToLibraryDialogProps {
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** SECTION or BLOCK */
  type: LibraryItemType;
  /** The element data to save (serialized section or block) */
  content: Record<string, unknown>;
  /** Default name to suggest */
  defaultName?: string;
  /** Called after successful save */
  onSaved?: () => void;
}

/**
 * Modal that prompts the user for a name and description, then saves
 * the given section/block to the library.
 */
export function SaveToLibraryDialog({
  tenantId,
  open,
  onOpenChange,
  type,
  content,
  defaultName = "",
  onSaved,
}: SaveToLibraryDialogProps) {
  const [name, setName] = React.useState(defaultName);
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setName(defaultName);
      setDescription("");
    }
  }, [open, defaultName]);

  const createItem = useCreateLibraryItem(tenantId);

  const handleSave = () => {
    if (!name.trim()) return;
    createItem.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        content,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSaved?.();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Save {type === "SECTION" ? "Section" : "Block"} to Library
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="library-item-name">Name</Label>
            <Input
              id="library-item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hero with CTA"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="library-item-description">
              Description{" "}
              <span className="text-(--el-400) font-normal">(optional)</span>
            </Label>
            <Textarea
              id="library-item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description to help you find it later"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || createItem.isPending}
          >
            {createItem.isPending ? "Saving..." : "Save to Library"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
