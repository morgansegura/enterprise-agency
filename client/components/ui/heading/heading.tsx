import { cn } from "@/lib/utils";
import type {
  HeadingLevel,
  HeadingSize,
  FontWeight,
  TextAlign,
  HeadingVariant,
} from "@/lib/types";
import "./heading.css";

type HeadingProps = {
  children?: React.ReactNode;
  /** The HTML tag to render (h1-h6) - semantic level */
  as?: HeadingLevel;
  /** Visual size - can differ from semantic level */
  size?: HeadingSize;
  /** Font weight */
  weight?: FontWeight;
  /** Text alignment */
  align?: TextAlign;
  /** Text color variant */
  variant?: HeadingVariant;
  className?: string;
};

export function Heading({
  children,
  as: Component = "h2",
  size = "lg",
  weight = "bold",
  align = "left",
  variant = "default",
  className,
}: HeadingProps) {
  return (
    <Component
      className={cn("heading", className)}
      data-size={size}
      data-weight={weight}
      data-align={align}
      data-variant={variant}
    >
      {children}
    </Component>
  );
}
