import Link from "next/link";

import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { IconCards, type IconCardEntry } from "@/components/feature/icon-cards";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Blocks } from "@/components/blocks";
import { getPage } from "@/lib/cms";

const ABOUT_CARDS: IconCardEntry[] = [
  {
    id: "who-we-are",
    iconToken: "custom:torch",
    title: "Who we are",
    description:
      "The story of CVFC — our mission, values, and the 44 years of South Bay families who built the club.",
    href: "/about/who-we-are",
  },
  {
    id: "coaching-staff",
    iconToken: "custom:whistle",
    title: "Coaching Staff",
    description:
      "Licensed coaches with experience across MLS NEXT, Elite Academy, college, and professional soccer — coached by people who've been there.",
    href: "/about/coaching-staff",
  },
  {
    id: "administrators",
    iconToken: "custom:soccer-desk",
    title: "Administrators",
    description:
      "The directors and staff running the club day-to-day — registration, operations, and the work that keeps the pathway moving.",
    href: "/about/administrators",
  },
  {
    id: "facilities",
    iconToken: "custom:soccer-field",
    title: "Facilities",
    description:
      "Where CVFC trains and plays — Victory Christian Academy, Hoover High School, Indoor Training Center, and community parks across the South Bay.",
    href: "/about/facilities",
  },
  {
    id: "testimonials",
    iconToken: "custom:medal",
    title: "Testimonials",
    description:
      "Parents, players, alumni, and coaches in their own words — what CVFC means on a Tuesday training session and on a Saturday match.",
    href: "/about/testimonials",
  },
  {
    id: "news",
    iconToken: "custom:trophy",
    title: "News & Stories",
    description:
      "Pro signings, championships, alumni news, and the small moments that shape a Tuesday training session — from across the CVFC pathway.",
    href: "/news",
  },
  {
    id: "support",
    iconToken: "custom:tickets",
    title: "Support the Club",
    description:
      "Donate, sponsor, or partner. Every gift to our 501(c)(3) goes back to the players, coaches, and fields here in the South Bay.",
    href: "/support",
  },
];

export async function AboutScreen() {
  const page = await getPage("about");
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <main>
        {page?.layout?.length ? (
          <Blocks layout={page.layout} />
        ) : (
          <>
            <PageHero
              eyebrow="About Chula Vista FC"
              heading="44 years. One community. One crest."
              description="Since 1982, CVFC has been a hometown soccer club for South Bay families — coaches who stay, players who grow, and a 501(c)(3) nonprofit where every dollar goes back to the kids on the field."
              actions={
                <>
                  <EvaluationCTA
                    variant="default"
                    label="Request an Evaluation"
                  />
                  <Button
                    variant="outline"
                    render={<Link href="/about/who-we-are" />}
                  >
                    <span>Read our story</span>
                    <Icon token="ri:arrow-right" aria-hidden="true" />
                  </Button>
                </>
              }
            />

            <IconCards
              eyebrow="Inside the Club"
              heading="Get to know CVFC."
              description="Five places to start — the story, the people, the fields, and the voices that make Chula Vista FC."
              cards={ABOUT_CARDS}
              background="bone"
            />

            <Callout
              eyebrow="Come See For Yourself"
              heading="Walk a CVFC field this week."
              variant="bone"
              body={
                <>
                  Reading about a club is one thing. Stepping onto a training
                  pitch and meeting a coach is another. Submit an evaluation
                  request and we&rsquo;ll be in touch within 48 hours — in
                  English or Spanish.
                </>
              }
              ctaSlot={
                <EvaluationCTA
                  label="Request an Evaluation"
                  variant="default"
                />
              }
            />
          </>
        )}
      </main>
    </>
  );
}
