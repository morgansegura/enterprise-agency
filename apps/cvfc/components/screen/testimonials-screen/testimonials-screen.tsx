import { Section } from "@/components/layout";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Heading } from "@/components/feature/heading";
import { PageHero } from "@/components/feature/page-hero";
import { TestimonialWall } from "@/components/feature/testimonial-wall";
import {
  TESTIMONIALS,
  getActiveTestimonials,
  getFeaturedTestimonials,
} from "@/data/testimonials";
import { getTestimonials } from "@/lib/cms";
import { cmsToTestimonial } from "@/lib/cms-content";

import "./testimonials-screen.css";

const ROLE_TAG = {
  Parent: "Parent",
  Player: "Player",
  Alumnus: "Alumnus",
  Coach: "Coach",
} as const;

export async function TestimonialsScreen() {
  const cms = (await getTestimonials())
    .map(cmsToTestimonial)
    .filter((t) => t.quote);
  const source = cms.length ? cms : TESTIMONIALS;
  const all = getActiveTestimonials(source);
  const featured = getFeaturedTestimonials(source);
  const wall = all.filter((t) => !t.featured);

  return (
    <>
      <main>
        <PageHero
          eyebrow="Voices"
          heading="Our community, in their own words."
          description="Parents, players, alumni, and coaches — the families and the staff who shape what Chula Vista FC means on a Tuesday training session and on a Saturday match. Below are their voices."
          actions={
            <EvaluationCTA variant="default" label="Request an Evaluation" />
          }
        />

        {featured.length > 0 ? (
          <Section bg="white" size="default">
            <Heading
              eyebrow="Featured Voices"
              heading="The stories worth pausing on."
              headingSize="section"
              description={
                <p>
                  Two longer accounts — one from the staff, one from a CVFC
                  family — that capture the way the club feels from inside.
                </p>
              }
            />
          </Section>
        ) : null}

        {featured.map((t, i) => {
          const bg = i % 2 === 0 ? "bone" : "white";
          return (
            <Section key={t.id} bg={bg} size="default">
              <figure className="featured-voice">
                <p className="featured-voice-eyebrow">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  {ROLE_TAG[t.role]}
                </p>
                <span className="featured-voice-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="featured-voice-quote">
                  {t.quote}
                </blockquote>
                {t.longform ? (
                  <p className="featured-voice-longform">{t.longform}</p>
                ) : null}
                <figcaption className="featured-voice-attribution">
                  <span className="featured-voice-author">{t.author}</span>
                  {t.context ? (
                    <span className="featured-voice-context">{t.context}</span>
                  ) : null}
                </figcaption>
              </figure>
            </Section>
          );
        })}

        <Section bg="bone" size="intro">
          <Heading
            eyebrow="The Whole Wall"
            heading="Every voice. Filter by who you want to hear from."
            headingSize="section"
            description={
              <p>
                Filter by Parents, Players, Alumni, or Coaches — or read the
                whole wall. We add new voices as families share them.
              </p>
            }
          />
        </Section>

        <TestimonialWall testimonials={wall} />

        <Callout
          eyebrow="Add Your Voice"
          heading="Share your CVFC story."
          variant="bone"
          body={
            <>
              If CVFC has shaped your player&rsquo;s game, your family, or your
              career, we&rsquo;d love to hear it. Email the club and we&rsquo;ll
              be in touch.
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
