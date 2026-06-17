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

const ROLE_CARDS: IconCardEntry[] = [
  {
    id: "head-coach",
    iconToken: "custom:whistle",
    title: "Head Coach — Competitive Pathway",
    description:
      "Lead a team across MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, DPL, NPL, or SoCal Flight. USSF C+ or UEFA equivalent preferred.",
  },
  {
    id: "assistant-coach",
    iconToken: "custom:soccer-desk",
    title: "Assistant Coach",
    description:
      "Support a head coach across training and match days. Strong technical knowledge, clear communication, and a player-first approach.",
  },
  {
    id: "goalkeeper-coach",
    iconToken: "custom:target",
    title: "Goalkeeper Coach",
    description:
      "Run age-banded goalkeeper sessions across the CVFC pathway. Specialty GK certification or playing experience at college/pro level.",
  },
  {
    id: "foundations-coach",
    iconToken: "custom:soccer-ball",
    title: "Foundations Coach",
    description:
      "Coach Mini Maestros and CVFC Youth (ages 4–9). Build technical foundations, fall in love with the game, and set the tone for everything that comes next.",
  },
];

const WHY_CARDS: IconCardEntry[] = [
  {
    id: "history",
    iconToken: "custom:torch",
    title: "44 Years of Player Development",
    description:
      "CVFC has been a Chula Vista club since 1982. Recent alumni have gone on to MLS Colorado Rapids, FC Dallas, Atlas FC, Club Tijuana Xolos, and Rayados de Monterrey — and many more to college and to the rest of their lives.",
  },
  {
    id: "pathway",
    iconToken: "custom:mountain-peak",
    title: "A Full Development Pathway",
    description:
      "Coach across MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, DPL, NPL, GA Aspire, and SoCal Flight — a complete pathway from Mini Maestros to U19, all under one club.",
  },
  {
    id: "community",
    iconToken: "custom:medal",
    title: "A Hometown Community",
    description:
      "501(c)(3) nonprofit. Coaches who stay across years. Bilingual program in English and Spanish. The kind of place where families know each other and players grow up together.",
  },
];

export function CoachingOpportunitiesScreen() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Programs", path: "/programs" },
            {
              name: "Coaching Opportunities",
              path: "/programs/coaching-opportunities",
            },
          ]),
        ]}
      />
      <main>
        <PageHero
          eyebrow="Coaching Opportunities"
          heading="Coach with us."
          description="Chula Vista FC is hiring across the pathway — Mini Maestros through MLS NEXT, on the boys side and the girls side, plus our goalkeeper specialty. If you love developing young players and want to be part of a hometown club with deep South Bay roots, we'd love to hear from you."
          actions={
            <Button
              variant="default"
              render={
                <a href="mailto:contact@chulavistafc.com?subject=CVFC%20Coaching%20Inquiry" />
              }
            >
              <Icon token="ri:badge" aria-hidden="true" />
              <span>Apply via email</span>
            </Button>
          }
        />

        <IconCards
          eyebrow="Open Roles"
          heading="Where we're hiring."
          description="Specific openings vary by season — reach out with your background and we'll match you to the right team and pathway."
          cards={ROLE_CARDS}
          background="white"
        />

        <IconCards
          eyebrow="Why Coach at CVFC"
          heading="The kind of club that earns long tenures."
          description="Coaches who join CVFC tend to stay. Here's why."
          cards={WHY_CARDS}
          cols={3}
          background="bone"
        />

        <Section bg="white" size="default">
          <Heading
            eyebrow="Requirements"
            heading="What we look for."
            headingSize="section"
            description={
              <p>
                The bar is high — we coach players who go pro. Specific
                certifications vary by role.
              </p>
            }
          />
          <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "USSF C License or higher (head-coach roles); USSF E acceptable for assistant and foundations roles",
              "Playing experience at college, semi-pro, or professional level preferred",
              "Bilingual English/Spanish strongly preferred — most CVFC families are bilingual",
              "SafeSport certification (we'll help with renewal)",
              "Background check clearance (we'll handle the paperwork)",
              "Commitment to player-first development — every player leaves better, whether or not they go pro",
            ].map((req) => (
              <li
                key={req}
                className="flex items-start gap-3 rounded-2xl border border-(--color-gold-bright)/30 bg-white p-5 text-sm leading-relaxed text-(--color-midnight)/85"
              >
                <Icon
                  token="ri:badge"
                  className="mt-0.5 size-4 shrink-0 text-(--color-gold)"
                  aria-hidden="true"
                />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Callout
          eyebrow="Apply Today"
          heading="Send us your story."
          variant="midnight"
          body={
            <>
              Email <strong>contact@chulavistafc.com</strong> with your coaching
              résumé, current certifications, languages spoken, and the age
              groups you&rsquo;d most like to work with. We respond within a
              week and follow up with the relevant Director of Coaching.
            </>
          }
          ctaSlot={
            <Button
              variant="outline"
              render={
                <a href="mailto:contact@chulavistafc.com?subject=CVFC%20Coaching%20Inquiry" />
              }
            >
              <span>Apply via email</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </Button>
          }
        />

        <Section
          bg="bone"
          size="default"
          className="border-t border-(--color-gold)/30"
        >
          <Heading
            eyebrow="More from CVFC"
            heading="Learn the club before you apply."
            headingSize="compact"
            description={
              <p>
                Read up on the club, the pathway, and the coaches you&rsquo;d be
                joining.
              </p>
            }
          />
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              render={<Link href="/about/who-we-are" />}
            >
              <span>Who we are</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              render={<Link href="/about/coaching-staff" />}
            >
              <span>Current coaching staff</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </Button>
            <Button variant="outline" render={<Link href="/programs" />}>
              <span>Our programs</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </Button>
          </div>
        </Section>
      </main>
    </>
  );
}
