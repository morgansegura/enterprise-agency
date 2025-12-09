import { cn } from "@/lib/utils";
import "./layout-heading.css";

interface LayoutHeadingProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  back?: React.ReactNode;
}

export function LayoutHeading({
  actions,
  back,
  className,
  description,
  title,
}: LayoutHeadingProps) {
  return (
    <div className={cn("layout-heading", className)}>
      <div className="layout-heading-content">
        {back ? (
          <div className="layout-heading-back-navigation">{back}</div>
        ) : null}
        <h1 className="layout-heading-title">{title}</h1>
        {description ? (
          <p className="layout-heading-description">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="layout-heading-actions">{actions}</div> : null}
    </div>
  );
}
