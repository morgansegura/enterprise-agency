import { cn } from "@/lib/utils";
import "./landing-screen.css";
import { HeroCarousel } from "@/components/feature/hero-carousel";
import { WelcomeBanner } from "@/components/feature/welcome-banner";
import { IconCards } from "@/components/feature/icon-cards";
import { Callout } from "@/components/feature/callout";
import { MediaSplit } from "@/components/feature/media-split";
import { StatBand } from "@/components/feature/stat-band";
import { PortraitGrid } from "@/components/feature/portrait-grid";
import { Testimonials } from "@/components/feature/testimonials";
import { FaqSection } from "@/components/feature/faq-section";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { getFeaturedCoaches } from "@/data/coaches";
import { Blocks } from "@/components/blocks";
import { getPage } from "@/lib/cms";
import {
  heroSlidesFromPage,
  welcomeBannerFromPage,
  faqSectionFromPage,
  testimonialsFromPage,
} from "@/lib/cms-blocks";

type LandingScreenProps = {
  className?: string;
};

export async function LandingScreen({ className }: LandingScreenProps) {
  const featuredCoaches = getFeaturedCoaches();
  const page = await getPage("home");
  const heroSlides = heroSlidesFromPage(page);
  const welcome = welcomeBannerFromPage(page);
  const faq = faqSectionFromPage(page);
  const testimonials = testimonialsFromPage(page);
  const hasCmsMediaSplits =
    page?.layout?.some((b) => b.blockType === "mediaSplit") ?? false;

  return (
    <>
      <main className={cn("landing-screen", className)}>
        {hasCmsMediaSplits ? (
          <Blocks page={page} />
        ) : (
          <>
            <HeroCarousel slides={heroSlides} />
            <WelcomeBanner headingAs="h2" {...welcome} />

            <IconCards
              eyebrow="Our Values"
              heading="Passion. Unity. Respect. Attitude."
              description="Creating champions on the field and leaders in life. P.U.R.A."
              cards={[
                {
                  id: "passion",
                  title: "Passion",
                  description:
                    "Love the game. Love the work. Love the journey. The players who go furthest are the ones who care most.",
                },
                {
                  id: "unity",
                  title: "Unity",
                  description:
                    "We rise together. The team is always larger than the player, and the club is always larger than the team.",
                },
                {
                  id: "respect",
                  title: "Respect",
                  description:
                    "For your teammates, your coaches, your opponents, and yourself. The foundation everything else is built on.",
                },
                {
                  id: "attitude",
                  title: "Attitude",
                  description:
                    "Show up ready to learn, ready to work, and ready to grow — every practice, every match, every moment.",
                },
              ]}
              background="white"
            />

            <Callout
              eyebrow="Open Year-Round"
              heading="Did you know?"
              body={
                <>
                  Even if our tryouts have ended, players can still be evaluated
                  on an individual basis. Chula Vista FC offers{" "}
                  <strong>individual evaluations</strong> &nbsp;for players who
                  are new to the area or missed official tryout dates. Our
                  comprehensive evaluation system is tailored to each
                  player&rsquo;s level, style, and needs, with the goal of
                  helping every athlete reach their full potential both on and
                  off the field.
                </>
              }
            />

            <IconCards
              cta={{
                label: "CVFC Development Pathways",
                href: "/programs",
                variant: "secondary",
                iconToken: "ri:soccer-ball",
              }}
            />

            {hasCmsMediaSplits ? (
              <Blocks page={page} only={["mediaSplit"]} />
            ) : (
              <>
                <MediaSplit
                  eyebrow="Player Development"
                  heading="Foundations of the Game"
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
                  eyebrow="Goalkeeper Pathway"
                  heading="Goalkeeper Pathway"
                  background="white"
                  reverse
                  body="From the youngest age groups to elite competition, our goalkeeper pathway provides specialized training at every stage. Players develop technical skills, tactical awareness, and mental resilience under expert guidance. The goal is clear — prepare keepers to excel at the highest levels of club, college, and professional play."
                  image={{
                    src: "https://chulavistafc.com/wp-content/uploads/2023/11/Goalkeepers-pic.jpg",
                    alt: "CVFC goalkeepers in training",
                  }}
                  tags={[
                    "Specialty Training",
                    "All Ages",
                    "College/Pro Pathway",
                  ]}
                  buttons={[
                    {
                      label: "Request an Evaluation",
                      href: "/evaluations",
                      variant: "outline",
                      iconToken: "ri:badge",
                    },
                    {
                      label: "Goalkeepers",
                      href: "/programs/goalkeeper-pathway",
                      variant: "secondary",
                      iconToken: "ri:soccer-ball",
                    },
                  ]}
                />

                <MediaSplit
                  eyebrow="Girls Competitive Pathway"
                  heading="Girls Competitive Pathway"
                  body={
                    <>
                      Chula Vista FC is proud to offer elite opportunities for
                      our female athletes, including <strong>NPL</strong> and{" "}
                      <strong>DPL</strong> competition, with{" "}
                      <strong>Girl&rsquo;s Academy (GA)</strong> and{" "}
                      <strong>GA Aspire</strong> coming soon. We also compete in
                      the <strong>SoCal League Flight system</strong>, giving
                      players the perfect level of competition to match their
                      development. These top-tier leagues and pathways ensure
                      our players receive the highest level of training,
                      competition, and exposure — helping them reach their full
                      potential on and off the field.
                    </>
                  }
                  image={{
                    src: "https://chulavistafc.com/wp-content/uploads/2024/02/IMG_6349.jpg",
                    alt: "CVFC girls competitive player",
                  }}
                  tags={["SoCal Flight", "NPL", "DPL", "GA Aspire", "GA"]}
                  buttons={[
                    {
                      label: "Request an Evaluation",
                      href: "/evaluations",
                      variant: "outline",
                      iconToken: "ri:badge",
                    },
                    {
                      label: "Girl's Pathway",
                      href: "/programs/girls-competitive-pathway",
                      variant: "secondary",
                      iconToken: "ri:soccer-ball",
                    },
                  ]}
                />

                <MediaSplit
                  eyebrow="Boys Competitive Pathway"
                  heading="Boys Competitive Pathway"
                  background="white"
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
                      These platforms give our players elite training, top-level
                      competition, and national exposure — preparing them to
                      excel at the highest levels of the game.
                    </>
                  }
                  image={{
                    src: "https://chulavistafc.com/wp-content/uploads/2024/05/IMG_0867.jpg",
                    alt: "CVFC boys competitive team",
                  }}
                  tags={[
                    "SoCal Flight",
                    "EA 2",
                    "EA",
                    "MLS NEXT 2",
                    "MLS NEXT",
                  ]}
                  buttons={[
                    {
                      label: "Request an Evaluation",
                      href: "/evaluations",
                      variant: "outline",
                      iconToken: "ri:badge",
                    },
                    {
                      label: "Boy's Pathway",
                      href: "/programs/boys-competitive-pathway",
                      variant: "secondary",
                      iconToken: "ri:soccer-ball",
                    },
                  ]}
                />
              </>
            )}

            <StatBand
              eyebrow="By the Numbers"
              heading="Built to compete. Trained to win."
              description="The pathway delivers — measured by championships earned, professional contracts signed, and the families who&rsquo;ve trusted Chula Vista FC since 1982."
              stats={[
                { id: "years", value: "40+", label: "Years of Development" },
                { id: "pro", value: "7+", label: "Recent Pro Signings" },
                { id: "titles", value: "5+", label: "Recent Championships" },
                { id: "coaches", value: "30+", label: "Coaches on Staff" },
              ]}
              highlights={[
                {
                  id: "tuilla-state-cup",
                  tag: "Champions",
                  title: "B2014 Tuilla — SoCal State Cup Champions",
                  body: "CVFC's Tuilla program lifted the latest SoCal State Cup, the club's most recent State Cup title.",
                },
                {
                  id: "jestand-mls",
                  tag: "Pro Signing",
                  title: "Gavin Jestand → MLS Colorado Rapids",
                  body: "From the CVFC pathway to a professional MLS contract.",
                },
                {
                  id: "lamar-fc-dallas",
                  tag: "Pro Signing",
                  title: "Quincy Lamar → FC Dallas",
                  body: "An MLS NEXT pathway success — CVFC alumnus signs with one of MLS's premier player-development academies.",
                },
                {
                  id: "jackson-atlas",
                  tag: "Pro Signing",
                  title: "Joaquin Jackson → Atlas FC Academy",
                  body: "B2009 player crosses into Liga MX — joining the Atlas FC academy in Guadalajara.",
                },
                {
                  id: "g2009-npl",
                  tag: "Girls Pathway",
                  title: "G2009 Academy — Undefeated NPL Run",
                  body: "Kareli Rascon and the G2009 squad finished 7-0-5 in NPL play — proof of the Girls Pathway delivering on the field.",
                },
                {
                  id: "hannah-gomez",
                  tag: "Scholar-Athlete",
                  title: "Hannah Gomez — 4.0 GPA & All-Star",
                  body: "G2009 Academy multi-sport athlete: top NPL play, all-star field hockey honors, and a 4.0 in the classroom.",
                },
              ]}
              footnote={
                <>
                  CVFC alumni have signed with{" "}
                  <strong>MLS Colorado Rapids</strong>,{" "}
                  <strong>FC Dallas</strong>, <strong>Atlas FC Academy</strong>,{" "}
                  <strong>Club Tijuana</strong>, and{" "}
                  <strong>Club Rayados de Monterrey</strong> — competing through{" "}
                  <strong>MLS NEXT</strong>, Elite Academy (<strong>EA</strong>
                  ), <strong>DPL</strong>, <strong>NPL</strong>, the{" "}
                  <strong>Southwest Premier League</strong>, and the{" "}
                  <strong>Lamar Hunt US Open Cup</strong>.
                </>
              }
            />

            <PortraitGrid
              eyebrow="Coaching Staff"
              heading="Coached by people who've been there."
              description="From former pro players to lifelong CVFC alumni, our staff brings real experience to every training session — and a deep commitment to developing the whole player."
              people={featuredCoaches.map((c) => ({
                id: c.id,
                name: c.name,
                role: c.title,
                credential: c.credentials?.join(" · "),
                image: c.image,
              }))}
              cta={{
                label: "Meet the Full Coaching Staff",
                href: "/about/coaching-staff",
                variant: "secondary",
                iconToken: "ri:soccer-ball",
              }}
              background="white"
            />

            <Testimonials {...testimonials} />
            <FaqSection {...faq} />

            <Callout
              eyebrow="Take the First Step"
              heading="Ready to play for Chula Vista?"
              variant="bone"
              body={
                <>
                  Whether you&rsquo;re new to the area, switching from another
                  club, or ready to level up — we&rsquo;d love to meet your
                  player. CVFC has been here since 1982, with a full pathway
                  from Mini Maestros to MLS NEXT, Elite Academy, DPL, and NPL.
                  Request an evaluation and a coach will follow up within 48
                  hours.
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
