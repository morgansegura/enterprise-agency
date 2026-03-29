"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Check,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Share2,
  PenTool,
  FileText,
  Settings,
  Home,
  Play,
} from "lucide-react";
import { type Breakpoint } from "../breakpoint-selector";
import { useParams } from "next/navigation";
import { usePreviewModeOptional } from "@/lib/context/preview-mode-context";
import { useUIStore } from "@/lib/stores/ui-store";
import { ResponsiveProvider } from "@/lib/responsive/context";
import { BRAND_NAME } from "@/lib/constants/brand";
import "./page-editor-layout.css";

interface PageEditorLayoutProps {
  pageId: string;
  pageTitle?: string;
  breakpoint?: Breakpoint;
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
  onPublish: () => void;
  onUnpublish?: () => void;
  onPreview?: () => void;
  onGeneratePreviewLink?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  previewMode?: boolean;
  isSaving?: boolean;
  isPublished?: boolean;
  hasUnsavedChanges?: boolean;
  lastSaved?: Date | null;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  children: React.ReactNode;
}

const BREAKPOINT_WIDTHS: Record<Breakpoint, string> = {
  desktop: "1440px",
  tablet: "768px",
  mobile: "375px",
};

/**
 * Page Editor Layout — Webflow-style two-bar toolbar + 3-panel editor
 */
