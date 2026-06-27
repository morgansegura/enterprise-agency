import { cn } from "@/lib/utils";

import "./page-hero.css";

type PageHeroProps = {
  className?: string;
  eyebrow?: string;
  heading?: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  background?: "white" | "bone" | "navy";
};

export function PageHero({
  className,
  eyebrow,
  heading,
  children,
  description,
  actions,
  background = "white",
}: PageHeroProps) {
  return (
    <section data-bg={background} className={cn("page-hero", className)}>
      <div className="page-hero-inner contain">
        <p className="eyebrow-full">
          <span>{eyebrow}</span>
        </p>
        <h1 className="page-hero-title">{heading}</h1>
        {description ? (
          <p className="page-hero-description">{description}</p>
        ) : null}
        {actions ? <div className="page-hero-actions">{actions}</div> : null}
        {children}
      </div>
    </section>
  );
}
