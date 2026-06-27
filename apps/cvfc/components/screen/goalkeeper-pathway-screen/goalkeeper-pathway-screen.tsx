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

export async function GoalkeeperPathwayScreen() {
  const page = await getPage("programs/goalkeeper-pathway");
  return (
    <>
      <main>
        {page?.layout?.length ? (
          <Blocks page={page} />
        ) : (
          <>
            <PageHero
              eyebrow="Goalkeeper Pathway"
              heading="Specialized training for the most specialized position."
              description="Goalkeeper is a different sport. Chula Vista FC has a dedicated goalkeeping staff — including a former Mexican Third Division goalkeeper, a Cal Poly San Luis Obispo scholarship alumnus, and an MLS NEXT goalkeeping coach — running specialty sessions at every age."
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
              eyebrow="Why a Specialty Pathway"
              heading="The position demands its own curriculum."
              body={
                <>
                  <p>
                    A keeper&rsquo;s development happens differently than an
                    outfield player&rsquo;s. Footwork, handling, distribution,
                    shot-stopping technique, decision-making in the box, and the
                    mental game all need their own time on the training ground —
                    not just whatever&rsquo;s left over at the end of a team
                    session.
                  </p>
                  <p>
                    Our goalkeepers train alongside their pathway team
                    (Foundations, Boys, Girls, MLS NEXT, DPL, etc.) but get
                    dedicated GK sessions led by goalkeeping specialists.
                    That&rsquo;s how a CVFC keeper develops the technical
                    foundation, tactical awareness, and mental resilience to
                    excel at club, college, and professional levels.
                  </p>
                </>
              }
              image={{
                src: "https://chulavistafc.com/wp-content/uploads/2023/11/Goalkeepers-pic.jpg",
                alt: "CVFC goalkeepers in training",
              }}
              tags={["All Ages", "MLS NEXT GK Coach", "College Pathway"]}
            />

            <IconCards
              eyebrow="What GK Training Builds"
              heading="The four pillars of a CVFC keeper."
              description="Specialty training is technical, tactical, mental, and physical — all four developed in parallel from first touch through senior soccer."
              background="white"
              cards={[
                {
                  id: "technical",
                  iconToken: "custom:cleats",
                  title: "Technical Foundation",
                  description:
                    "Handling, footwork, set position, diving, crossing, and distribution. The fundamentals every keeper rebuilds at every age.",
                },
                {
                  id: "tactical",
                  iconToken: "custom:soccer-field",
                  title: "Tactical Awareness",
                  description:
                    "Reading the game, organizing the back line, decision-making in the box, and playing out from the back in the modern style.",
                },
                {
                  id: "mental",
                  iconToken: "custom:bullseye",
                  title: "Mental Resilience",
                  description:
                    "The keeper position is mostly mental. Confidence after a mistake, focus through long stretches, and the willingness to be the loudest voice on the field.",
                },
                {
                  id: "physical",
                  iconToken: "custom:speed-bike",
                  title: "Athletic Development",
                  description:
                    "Explosive power, reaction speed, and the conditioning to perform 90 minutes from first whistle to last.",
                },
              ]}
            />

            <Section bg="bone" size="default">
              <Heading
                eyebrow="The Goalkeeping Staff"
                heading="Coached by professionals."
                headingSize="section"
                description={
                  <>
                    <p>
                      CVFC&rsquo;s goalkeeping staff includes{" "}
                      <strong>Ricardo Villalva</strong>, our MLS NEXT goalkeeper
                      coach who played in Mexico&rsquo;s third division with
                      Alebrijes de Oaxaca; <strong>Carlos Arce</strong>, a
                      former Xolos U15 keeper who earned a full scholarship to
                      Cal Poly San Luis Obispo (coached by former US National
                      Team head coach Steve Sampson); and{" "}
                      <strong>Victor Duran</strong>, who works with our
                      developing keepers across the pathway.
                    </p>
                    <p>
                      A few of our keepers will sign with college programs. Some
                      may push toward professional environments. Most
                      won&rsquo;t — and that&rsquo;s honest. What every CVFC
                      keeper does take with them is composure under pressure,
                      decisiveness, and the kind of mental toughness that pays
                      off in every part of life after the game.
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
                  <span>Meet the Goalkeeping Staff</span>
                  <Icon token="ri:arrow-right" aria-hidden="true" />
                </Button>
              </div>
            </Section>

            <Callout
              eyebrow="Get Started"
              heading="Bring your keeper out for a session."
              variant="bone"
              body={
                <>
                  Goalkeepers tryout alongside their pathway team. Choose your
                  player&rsquo;s pathway and birth year, and our goalkeeping
                  staff will be in touch.
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