export function PageEditorLayout({
  pageTitle,
  breakpoint = "desktop",
  onBreakpointChange,
  onPublish,
  onUnpublish,
  onPreview,
  onGeneratePreviewLink,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  previewMode = false,
  isSaving = false,
  isPublished = false,
  hasUnsavedChanges: _hasUnsavedChanges = false,
  leftPanel,
  rightPanel,
  children,
}: PageEditorLayoutProps) {
  const { setHasCustomToolbar } = usePreviewModeOptional();
  const params = useParams();
  const { selectedElement } = useUIStore();

  React.useEffect(() => {
    setHasCustomToolbar(true);
    return () => setHasCustomToolbar(false);
  }, [setHasCustomToolbar]);

  // Build breadcrumb from selection
  const breadcrumb = React.useMemo(() => {
    const parts: string[] = [];
    if (pageTitle) parts.push(pageTitle);
    if (selectedElement) {
      if (
        selectedElement.type === "section" ||
        selectedElement.type === "container" ||
        selectedElement.type === "block"
      ) {
        parts.push(`Section ${(selectedElement.sectionIndex ?? 0) + 1}`);
      }
      if (
        selectedElement.type === "container" ||
        selectedElement.type === "block"
      ) {
        parts.push(`Container ${(selectedElement.containerIndex ?? 0) + 1}`);
      }
      if (selectedElement.type === "block" && selectedElement.key) {
        parts.push(
          selectedElement.key.replace(/^figma-/, "").replace(/-\d+$/, ""),
        );
      }
    }
    return parts;
  }, [pageTitle, selectedElement]);

  // Save status indicator
  const statusDot = isSaving ? "saving" : "idle";

  return (
    <div className="page-editor-layout" data-preview-mode={previewMode}>
      {/* ================================================================
       * Bar 1 — Main nav bar
       * Brand | Mode context | Save indicator | Preview + Share + Publish
       * ================================================================ */}
      <div className="page-editor-navbar">
        <div className="page-editor-navbar-left">
          <a
            href={`/${params?.id}`}
            className="page-editor-navbar-brand"
            title="Back to dashboard"
          >
            {BRAND_NAME.charAt(0)}
          </a>

          {/* Mode tabs */}
          <nav className="page-editor-mode-tabs">
            <span className="page-editor-mode-tab" data-active>
              <PenTool className="size-3.5" />
              Design
            </span>
            <a
              href={`/${params?.id}/pages`}
              className="page-editor-mode-tab"
            >
              <FileText className="size-3.5" />
              CMS
            </a>
            <a
              href={`/${params?.id}/theme`}
              className="page-editor-mode-tab"
            >
              <Settings className="size-3.5" />
              Settings
            </a>
          </nav>
        </div>

        <div className="page-editor-navbar-center">
          {/* Page selector + save indicator */}
          <a
            href={`/${params?.id}/pages`}
            className="page-editor-page-selector"
            title="Switch page"
          >
            <Home className="size-3.5" />
            <span>{pageTitle || "Untitled"}</span>
            <ChevronDown className="size-3" />
          </a>

          {isSaving && (
            <span className="page-editor-save-indicator" data-state={statusDot}>
              Saving...
            </span>
          )}
        </div>

        <div className="page-editor-navbar-right">
          <button
            className="page-editor-navbar-btn"
            onClick={onPreview}
            title="Preview"
          >
            <Play className="size-4" />
          </button>

          {onGeneratePreviewLink && (
            <button
              className="page-editor-navbar-btn"
              onClick={onGeneratePreviewLink}
              title="Share preview link"
            >
              <Share2 className="size-4" />
            </button>
          )}

          <div className="page-editor-navbar-divider" />

          {isPublished ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="page-editor-publish-btn" data-published>
                  <Check className="size-3.5" />
                  Published
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onPublish}>
                  Update Published Version
                </DropdownMenuItem>
                {onUnpublish && (
                  <DropdownMenuItem className="text-(--status-error)">
                    Unpublish
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={onPublish} className="page-editor-publish-btn">
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* ================================================================
       * Editor Body — left rail | (subbar + canvas) | right panel
       * ================================================================ */}
      <ResponsiveProvider breakpoint={breakpoint} isBuilder={true}>
        <div className="page-editor-body">
          {leftPanel && (
            <aside className="page-editor-left-panel">{leftPanel}</aside>
          )}

          {/* Center column — subbar + canvas */}
          <div className="page-editor-center">
            {/* Subbar — breadcrumb + breakpoints (between sidebars) */}
            <div className="page-editor-subbar">
              <div className="page-editor-subbar-left">
                <button
                  className="page-editor-subbar-btn"
                  onClick={onUndo}
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="size-3.5" />
                </button>
                <button
                  className="page-editor-subbar-btn"
                  onClick={onRedo}
                  disabled={!canRedo}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo2 className="size-3.5" />
                </button>

                <div className="page-editor-subbar-divider" />

                <div className="page-editor-breadcrumb">
                  {breadcrumb.map((part, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && (
                        <ChevronRight className="page-editor-breadcrumb-sep" />
                      )}
                      <span
                        className="page-editor-breadcrumb-item"
                        data-active={i === breadcrumb.length - 1 || undefined}
                      >
                        {part}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="page-editor-subbar-right">
                {onBreakpointChange && (
                  <>
                    <span className="page-editor-viewport-width">
                      {BREAKPOINT_WIDTHS[breakpoint]}
                    </span>
                    <div className="page-editor-breakpoints">
                      <button
                        className="page-editor-breakpoint-btn"
                        data-active={breakpoint === "desktop" || undefined}
                        onClick={() => onBreakpointChange("desktop")}
                        title="Desktop"
                      >
                        <Monitor className="size-4" />
                      </button>
                      <button
                        className="page-editor-breakpoint-btn"
                        data-active={breakpoint === "tablet" || undefined}
                        onClick={() => onBreakpointChange("tablet")}
                        title="Tablet"
                      >
                        <Tablet className="size-4" />
                      </button>
                      <button
                        className="page-editor-breakpoint-btn"
                        data-active={breakpoint === "mobile" || undefined}
                        onClick={() => onBreakpointChange("mobile")}
                        title="Mobile"
                      >
                        <Smartphone className="size-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Canvas */}
            <main className="page-editor-canvas">
              <div className="page-editor-canvas-content design-preview">
                {children}
              </div>
            </main>
          </div>

          {rightPanel}
        </div>
      </ResponsiveProvider>
    </div>
  );
}
