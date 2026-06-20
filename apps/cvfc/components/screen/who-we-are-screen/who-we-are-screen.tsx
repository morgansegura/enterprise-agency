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
import { StatBand } from "@/components/feature/stat-band";
import { WelcomeBanner } from "@/components/feature/welcome-banner";
import { Blocks } from "@/components/blocks";
import { getPage } from "@/lib/cms";

export async function WhoWeAreScreen() {
  const page = await getPage("about/who-we-are");
  return (
    <>
      <main>
        {page?.layout?.length ? (
          <Blocks layout={page.layout} />
        ) : (
          <>
            <PageHero
              eyebrow="Who We Are"
              heading="A youth soccer club, started in 1982."
              description="Chula Vista FC develops boys and girls from every walk of life into competitors at the highest levels of youth, college, and professional soccer — and into people who carry the work into the rest of their lives."
              actions={
                <EvaluationCTA
                  variant="default"
                  label="Request an Evaluation"
                />
              }
            />

            <WelcomeBanner
              eyebrow="Since 1982"
              heading="Built by the community, for the community."
              headingAs="h2"
              image={{
                src: "/media/image/image-cvfc-founders.png",
                alt: "Chula Vista FC founders",
              }}
              body={
                <>
                  <p>
                    Established in 1982, Chula Vista FC has been in the upper
                    echelon of clubs in the South Bay area for over 40 years. As
                    a member of the MLS Next League and Elite Academy League, we
                    offer the highest standards and level of play at the youth
                    level in San Diego under our core values of attitude, unity,
                    respect, and passion.
                  </p>
                  <p>
                    Since the club&rsquo;s beginnings, many changes have been
                    made to foster and improve the development of players while
                    maintaining a strong culture of local community identity.
                    The goal for us is clear &mdash; to provide its members with
                    value and for Chula Vista FC to continue functioning as one
                    of the most professional clubs in the United States.
                  </p>
                </>
              }
            />

            <IconCards
              eyebrow="Our Values"
              heading="Passion. Unity. Respect. Attitude."
              description="Creating champions on the field and leaders in life."
              background="white"
              cards={[
                {
                  id: "attitude",
                  title: "Attitude",
                  description:
                    "Show up ready to learn, ready to work, and ready to grow — every practice, every match, every moment.",
                },
                {
                  id: "respect",
                  title: "Respect",
                  description:
                    "For your teammates, your coaches, your opponents, and yourself. The foundation everything else is built on.",
                },
                {
                  id: "unity",
                  title: "Unity",
                  description:
                    "We rise together. The team is always larger than the player, and the club is always larger than the team.",
                },
                {
                  id: "passion",
                  title: "Passion",
                  description:
                    "Love the game. Love the work. Love the journey. The players who go furthest are the ones who care most.",
                },
              ]}
            />

            <MediaSplit
              eyebrow="The Mission"
              heading="The work is the same for every player who walks in."
              body={
                <>
                  <p>
                    That&rsquo;s the work — and it has been since 1982. Chula
                    Vista FC was founded in the South Bay and we&rsquo;re still
                    rooted here, but the gate has always been open. Families
                    come to us from across San Diego County, the Imperial
                    Valley, the border region, and beyond. We measure players by
                    what they&rsquo;re willing to do, not where they&rsquo;re
                    coming from.
                  </p>
                  <p>
                    Recent partnerships extend that reach: in 2025,{" "}
                    <strong>San Diego FC</strong> partnered with Chula Vista FC
                    to help grow the beautiful game across the region. In 2024,
                    CVFC joined a campaign to improve soccer fields throughout
                    Chula Vista — investing in the infrastructure the next
                    generation of players will share.
                  </p>
                </>
              }
              image={{
                src: "https://chulavistafc.com/wp-content/uploads/2024/05/IMG_0867.jpg",
                alt: "Chula Vista FC players in competition",
              }}
              tags={[
                "Boys & Girls",
                "Every Player",
                "San Diego FC Partnership",
              ]}
            />

            <Section bg="white" size="default">
              <Heading
                eyebrow="Cultural Continuity"
                heading="Former players giving back"
                headingSize="section"
                description={
                  <>
                    <p>
                      Some of our coaches once wore the same crest they now
                      teach under. <strong>Fernando Mares</strong>, our
                      Assistant Academy Director, played for CVFC from 2000 to
                      2010 before returning as a coach.{" "}
                      <strong>Mathias Medel</strong>, our Director of Mini
                      Maestros, played his entire life with the club.{" "}
                      <strong>Javier Castorena</strong> wore the Chula Vista
                      Pumas shirt (now CVFC) from 1999 to 2008.
                    </p>
                    <p>
                      That continuity matters. Coaches who came up through the
                      pathway understand it. They mentor with the perspective of
                      having walked the same field as the players in front of
                      them — and they carry the club&rsquo;s identity forward.
                    </p>
                  </>
                }
              />
              <div className="mt-8 flex justify-center">
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

            <StatBand
              eyebrow="By the Numbers"
              heading="Inside Chula Vista FC."
              description="Championships earned, professional contracts signed, and the families who've trusted Chula Vista FC across four decades."
              stats={[
                {
                  id: "years",
                  value: "40+",
                  label: "Years Developing Players",
                },
                { id: "pathways", value: "5", label: "Active Pathways" },
                { id: "leagues", value: "8+", label: "Leagues & Programs" },
                { id: "coaches", value: "30+", label: "Licensed Coaches" },
              ]}
              highlights={[
                {
                  id: "alumni-coaches",
                  tag: "Generational",
                  title: "Players who came back to give it back",
                  body: "Coaches like Fernando Mares (CVFC 2000–2010), Mathias Medel (lifelong), and Javier Castorena (Chula Vista Pumas 1999–2008) returned to coach the next generation in the same shirt they grew up in.",
                },
                {
                  id: "every-pathway",
                  tag: "All in One Club",
                  title: "Boys, girls, goalkeepers — all under one roof",
                  body: "MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, NPL, DPL, GA Aspire (coming), and Foundations from age four. One club, every pathway.",
                },
                {
                  id: "cross-border",
                  tag: "Across Borders",
                  title: "Players moving to MLS and Liga MX",
                  body: "Recent CVFC alumni have signed with MLS Colorado Rapids, FC Dallas, Atlas FC Academy, Club Tijuana, and Club Rayados de Monterrey.",
                },
                {
                  id: "sdfc-partner",
                  tag: "MLS Partner",
                  title: "Trusted by an MLS expansion club",
                  body: "San Diego FC partnered with Chula Vista FC to help grow the beautiful game across the region.",
                },
                {
                  id: "us-soccer-host",
                  tag: "US Soccer",
                  title: "Hosted a US Soccer Talent ID Center",
                  body: "US Soccer chose CVFC to host a Talent ID Center in Santee — recognition of the development environment we've built.",
                },
                {
                  id: "coaching-quality",
                  tag: "Coaching",
                  title: "USSF B minimum. USSF A and UEFA on staff.",
                  body: "Every MLS NEXT head coach holds at least a USSF B License — and the staff also includes USSF A license holders. Academy Director J. Hector Diaz holds a UEFA C License earned in Scotland.",
                },
                {
                  id: "college-signings",
                  tag: "Collegiate",
                  title: "Alumni continuing to college soccer",
                  body: "CVFC players have moved on to NCAA programs including Cal Poly San Luis Obispo (full scholarship), San Diego State University, Point Loma Nazarene, UC Riverside, and more.",
                },
                {
                  id: "first-team",
                  tag: "First Team",
                  title: "An adult First Team that competes",
                  body: "CVFC's First Team has won the Southwest Premier League, advanced through the Lamar Hunt US Open Cup qualifying rounds, and reached NISA semifinals — giving senior players a real competitive ceiling at the club.",
                },
                {
                  id: "from-age-four",
                  tag: "From Day One",
                  title: "A pathway from age four",
                  body: "Players can start with Mini Maestros at age four and stay all the way through MLS NEXT, EA, NPL, or DPL — without ever changing clubs.",
                },
              ]}
              footnote={
                <>
                  CVFC alumni have signed with{" "}
                  <strong>MLS Colorado Rapids</strong>,{" "}
                  <strong>FC Dallas</strong>, <strong>Austin FC</strong>,{" "}
                  <strong>Atlas FC Academy</strong>,{" "}
                  <strong>Club Tijuana</strong>,{" "}
                  <strong>Club Rayados de Monterrey</strong>, and{" "}
                  <strong>Barça Academy Arizona</strong> — and have represented
                  the <strong>US National Team</strong> and the{" "}
                  <strong>Mexican National Team</strong>. Competing through{" "}
                  <strong>MLS NEXT</strong>, Elite Academy, NPL, DPL, the
                  Southwest Premier League, and the Lamar Hunt US Open Cup.
                </>
              }
            />

            <Callout
              eyebrow="Be Part of the Next 40 Years"
              heading="Join the South Bay's premier youth soccer club."
              variant="bone"
              body={
                <>
                  Whether your player is just getting started in Mini Maestros
                  or ready to compete in MLS NEXT, the path begins with a
                  conversation. Request an evaluation and a CVFC coach will be
                  in touch.
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
