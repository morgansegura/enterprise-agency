import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import "./evaluation-cta.css";

type EvaluationCTAProps = {
  className?: string;
  children?: ReactNode;
  label?: string;
  variant?: "default" | "secondary" | "outline";
  href?: string;
};

/**
 * "Request an Evaluation" button — a styled link to the registration form on the
 * /evaluations page. Every evaluation CTA across the site routes to the same
 * place (`/evaluations#register`) rather than opening a modal: a long multi-step
 * form is a far better experience on a full page than in a modal.
 */
export function EvaluationCTA({
  className,
  children,
  label = "Request an Evaluation",
  variant = "default",
  href = "/evaluations#register",
}: EvaluationCTAProps) {
  return (
    <Link
      href={href}
      data-variant={variant}
      className={cn("evaluation-cta-trigger", className)}
    >
      {children ?? label}
    </Link>
  );
}
