import Link from "next/link";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Callout } from "@/components/feature/callout";
import { Heading } from "@/components/feature/heading";
import { IconCards, type IconCardEntry } from "@/components/feature/icon-cards";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { breadcrumbSchema } from "@/lib/schema";

import "./sponsor-screen.css";

type SponsorTier = {
  amount: string;
  label: string;
  body: string;
  deliverables: string[];
  highlight?: boolean;
};

const SPONSOR_TIERS: SponsorTier[] = [
  {
    amount: "$1,500/yr",
    label: "Bronze",
    body: "Local-business visibility across one full season.",
    deliverables: [
      "Logo on team banner at home matches",
      "Recognition on /support page",
      "Social media thank-you",
      "Quarterly newsletter mention",
    ],
  },
  {
    amount: "$3,500/yr",
    label: "Silver",
    body: "Mid-tier package with stronger placement and a season-long story.",
    deliverables: [
      "Everything in Bronze",
      "Logo on training kit (one team)",
      "Featured on /sponsor page with link",
      "Match-day announcement at home games",
      "Two social media features per season",
    ],
  },
  {
    amount: "$7,500/yr",
    label: "Gold",
    body: "Premier tier — front-of-jersey-class visibility.",
    highlight: true,
    deliverables: [
      "Everything in Silver",
      "Front-of-jersey logo (one age group)",
      "Field signage at Victory Christian Academy home venue",
      "Featured story on /news with full piece",
      "Hosted hospitality at home tournaments",
      "Sponsor a player scholarship in your business name",
    ],
  },
  {
    amount: "Custom",
    label: "Title / Capital",
    body: "Naming rights, capital projects, or multi-year commitments — let's design it together.",
    deliverables: [
      "Naming rights for a CVFC team, program, or facility",
      "Custom multi-year package",
      "Direct relationship with the Director of Coaching",
      "Recognized donor wall + 990 transparency",
    ],
  },
];

const REASONS: IconCardEntry[] = [
  {
    id: "audience",
    iconToken: "custom:medal",
    title: "Reach South Bay Families",
    description:
      "Hundreds of families pass through CVFC each year — from Mini Maestros parents to MLS NEXT alumni. A genuine community of families who shop, work, and live in the South Bay.",
  },
  {
    id: "longevity",
    iconToken: "custom:torch",
    title: "Stand With a 44-Year Club",
    description:
      "CVFC has been in Chula Vista since 1982. Your sponsorship sits alongside four decades of South Bay soccer — a relationship, not a transaction.",
  },
  {
    id: "impact",
    iconToken: "custom:tickets",
    title: "Direct Impact, Tax-Deductible",
    description:
      "CVFC is a 501(c)(3) nonprofit. Your sponsorship is tax-deductible to the extent allowed by law, and it funds player scholarships, fields, and coaching — the work that keeps the club going.",
  },
];

export async function SponsorScreen() {
  const hero = pageHeroFromPage(await getPage("sponsor"));
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Support", path: "/support" },
            { name: "Become a Sponsor", path: "/sponsor" },
          ]),
        ]}
      />
      <main>
        <PageHero
          eyebrow={hero?.eyebrow || "Become a Sponsor"}
          heading={hero?.heading || "Stand with the club, stand with the kids."}
          description={
            hero?.description ||
            "Local businesses and community partners help keep CVFC strong. Jersey logos, banner placement, match-day recognition, and gifts that fund player scholarships — every sponsorship goes back into the work, and the kids feel it on Tuesday practice."
          }
          actions={
            <Button
              variant="default"
              render={
                <a href="mailto:contact@chulavistafc.com?subject=CVFC%20Sponsorship%20Inquiry" />
              }
            >
              <Icon token="ri:badge" aria-hidden="true" />
              <span>Inquire about sponsorship</span>
            </Button>
          }
        />

        <IconCards
          eyebrow="Why Sponsor CVFC"
          heading="A relationship with the South Bay."
          description="A few reasons businesses choose to support CVFC year after year."
          cards={REASONS}
          cols={3}
          background="white"
        />

        <Section bg="bone" size="default">
          <Heading
            eyebrow="Sponsorship Tiers"
            heading="Pick the level that fits your business."
            headingSize="section"
            description={
              <p>
                Tiers are a starting point — every sponsorship is customized to
                the business and the season. Reach out and we&rsquo;ll tailor
                the package.
              </p>
            }
          />
          <ul className="sponsor-tier-grid">
            {SPONSOR_TIERS.map((tier) => (
              <li key={tier.label} className="sponsor-tier-item">
                <article
                  className="sponsor-tier-card"
                  data-highlight={tier.highlight ? "true" : "false"}
                >
                  <div className="sponsor-tier-head">
                    <p className="sponsor-tier-label">{tier.label}</p>
                    <p className="sponsor-tier-amount">{tier.amount}</p>
                    <p className="sponsor-tier-body">{tier.body}</p>
                  </div>
                  <ul className="sponsor-tier-deliverables">
                    {tier.deliverables.map((d) => (
                      <li key={d} className="sponsor-tier-deliverable">
                        <Icon
                          token="ri:badge"
                          className="sponsor-tier-deliverable-icon"
                          aria-hidden="true"
                        />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={tier.highlight ? "default" : "outline"}
                    className="sponsor-tier-button"
                    render={
                      <a
                        href={`mailto:contact@chulavistafc.com?subject=CVFC%20${encodeURIComponent(tier.label)}%20Sponsorship%20Inquiry`}
                      />
                    }
                  >
                    <span>Inquire about {tier.label}</span>
                  </Button>
                </article>
              </li>
            ))}
          </ul>
        </Section>

        <Callout
          eyebrow="Or Donate Directly"
          heading="Not every gift fits a tier."
          variant="bone"
          body={
            <>
              Individual donors, small businesses giving below sponsorship
              levels, and one-time gifts are equally important. Visit the donate
              page to give directly.
            </>
          }
          ctaSlot={
            <Button variant="default" render={<Link href="/support" />}>
              <span>Donate to CVFC</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </Button>
          }
        />
      </main>
    </>
  );
}
