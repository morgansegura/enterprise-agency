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
import { Switch } from "@/components/ui/switch";

// =============================================================================
// Types
// =============================================================================

export interface BlogGlobalSettingsData {
  // General
  blogTitle: string;
  blogDescription: string;
  postsPerPage: number;

  // Display
  defaultLayout: "grid" | "list" | "masonry";
  showExcerpts: boolean;
  excerptLength: number;
  showFeaturedImages: boolean;
  showAuthor: boolean;
  showDate: boolean;
  showReadTime: boolean;

  // Categories & Tags
  showCategories: boolean;
  showTags: boolean;
  showCategoriesInSidebar: boolean;

  // Comments
  commentsEnabled: boolean;
  commentModeration: "none" | "manual" | "auto";
  requireApproval: boolean;

  // RSS
  rssEnabled: boolean;
  rssPostCount: number;
  rssIncludeFullContent: boolean;

  // Social
  socialSharingEnabled: boolean;
  shareButtons: ("twitter" | "facebook" | "linkedin" | "email")[];
}

interface BlogGlobalSettingsProps {
  data: Partial<BlogGlobalSettingsData>;
  onChange: (field: keyof BlogGlobalSettingsData, value: unknown) => void;
  isLoading?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function BlogGlobalSettings({
  data,
  onChange,
  isLoading,
}: BlogGlobalSettingsProps) {
  return (
    <>
      <SettingsSection
        title="General"
        description="Basic blog configuration."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="blog-title">Blog Title</Label>
            <Input
              id="blog-title"
              value={data.blogTitle || ""}
              onChange={(e) => onChange("blogTitle", e.target.value)}
              placeholder="My Blog"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="blog-description">Blog Description</Label>
            <Input
              id="blog-description"
              value={data.blogDescription || ""}
              onChange={(e) => onChange("blogDescription", e.target.value)}
              placeholder="A blog about..."
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Shown in RSS feeds and meta tags
            </p>
          </SettingsField>

          <SettingsField>
            <Label htmlFor="posts-per-page">Posts Per Page</Label>
            <Input
              id="posts-per-page"
              type="number"
              min="1"
              max="100"
              value={data.postsPerPage ?? 10}
              onChange={(e) => onChange("postsPerPage", parseInt(e.target.value) || 10)}
              disabled={isLoading}
            />
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Display"
        description="How posts appear on listing pages."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="default-layout">Default Layout</Label>
            <Select
              value={data.defaultLayout || "grid"}
              onValueChange={(value) => onChange("defaultLayout", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="default-layout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>

          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Excerpts</Label>
                <p className="text-xs text-muted-foreground">
                  Display post summaries on listing pages
                </p>
              </div>
              <Switch
                checked={data.showExcerpts ?? true}
                onCheckedChange={(checked) => onChange("showExcerpts", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          {data.showExcerpts && (
            <SettingsField>
              <Label htmlFor="excerpt-length">Excerpt Length (words)</Label>
              <Input
                id="excerpt-length"
                type="number"
                min="10"
                max="500"
                value={data.excerptLength ?? 55}
                onChange={(e) => onChange("excerptLength", parseInt(e.target.value) || 55)}
                disabled={isLoading}
              />
            </SettingsField>
          )}

          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Featured Images</Label>
                <p className="text-xs text-muted-foreground">
                  Show featured images on post cards
                </p>
              </div>
              <Switch
                checked={data.showFeaturedImages ?? true}
                onCheckedChange={(checked) => onChange("showFeaturedImages", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Author</Label>
                <p className="text-xs text-muted-foreground">
                  Display author name on posts
                </p>
              </div>
              <Switch
                checked={data.showAuthor ?? true}
                onCheckedChange={(checked) => onChange("showAuthor", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Date</Label>
                <p className="text-xs text-muted-foreground">
                  Display publish date on posts
                </p>
              </div>
              <Switch
                checked={data.showDate ?? true}
                onCheckedChange={(checked) => onChange("showDate", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Read Time</Label>
                <p className="text-xs text-muted-foreground">
                  Display estimated reading time
                </p>
              </div>
              <Switch
                checked={data.showReadTime ?? false}
                onCheckedChange={(checked) => onChange("showReadTime", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Comments"
        description="Configure commenting behavior."
      >
        <SettingsForm>
          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Comments</Label>
                <p className="text-xs text-muted-foreground">
                  Allow visitors to comment on posts
                </p>
              </div>
              <Switch
                checked={data.commentsEnabled ?? false}
                onCheckedChange={(checked) => onChange("commentsEnabled", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          {data.commentsEnabled && (
            <>
              <SettingsField>
                <Label htmlFor="comment-moderation">Moderation</Label>
                <Select
                  value={data.commentModeration || "manual"}
                  onValueChange={(value) => onChange("commentModeration", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="comment-moderation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No moderation</SelectItem>
                    <SelectItem value="manual">Manual approval</SelectItem>
                    <SelectItem value="auto">Auto-moderation</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsField>

              <SettingsField>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Require Approval</Label>
                    <p className="text-xs text-muted-foreground">
                      First comment from new users requires approval
                    </p>
                  </div>
                  <Switch
                    checked={data.requireApproval ?? true}
                    onCheckedChange={(checked) => onChange("requireApproval", checked)}
                    disabled={isLoading}
                  />
                </div>
              </SettingsField>
            </>
          )}
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="RSS Feed"
        description="Configure RSS feed settings."
      >
        <SettingsForm>
          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable RSS</Label>
                <p className="text-xs text-muted-foreground">
                  Provide an RSS feed for your blog
                </p>
              </div>
              <Switch
                checked={data.rssEnabled ?? true}
                onCheckedChange={(checked) => onChange("rssEnabled", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          {data.rssEnabled && (
            <>
              <SettingsField>
                <Label htmlFor="rss-post-count">Posts in Feed</Label>
                <Input
                  id="rss-post-count"
                  type="number"
                  min="5"
                  max="100"
                  value={data.rssPostCount ?? 20}
                  onChange={(e) => onChange("rssPostCount", parseInt(e.target.value) || 20)}
                  disabled={isLoading}
                />
              </SettingsField>

              <SettingsField>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Full Content in Feed</Label>
                    <p className="text-xs text-muted-foreground">
                      Include complete post content (vs. excerpt only)
                    </p>
                  </div>
                  <Switch
                    checked={data.rssIncludeFullContent ?? false}
                    onCheckedChange={(checked) => onChange("rssIncludeFullContent", checked)}
                    disabled={isLoading}
                  />
                </div>
              </SettingsField>
            </>
          )}
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Social Sharing"
        description="Configure social sharing options."
      >
        <SettingsForm>
          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Sharing</Label>
                <p className="text-xs text-muted-foreground">
                  Show social share buttons on posts
                </p>
              </div>
              <Switch
                checked={data.socialSharingEnabled ?? true}
                onCheckedChange={(checked) => onChange("socialSharingEnabled", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>
        </SettingsForm>
      </SettingsSection>
    </>
  );
}
