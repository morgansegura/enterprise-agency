import { cn } from "@/lib/utils";
import type {
  ContainerElement,
  Spacing,
  BackgroundVariant,
  Width,
  TextAlign,
} from "@/lib/types";
import "@/styles/tokens/section.css";

/**
 * Container settings for inner content
 */
type ContainerSettings = {
  maxWidth?: "narrow" | "container" | "wide" | "full";
  paddingX?: string;
  paddingY?: string;
  background?: string;
  borderRadius?: string;
  shadow?: string;
  layout?: {
    type?: "stack" | "flex" | "grid";
    direction?: "column" | "row";
    gap?: string;
    columns?: number | string;
    justify?: string;
    align?: string;
  };
};

type SectionProps = {
  children?: React.ReactNode;
  /** The HTML tag to render */
  as?: ContainerElement;
  /** Vertical spacing (padding top/bottom) - used when paddingTop/Bottom not set */
  spacing?: Spacing;
  /** Individual padding top */
  paddingTop?: Spacing;
  /** Individual padding bottom */
  paddingBottom?: Spacing;
  /** Background style */
  background?: BackgroundVariant;
  /** Max width constraint */
  width?: Width | "container";
  /** Content alignment */
  align?: Exclude<TextAlign, "justify">;
  /** Container settings */
  container?: ContainerSettings;
  /** Inline styles (for custom backgrounds) */
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Map spacing values to Tailwind classes
 */
const spacingClasses: Record<Spacing, { top: string; bottom: string }> = {
  none: { top: "pt-0", bottom: "pb-0" },
  xs: { top: "pt-2", bottom: "pb-2" },
  sm: { top: "pt-4", bottom: "pb-4" },
  md: { top: "pt-8", bottom: "pb-8" },
  lg: { top: "pt-12", bottom: "pb-12" },
  xl: { top: "pt-16", bottom: "pb-16" },
  "2xl": { top: "pt-24", bottom: "pb-24" },
};

/**
 * Map container padding to Tailwind classes
 */
const paddingXClasses: Record<string, string> = {
  none: "px-0",
  xs: "px-2",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
  xl: "px-12",
};

const paddingYClasses: Record<string, string> = {
  none: "py-0",
  xs: "py-2",
  sm: "py-4",
  md: "py-6",
  lg: "py-8",
  xl: "py-12",
};

const gapClasses: Record<string, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

const borderRadiusClasses: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const shadowClasses: Record<string, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

export function Section({
  children,
  as: Component = "section",
  spacing,
  paddingTop,
  paddingBottom,
  background = "none",
  width = "wide",
  align = "left",
  container,
  style,
  className,
}: SectionProps) {
  // Handle individual padding or fallback to spacing
  const effectivePaddingTop = paddingTop || spacing || "md";
  const effectivePaddingBottom = paddingBottom || spacing || "md";

  // Build container classes
  const containerClasses: string[] = [];
  if (container) {
    // Padding
    if (container.paddingX) {
      containerClasses.push(paddingXClasses[container.paddingX] || "");
    }
    if (container.paddingY) {
      containerClasses.push(paddingYClasses[container.paddingY] || "");
    }
    // Border radius
    if (container.borderRadius) {
      containerClasses.push(borderRadiusClasses[container.borderRadius] || "");
    }
    // Shadow
    if (container.shadow) {
      containerClasses.push(shadowClasses[container.shadow] || "");
    }
    // Layout
    if (container.layout) {
      const {
        type,
        direction,
        gap,
        columns,
        justify,
        align: layoutAlign,
      } = container.layout;
      if (type === "flex") {
        containerClasses.push("flex");
        containerClasses.push(direction === "row" ? "flex-row" : "flex-col");
      } else if (type === "grid") {
        containerClasses.push("grid");
        if (typeof columns === "number") {
          containerClasses.push(`grid-cols-${columns}`);
        }
      } else {
        // stack
        containerClasses.push("flex flex-col");
      }
      if (gap) {
        containerClasses.push(gapClasses[gap] || "");
      }
      if (justify) {
        containerClasses.push(`justify-${justify}`);
      }
      if (layoutAlign) {
        containerClasses.push(`items-${layoutAlign}`);
      }
    }
  }

  // Build container style
  const containerStyle: React.CSSProperties = {};
  if (container?.background && container.background !== "transparent") {
    containerStyle.backgroundColor = container.background;
  }

  return (
    <Component
      className={cn(
        "section",
        spacingClasses[effectivePaddingTop]?.top,
        spacingClasses[effectivePaddingBottom]?.bottom,
        className,
      )}
      data-background={background}
      data-width={width}
      data-align={align}
      style={style}
    >
      <div
        className={cn("section-container", ...containerClasses)}
        style={
          Object.keys(containerStyle).length > 0 ? containerStyle : undefined
        }
      >
        {children}
      </div>
    </Component>
  );
}
