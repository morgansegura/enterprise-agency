import { Section } from "@/components/layout";
import { cn } from "@/lib/utils";

import "./separator.css";

/** Thin contained rule between sections. */
export function Separator({ className }: { className?: string }) {
  return (
    <Section size="flush" className={cn("separator", className)}>
      <hr className="separator-rule" />
    </Section>
  );
}
