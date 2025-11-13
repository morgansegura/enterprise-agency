import { cn } from "@/lib/utils";
import type {
  TextElement,
  TextSize,
  FontWeight,
  TextAlign,
  TextVariant,
} from "@/lib/types";
import "./text.css";

type TextProps = {
  children?: React.ReactNode;
  /** The HTML tag to render */
  as?: TextElement;
  /** Text size */
  size?: TextSize;
  /** Font weight */
  weight?: FontWeight;
  /** Text alignment */
  align?: TextAlign;
  /** Text variant/style */
  variant?: TextVariant;
  className?: string;
};

export function Text({
  children,
  as: Component = "p",
  size = "base",
  weight = "normal",
  align = "left",
  variant = "default",
  className,
}: TextProps) {
  return (
    <Component
      className={cn("text", className)}
      data-size={size}
      data-weight={weight}
      data-align={align}
      data-variant={variant}
    >
      {children}
    </Component>
  );
}
