"use client";

import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import "./visibility-toggles.css";

interface VisibilityTogglesProps {
  hideOn?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
  onChange: (hideOn: { desktop?: boolean; tablet?: boolean; mobile?: boolean }) => void;
  className?: string;
}

/**
 * VisibilityToggles
 *
 * Toggle buttons to hide content on specific breakpoints.
 * Crossed out = hidden on that breakpoint.
 */
export function VisibilityToggles({
  hideOn = {},
  onChange,
  className,
}: VisibilityTogglesProps) {
  const toggleBreakpoint = (breakpoint: "desktop" | "tablet" | "mobile") => {
    onChange({
      ...hideOn,
      [breakpoint]: !hideOn[breakpoint],
    });
  };

  return (
    <div className={cn("visibility-toggles", className)}>
      <button
        type="button"
        className={cn("visibility-toggle", hideOn.desktop && "is-hidden")}
        onClick={() => toggleBreakpoint("desktop")}
        title={hideOn.desktop ? "Hidden on desktop - click to show" : "Visible on desktop - click to hide"}
      >
        <Monitor className="h-4 w-4" />
        {hideOn.desktop && <span className="visibility-toggle-strike" />}
      </button>
      <button
        type="button"
        className={cn("visibility-toggle", hideOn.tablet && "is-hidden")}
        onClick={() => toggleBreakpoint("tablet")}
        title={hideOn.tablet ? "Hidden on tablet - click to show" : "Visible on tablet - click to hide"}
      >
        <Tablet className="h-4 w-4" />
        {hideOn.tablet && <span className="visibility-toggle-strike" />}
      </button>
      <button
        type="button"
        className={cn("visibility-toggle", hideOn.mobile && "is-hidden")}
        onClick={() => toggleBreakpoint("mobile")}
        title={hideOn.mobile ? "Hidden on mobile - click to show" : "Visible on mobile - click to hide"}
      >
        <Smartphone className="h-4 w-4" />
        {hideOn.mobile && <span className="visibility-toggle-strike" />}
      </button>
    </div>
  );
}
