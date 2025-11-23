import { cn } from "@/lib/utils";
import type {
  ContainerElement,
  Spacing,
  BackgroundVariant,
  Width,
  TextAlign,
} from "@/lib/types";
import "@/styles/tokens/section.css";

type SectionProps = {
  children?: React.ReactNode;
  /** The HTML tag to render */
  as?: ContainerElement;
  /** Vertical spacing (padding top/bottom) */
  spacing?: Spacing;
  /** Background style */
  background?: BackgroundVariant;
  /** Max width constraint */
  width?: Width;
  /** Content alignment */
  align?: Exclude<TextAlign, "justify">;
  className?: string;
};

export function Section({
  children,
  as: Component = "section",
  spacing = "md",
  background = "none",
  width = "wide",
  align = "left",
  className,
}: SectionProps) {
  return (
    <Component
      className={cn("section", className)}
      data-spacing={spacing}
      data-background={background}
      data-width={width}
      data-align={align}
    >
      {children}
    </Component>
  );
}
