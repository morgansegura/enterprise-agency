import Link from "next/link";

import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { cn } from "@/lib/utils";

import "./page-in-progress-screen.css";

type PageInProgressScreenProps = {
  className?: string;
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageInProgressScreen({
  className,
  eyebrow = "Page In Progress",
  title,
  description = "This page is being built. In the meantime, head back to the home page or request a player evaluation to get started.",
}: PageInProgressScreenProps) {
  return (
    <>
      <main className={cn("page-in-progress-screen", className)}>
        <section className="page-in-progress-hero">
          <div className="page-in-progress-hero-inner contain">
            <p className="eyebrow-full">
              <span>{eyebrow}</span>
            </p>
            <h1 className="page-in-progress-title">{title}</h1>
            <p className="page-in-progress-description">{description}</p>
            <div className="page-in-progress-actions">
              <Button variant="secondary" render={<Link href="/" />}>
                <Icon token="ri:arrow-right" aria-hidden="true" />
                <span>Back to Home</span>
              </Button>
              <EvaluationCTA variant="outline" label="Request an Evaluation" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
