"use client";

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
  Link,
  ExternalLink,
  History,
  PanelRightOpen,
} from "lucide-react";
import { BreakpointSelector, type Breakpoint } from "../breakpoint-selector";
import { formatDistanceToNow } from "date-fns";
import { useUIStore } from "@/lib/stores/ui-store";
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
  versions?: PageVersion[];
  onRestoreVersion?: (versionId: string) => void;
  onViewAllHistory?: () => void;
  previewMode?: boolean;
  isSaving?: boolean;
  isPublished?: boolean;
  hasUnsavedChanges?: boolean;
  lastSaved?: Date | null;
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
  onGeneratePreviewLink,
  versions = [],
  onRestoreVersion,
  onViewAllHistory,
  previewMode = false,
  isSaving = false,
  isPublished = false,
  hasUnsavedChanges = false,
  lastSaved,
  rightPanel,
  children,
}: PageEditorLayoutProps) {
  const { rightPanelOpen, toggleRightPanel } = useUIStore();
  const renderSaveStatus = () => {
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
  };

  return (
    <div className="page-editor-layout" data-preview-mode={previewMode}>
      {/* Editor Toolbar */}
      <div className="page-editor-toolbar">
        <div className="page-editor-toolbar-left">
          {renderSaveStatus()}
          {/* History Dropdown */}
          {versions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <History className="h-4 w-4" />
                  History
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {versions.slice(0, 5).map((version) => (
                  <DropdownMenuItem
                    key={version.id}
                    onClick={() => onRestoreVersion?.(version.id)}
                    className="flex flex-col items-start gap-0.5"
                  >
                    <span className="font-medium text-sm">
                      Version {version.version}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(version.createdAt), {
                        addSuffix: true,
                      })}
                      {version.changeNote && ` · ${version.changeNote}`}
                    </span>
                  </DropdownMenuItem>
                ))}
                {onViewAllHistory && (
                  <>
                    <div className="border-t my-1" />
                    <DropdownMenuItem onClick={onViewAllHistory}>
                      <span className="text-sm text-primary">
                        View all history
                      </span>
                    </DropdownMenuItem>
                  </>
                )}
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
          {/* Preview Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
                Preview
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onPreview}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Preview
              </DropdownMenuItem>
              {onGeneratePreviewLink && (
                <DropdownMenuItem onClick={onGeneratePreviewLink}>
                  <Link className="h-4 w-4 mr-2" />
                  Copy Shareable Link
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Save Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>

          {/* Publish Button */}
          {isPublished ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="secondary">
                  <Check className="h-4 w-4" />
                  Published
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onPublish}>
                  Update Published Version
                </DropdownMenuItem>
                {onUnpublish && (
                  <DropdownMenuItem
                    onClick={onUnpublish}
                    className="text-destructive"
                  >
                    Unpublish
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={onPublish}>
              Publish
            </Button>
          )}

          {/* Right Panel Toggle */}
          {rightPanel && !rightPanelOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRightPanel}
              title="Open settings panel"
            >
              <PanelRightOpen className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Editor Body - Canvas + Right Panel */}
      <div className="page-editor-body">
        <main className="page-editor-canvas">
          {/* design-preview class maps legacy tokens to --theme-* values */}
          <div className="page-editor-canvas-content design-preview">
            {children}
          </div>
        </main>

        {/* Right Panel (Settings) */}
        {rightPanel}
      </div>
    </div>
  );
}
