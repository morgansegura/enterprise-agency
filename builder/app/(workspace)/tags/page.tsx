"use client";

import * as React from "react";
import {
  useTagsWithCounts,
  useRenameTag,
  useDeleteTag,
  type Tag,
} from "@/lib/hooks/use-tags";
import { PageHeader } from "@/components/layout/page-header";
import { Tags } from "lucide-react";
import { toast } from "sonner";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import { TagsList } from "./components/tags-list";
import { RenameDialog } from "./components/rename-dialog";

import "./tags.css";

export default function TagsPage() {
  const { tenantId } = useResolvedTenant();
  const id = tenantId!;

  const { data: tags, isLoading, error } = useTagsWithCounts(id);
  const renameTag = useRenameTag(id);
  const deleteTag = useDeleteTag(id);

  const [search, setSearch] = React.useState("");
  const [renaming, setRenaming] = React.useState<Tag | null>(null);
  const [newName, setNewName] = React.useState("");

  const filteredTags = React.useMemo(() => {
    if (!tags) return [];
    if (!search) return tags;
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tags, search]);

  const handleRename = async () => {
    if (!renaming || !newName.trim()) return;
    if (newName === renaming.name) {
      setRenaming(null);
      return;
    }
    try {
      const result = await renameTag.mutateAsync({
        oldName: renaming.name,
        newName: newName.trim(),
      });
      toast.success(
        `Tag renamed to "${newName.trim()}" (${result.updatedCount} post(s) updated)`,
      );
      setRenaming(null);
      setNewName("");
    } catch {
      toast.error("Failed to rename tag");
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (
      !confirm(
        `Delete tag "${tag.name}"? It will be removed from ${tag.count} post(s).`,
      )
    ) {
      return;
    }
    try {
      await deleteTag.mutateAsync(tag.name);
      toast.success(`Tag "${tag.name}" deleted`);
    } catch {
      toast.error("Failed to delete tag");
    }
  };

  const handleStartRename = (tag: Tag) => {
    setRenaming(tag);
    setNewName(tag.name);
  };

  if (error) {
    return (
      <div className="tags-page">
        <PageHeader
          title="Tags"
          icon={Tags}
          description="Failed to load tags"
        />
      </div>
    );
  }

  return (
    <div className="tags-page">
      <PageHeader
        title="Tags"
        icon={Tags}
        count={tags?.length || 0}
        singularName="tag"
        pluralName="tags"
        showSearch
        searchPlaceholder="Search tags..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <TagsList
        tags={filteredTags}
        isLoading={isLoading}
        search={search}
        onRename={handleStartRename}
        onDelete={handleDelete}
      />

      {renaming && (
        <RenameDialog
          tag={renaming}
          newName={newName}
          onNewNameChange={setNewName}
          onRename={handleRename}
          onClose={() => setRenaming(null)}
          isPending={renameTag.isPending}
        />
      )}
    </div>
  );
}
