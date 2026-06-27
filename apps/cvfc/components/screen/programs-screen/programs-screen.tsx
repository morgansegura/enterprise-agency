import Link from "next/link";

import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { IconCards } from "@/components/feature/icon-cards";
import { MediaSplit } from "@/components/feature/media-split";
import { PageHero } from "@/components/feature/page-hero";
import { Blocks } from "@/components/blocks";
import { getPage } from "@/lib/cms";

type ProgramsScreenProps = {
  className?: string;
};

export async function ProgramsScreen({ className }: ProgramsScreenProps) {
  const page = await getPage("programs");
  return (
    <>
      <main className={className}>
        {page?.layout?.length ? (
          <Blocks page={page} />
        ) : (
          <>
            <PageHero
              eyebrow="Programs & Pathways"
              heading="From first touch to college and pro."
              description="CVFC offers a clear, structured pathway from Mini Maestros at age 4 through MLS NEXT, Elite Academy, NPL, and DPL. Every stage builds technical skill, tactical understanding, and character — preparing players for top leagues, college programs, and beyond."
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
                    <Icon token="ri:badge" aria-hidden="true" />
                    <span>Learn About Tryouts</span>
                    <Icon token="ri:arrow-right" aria-hidden="true" />
                  </Button>
                </>
              }
            />

            <IconCards />

            <MediaSplit
              eyebrow="Player Development"
              heading="Foundations of the Game"
              background="white"
              body="From our Mini Maestros to CVFC Youth teams, Chula Vista FC builds a strong foundation for future success. Our youngest players learn the game through fun, engaging, and skill-focused sessions, while developing the confidence, discipline, and technique needed to thrive as they progress through our development pathway."
              image={{
                src: "https://chulavistafc.com/wp-content/uploads/2024/02/TurnerMedia-5199-scaled-e1707609763493.jpg",
                alt: "Mini Maestros training",
              }}
              tags={["Mini Maestros", "CVFC Youth", "Ages 4–9"]}
              buttons={[
                {
                  label: "More about Foundations",
                  href: "/programs/foundations",
                  variant: "secondary",
                  iconToken: "ri:soccer-ball",
                },
              ]}
            />

            <MediaSplit
              eyebrow="Boys Competitive Pathway"
              heading="Boys Competitive Pathway"
              reverse
              body={
                <>
                  Chula Vista FC offers one of the strongest competitive
                  pathways for boys in Southern California, featuring{" "}
                  <strong>MLS NEXT</strong> and <strong>MLS NEXT 2</strong>,
                  along with <strong>Elite Academy (EA)</strong> and{" "}
                  <strong>EA 2</strong>. We also compete in the{" "}
                  <strong>SoCal League Flight system</strong>, providing the
                  right level of competition for every stage of development.
                </>
              }
              image={{
                src: "https://chulavistafc.com/wp-content/uploads/2024/05/IMG_0867.jpg",
                alt: "CVFC boys competitive team",
              }}
              tags={["SoCal Flight", "EA 2", "EA", "MLS NEXT 2", "MLS NEXT"]}
              buttons={[
                {
                  label: "Boy's Pathway",
                  href: "/programs/boys-competitive-pathway",
                  variant: "secondary",
                  iconToken: "ri:soccer-ball",
                },
              ]}
            />

            <MediaSplit
              eyebrow="Girls Competitive Pathway"
              heading="Girls Competitive Pathway"
              background="white"
              body={
                <>
                  Chula Vista FC offers elite opportunities for our female
                  athletes, including <strong>NPL</strong> and{" "}
                  <strong>DPL</strong> competition, with{" "}
                  <strong>Girl&rsquo;s Academy (GA)</strong> and{" "}
                  <strong>GA Aspire</strong> coming soon. We also compete in the{" "}
                  <strong>SoCal League Flight system</strong>, giving players
                  the perfect level of competition to match their development.
                </>
              }
              image={{
                src: "https://chulavistafc.com/wp-content/uploads/2024/02/IMG_6349.jpg",
                alt: "CVFC girls competitive player",
              }}
              tags={["SoCal Flight", "NPL", "DPL", "GA Aspire", "GA"]}
              buttons={[
                {
                  label: "Girl's Pathway",
                  href: "/programs/girls-competitive-pathway",
                  variant: "secondary",
                  iconToken: "ri:soccer-ball",
                },
              ]}
            />

            <MediaSplit
              eyebrow="Goalkeeper Pathway"
              heading="Goalkeeper Pathway"
              reverse
              body="From the youngest age groups to elite competition, our goalkeeper pathway provides specialized training at every stage. Players develop technical skills, tactical awareness, and mental resilience under expert guidance. The goal is clear — prepare keepers to excel at the highest levels of club, college, and professional play."
              image={{
                src: "https://chulavistafc.com/wp-content/uploads/2023/11/Goalkeepers-pic.jpg",
                alt: "CVFC goalkeepers in training",
              }}
              tags={["Specialty Training", "All Ages", "College/Pro Pathway"]}
              buttons={[
                {
                  label: "Goalkeepers",
                  href: "/programs/goalkeeper-pathway",
                  variant: "secondary",
                  iconToken: "ri:soccer-ball",
                },
              ]}
            />

            <Callout
              eyebrow="Take the First Step"
              heading="Ready to play for Chula Vista?"
              variant="bone"
              body={
                <>
                  Choose your player&rsquo;s date of birth and gender, complete
                  the registration, and a CVFC coach will be in touch with your
                  tryout invitation.
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
