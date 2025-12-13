"use client";

import * as React from "react";
import { useTagsWithCounts, useRenameTag, useDeleteTag, type Tag } from "@/lib/hooks";
import { ContentList } from "@/components/layout/content-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tags, Pencil } from "lucide-react";

// Tag item type for ContentList
interface TagItem {
  id: string;
  title: string;
  name: string;
  slug: string;
  count: number;
}

export default function TagsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  // State
  const [editingTag, setEditingTag] = React.useState<TagItem | null>(null);
  const [newTagName, setNewTagName] = React.useState("");

  // Queries
  const { data: tags, isLoading, error } = useTagsWithCounts(id);
  const renameTag = useRenameTag(id);
  const deleteTag = useDeleteTag(id);

  // Transform tags to include title field for ContentList
  const tagItems: TagItem[] = React.useMemo(() => {
    if (!tags) return [];
    return tags.map((t) => ({
      ...t,
      title: t.name,
    }));
  }, [tags]);

  // Handlers
  const handleCreate = () => {
    toast.info("Tags are created by adding them to posts");
  };

  const handleEdit = (tag: TagItem) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
  };

  const handleDelete = (tag: TagItem) => {
    if (confirm(`Delete tag "${tag.name}"? This will remove it from ${tag.count} post(s).`)) {
      deleteTag.mutate(tag.name, {
        onSuccess: () => {
          toast.success(`Tag "${tag.name}" deleted`);
        },
        onError: () => {
          toast.error("Failed to delete tag");
        },
      });
    }
  };

  const handleRename = () => {
    if (!editingTag || !newTagName.trim()) return;
    if (newTagName === editingTag.name) {
      setEditingTag(null);
      return;
    }

    renameTag.mutate(
      { oldName: editingTag.name, newName: newTagName.trim() },
      {
        onSuccess: (result) => {
          toast.success(`Tag renamed to "${newTagName}" (${result.updatedCount} post(s) updated)`);
          setEditingTag(null);
        },
        onError: () => {
          toast.error("Failed to rename tag");
        },
      }
    );
  };

  return (
    <>
      <ContentList<TagItem>
        title="Tags"
        singularName="Tag"
        pluralName="tags"
        icon={Tags}
        items={tagItems}
        isLoading={isLoading}
        error={error}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showStatus={false}
        searchFields={["title", "name", "slug"]}
        menuActions={[
          {
            label: "Rename",
            icon: Pencil,
            onClick: handleEdit,
          },
        ]}
        renderListMeta={(tag) => (
          <span className="text-sm text-(--muted-foreground)">
            {tag.count} {tag.count === 1 ? "post" : "posts"}
          </span>
        )}
        renderMeta={(tag) => (
          <p className="text-xs text-(--muted-foreground) mt-1">
            Used in {tag.count} {tag.count === 1 ? "post" : "posts"}
          </p>
        )}
      />

      {/* Rename Tag Dialog */}
      <Dialog
        open={!!editingTag}
        onOpenChange={(open) => !open && setEditingTag(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Tag</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input
                id="tag-name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter new tag name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                }}
              />
            </div>
            {editingTag && editingTag.count > 0 && (
              <p className="text-sm text-(--muted-foreground)">
                This will update {editingTag.count} post(s) using this tag.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTag(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!newTagName.trim() || renameTag.isPending}
            >
              {renameTag.isPending ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
