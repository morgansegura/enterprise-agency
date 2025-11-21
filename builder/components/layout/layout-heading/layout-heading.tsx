import { cn } from "@/lib/utils";
import "./layout-heading.css";

interface LayoutHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function LayoutHeading({ title, description, className }: LayoutHeadingProps) {
  return (
    <div className={cn("layout-heading", className)}>
      <h1 className="layout-heading-title">{title}</h1>
      {description && (
        <p className="layout-heading-description">{description}</p>
      )}
    </div>
  );
}
