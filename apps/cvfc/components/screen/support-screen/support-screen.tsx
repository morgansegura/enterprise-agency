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
import { blockFor, cmsOverlay } from "@/lib/media";
import {
  pageHeroFromPage,
  iconCardsFromBlock,
  calloutFromBlock,
} from "@/lib/cms-blocks";
import { breadcrumbSchema } from "@/lib/schema";

import "./support-screen.css";

// type Tier = {
//   amount: string;
//   label: string;
//   body: string;
//   custom?: boolean;
//   cta?: string;
// };

// const ONE_TIME_TIERS: Tier[] = [
//   {
//     amount: "$50",
//     label: "Player Gear",
//     body: "A pair of cleats or essential gear for a player. A small gift that helps a kid show up ready.",
//   },
//   {
//     amount: "$150",
//     label: "Game-Day Costs",
//     body: "Tournament entry, referee fees, travel — the costs alongside game-day. Your gift covers them so kids can focus on playing.",
//   },
//   {
//     amount: "$500",
//     label: "Uniform Kit",
//     body: "A full home and away uniform for a player. Putting on the crest matters, and your gift makes that moment possible.",
//   },
//   {
//     amount: "$2,500",
//     label: "Team Field Time",
//     body: "An evening of lit-field training for a whole team across a season — the kind of gift that shows up in every Tuesday practice.",
//   },
//   {
//     amount: "Any amount",
//     label: "Custom",
//     body: "Give whatever feels right for your family. Every gift, large or small, finds its way to a kid on a CVFC field. Thank you.",
//     custom: true,
//     cta: "Give a custom amount",
//   },
// ];

// const MONTHLY_TIERS: Tier[] = [
//   {
//     amount: "$25/mo",
//     label: "Friend of CVFC",
//     body: "Steady support that keeps the fields lit and the gear ready. Small monthly gifts add up across a season.",
//   },
//   {
//     amount: "$100/mo",
//     label: "Pathway Patron",
//     body: "Helps a player on financial assistance stay with the club through the year. A real difference for a real kid.",
//   },
//   {
//     amount: "$250/mo",
//     label: "Champion",
//     body: "Supports coaching and the long, patient development that follows. The kind of giving that shapes a season — and a player.",
//   },
//   {
//     amount: "Any amount",
//     label: "Custom Monthly",
//     body: "Choose any monthly amount. Even small recurring gifts compound into something meaningful by year-end. Thank you.",
//     custom: true,
//     cta: "Start custom monthly",
//   },
// ];

const IMPACT_CARDS: IconCardEntry[] = [
  {
    id: "scholarships",
    iconToken: "custom:medal",
    title: "Player Scholarships",
    description:
      "We never want a South Bay kid to miss out because their family can't afford the season. Need-based financial assistance helps players join CVFC and stay through the pathway.",
  },
  {
    id: "facilities",
    iconToken: "custom:soccer-field",
    title: "Fields & Equipment",
    description:
      "Lit evening fields, indoor sessions at the Indoor Training Center, and the gear players need. Your gift keeps the space ready and welcoming for every team.",
  },
  {
    id: "coaching",
    iconToken: "custom:whistle",
    title: "Coaching & Development",
    description:
      "Coaches who care about each player and have the licenses to back it up. Your gift keeps the pathway — including our goalkeeper specialty — staffed by people who know what they're doing.",
  },
];

