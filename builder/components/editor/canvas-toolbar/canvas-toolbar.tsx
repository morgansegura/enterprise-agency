"use client";

import {
  MousePointer2,
  Undo2,
  Redo2,
  Code,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import type { Breakpoint } from "../breakpoint-selector";
import "./canvas-toolbar.css";

interface CanvasToolbarProps {
  breakpoint: Breakpoint;
  onBreakpointChange: (breakpoint: Breakpoint) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function CanvasToolbar({
  breakpoint,
  onBreakpointChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: CanvasToolbarProps) {
  return (
    <div className="canvas-toolbar">
      {/* Pointer tool */}
      <div className="canvas-toolbar-group">
        <button
          className="canvas-toolbar-btn"
          data-active="true"
          title="Select"
        >
          <MousePointer2 />
        </button>
      </div>

      <div className="canvas-toolbar-divider" />

      {/* Undo/Redo */}
      <div className="canvas-toolbar-group">
        <button
          className="canvas-toolbar-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo2 />
        </button>
        <button
          className="canvas-toolbar-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo2 />
        </button>
      </div>

      <div className="canvas-toolbar-divider" />

      {/* Code view */}
      <div className="canvas-toolbar-group">
        <button className="canvas-toolbar-btn" title="View code">
          <Code />
        </button>
      </div>

      <div className="canvas-toolbar-divider" />

      {/* Breakpoints */}
      <div className="canvas-toolbar-group">
        <button
          className="canvas-toolbar-btn"
          data-active={breakpoint === "desktop" || undefined}
          onClick={() => onBreakpointChange("desktop")}
          title="Desktop"
        >
          <Monitor />
        </button>
        <button
          className="canvas-toolbar-btn"
          data-active={breakpoint === "tablet" || undefined}
          onClick={() => onBreakpointChange("tablet")}
          title="Tablet"
        >
          <Tablet />
        </button>
        <button
          className="canvas-toolbar-btn"
          data-active={breakpoint === "mobile" || undefined}
          onClick={() => onBreakpointChange("mobile")}
          title="Mobile"
        >
          <Smartphone />
        </button>
      </div>

      <div className="canvas-toolbar-divider" />

      {/* Zoom */}
      <button className="canvas-toolbar-zoom" title="Zoom">
        100%
        <ChevronDown className="size-3" />
      </button>
    </div>
  );
}
