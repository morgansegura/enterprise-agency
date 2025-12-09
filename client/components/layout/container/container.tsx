import { cn } from "@/lib/utils";
import "./container.css";

type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg";
  width?: "full" | "narrow" | "wide";
};

export function Container({
  children,
  className,
  spacing = "md",
  width = "wide",
}: ContainerProps) {
  return (
    <div
      className={cn("container", className)}
      data-width={width}
      data-spacing={spacing}
    >
      {children}
    </div>
  );
}
