import { cn } from "@/lib/utils";

import "./section.css";

export type SectionBg = "bone" | "white" | "midnight" | "ink" | "transparent";
export type SectionSize = "compact" | "default" | "loose" | "flush" | "intro";

type SectionProps = {
  children?: React.ReactNode;
  className?: string;
  /** Background color variant. Default: transparent (inherits parent). */
  bg?: SectionBg;
  /** Vertical padding scale. Default: "default" (py-16 md:py-20). */
  size?: SectionSize;
  /** Anchor id for in-page navigation. */
  id?: string;
  /** ARIA label for landmark navigation. */
  ariaLabel?: string;
  /**
   * Wrap children in the `.contain` max-width class. Default: true.
   * Set false when the feature inside manages its own width (e.g. full-bleed media).
   */
  contain?: boolean;
};

export function Section({
  children,
  className,
  bg = "transparent",
  size = "default",
  id,
  ariaLabel,
  contain = true,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      data-bg={bg}
      data-size={size}
      className={cn("section", className)}
    >
      {contain ? <div className="contain">{children}</div> : children}
    </section>
  );
}
