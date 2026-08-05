import Link from "next/link";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Heading } from "@/components/feature/heading";
import { IconCards } from "@/components/feature/icon-cards";
import { MediaSplit } from "@/components/feature/media-split";
import { PageHero } from "@/components/feature/page-hero";
import { SeasonDetails } from "@/components/feature/season-details";
import { Blocks } from "@/components/blocks";
import { getPage } from "@/lib/cms";
import {
  MINI_MAESTROS,
  formatEarlyBirdDeadline,
  formatSeasonRange,
  isEarlyBirdOpen,
  isMiniMaestrosSeasonOpen,
} from "@/data/mini-maestros";

export async function FoundationsScreen() {
  const page = await getPage("programs/foundations");
  const seasonOpen = isMiniMaestrosSeasonOpen();
  const earlyBird = isEarlyBirdOpen();
  return (
    <>
      <main>
        {page?.layout?.length ? (
          <Blocks page={page} />
        ) : (
          <>
            <PageHero
              eyebrow="Foundations"
              heading="Soccer starts here."
              description="Foundations is where every CVFC pathway begins — Mini Maestros and CVFC Youth for ages 4 through 9. Technique first, fun first. The skills that carry a player through MLS NEXT, college, and the rest of life all start in this tier."
              actions={
                <Button
                  variant="outline"
                  render={
                    <a
                      href={MINI_MAESTROS.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <span>Register Now for Mini Maestros</span>
                  <Icon token="ri:arrow-right" aria-hidden="true" />
                </Button>
              }
            />

            {seasonOpen ? (
              <Section size="default" id="mini-maestros">
                <Heading
                  eyebrow={`Mini Maestros \u00b7 ${MINI_MAESTROS.season}`}
                  heading="A six-week season, built for first-timers."
                  headingSize="section"
                  description={
                    <p>
                      Our short-season entry point \u2014 six weeks of
                      technique, small-sided matches, and a shirt of their own.
                      No experience needed, and no year-long commitment.
                    </p>
                  }
                />
                <SeasonDetails
                  className="mt-10"
                  dateline={formatSeasonRange()}
                  datelineNote={MINI_MAESTROS.breakNote}
                  facts={[
                    {
                      id: "weeks",
                      value: `${MINI_MAESTROS.weeks} weeks`,
                      label: "Season length",
                    },
                    {
                      id: "ages",
                      value: "Ages 4\u20139",
                      label: "Three divisions",
                    },
                    earlyBird
                      ? {
                          id: "price",
                          value: MINI_MAESTROS.earlyBirdPrice,
                          label: `Early bird \u2014 ends ${formatEarlyBirdDeadline()}`,
                        }
                      : {
                          id: "matches",
                          value: "Saturdays",
                          label: "Match day",
                        },
                  ]}
                  divisions={[...MINI_MAESTROS.divisions]}
                  columns={[
                    {
                      id: "schedule",
                      label: "Practice & game schedule",
                      items: [
                        "Matches Saturday mornings.",
                        "One weekday training, Monday through Friday.",
                        "Training times work around parent schedules where we can.",
                      ],
                    },
                    {
                      id: "venues",
                      label: "Venues",
                      items: [
                        "Terra Nova Park \u2014 games.",
                        "Victory Christian Academy \u2014 training.",
                        "Futbol Training Center \u2014 training.",
                      ],
                    },
                    {
                      id: "included",
                      label: "Included",
                      items: [...MINI_MAESTROS.includes],
                    },
                    {
                      id: "register",
                      label: "How to register",
                      items: [
                        "Registration runs through PlayMetrics \u2014 a couple of minutes.",
                        "A CVFC coach follows up with first-session details.",
                      ],
                    },
                  ]}
                  footnote={
                    earlyBird
                      ? undefined
                      : "Early bird pricing has closed \u2014 contact the club for current pricing and availability."
                  }
                />
                <div className="mt-12 flex justify-center">
                  <Button
                    variant="outline"
                    render={
                      <a
                        href={MINI_MAESTROS.registerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <span>Register Now for Mini Maestros</span>
                    <Icon token="ri:arrow-right" aria-hidden="true" />
                  </Button>
                </div>
              </Section>
            ) : null}

            <MediaSplit
              eyebrow="Player Development"
              heading="Technique is #1."
              body={
                <>
                  <p>
                    Foundations players come to us as four-year-olds and leave
                    at nine ready for competitive tryouts. The job in those
                    years isn&rsquo;t winning — it&rsquo;s ball mastery,
                    dribbling, shooting, and 1v1 attacking and defending. Build
                    the skills first, and confidence follows.
                  </p>
                  <p>
                    Our Foundations program is COED, runs Monday through
                    Wednesday with matches on Saturdays, and rotates new
                    technical content every week. New families are welcome
                    year-round.
                  </p>
                </>
              }
              image={{
                src: "https://chulavistafc.com/wp-content/uploads/2024/02/TurnerMedia-5199-scaled-e1707609763493.jpg",
                alt: "Mini Maestros training",
              }}
              tags={["Ages 4–9", "Mini Maestros", "CVFC Youth"]}
            />

            <IconCards
              eyebrow="The Foundations Tier"
              heading="From first touch to first competitive year."
              description="Four divisions, one progression. Each step prepares players for the next."
              background="white"
              cards={[
                {
                  id: "super-juniors",
                  iconToken: "custom:soccer-ball",
                  title: "Super Juniors",
                  description:
                    "Ages 4–5 (born 2021–2022). First introduction to the ball, coordination, and the joy of the game.",
                },
                {
                  id: "juniors",
                  iconToken: "custom:cleats",
                  title: "Juniors",
                  description:
                    "Age 6 (born 2020). Ball mastery and 1v1 confidence. Saturday matches start to feel like real soccer.",
                },
                {
                  id: "u8",
                  iconToken: "custom:soccer-field",
                  title: "U8 Mini Maestros",
                  description:
                    "Ages 7–8 (born 2018–2019). Technical content rotates weekly. Players begin learning shape, spacing, and decision-making.",
                },
                {
                  id: "cvfc-youth",
                  iconToken: "custom:bullseye",
                  title: "CVFC Youth (U9)",
                  description:
                    "Age 9 (born 2017). The bridge into competitive play. Ready to try out for boys, girls, or goalkeeper pathways at U10.",
                },
              ]}
            />

            <Section bg="bone" size="default">
              <Heading
                eyebrow="The Pathway"
                heading="Where Foundations leads."
                headingSize="section"
                description={
                  <>
                    <p>
                      At U10, Foundations players try out for one of three
                      competitive pathways: <strong>Boys</strong> (MLS NEXT, MLS
                      NEXT Academy, Elite Academy, EA II, SoCal Flight),{" "}
                      <strong>Girls</strong> (DPL, NPL, GA Aspire, SoCal
                      Flight), or the <strong>Goalkeeper</strong> pathway. Every
                      competitive pathway leads to college recruiting
                      visibility, and a few alumni go on to sign professional
                      contracts with MLS clubs and Liga MX academies.
                    </p>
                    <p>
                      Most of our Foundations players won&rsquo;t turn pro. That
                      was never the point. They&rsquo;ll learn how to compete,
                      how to lose and come back, how to lead a teammate, and how
                      to keep showing up — skills that matter long after the
                      last whistle blows.
                    </p>
                  </>
                }
              />
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button variant="secondary" render={<Link href="/programs" />}>
                  <Icon token="ri:soccer-ball" aria-hidden="true" />
                  <span>Explore the Pathway</span>
                  <Icon token="ri:arrow-right" aria-hidden="true" />
                </Button>
              </div>
            </Section>

            <Callout
              eyebrow="Get Started"
              heading="Bring your player out."
              variant="bone"
              showIcon={false}
              body={
                <>
                  Foundations welcomes new families year-round. Choose your
                  player&rsquo;s pathway and birth year, and a CVFC coach will
                  be in touch with the next step.
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
