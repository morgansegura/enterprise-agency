"use client";

import { Button } from "@/components/ui/button";
import { Save, Eye } from "lucide-react";
import { BreakpointSelector, type Breakpoint } from "../breakpoint-selector";
import "./page-editor-layout.css";

interface PageEditorLayoutProps {
  pageId: string;
  pageTitle: string;
  breakpoint?: Breakpoint;
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
  onSave: () => void;
  onPublish: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
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
  pageTitle,
  breakpoint = "desktop",
  onBreakpointChange,
  onSave,
  onPublish,
  onPreview,
  isSaving = false,
  children,
}: PageEditorLayoutProps) {
  return (
    <div className="page-editor-layout">
      {/* Editor Toolbar */}
      <div className="page-editor-toolbar">
        <div className="page-editor-toolbar-left">
          <h2 className="page-editor-title">{pageTitle}</h2>
          {isSaving && <span className="page-editor-status">Saving...</span>}
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
          <Button variant="ghost" size="sm" onClick={onPreview}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button size="sm" onClick={onPublish}>
            Publish
          </Button>
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
