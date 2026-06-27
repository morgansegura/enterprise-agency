import { JsonLd } from "@/components/seo/json-ld";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { FaqSection } from "@/components/feature/faq-section";
import { PageHero } from "@/components/feature/page-hero";
import { RegistrationForm } from "@/components/feature/registration-form";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import "./evaluations-screen.css";

type EvaluationsScreenProps = {
  className?: string;
};

const STEPS = [
  {
    n: "01",
    title: "Choose your player's date of birth and gender",
    body: "Select the right age group and pathway so your registration goes to the correct coaching staff.",
  },
  {
    n: "02",
    title: "Fill out the registration form",
    body: "Complete the form with your player's info and your contact details — that's everything we need to begin.",
  },
  {
    n: "03",
    title: "Watch for an email or a call with your invitation",
    body: "A CVFC coach reaches out directly with your tryout invitation or individual evaluation details.",
  },
] as const;

const TRACKS = [
  {
    id: "boys",
    label: "Boys Pathway",
    blurb: "MLS NEXT, MLS NEXT 2, Elite Academy (EA), EA 2, and SoCal Flight.",
  },
  {
    id: "girls",
    label: "Girls Pathway",
    blurb: "GA, GA Aspire, DPL, NPL, and SoCal Flight.",
  },
  {
    id: "goalkeeper",
    label: "Goalkeeper Pathway",
    blurb:
      "Specialized goalkeeper training at every age — from first touch to college and professional play.",
  },
] as const;

const GENDER_LABEL: Record<string, string> = {
  boys: "Boys",
  girls: "Girls",
  goalkeeper: "Boys/Girls",
};

// Birth year for a U-band = the season's END year − U (US Soccer "seasonal
// year"). Registration runs for the UPCOMING season, so from June we roll to the
// next one — this auto-updates each year (computed at build; a yearly redeploy
// refreshes it). Bump ROLLOVER_MONTH if registration opens earlier/later.
const ROLLOVER_MONTH = 5; // June (0-based)
const seasonEndYear = () => {
  const now = new Date();
  return now.getMonth() >= ROLLOVER_MONTH
    ? now.getFullYear() + 1
    : now.getFullYear();
};
const by = (u: number) => seasonEndYear() - u;

// `years` = school-year birth years (Aug–Jul). `hg` = MLS NEXT Homegrown birth
// years (Jan–Dec, boys only); shown only on the Boys card. They match except U19
// (Homegrown groups the older single year). Both auto-roll via by().
function ageRows(gender: string) {
  return [
    { id: "u06-07", label: `U06, U07 ${gender}`, years: [by(6), by(7)], hg: [by(6), by(7)] }, // prettier-ignore
    { id: "u08-09", label: `U08, U09 ${gender}`, years: [by(8), by(9)], hg: [by(8), by(9)] }, // prettier-ignore
    { id: "u10-11", label: `U10, U11 ${gender} Competitive`, years: [by(10), by(11)], hg: [by(10), by(11)] }, // prettier-ignore
    { id: "u12-13", label: `U12, U13 ${gender} Competitive`, years: [by(12), by(13)], hg: [by(12), by(13)] }, // prettier-ignore
    { id: "u14-15", label: `U14, U15 ${gender} Competitive`, years: [by(14), by(15)], hg: [by(14), by(15)] }, // prettier-ignore
    { id: "u16-17", label: `U16, U17 ${gender} Competitive`, years: [by(16), by(17)], hg: [by(16), by(17)] }, // prettier-ignore
    { id: "u19", label: `U19 ${gender} Competitive`, years: [by(18), by(19)], hg: [by(18)] }, // prettier-ignore
  ];
}

