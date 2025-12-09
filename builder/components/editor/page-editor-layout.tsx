"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Save,
  Eye,
  Settings,
  Layers,
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  PanelRightClose,
} from "lucide-react";
import { BlocksLibrary } from "./blocks-library";
import { PageSettings } from "./page-settings";
import { PageLayers } from "./page-layers";
import { BreakpointSelector, type Breakpoint } from "./breakpoint-selector";
import "./page-editor-layout.css";

interface PageEditorLayoutProps {
  pageId: string;
  pageTitle: string;
  page?: {
    title: string;
    slug: string;
    status?: string;
    template?: string;
  };
  breakpoint?: Breakpoint;
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
  onSave: () => void;
  onPublish: () => void;
  onPageChange?: (field: string, value: string) => void;
  isSaving?: boolean;
  children: React.ReactNode;
}

/**
 * Page Editor Layout
 * Three-column layout: Blocks Library | Canvas | Settings Panel
 *
 * Enterprise practices:
 * - Responsive sidebars (collapsible on smaller screens)
 * - Keyboard shortcuts
 * - Auto-save indicator
 * - Toolbar with common actions
 */
export function PageEditorLayout({
  pageId,
  pageTitle,
  page,
  breakpoint = "desktop",
  onBreakpointChange,
  onSave,
  onPublish,
  onPageChange,
  isSaving = false,
  children,
}: PageEditorLayoutProps) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState<"settings" | "layers">(
    "settings",
  );

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
          <Button variant="ghost" size="sm">
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

      {/* Editor Body */}
      <div className="page-editor-body">
        {/* Left Sidebar - Blocks Library */}
        <aside
          className="page-editor-sidebar page-editor-sidebar-left"
          data-state={leftSidebarOpen ? "collapsed" : "expanded"}
        >
          <div className="page-editor-sidebar-header">
            <h3>Blocks</h3>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setLeftSidebarOpen(false)}
            >
              <PanelLeftClose />
            </Button>
          </div>
          <div className="page-editor-sidebar-content">
            <BlocksLibrary />
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="page-editor-canvas">
          {!leftSidebarOpen ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="page-editor-sidebar-toggle page-editor-sidebar-toggle-left"
              onClick={() => setLeftSidebarOpen(true)}
            >
              <PanelLeft />
            </Button>
          ) : null}

          <div className="page-editor-canvas-content">{children}</div>

          {!rightSidebarOpen ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="page-editor-sidebar-toggle page-editor-sidebar-toggle-right"
              onClick={() => setRightSidebarOpen(true)}
            >
              <PanelRight />
            </Button>
          ) : null}
        </main>

        {/* Right Sidebar - Settings/Layers */}
        <aside
          className="page-editor-sidebar page-editor-sidebar-right"
          data-state={rightSidebarOpen ? "expanded" : "collapsed"}
        >
          <div className="page-editor-sidebar-header">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setRightSidebarOpen(false)}
            >
              <PanelRightClose />
            </Button>
            <div className="page-editor-sidebar-tabs">
              <Button
                variant="ghost"
                size="sm"
                className={`page-editor-sidebar-tab ${activeRightTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveRightTab("settings")}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`page-editor-sidebar-tab ${activeRightTab === "layers" ? "active" : ""}`}
                onClick={() => setActiveRightTab("layers")}
              >
                <Layers className="h-4 w-4" />
                Layers
              </Button>
            </div>
          </div>
          <div className="page-editor-sidebar-content">
            {activeRightTab === "settings" && page && (
              <PageSettings page={page} onChange={onPageChange} />
            )}
            {activeRightTab === "layers" && <PageLayers />}
          </div>
        </aside>
      </div>
    </div>
  );
}
