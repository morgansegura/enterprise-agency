"use client";

import * as React from "react";
import "./resizable-preview.css";

interface ResizablePreviewProps {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number | "full";
  height?: number;
  showScrollContent?: boolean;
  className?: string;
}

export function ResizablePreview({
  children,
  minWidth = 320,
  maxWidth,
  defaultWidth = "full",
  height = 400,
  showScrollContent = true,
  className,
}: ResizablePreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [containerMaxWidth, setContainerMaxWidth] = React.useState<number>(800);

  // Get container width on mount and resize
  React.useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        // Account for padding and resize handle
        const containerWidth = containerRef.current.offsetWidth - 24;
        setContainerMaxWidth(containerWidth);

        // Initialize or clamp width
        if (width === null || width > containerWidth) {
          const initialWidth =
            defaultWidth === "full"
              ? containerWidth
              : Math.min(defaultWidth as number, containerWidth);
          setWidth(initialWidth);
        }
      }
    };

    // Use setTimeout to ensure container has rendered
    const timer = setTimeout(updateContainerWidth, 0);
    window.addEventListener("resize", updateContainerWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, [defaultWidth, width]);

  const effectiveMaxWidth = maxWidth || containerMaxWidth;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      const clampedWidth = Math.max(
        minWidth,
        Math.min(newWidth, effectiveMaxWidth),
      );
      setWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, minWidth, effectiveMaxWidth]);

  // Don't render until we have a proper width measurement
  const currentWidth = width || containerMaxWidth;
  const clampedWidth = Math.min(currentWidth, containerMaxWidth);
  const widthLabel =
    clampedWidth >= 1024
      ? "Desktop"
      : clampedWidth >= 768
        ? "Tablet"
        : "Mobile";

  return (
    <div
      ref={containerRef}
      className={`resizable-preview-container ${className || ""}`}
    >
      <div
        className={`resizable-preview-frame ${isDragging ? "is-dragging" : ""}`}
        style={{ width: clampedWidth }}
      >
        <div
          className="resizable-preview-viewport"
          style={{ height: `${height}px` }}
        >
          {children}

          {/* Scroll content for testing scroll behaviors */}
          {showScrollContent && (
            <div className="resizable-preview-scroll-content">
              <div className="resizable-preview-placeholder-block" />
              <div className="resizable-preview-placeholder-lines">
                <div
                  className="resizable-preview-placeholder-line"
                  style={{ width: "60%" }}
                />
                <div
                  className="resizable-preview-placeholder-line"
                  style={{ width: "80%" }}
                />
                <div
                  className="resizable-preview-placeholder-line"
                  style={{ width: "45%" }}
                />
              </div>
              <div className="resizable-preview-placeholder-block" />
              <div className="resizable-preview-placeholder-lines">
                <div
                  className="resizable-preview-placeholder-line"
                  style={{ width: "70%" }}
                />
                <div
                  className="resizable-preview-placeholder-line"
                  style={{ width: "55%" }}
                />
              </div>
              <div className="resizable-preview-placeholder-block" />
              <div className="resizable-preview-placeholder-lines">
                <div
                  className="resizable-preview-placeholder-line"
                  style={{ width: "50%" }}
                />
                <div
                  className="resizable-preview-placeholder-line"
                  style={{ width: "75%" }}
                />
                <div
                  className="resizable-preview-placeholder-line"
                  style={{ width: "40%" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Resize handle */}
        <div className="resizable-preview-handle" onMouseDown={handleMouseDown}>
          <div className="resizable-preview-handle-bar" />
        </div>
      </div>

      {/* Width indicator */}
      <div className="resizable-preview-indicator">
        <span className="resizable-preview-width">
          {Math.round(clampedWidth)}px
        </span>
        <span className="resizable-preview-breakpoint">{widthLabel}</span>
      </div>
    </div>
  );
}
