import * as React from "react";
import { cn } from "@/lib/utils";
import "./motion.css";

// ============================================================================
// Types
// ============================================================================

export type MotionPreset =
  | "fade-in"
  | "fade-out"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale-up"
  | "scale-down"
  | "zoom-in"
  | "zoom-out";

export type MotionDuration = "instant" | "fast" | "normal" | "slow" | "slower";
export type MotionEasing = "standard" | "entrance" | "exit" | "spring";

interface MotionProps extends React.ComponentProps<"div"> {
  preset?: MotionPreset;
  duration?: MotionDuration;
  easing?: MotionEasing;
  delay?: number;
  show?: boolean;
  exitPreset?: MotionPreset;
  onAnimationEnd?: () => void;
}

interface CollapseProps extends React.ComponentProps<"div"> {
  isOpen: boolean;
  duration?: MotionDuration;
}

// ============================================================================
// Motion
// ============================================================================

function Motion({
  preset = "fade-in",
  duration = "normal",
  easing = "standard",
  delay = 0,
  show = true,
  exitPreset,
  className,
  children,
  onAnimationEnd,
  style,
  ...props
}: MotionProps) {
  const [shouldRender, setShouldRender] = React.useState(show);
  const [activePreset, setActivePreset] = React.useState(
    show ? preset : exitPreset || "fade-out",
  );

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
      setActivePreset(preset);
    } else {
      setActivePreset(exitPreset || "fade-out");
    }
  }, [show, preset, exitPreset]);

  const handleAnimationEnd = React.useCallback(() => {
    if (!show) {
      setShouldRender(false);
    }
    onAnimationEnd?.();
  }, [show, onAnimationEnd]);

  if (!shouldRender) return null;

  return (
    <div
      data-slot="motion"
      data-preset={activePreset}
      data-duration={duration}
      data-easing={easing}
      className={cn(className)}
      style={{ animationDelay: delay ? `${delay}ms` : undefined, ...style }}
      onAnimationEnd={handleAnimationEnd}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Collapse (animated height)
// ============================================================================

function Collapse({
  isOpen,
  duration = "normal",
  className,
  children,
  ...props
}: CollapseProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | undefined>(
    isOpen ? undefined : 0,
  );

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      const contentHeight = el.scrollHeight;
      setHeight(contentHeight);
      const timer = setTimeout(() => setHeight(undefined), 200);
      return () => clearTimeout(timer);
    } else {
      setHeight(el.scrollHeight);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0));
      });
    }
  }, [isOpen]);

  return (
    <div
      data-slot="motion-collapse"
      data-state={isOpen ? "open" : "closed"}
      data-duration={duration}
      className={cn(className)}
      style={{ height: height !== undefined ? height : "auto" }}
      {...props}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

// ============================================================================
// Stagger (sequential animations)
// ============================================================================

interface StaggerProps extends React.ComponentProps<"div"> {
  staggerDelay?: number;
  preset?: MotionPreset;
  duration?: MotionDuration;
  easing?: MotionEasing;
}

function Stagger({
  staggerDelay = 50,
  preset = "fade-in",
  duration = "normal",
  easing = "entrance",
  className,
  children,
  ...props
}: StaggerProps) {
  return (
    <div className={cn(className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <Motion
            preset={preset}
            duration={duration}
            easing={easing}
            delay={index * staggerDelay}
          >
            {child}
          </Motion>
        );
      })}
    </div>
  );
}

export { Motion, Collapse, Stagger };
