"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface PostSettingsProps {
  post: {
    title: string;
    slug: string;
    status?: string;
    author?: string;
    publishDate?: string;
    excerpt?: string;
    featuredImage?: string;
    categories?: string[];
    tags?: string[];
  };
  onChange: (field: string, value: unknown) => void;
}

export function PostSettings({ post, onChange }: PostSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="post-title">Title</Label>
          <Input
            id="post-title"
            value={post.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Enter post title"
          />
        </div>

        <div>
          <Label htmlFor="post-slug">Slug</Label>
          <Input
            id="post-slug"
            value={post.slug}
            onChange={(e) => onChange("slug", e.target.value)}
            placeholder="post-slug"
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL-friendly version of the title
          </p>
        </div>

        <div>
          <Label htmlFor="post-excerpt">Excerpt</Label>
          <Textarea
            id="post-excerpt"
            value={post.excerpt || ""}
            onChange={(e) => onChange("excerpt", e.target.value)}
            placeholder="Brief summary of the post"
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Shown in post listings and meta descriptions
          </p>
        </div>
      </div>

      <Separator />

      {/* Author & Date */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="post-author">Author</Label>
          <Input
            id="post-author"
            value={post.author || ""}
            onChange={(e) => onChange("author", e.target.value)}
            placeholder="Author name"
          />
        </div>

        <div>
          <Label htmlFor="post-publish-date">Publish Date</Label>
          <Input
            id="post-publish-date"
            type="datetime-local"
            value={
              post.publishDate
                ? new Date(post.publishDate).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => onChange("publishDate", e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Schedule when this post should be published
          </p>
        </div>
      </div>

      <Separator />

      {/* Featured Image */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="post-featured-image">Featured Image</Label>
          <Input
            id="post-featured-image"
            value={post.featuredImage || ""}
            onChange={(e) => onChange("featuredImage", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {post.featuredImage && (
            <div className="mt-2 border rounded-md overflow-hidden">
              <img
                src={post.featuredImage}
                alt="Featured"
                className="w-full h-auto"
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Main image for the post (shown in listings and social shares)
          </p>
        </div>
      </div>

      <Separator />

      {/* Categories & Tags */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="post-categories">Categories</Label>
          <Input
            id="post-categories"
            value={post.categories?.join(", ") || ""}
            onChange={(e) =>
              onChange(
                "categories",
                e.target.value.split(",").map((cat) => cat.trim()),
              )
            }
            placeholder="News, Updates, Tutorial"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Comma-separated list of categories
          </p>
        </div>

        <div>
          <Label htmlFor="post-tags">Tags</Label>
          <Input
            id="post-tags"
            value={post.tags?.join(", ") || ""}
            onChange={(e) =>
              onChange(
                "tags",
                e.target.value.split(",").map((tag) => tag.trim()),
              )
            }
            placeholder="javascript, react, typescript"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Comma-separated list of tags
          </p>
        </div>
      </div>

      <Separator />

      {/* Status */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="post-status">Status</Label>
          <Select
            value={post.status || "draft"}
            onValueChange={(value) => onChange("status", value)}
          >
            <SelectTrigger id="post-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
