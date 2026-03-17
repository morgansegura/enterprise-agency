"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import "./live-preview-panel.css";

// =============================================================================
// Types
// =============================================================================

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const VIEWPORT_ICONS: Record<Viewport, React.ElementType> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

interface LivePreviewPanelProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  previewUrl?: string;
  isReady?: boolean;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function LivePreviewPanel({
  iframeRef,
  previewUrl = "/admin/preview",
  isReady = true,
  className,
}: LivePreviewPanelProps) {
  const [viewport, setViewport] = React.useState<Viewport>("desktop");

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className={cn("live-preview", className)}>
      <div className="live-preview__toolbar">
        <div className="live-preview__viewports">
          {(Object.keys(VIEWPORT_WIDTHS) as Viewport[]).map((vp) => {
            const Icon = VIEWPORT_ICONS[vp];
            return (
              <Button
                key={vp}
                variant={viewport === vp ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewport(vp)}
                className="live-preview__viewport-btn"
              >
                <Icon />
              </Button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className="live-preview__refresh-btn"
        >
          <RefreshCw />
        </Button>
      </div>

      <div className="live-preview__container">
        <div
          className="live-preview__frame-wrapper"
          style={{ maxWidth: VIEWPORT_WIDTHS[viewport] }}
        >
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="live-preview__iframe"
            title="Page preview"
          />

          {!isReady && (
            <div className="live-preview__loading">
              <Loader2 className="live-preview__loading-icon" />
              <span>Loading preview...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
