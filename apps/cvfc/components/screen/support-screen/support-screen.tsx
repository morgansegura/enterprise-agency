import Link from "next/link";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Callout } from "@/components/feature/callout";
import { DonateEmbed } from "@/components/feature/donate-embed";
import { DonationTiers } from "@/components/feature/donation-tiers";
import { Heading } from "@/components/feature/heading";
import { IconCards, type IconCardEntry } from "@/components/feature/icon-cards";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { getPage } from "@/lib/cms";
import {
  DONATE_ANCHOR,
  MONTHLY_TIERS,
  ONE_TIME_TIERS,
  donationsEnabled,
} from "@/lib/donate";
import { siteConfig } from "@/lib/site-config";
import { blockFor, cmsOverlay } from "@/lib/media";
import {
  pageHeroFromPage,
  iconCardsFromBlock,
  calloutFromBlock,
} from "@/lib/cms-blocks";
import { breadcrumbSchema } from "@/lib/schema";

import "./support-screen.css";

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
                <Link
                  href={
                    donationsEnabled
                      ? `#${DONATE_ANCHOR}`
                      : "mailto:contact@chulavistafc.com?subject=Donation%20to%20Chula%20Vista%20FC"
                  }
                />
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

        {donationsEnabled ? (
          <>
            <Section bg="bone" size="default">
              <Heading
                eyebrow="Recurring Support"
                heading="Become a monthly donor."
                headingSize="section"
                description={
                  <p>
                    Steady, monthly gifts mean the club can plan ahead with
                    confidence — coach hiring, scholarship offers, and the
                    long-haul work that shapes a season.
                  </p>
                }
              />
              <DonationTiers tiers={MONTHLY_TIERS} cadence="monthly" />
            </Section>

            <Section bg="white" size="default">
              <Heading
                eyebrow="One-Time Gift"
                heading="Give what feels right."
                headingSize="section"
                description={
                  <p>
                    Pick an amount, or set your own. Every gift — every size —
                    lands with a player on a CVFC field.
                  </p>
                }
              />
              <DonationTiers tiers={ONE_TIME_TIERS} cadence="one-time" />
            </Section>

            <DonateEmbed />
          </>
        ) : null}

        <Section
          bg="bone"
          size="default"
          id={donationsEnabled ? undefined : DONATE_ANCHOR}
        >
          <div className="support-form-block">
            {donationsEnabled ? null : (
              <>
                <Heading
                  eyebrow="Make Your Gift"
                  heading="Ready to give?"
                  headingSize="section"
                  description={
                    <p>
                      We&rsquo;re finalizing our donation processing partner.
                      Until then, please email the club directly and a board
                      member will follow up to make your gift easy. Thank you
                      for being here.
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
              </>
            )}
            <p className="support-tax-note">
              Chula Vista Fútbol Club is a 501(c)(3) nonprofit organization,
              registered with the IRS as {siteConfig.registeredName}. Donations
              are tax-deductible to the extent allowed by law. Federal Tax ID
              (EIN): <strong>{siteConfig.ein}</strong>.
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
