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
} from "lucide-react";
import { BreakpointSelector, type Breakpoint } from "../breakpoint-selector";
import { formatDistanceToNow } from "date-fns";
import "./page-editor-layout.css";

interface PageEditorLayoutProps {
  pageId: string;
  breakpoint?: Breakpoint;
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish?: () => void;
  onPreview?: () => void;
  onGeneratePreviewLink?: () => void;
  previewMode?: boolean;
  isSaving?: boolean;
  isPublished?: boolean;
  hasUnsavedChanges?: boolean;
  lastSaved?: Date | null;
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
  previewMode = false,
  isSaving = false,
  isPublished = false,
  hasUnsavedChanges = false,
  lastSaved,
  children,
}: PageEditorLayoutProps) {
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
        <div className="page-editor-toolbar-left">{renderSaveStatus()}</div>
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
        </div>
      </div>

      {/* Editor Body - Full width canvas */}
      <div className="page-editor-body">
        <main className="page-editor-canvas">
          <div className="page-editor-canvas-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
