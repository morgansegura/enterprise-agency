"use client";

import * as React from "react";
import { BlocksLibrary } from "./blocks-library";
import { PostSettings } from "./post-settings";
import { PageLayers } from "./page-layers";
import { BreakpointSelector, type Breakpoint } from "./breakpoint-selector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./page-editor-layout.css";

interface PostEditorLayoutProps {
  postId: string;
  postTitle: string;
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
  breakpoint?: Breakpoint;
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
  onSave: () => void;
  onPublish: () => void;
  onPostChange: (field: string, value: unknown) => void;
  isSaving?: boolean;
  children: React.ReactNode;
}

export function PostEditorLayout({
  postId,
  postTitle,
  post,
  breakpoint = "desktop",
  onBreakpointChange,
  onSave,
  onPublish,
  onPostChange,
  isSaving = false,
  children,
}: PostEditorLayoutProps) {
  const [leftSidebarOpen, setLeftSidebarOpen] = React.useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = React.useState(false);
  const [activeRightTab, setActiveRightTab] = React.useState<
    "settings" | "layers"
  >("settings");

  return (
    <div className="page-editor-layout">
      {/* Top Toolbar */}
      <div className="page-editor-toolbar">
        <div className="page-editor-toolbar-left">
          <h2 className="text-lg font-semibold">{postTitle}</h2>
          {isSaving && (
            <span className="text-sm text-muted-foreground">Saving...</span>
          )}
        </div>
        <div className="page-editor-toolbar-center">
          {onBreakpointChange && (
            <BreakpointSelector
              value={breakpoint}
              onChange={onBreakpointChange}
            />
          )}
        </div>
        <div className="page-editor-toolbar-right">
          <Button variant="outline" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={onPublish}>Publish</Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="page-editor-content">
        {/* Left Sidebar - Blocks Library */}
        <aside
          className={cn(
            "page-editor-sidebar page-editor-sidebar-left",
            !leftSidebarOpen && "page-editor-sidebar-collapsed",
          )}
        >
          <div className="page-editor-sidebar-header">
            <h3 className="font-semibold">Blocks</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            >
              {leftSidebarOpen ? "◀" : "▶"}
            </Button>
          </div>
          {leftSidebarOpen && (
            <div className="page-editor-sidebar-content">
              <BlocksLibrary />
            </div>
          )}
        </aside>

        {/* Canvas */}
        <main className="page-editor-canvas">{children}</main>

        {/* Right Sidebar - Settings & Layers */}
        <aside
          className={cn(
            "page-editor-sidebar page-editor-sidebar-right",
            !rightSidebarOpen && "page-editor-sidebar-collapsed",
          )}
        >
          <div className="page-editor-sidebar-header">
            <div className="flex gap-2">
              <Button
                variant={activeRightTab === "settings" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActiveRightTab("settings");
                  setRightSidebarOpen(true);
                }}
              >
                Settings
              </Button>
              <Button
                variant={activeRightTab === "layers" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActiveRightTab("layers");
                  setRightSidebarOpen(true);
                }}
              >
                Layers
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              {rightSidebarOpen ? "▶" : "◀"}
            </Button>
          </div>
          {rightSidebarOpen && (
            <div className="page-editor-sidebar-content">
              {activeRightTab === "settings" && (
                <PostSettings post={post} onChange={onPostChange} />
              )}
              {activeRightTab === "layers" && <PageLayers />}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
