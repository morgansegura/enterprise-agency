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
import { Blocks } from "@/components/blocks";
import { getPage } from "@/lib/cms";

export async function GirlsCompetitivePathwayScreen() {
  const page = await getPage("programs/girls-competitive-pathway");
  return (
    <>
      <main>
        {page?.layout?.length ? (
          <Blocks page={page} />
        ) : (
          <>
            <PageHero
              eyebrow="Girls Competitive Pathway"
              heading="GA, DPL, NPL, and a pathway built for the next generation."
              description="The girls pathway at Chula Vista FC runs from U10 through U19 across DPL, NPL, and the SoCal Flight system, with applications submitted for GA and GA Aspire. One club, every level — built so players can climb without ever changing crests."
              actions={
                <>
                  <EvaluationCTA
                    variant="default"
                    label="Request an Evaluation"
                  />
                  <Button
                    variant="outline"
                    render={<Link href="/evaluations#register" />}
                  >
                    <span>Learn About Tryouts</span>
                    <Icon token="ri:arrow-right" aria-hidden="true" />
                  </Button>
                </>
              }
            />

            <MediaSplit
              eyebrow="Inside the DPL"
              heading="The Development Player League."
              body={
                <>
                  <p>
                    The Development Player League is a prestigious club-vs-club
                    platform specifically designed to elevate girls&rsquo;
                    soccer. CVFC was accepted into the DPL in April 2025 — a
                    standards-driven national league that gives players a
                    structured, reputable environment for long-term growth.
                  </p>
                  <p>
                    DPL emphasizes both athletic and personal growth. It extends
                    beyond soccer skills to life lessons, community, and
                    collegiate opportunities — and it pits CVFC players against
                    the elite clubs of Southern California, who are among the
                    nation&rsquo;s best.
                  </p>
                </>
              }
              image={{
                src: "https://chulavistafc.com/wp-content/uploads/2024/02/IMG_6349.jpg",
                alt: "CVFC girls competitive player",
              }}
              tags={["DPL", "NPL", "Birth Years 2007–2013"]}
              reverse
            />

            <IconCards
              eyebrow="The Girls Pathway"
              heading="Girls leagues, by tier."
              cols={3}
              description="From Girls Academy down through SoCal Flight — leagues ordered by competitive level, so players can find the right rung now and a clear way up."
              background="white"
              cards={[
                {
                  id: "ga",
                  iconToken: "custom:trophy",
                  title: "Girls Academy (GA)",
                  description:
                    "The top of the girls pathway — the Girls Academy League, the highest national-tier environment for elite female players. CVFC has applied for GA acceptance.",
                },
                {
                  id: "ga-aspire",
                  iconToken: "custom:medal",
                  title: "GA Aspire",
                  description:
                    "The pre-Girls Academy environment that develops the next generation of GA players at the highest competitive level. CVFC has applied for GA Aspire acceptance.",
                },
                {
                  id: "dpl",
                  iconToken: "custom:soccer-ball",
                  title: "DPL",
                  description:
                    "The Development Player League — a prestigious club-vs-club platform specifically designed to elevate girls' soccer. CVFC accepted in April 2025.",
                },
                {
                  id: "npl",
                  iconToken: "custom:torch",
                  title: "NPL",
                  description:
                    "National Premier Leagues — top-tier regional competition with national playoff visibility for girls who play at the highest club level.",
                },
                {
                  id: "socal-flight",
                  iconToken: "custom:racing-flags",
                  title: "SoCal Flight System",
                  description:
                    "Regional girls competition tiered by ability, so every team plays opponents at the right level. The right rung for steady, measurable progress.",
                },
              ]}
            />

            <Section bg="bone" size="default">
              <Heading
                eyebrow="Inside Girls Academy"
                heading="Girls Academy (GA)"
                headingSize="section"
                description={
                  <>
                    <p>
                      The Girls Academy League (GA) sits at the top of the girls
                      competitive pathway — a national-tier environment built
                      for the most committed female athletes, with full-year
                      development, top opponents from across the country, and
                      direct visibility for college recruiters and youth
                      national team scouts.
                    </p>
                    <p>
                      CVFC has applied for GA acceptance. Once placed, GA will
                      sit above GA Aspire, DPL, NPL, and the SoCal Flight system
                      in the girls competitive structure.
                    </p>
                  </>
                }
              />
            </Section>

            <Section bg="white" size="default">
              <Heading
                eyebrow="Inside GA Aspire"
                heading="GA Aspire"
                headingSize="section"
                description={
                  <>
                    <p>
                      GA Aspire is the pre-Girls Academy environment that
                      prepares the next generation of GA-level players. It pairs
                      the daily standards of the top tier with a developmental
                      focus, so players who aren&rsquo;t yet on a GA roster can
                      train, compete, and grow toward it.
                    </p>
                    <p>
                      CVFC has applied for GA Aspire acceptance. Once placed, GA
                      Aspire will sit between GA and DPL in the girls
                      competitive structure.
                    </p>
                  </>
                }
              />
            </Section>

            <Section bg="bone" size="default">
              <Heading
                eyebrow="Inside the NPL"
                heading="National Premier League"
                headingSize="section"
                description={
                  <>
                    <p>
                      The National Premier League (NPL) is one of the highest
                      levels of regional girls soccer in the U.S., with national
                      playoff visibility for top regional finishers. It&rsquo;s
                      built for players who want the rigor of a national-tier
                      league while staying rooted in regional competition.
                    </p>
                    <p>
                      CVFC NPL teams compete against the strongest clubs in
                      Southern California and have a real path to the NPL
                      Showcase and national playoff stages.
                    </p>
                  </>
                }
              />
            </Section>

            <Section bg="white" size="default">
              <Heading
                eyebrow="Inside SoCal Flight"
                heading="SoCal Flight System"
                headingSize="section"
                description={
                  <>
                    <p>
                      The SoCal Flight system tiers regional girls competition
                      by ability, so every team plays opponents at the level
                      that pushes them without overwhelming them. For CVFC,
                      Flight is where developing teams build the foundation to
                      step up to NPL or DPL when they&rsquo;re ready.
                    </p>
                    <p>
                      Flight matches are local or regional, season schedules are
                      predictable, and the competitive environment is real
                      without the travel commitment of national-tier leagues.
                    </p>
                  </>
                }
              />
            </Section>

            <Section bg="bone" size="default">
              <Heading
                eyebrow="The Pathway Story"
                heading="Built for college soccer — and what comes after."
                headingSize="section"
                description={
                  <>
                    <p>
                      The girls pathway is built around two real outcomes:{" "}
                      <strong>college recruiting visibility</strong> for the
                      players who want it, and <strong>life skills</strong> that
                      carry every player forward whether soccer stays in the
                      picture or not. DPL events, NPL playoffs, and Flight
                      competition put players in front of college coaches at
                      every level. Daily training builds the work ethic,
                      leadership, and resilience that matter long after.
                    </p>
                    <p>
                      Most CVFC girls won&rsquo;t play professionally —
                      there&rsquo;s no honest pathway in youth soccer that
                      pretends otherwise. But every player leaves better than
                      she came: stronger, sharper, more accountable, more
                      capable of leading a team.
                    </p>
                  </>
                }
              />
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  variant="secondary"
                  render={<Link href="/about/coaching-staff" />}
                >
                  <Icon token="ri:soccer-ball" aria-hidden="true" />
                  <span>Meet the Coaching Staff</span>
                  <Icon token="ri:arrow-right" aria-hidden="true" />
                </Button>
              </div>
            </Section>

            <Callout
              eyebrow="Take the Step"
              heading="Bring her out for a tryout."
              variant="bone"
              body={
                <>
                  CVFC accepts evaluations year-round across DPL, NPL, and the
                  SoCal Flight system, with applications submitted for GA and GA
                  Aspire. Choose her birth year and a CVFC coach will be in
                  touch with the next step.
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
