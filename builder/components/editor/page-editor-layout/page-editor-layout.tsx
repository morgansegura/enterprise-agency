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
  Save,
  Eye,
  ChevronDown,
  Check,
  History,
  PanelRightOpen,
} from "lucide-react";
import { BreakpointSelector, type Breakpoint } from "../breakpoint-selector";
import { formatDistanceToNow } from "date-fns";
import { useUIStore } from "@/lib/stores/ui-store";
import { usePreviewModeOptional } from "@/lib/context/preview-mode-context";
import { ResponsiveProvider } from "@/lib/responsive/context";
import "./page-editor-layout.css";

interface PageVersion {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  changeNote: string | null;
}

interface PageEditorLayoutProps {
  pageId: string;
  breakpoint?: Breakpoint;
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish?: () => void;
  onPreview?: () => void;
  onGeneratePreviewLink?: () => void;
  /** Slug for "View Live Site" link */
  pageSlug?: string;
  /** Tenant slug for building client URL */
  tenantSlug?: string;
  versions?: PageVersion[];
  onRestoreVersion?: (versionId: string) => void;
  onViewAllHistory?: () => void;
  previewMode?: boolean;
  isSaving?: boolean;
  isPublished?: boolean;
  hasUnsavedChanges?: boolean;
  lastSaved?: Date | null;
  /** Left panel content (PageLayers tree) */
  leftPanel?: React.ReactNode;
  /** Right panel content (SettingsPanel) */
  rightPanel?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Page Editor Layout
 * Clean canvas-focused layout for WYSIWYG editing
 *
 * Features:
 * - Top toolbar with save/publish actions
 * - Breakpoint selector for responsive design
 * - Full-width canvas for editing
 * - Blocks are added via ADD BLOCK popover in each section
 */
export function PageEditorLayout({
  breakpoint = "desktop",
  onBreakpointChange,
  onSave,
  onPublish,
  onUnpublish,
  onPreview,
  versions = [],
  onRestoreVersion,
  previewMode = false,
  isSaving = false,
  isPublished = false,
  hasUnsavedChanges = false,
  lastSaved,
  leftPanel,
  rightPanel,
  children,
}: PageEditorLayoutProps) {
  const { rightPanelOpen, toggleRightPanel } = useUIStore();
  const { setHasCustomToolbar } = usePreviewModeOptional();

  // Tell parent layout we have our own toolbar
  React.useEffect(() => {
    setHasCustomToolbar(true);
    return () => setHasCustomToolbar(false);
  }, [setHasCustomToolbar]);

  // Memoize save status to avoid Date.now() calls during render
  const saveStatusElement = React.useMemo(() => {
    if (isSaving) {
      return <span className="page-editor-status saving">Saving...</span>;
    }
    if (hasUnsavedChanges) {
      return (
        <span className="page-editor-status unsaved">Unsaved changes</span>
      );
    }
    if (lastSaved) {
      // Show "All changes saved" if saved within last 10 seconds
      // eslint-disable-next-line react-hooks/purity -- Date.now() for time-since-save display is intentional
      const secondsAgo = (Date.now() - lastSaved.getTime()) / 1000;
      if (secondsAgo < 10) {
        return (
          <span className="page-editor-status saved">All changes saved</span>
        );
      }
      return (
        <span className="page-editor-status saved">
          Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
        </span>
      );
    }
    return null;
  }, [isSaving, hasUnsavedChanges, lastSaved]);

  return (
    <div className="page-editor-layout" data-preview-mode={previewMode}>
      {/* Editor Toolbar */}
      <div className="page-editor-toolbar">
        <div className="page-editor-toolbar-left">
          {saveStatusElement}

          {versions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="page-editor-toolbar-btn">
                  <History className="size-3.5" />
                  <span>History</span>
                  <ChevronDown className="size-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {versions.slice(0, 5).map((version, i) => (
                  <React.Fragment key={version.id}>
                    {i > 0 && (
                      <div className="h-px bg-[var(--border-default)] mx-1" />
                    )}
                    <DropdownMenuItem
                      onClick={() => onRestoreVersion?.(version.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-[14px]">
                          Version {version.version}
                        </span>
                        <span className="text-[12px] text-[var(--el-400)]">
                          {formatDistanceToNow(new Date(version.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
          <button className="page-editor-toolbar-btn" onClick={onPreview}>
            <Eye className="size-4" />
            <span>Preview</span>
          </button>

          <Button variant="outline" onClick={onSave} disabled={isSaving}>
            <Save className="size-4" />
            Save
          </Button>

          {isPublished ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[var(--status-success)] text-white hover:bg-[var(--status-success)]/90">
                  <Check className="size-4" />
                  Published
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onPublish}>
                  Update Published Version
                </DropdownMenuItem>
                {onUnpublish && (
                  <DropdownMenuItem
                    onClick={onUnpublish}
                    className="text-[var(--status-error)]"
                  >
                    Unpublish
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={onPublish}>
              Publish
            </Button>
          )}

          {rightPanel && !rightPanelOpen && (
            <button
              className="page-editor-toolbar-btn"
              onClick={toggleRightPanel}
              title="Open settings panel"
            >
              <PanelRightOpen className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body - Left Tree + Canvas + Right Panel */}
      <ResponsiveProvider breakpoint={breakpoint} isBuilder={true}>
        <div className="page-editor-body">
          {/* Left Panel (Content Tree) */}
          {leftPanel && (
            <aside className="page-editor-left-panel">{leftPanel}</aside>
          )}

          {/* Center Canvas (Live Preview) */}
          <main className="page-editor-canvas">
            <div className="page-editor-canvas-content design-preview">
              {children}
            </div>
          </main>

          {/* Right Panel (Settings) */}
          {rightPanel}
        </div>
      </ResponsiveProvider>
    </div>
  );
}
