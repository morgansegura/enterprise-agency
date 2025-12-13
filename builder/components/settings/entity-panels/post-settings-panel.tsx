"use client";

import * as React from "react";
import {
  SettingsSection,
  SettingsForm,
  SettingsField,
} from "@/components/ui/settings-drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { EditRouteContext, CreateRouteContext } from "@/lib/settings";

// =============================================================================
// Types
// =============================================================================

export interface PostSettingsData {
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled" | "archived";
  excerpt?: string;
  category?: string;
  tags: string[];
  author?: string;
  publishDate?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface PostSettingsPanelProps {
  context: EditRouteContext | CreateRouteContext;
  data: Partial<PostSettingsData>;
  onChange: (field: keyof PostSettingsData, value: unknown) => void;
  isLoading?: boolean;
  availableCategories?: string[];
  availableTags?: string[];
}

// =============================================================================
// Component
// =============================================================================

export function PostSettingsPanel({
  context,
  data,
  onChange,
  isLoading,
  availableCategories = [],
  availableTags = [],
}: PostSettingsPanelProps) {
  const [newTag, setNewTag] = React.useState("");

  const handleAddTag = () => {
    if (newTag && !data.tags?.includes(newTag)) {
      onChange("tags", [...(data.tags || []), newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange("tags", (data.tags || []).filter((t) => t !== tagToRemove));
  };

  return (
    <>
      <SettingsSection
        title="General"
        description="Basic post information."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              value={data.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Post title"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="post-slug">Slug</Label>
            <Input
              id="post-slug"
              value={data.slug || ""}
              onChange={(e) => onChange("slug", e.target.value)}
              placeholder="post-url-slug"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="post-excerpt">Excerpt</Label>
            <Textarea
              id="post-excerpt"
              value={data.excerpt || ""}
              onChange={(e) => onChange("excerpt", e.target.value)}
              placeholder="Brief summary of the post"
              rows={3}
              disabled={isLoading}
            />
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Publishing"
        description="Status and scheduling options."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="post-status">Status</Label>
            <Select
              value={data.status || "draft"}
              onValueChange={(value) => onChange("status", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="post-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>

          {data.status === "scheduled" && (
            <SettingsField>
              <Label htmlFor="publish-date">Publish Date</Label>
              <Input
                id="publish-date"
                type="datetime-local"
                value={data.publishDate || ""}
                onChange={(e) => onChange("publishDate", e.target.value)}
                disabled={isLoading}
              />
            </SettingsField>
          )}

          <SettingsField>
            <Label htmlFor="post-author">Author</Label>
            <Input
              id="post-author"
              value={data.author || ""}
              onChange={(e) => onChange("author", e.target.value)}
              placeholder="Author name"
              disabled={isLoading}
            />
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Organization"
        description="Categories and tags for content organization."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="post-category">Category</Label>
            <Select
              value={data.category || ""}
              onValueChange={(value) => onChange("category", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="post-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No category</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsField>

          <SettingsField>
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={isLoading || !newTag}
              >
                Add
              </Button>
            </div>
            {(data.tags?.length || 0) > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {data.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="SEO"
        description="Search engine optimization."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="post-meta-title">Meta Title</Label>
            <Input
              id="post-meta-title"
              value={data.metaTitle || ""}
              onChange={(e) => onChange("metaTitle", e.target.value)}
              placeholder="SEO title"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="post-meta-description">Meta Description</Label>
            <Textarea
              id="post-meta-description"
              value={data.metaDescription || ""}
              onChange={(e) => onChange("metaDescription", e.target.value)}
              placeholder="SEO description"
              rows={3}
              disabled={isLoading}
            />
          </SettingsField>
        </SettingsForm>
      </SettingsSection>
    </>
  );
}
