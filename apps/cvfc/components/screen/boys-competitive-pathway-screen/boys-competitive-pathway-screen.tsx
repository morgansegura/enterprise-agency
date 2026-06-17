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

export function BoysCompetitivePathwayScreen() {
  return (
    <>
      <main>
        <PageHero
          eyebrow="Boys Competitive Pathway"
          heading="MLS NEXT, Elite Academy, and a real pathway."
          description="The boys pathway at Chula Vista FC runs from U10 through U19 across MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, and the SoCal Flight system. One club, every level — built so players can climb without ever changing crests."
          actions={
            <>
              <EvaluationCTA variant="default" label="Request an Evaluation" />
              <Button variant="outline" render={<Link href="/evaluations" />}>
                <span>Learn About Tryouts</span>
                <Icon token="ri:arrow-right" aria-hidden="true" />
              </Button>
            </>
          }
        />

        <MediaSplit
          eyebrow="The Top of the Ladder"
          heading="Inside MLS NEXT."
          body={
            <>
              <p>
                Chula Vista FC is a proud member of the MLS NEXT League, where
                our top-flight boys&rsquo; teams are provided with a
                purpose-driven path to professional play and college athletics.
                MLS NEXT clubs combined have produced more than 90 percent of
                the U.S. Youth National Team players in 2019 — establishing it
                as the top destination for the best young players in North
                America.
              </p>
              <p>
                Players are scouted through the MLS NEXT Showcases held
                throughout the season and challenged by the best teams in the
                country. Coaches commit to a high-intensity regimen that focuses
                on player identification, environment, personal growth, and
                community.
              </p>
            </>
          }
          image={{
            src: "https://chulavistafc.com/wp-content/uploads/2024/05/IMG_0867.jpg",
            alt: "CVFC boys MLS NEXT player",
          }}
          tags={["MLS NEXT", "Birth Years 2007–2013", "Showcase Scouting"]}
        />

        <IconCards
          eyebrow="The Boys Pathway"
          heading="Boys leagues, by tier."
          cols={3}
          description="Whether your player is just starting competitive soccer or aiming at MLS, there's a tier that matches their level — and a coach already developing players above and below it."
          background="white"
          cards={[
            {
              id: "mls-next",
              iconToken: "custom:trophy",
              title: "MLS NEXT",
              description:
                "Top-flight competition across the U.S. Showcase scouting, national-tier opponents, and the most direct line to MLS academies and college recruiters.",
            },
            {
              id: "mls-next-academy",
              iconToken: "custom:medal",
              title: "MLS NEXT Academy",
              description:
                "Sub-MLS-NEXT competitive tier within the same player development environment. A clear next step on the way up.",
            },
            {
              id: "elite-academy",
              iconToken: "custom:soccer-ball",
              title: "Elite Academy (EA)",
              description:
                "High-level alternative to MLS NEXT for players who want top competition without the full MLS NEXT travel commitment.",
            },
            {
              id: "ea-ii",
              iconToken: "custom:soccer-field",
              title: "Elite Academy II",
              description:
                "CVFC joined Elite Academy 2 for the 2024–25 season — adding a second EA tier so more players can compete at the elite level.",
            },
            {
              id: "socal-flight",
              iconToken: "custom:racing-flags",
              title: "SoCal Flight System",
              description:
                "Regional competition tiered by ability so every team plays opponents at the right level. The right rung for steady, measurable development.",
            },
            {
              id: "first-team",
              iconToken: "custom:torch",
              title: "First Team",
              description:
                "CVFC's adult First Team has won the Southwest Premier League and qualified for the Lamar Hunt US Open Cup. A real ceiling for senior players.",
            },
          ]}
        />

        <Section bg="bone" size="default">
          <Heading
            eyebrow="Inside MLS NEXT Academy"
            heading="MLS NEXT Academy"
            headingSize="section"
            description={
              <>
                <p>
                  MLS NEXT Academy is the next-tier roster within the same MLS
                  NEXT environment — same coaching standards, same curriculum,
                  same training environment as MLS NEXT, with competition tuned
                  for players still climbing toward the top tier.
                </p>
                <p>
                  CVFC&rsquo;s MLS NEXT Academy program covers birth years
                  2007–2013 and gives players a clear, internal pathway to the
                  top MLS NEXT roster as they develop.
                </p>
              </>
            }
          />
        </Section>

        <Section bg="white" size="default">
          <Heading
            eyebrow="Inside Elite Academy"
            heading="Elite Academy (EA) — top competition, regional commitment."
            headingSize="section"
            description={
              <>
                <p>
                  Elite Academy is a high-level alternative to MLS NEXT for
                  players who want top competition without the full MLS NEXT
                  national-travel commitment. EA matches CVFC up with the
                  strongest clubs in Southern California in a competitive
                  structure that still produces college and academy-bound
                  players.
                </p>
                <p>
                  CVFC&rsquo;s EA program covers birth years 2005–2013 and is
                  led by coaches with experience at the U.S. Youth National Team
                  level and beyond.
                </p>
              </>
            }
          />
        </Section>

        <Section bg="bone" size="default">
          <Heading
            eyebrow="Inside Elite Academy II"
            heading="Elite Academy II"
            headingSize="section"
            description={
              <>
                <p>
                  Chula Vista FC joined Elite Academy 2 (EA II) for the 2024–25
                  season, adding a second EA roster tier so more players can
                  compete in the elite environment. EA II pairs with the main EA
                  program to create internal competition, push-up opportunities,
                  and a more developmental structure for players still building
                  toward the top tier.
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
                  The SoCal Flight system tiers regional boys competition by
                  ability, so every team plays opponents at the level that
                  pushes them without overwhelming them. For CVFC, Flight is
                  where developing teams build the foundation to step up to EA
                  or MLS NEXT when they&rsquo;re ready.
                </p>
                <p>
                  Flight matches are local or regional, schedules are
                  predictable, and the competitive environment is real without
                  the travel commitment of national-tier leagues.
                </p>
              </>
            }
          />
        </Section>

        <Section bg="bone" size="default">
          <Heading
            eyebrow="Inside the First Team"
            heading="The senior ceiling — Southwest Premier League and beyond."
            headingSize="section"
            description={
              <>
                <p>
                  CVFC&rsquo;s adult First Team competes in the Southwest
                  Premier League, where it has lifted the SWPL trophy. The First
                  Team has also advanced through the qualifying rounds of the
                  Lamar Hunt US Open Cup and reached NISA semifinals — a real
                  adult ceiling for senior players who want to stay competitive
                  after the youth pathway.
                </p>
                <p>
                  For players moving from U19 toward college, the First Team is
                  also a training environment they can learn from even before
                  they&rsquo;re old enough to play in it.
                </p>
              </>
            }
          />
        </Section>

        <Section bg="bone" size="default">
          <Heading
            eyebrow="The Pathway Story"
            heading="From U10 to MLS, FC Dallas, and Liga MX."
            headingSize="section"
            description={
              <>
                <p>
                  Recent CVFC alumni have signed with{" "}
                  <strong>MLS Colorado Rapids</strong>,{" "}
                  <strong>FC Dallas</strong>, <strong>Austin FC</strong>,{" "}
                  <strong>Atlas FC Academy</strong>,{" "}
                  <strong>Club Tijuana</strong>,{" "}
                  <strong>Club Rayados de Monterrey</strong>, and{" "}
                  <strong>Barça Academy Arizona</strong>, and have represented
                  the <strong>US National Team</strong> and the{" "}
                  <strong>Mexican National Team</strong>. That&rsquo;s the
                  ceiling — and it&rsquo;s real. The pathway works.
                </p>
                <p>
                  But most players who come through MLS NEXT, EA, or the SoCal
                  Flight system don&rsquo;t turn pro. That was never the only
                  point. They learn how to compete, how to lose and come back,
                  how to lead a teammate, and how to keep showing up — skills
                  that matter in college, in careers, and in everything that
                  comes after.
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
          heading="Tryouts open year-round."
          variant="bone"
          body={
            <>
              Whether your player is moving up from Foundations or coming in
              from another club, the path begins the same way. Choose their
              birth year and a CVFC coach will be in touch with the next step.
            </>
          }
          ctaSlot={
            <EvaluationCTA label="Request an Evaluation" variant="default" />
          }
        />
      </main>
    </>
  );
}
