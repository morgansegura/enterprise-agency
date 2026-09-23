import Link from "next/link";

import { Section } from "@/components/layout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

import "./guides-screen.css";

/** Add a guide here when it ships — this index is also the breadcrumb parent. */
export const GUIDES = [
  {
    href: "/guides/mls-next-san-diego",
    title: "MLS NEXT in San Diego",
    summary:
      "The top tier of boys youth soccer: what it is, what it asks of a family, and how a player gets in.",
  },
  {
    href: "/guides/youth-soccer-leagues",
    title: "Youth soccer leagues, explained",
    summary:
      "MLS NEXT, ECNL, Elite Academy, DPL, NPL, Girls Academy and SoCal Flight — what each one means and who it suits.",
  },
  {
    href: "/guides/san-diego-youth-soccer-clubs",
    title: "Youth soccer clubs in San Diego: how to choose",
    summary:
      "What separates clubs at the same level, what a season really costs, and the questions worth asking on a visit.",
  },
];

export function GuidesScreen({ className }: { className?: string }) {
  return (
    <div className={cn("guides-screen", className)}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ])}
      />

      <PageHero
        eyebrow="Guides"
        heading="Straight answers for soccer families"
        description="Written for parents working out where their player belongs — leagues, levels, cost and commitment, explained without a sales pitch."
      />

      <Section>
        <ul className="guides-list">
          {GUIDES.map((guide) => (
            <li key={guide.href} className="guides-item">
              <h2 className="guides-item-title">
                <Link href={guide.href}>{guide.title}</Link>
              </h2>
              <p className="guides-item-summary">{guide.summary}</p>
            </li>
          ))}
        </ul>

        <div className="guides-actions">
          <EvaluationCTA />
        </div>
      </Section>
    </div>
  );
}
