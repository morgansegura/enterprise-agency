import { cn } from "@/lib/utils";
import "./container.css";

export interface ContainerProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Container — layout wrapper inside Section.
 * Clean semantic output. All styling from generated CSS via .e-{key} class.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("container", className)}>
      {children}
    </div>
  );
}
