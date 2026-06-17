import Link from "next/link";

import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { FaqSection } from "@/components/feature/faq-section";
import { PageHero } from "@/components/feature/page-hero";
import { EVALUATION_PROGRAMS } from "@/lib/evaluations";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import "./evaluations-screen.css";

type EvaluationsScreenProps = {
  className?: string;
};

const TRACKS = [
  {
    id: "boys",
    label: "Boys Pathway",
    blurb: "MLS NEXT, MLS NEXT 2, Elite Academy (EA), EA 2, and SoCal Flight.",
  },
  {
    id: "girls",
    label: "Girls Pathway",
    blurb: "NPL, DPL, GA, GA Aspire (coming), and SoCal Flight.",
  },
  {
    id: "goalkeeper",
    label: "Goalkeeper Pathway",
    blurb:
      "Specialized goalkeeper training at every age — from first touch to college and professional play.",
  },
] as const;

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

export function EvaluationsScreen({ className }: EvaluationsScreenProps) {
  const programsByTrack = TRACKS.map((t) => ({
    ...t,
    programs: EVALUATION_PROGRAMS.filter((p) => p.track === t.id),
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
          description="Whether tryouts are open or you missed the window, every player gets a path. Choose a track and birth year to be routed to the right registration — and a coach reaches out within 48 hours."
          actions={
            <>
              <EvaluationCTA variant="default" label="Start Your Evaluation" />
              <Button variant="outline" render={<Link href="/programs" />}>
                <Icon token="ri:soccer-ball" aria-hidden="true" />
                <span>Explore the Pathway</span>
                <Icon token="ri:arrow-right" aria-hidden="true" />
              </Button>
            </>
          }
        />

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
                Choose your track and birth year.
              </h2>
              <p className="evaluations-programs-description">
                Every program below routes to its own registration form.
                Don&rsquo;t see your player&rsquo;s age band? Start an
                individual evaluation — coaches review every request.
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
                  {track.id === "goalkeeper" ? (
                    <div className="evaluations-track-card-empty">
                      <p>
                        To request a goalkeeper tryout, start an individual
                        evaluation and a coach will reach out directly.
                      </p>
                      <EvaluationCTA
                        variant="secondary"
                        label="Request a GK Evaluation"
                      />
                    </div>
                  ) : (
                    <ul className="evaluations-track-card-list">
                      {track.programs.map((program) => (
                        <li key={program.id}>
                          <a
                            href={program.signupUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="evaluations-program-row"
                          >
                            <div className="evaluations-program-row-text">
                              <p className="evaluations-program-row-label">
                                {program.label}
                              </p>
                              <p className="evaluations-program-row-meta">
                                Birth years: {program.birthYears.join(" · ")}
                              </p>
                            </div>
                            <span className="evaluations-program-row-link">
                              <span>Register</span>
                              <Icon token="ri:arrow-right" aria-hidden="true" />
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
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

        <FaqSection
          heading="Tryout & evaluation questions."
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
