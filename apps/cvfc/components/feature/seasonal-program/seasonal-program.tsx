import { cn } from "@/lib/utils";

import "./seasonal-program.css";

export type SeasonalProgramProps = {
  className?: string;
  heading?: string;
  body?: string;
};

export function SeasonalProgram({
  className,
  heading,
  body,
}: SeasonalProgramProps) {
  return (
    <section className={cn("seasonal-program", className)}>
      {heading ? <h2 className="seasonal-program-heading">{heading}</h2> : null}
      {body ? <p className="seasonal-program-body">{body}</p> : null}
    </section>
  );
}
