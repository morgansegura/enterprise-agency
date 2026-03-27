"use client";

import * as React from "react";
import { Layers, Plus } from "lucide-react";
import "./editor-sidebar.css";

interface EditorSidebarProps {
  layersPanel: React.ReactNode;
  blocksPanel: React.ReactNode;
}

export function EditorSidebar({
  layersPanel,
  blocksPanel,
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<"layers" | "add">("layers");

  return (
    <div className="editor-sidebar">
      <div className="editor-sidebar-tabs">
        <button
          type="button"
          className="editor-sidebar-tab"
          data-active={activeTab === "layers" || undefined}
          onClick={() => setActiveTab("layers")}
        >
          <Layers className="size-3.5" />
          <span>Layers</span>
        </button>
        <button
          type="button"
          className="editor-sidebar-tab"
          data-active={activeTab === "add" || undefined}
          onClick={() => setActiveTab("add")}
        >
          <Plus className="size-3.5" />
          <span>Add</span>
        </button>
      </div>
      <div className="editor-sidebar-content">
        {activeTab === "layers" ? layersPanel : blocksPanel}
      </div>
    </div>
  );
}
