import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import { Section } from "@/components/layout";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Heading } from "@/components/feature/heading";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { FAQ_ENTRIES, type FaqCategory, type FaqEntry } from "@/data/faq";
import { getPage } from "@/lib/cms";
import { blockFor, cmsOverlay } from "@/lib/media";
import { pageHeroFromPage, calloutFromBlock } from "@/lib/cms-blocks";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";

import "./faq-screen.css";

const CATEGORY_ORDER: FaqCategory[] = [
  "About the Club",
  "Cost & Scholarships",
  "Tryouts & Evaluations",
  "Programs & Pathways",
  "Practice & Games",
  "Outcomes",
];

function groupByCategory(entries: FaqEntry[]) {
  const groups = new Map<FaqCategory | "Other", FaqEntry[]>();
  for (const entry of entries) {
    const key: FaqCategory | "Other" = entry.category ?? "Other";
    const existing = groups.get(key);
    if (existing) {
      existing.push(entry);
    } else {
      groups.set(key, [entry]);
    }
  }
  return groups;
}

function categoryHeadline(category: FaqCategory): string {
  switch (category) {
    case "About the Club":
      return "About Chula Vista FC.";
    case "Cost & Scholarships":
      return "Cost, fees, and scholarships.";
    case "Tryouts & Evaluations":
      return "Tryouts and year-round evaluations.";
    case "Programs & Pathways":
      return "Programs, pathways, and leagues.";
    case "Practice & Games":
      return "Practice fields and match-day venues.";
    case "Outcomes":
      return "Pathways to college and pro.";
  }
}

export async function FaqScreen() {
  const page = await getPage("faq");
  const hero = pageHeroFromPage(page);
  const stillBlock = blockFor(page, "still-questions", "callout");
  const groups = groupByCategory(FAQ_ENTRIES);

  return (
    <>
      <JsonLd
        data={[
          faqPageSchema(
            FAQ_ENTRIES.map((e) => ({
              question: e.question,
              answer: e.answer,
            })),
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />
      <main>
        <PageHero
          eyebrow={hero?.eyebrow || "Frequently Asked Questions"}
          heading={hero?.heading || "Real answers for South Bay families."}
          description={
            hero?.description ||
            "Everything parents ask before joining a club — costs, tryouts, leagues, scholarships, comparisons, and outcomes. If we missed your question, request an evaluation and a coach will follow up within 48 hours."
          }
          actions={
            <EvaluationCTA variant="default" label="Request an Evaluation" />
          }
        />

        {CATEGORY_ORDER.map((category, idx) => {
          const items = groups.get(category);
          if (!items || items.length === 0) return null;
          const bg = idx % 2 === 0 ? "white" : "bone";
          return (
            <Section key={category} bg={bg} size="default">
              <Heading
                eyebrow={category}
                heading={categoryHeadline(category)}
                headingSize="section"
              />
              <Accordion
                type="single"
                collapsible
                className="faq-screen-accordion"
              >
                {items.map((entry) => (
                  <AccordionItem key={entry.id} value={entry.id}>
                    <AccordionTrigger>{entry.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="faq-screen-answer">{entry.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Section>
          );
        })}

        <Callout
          {...cmsOverlay(
            {
              eyebrow: "Still Have Questions?",
              heading: "Talk to a coach this week.",
              variant: "bone" as const,
              body: (
                <>
                  Every family is different. Submit an evaluation request with
                  your player&rsquo;s pathway and birth year, and a coach will
                  follow up within 48 hours — in English or Spanish, whichever
                  works for your family.
                </>
              ),
            },
            stillBlock ? calloutFromBlock(stillBlock) : undefined,
          )}
          ctaSlot={
            <EvaluationCTA label="Request an Evaluation" variant="default" />
          }
        />
      </main>
    </>
  );
}