export async function SupportScreen() {
  const page = await getPage("support");
  const hero = pageHeroFromPage(page);
  const impactBlock = blockFor(page, "where-gift-goes", "iconCards");
  const otherBlock = blockFor(page, "other-ways-help", "callout");
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Support", path: "/support" },
          ]),
        ]}
      />
      <main>
        <PageHero
          eyebrow={hero?.eyebrow || "Donate to Chula Vista FC"}
          heading={hero?.heading || "Help us show up for the next kid."}
          description={
            hero?.description ||
            "Every gift to Chula Vista FC stays with our players. As a 501(c)(3) nonprofit, your support keeps the fields lit, the kits clean, and the door open to South Bay families who'd otherwise stay home. Thank you for being part of this."
          }
          actions={
            <Button
              variant="default"
              render={
                <Link href="mailto:contact@chulavistafc.com?subject=Donation%20to%20Chula%20Vista%20FC" />
              }
            >
              <Icon token="ri:badge" aria-hidden="true" />
              <span>Donate now</span>
            </Button>
          }
        />

        <IconCards
          {...cmsOverlay(
            {
              eyebrow: "Where Your Gift Goes",
              heading: "To the kids on the field.",
              description:
                "CVFC is volunteer-led at the board level, so your gift moves directly into the day-to-day work — coaching the players, training on the fields, and keeping the door open.",
              cards: IMPACT_CARDS,
              background: "white" as const,
            },
            impactBlock ? iconCardsFromBlock(impactBlock) : undefined,
          )}
        />

        {/* <Section bg="bone" size="default" id="donate">
          <Heading
            eyebrow="One-Time Gift"
            heading="Give what feels right."
            headingSize="section"
            description={
              <p>
                Pick an amount, or set your own. Every gift — every size — lands
                with a player on a CVFC field.
              </p>
            }
          />
          <ul className="support-tier-grid">
            {ONE_TIME_TIERS.map((tier) => (
              <li key={tier.label} className="support-tier-item">
                <article
                  className="support-tier-card"
                  data-custom={tier.custom ? "true" : "false"}
                >
                  <p className="support-tier-amount">{tier.amount}</p>
                  <h3 className="support-tier-label">{tier.label}</h3>
                  <p className="support-tier-body">{tier.body}</p>
                  <Button
                    variant={tier.custom ? "default" : "outline"}
                    className="support-tier-button"
                    render={<Link href="#donate-form" />}
                  >
                    <span>{tier.cta ?? `Give ${tier.amount}`}</span>
                  </Button>
                </article>
              </li>
            ))}
          </ul>
        </Section> */}

        {/* <Section bg="white" size="default">
          <Heading
            eyebrow="Recurring Support"
            heading="Become a monthly donor."
            headingSize="section"
            description={
              <p>
                Steady, monthly gifts mean the club can plan ahead with
                confidence — coach hiring, scholarship offers, and the long-haul
                work that shapes a season.
              </p>
            }
          />
          <ul className="support-tier-grid">
            {MONTHLY_TIERS.map((tier) => (
              <li key={tier.label} className="support-tier-item">
                <article
                  className="support-tier-card support-tier-card-recurring"
                  data-custom={tier.custom ? "true" : "false"}
                >
                  <p className="support-tier-amount">{tier.amount}</p>
                  <h3 className="support-tier-label">{tier.label}</h3>
                  <p className="support-tier-body">{tier.body}</p>
                  <Button
                    variant="default"
                    className="support-tier-button"
                    render={<Link href="#donate-form" />}
                  >
                    <span>{tier.cta ?? `Start ${tier.amount}`}</span>
                  </Button>
                </article>
              </li>
            ))}
          </ul>
        </Section> */}

        <Section bg="bone" size="default" id="donate-form">
          <div className="support-form-block">
            <Heading
              eyebrow="Make Your Gift"
              heading="Ready to give?"
              headingSize="section"
              description={
                <p>
                  We&rsquo;re finalizing our donation processing partner. Until
                  then, please email the club directly and a board member will
                  follow up to make your gift easy. Thank you for being here.
                </p>
              }
            />
            <div className="support-form-cta">
              <Button
                variant="default"
                render={
                  <a href="mailto:contact@chulavistafc.com?subject=Donation%20to%20Chula%20Vista%20FC" />
                }
              >
                <Icon token="ri:badge" aria-hidden="true" />
                <span>Contact the club to donate</span>
              </Button>
            </div>
            <p className="support-tax-note">
              Chula Vista Fútbol Club is a 501(c)(3) nonprofit organization.
              Donations are tax-deductible to the extent allowed by law. Federal
              Tax ID (EIN): <strong>20-3786129</strong>.
            </p>
          </div>
        </Section>

        <Callout
          id="partnerships"
          cta={{
            label: "View sponsorship tiers",
            href: "/sponsor",
            variant: "default",
          }}
          {...cmsOverlay(
            {
              eyebrow: "Other Ways to Help",
              heading: "Sponsorships and partnerships.",
              variant: "midnight" as const,
              body: (
                <>
                  Local businesses and community{" "}
                  <Link href="/partnerships" className="underline">
                    partners
                  </Link>{" "}
                  help keep CVFC strong — through jersey logos, tournament
                  sponsorships, and gifts directed to specific programs (the
                  Goalkeeper Pathway, Mini Maestros, the Girls Pathway, the
                  Facilities Campaign). Browse the tiers or reach out and
                  we&rsquo;ll find a fit together.
                </>
              ),
            },
            otherBlock ? calloutFromBlock(otherBlock) : undefined,
          )}
        />
      </main>
    </>
  );
}
