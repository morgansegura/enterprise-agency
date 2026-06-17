import Link from "next/link";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Callout } from "@/components/feature/callout";
import { Heading } from "@/components/feature/heading";
import { IconCards, type IconCardEntry } from "@/components/feature/icon-cards";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PARTNERSHIP_KINDS: IconCardEntry[] = [
  {
    id: "league",
    iconToken: "custom:soccer-field",
    title: "League & Federation Partners",
    description:
      "MLS NEXT, Elite Academy League, Development Player League, National Premier League, SoCal Soccer League, Southwest Premier League — the competitions that shape the CVFC pathway.",
  },
  {
    id: "club",
    iconToken: "custom:trophy",
    title: "Pro & Academy Partners",
    description:
      "Victory Christian Academy as primary training home, San Diego FC partnership, and academy-level relationships across MLS and Liga MX (Atlas, Club Tijuana, Rayados).",
  },
  {
    id: "community",
    iconToken: "custom:medal",
    title: "Community Partners",
    description:
      "Local schools, parks, and South Bay organizations that share fields, host tournaments, and help CVFC stay rooted in Chula Vista.",
  },
  {
    id: "facility",
    iconToken: "custom:soccer-desk",
    title: "Facility Partners",
    description:
      "Hoover High School (match days), Indoor Training Center (indoor specialty), and the network of community parks across the South Bay where CVFC trains every week.",
  },
];

const HOW_WE_PARTNER: IconCardEntry[] = [
  {
    id: "programs",
    iconToken: "custom:torch",
    title: "Co-Built Programs",
    description:
      "Joint clinics, ID camps, scholarship initiatives, and pathway-specific programming with partner clubs and federations.",
  },
  {
    id: "fields",
    iconToken: "custom:soccer-ball",
    title: "Shared Fields & Tournaments",
    description:
      "Reciprocal field use, joint tournaments, and shared event hosting across South Bay venues.",
  },
  {
    id: "scouting",
    iconToken: "custom:target",
    title: "Scouting & Talent Pipelines",
    description:
      "Direct relationships between CVFC coaches and college, MLS academy, and Liga MX scouts — players see the right eyes at the right time.",
  },
];

export function PartnershipsScreen() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Support", path: "/support" },
            { name: "Partnerships", path: "/partnerships" },
          ]),
        ]}
      />
      <main>
        <PageHero
          eyebrow="Partnerships"
          heading="The relationships behind 44 years of CVFC."
          description="Chula Vista FC is more than one club — it's a network. League affiliations, academy partners, community organizations, and field hosts all make the CVFC pathway possible. If your organization wants to join the work, we want to talk."
          actions={
            <Button
              variant="default"
              render={
                <a href="mailto:contact@chulavistafc.com?subject=CVFC%20Partnership%20Inquiry" />
              }
            >
              <Icon token="ri:badge" aria-hidden="true" />
              <span>Inquire about partnerships</span>
            </Button>
          }
        />

        <IconCards
          eyebrow="Partnership Types"
          heading="Four kinds of partners. One mission."
          description="Every partnership is unique — here are the broad categories."
          cards={PARTNERSHIP_KINDS}
          background="white"
        />

        <IconCards
          eyebrow="How We Work Together"
          heading="What partnership looks like in practice."
          description="The shape of CVFC partnerships, in three categories."
          cards={HOW_WE_PARTNER}
          cols={3}
          background="bone"
        />

        <Section bg="white" size="default">
          <Heading
            eyebrow="Partner With CVFC"
            heading="A few of the relationships that power the club."
            headingSize="section"
            description={
              <p>
                Active and recent partnerships — official affiliations and
                community ties that shape day-to-day CVFC.
              </p>
            }
          />
          <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "MLS NEXT",
              "MLS NEXT Academy",
              "Elite Academy League",
              "Development Player League (DPL)",
              "National Premier League (NPL)",
              "Girls Academy (GA Aspire — applied)",
              "Southwest Premier League (SWPL)",
              "SoCal Soccer League",
              "Victory Christian Academy",
              "San Diego FC",
              "Atlas FC Academy (Liga MX)",
              "Club Tijuana Xolos (Liga MX)",
              "Club Rayados de Monterrey (Liga MX)",
              "Hoover High School (San Diego)",
              "Indoor Training Center",
              "City of Chula Vista Parks & Recreation",
            ].map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 rounded-2xl border border-(--color-gold-bright)/30 bg-white px-5 py-4 text-sm font-medium leading-snug text-(--color-midnight)/85"
              >
                <Icon
                  token="ri:badge"
                  className="size-4 shrink-0 text-(--color-gold)"
                  aria-hidden="true"
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Callout
          eyebrow="Other Ways to Engage"
          heading="Donate or sponsor."
          variant="bone"
          body={
            <>
              If your organization or family is closer to a sponsorship or a
              direct donation than a strategic partnership, both pages below
              walk through what we offer.
            </>
          }
          ctaSlot={
            <>
              <Button variant="default" render={<Link href="/sponsor" />}>
                <span>Sponsorship tiers</span>
                <Icon token="ri:arrow-right" aria-hidden="true" />
              </Button>
              <Button variant="outline" render={<Link href="/support" />}>
                <span>Donate</span>
                <Icon token="ri:arrow-right" aria-hidden="true" />
              </Button>
            </>
          }
        />
      </main>
    </>
  );
}