export function EvaluationsScreen({ className }: EvaluationsScreenProps) {
  const programsByTrack = TRACKS.map((t) => ({
    ...t,
    rows: ageRows(GENDER_LABEL[t.id]),
  }));

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/evaluations#webpage`,
    url: `${siteConfig.url}/evaluations`,
    name: "Tryouts & Evaluations — Chula Vista FC",
    description:
      "Chula Vista FC accepts player evaluations year-round and runs seasonal tryouts each spring. Find your fit by track and birth year.",
    inLanguage: "en-US",
    isPartOf: { "@id": `${siteConfig.url}#website` },
    about: { "@id": `${siteConfig.url}#organization` },
  };

  return (
    <>
      <main className={cn("evaluations-screen", className)}>
        <PageHero
          eyebrow="Tryouts & Evaluations"
          heading="Find your fit at Chula Vista FC."
          description={
            <>
              Whether tryouts are open or you missed the window, every player
              gets a path. Choose a track and birth year to be routed to the
              right registration. <br />
              <strong>Your coach will reach out within 48 hours</strong>!
            </>
          }
          // actions={
          //   <>
          //     <EvaluationCTA variant="default" label="Start Your Evaluation" />
          //     <Button variant="outline" render={<Link href="/programs" />}>
          //       <Icon token="ri:soccer-ball" aria-hidden="true" />
          //       <span>Explore the Pathway</span>
          //       <Icon token="ri:arrow-right" aria-hidden="true" />
          //     </Button>
          //   </>
          // }
        />

        <section className="evaluations-register">
          <div className="contain">
            <RegistrationForm variant="page" />
          </div>
        </section>

        <section className="evaluations-steps">
          <div className="evaluations-steps-inner contain">
            <header className="evaluations-steps-header">
              <p className="eyebrow-full">
                <span>How it works</span>
              </p>
              <h2 className="evaluations-steps-heading">
                How a player joins Chula Vista FC.
              </h2>
            </header>
            <ol className="evaluations-steps-list">
              {STEPS.map((step) => (
                <li key={step.n} className="evaluations-step">
                  <span className="evaluations-step-number" aria-hidden="true">
                    {step.n}
                  </span>
                  <h3 className="evaluations-step-title">{step.title}</h3>
                  <p className="evaluations-step-body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="evaluations-explainer">
          <div className="evaluations-explainer-inner contain">
            <article className="evaluations-explainer-card">
              <p className="evaluations-explainer-tag">Year-Round</p>
              <h2 className="evaluations-explainer-title">
                Missed our tryouts? You can still request one.
              </h2>
              <p className="evaluations-explainer-body">
                If your player missed the official tryout window or is new to
                the area, you can still request an individual tryout. Choose
                your player&rsquo;s date of birth and gender, complete the
                registration, and watch for an email or call with your
                invitation.
              </p>
            </article>

            <article className="evaluations-explainer-card">
              <p className="evaluations-explainer-tag" data-accent="true">
                Older Age Groups
              </p>
              <h2 className="evaluations-explainer-title">
                Ongoing individual tryouts.
              </h2>
              <p className="evaluations-explainer-body">
                For older age groups not listed in our scheduled tryout windows,
                CVFC offers ongoing individual tryouts. Submit your registration
                and a coach will reach out directly to schedule your session.
              </p>
            </article>
          </div>
        </section>

        <section className="evaluations-programs">
          <div className="evaluations-programs-inner contain">
            <header className="evaluations-programs-header">
              <p className="eyebrow-full">
                <span>Open Programs</span>
              </p>
              <h2 className="evaluations-programs-heading">
                Players are grouped by age.
              </h2>
              <p className="evaluations-programs-description">
                Beginning in the 2026 - 2027 season, all age groups are shifting
                from birth year to school year, with exception to MLS Next
                (Homegrown).{" "}
                <strong>
                  Players born between August 1 of a given year and July 31 of
                  the next year are grouped together.
                </strong>
              </p>
            </header>

            <div className="evaluations-programs-grid">
              {programsByTrack.map((track) => (
                <article key={track.id} className="evaluations-track-card">
                  <header className="evaluations-track-card-header">
                    <h3 className="evaluations-track-card-title">
                      {track.label}
                    </h3>
                    <p className="evaluations-track-card-blurb">
                      {track.blurb}
                    </p>
                  </header>
                  <ul className="evaluations-track-card-list">
                    {track.rows.map((row) => (
                      <li key={row.id}>
                        <div className="evaluations-program-row">
                          <div className="evaluations-program-row-text">
                            <p className="evaluations-program-row-label">
                              {row.label}
                            </p>
                            <p className="evaluations-program-row-meta">
                              Year: {row.years.join(", ")}
                              {track.id === "boys"
                                ? ` (Homegrown: ${row.hg.join(", ")})`
                                : ""}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <FaqSection
          heading="Tryout & Evaluation Questions."
          description="The most common questions parents ask before signing their player up — answered."
          ctaLabel="See all FAQs"
        />

        <Callout
          eyebrow="Take the First Step"
          heading="Ready to play for Chula Vista?"
          variant="bone"
          body={
            <>
              Choose your player&rsquo;s date of birth and gender, complete the
              registration, and a CVFC coach will be in touch with your tryout
              invitation.
            </>
          }
          ctaSlot={
            <EvaluationCTA label="Request an Evaluation" variant="default" />
          }
        />
      </main>
      <JsonLd data={aboutPageSchema} />
    </>
  );
}
