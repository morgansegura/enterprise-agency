import { cn } from "@/lib/utils";

import "./section.css";

export type SectionBg = "default" | "primary" | "secondary" | "muted" | "card";
export type SectionSize = "compact" | "default" | "loose" | "flush" | "hero";

type SectionProps = {
  children?: React.ReactNode;
  className?: string;
  /** Background variant (token-driven). Default: transparent/page background. */
  bg?: SectionBg;
  /** Vertical padding scale. */
  size?: SectionSize;
  /** Wrap children in the `.contain` max-width. Default: true. */
  contain?: boolean;
  id?: string;
  ariaLabel?: string;
};

/** Universal section wrapper — every block on a screen sits in a Section. */
export function Section({
  children,
  className,
  bg = "default",
  size = "default",
  contain = true,
  id,
  ariaLabel,
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
