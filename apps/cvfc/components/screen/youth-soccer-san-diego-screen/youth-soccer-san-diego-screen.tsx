import Link from "next/link";

import { Section } from "@/components/layout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Heading } from "@/components/feature/heading";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { FACILITIES } from "@/data/facilities";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

import "./youth-soccer-san-diego-screen.css";

/** Entry points, ordered the way a parent narrows down: age, then side, then specialty. */
const PATHWAYS = [
  {
    href: "/programs/foundations",
    label: "Ages 4–9",
    name: "Foundations",
    body: "Mini Maestros and CVFC Youth. First touches, small-sided games, and coaches who keep it fun while the technique goes in.",
  },
  {
    href: "/programs/boys-competitive-pathway",
    label: "Boys, U10–U19",
    name: "Boys competitive",
    body: "MLS NEXT, MLS NEXT Academy, Elite Academy, EA II and SoCal Flight — the full ladder without changing clubs.",
  },
  {
    href: "/programs/girls-competitive-pathway",
    label: "Girls, U10–U19",
    name: "Girls competitive",
    body: "DPL, NPL and SoCal Flight, with the same coaching staff and curriculum as the boys' side.",
  },
  {
    href: "/programs/goalkeeper-pathway",
    label: "Every age",
    name: "Goalkeeper pathway",
    body: "Dedicated goalkeeper sessions year-round, led by goalkeeper coaches, from Mini Maestros through U19.",
  },
];

/** Three steps, stated plainly — the page converts on this being simple. */
const STEPS = [
  {
    step: "1",
    title: "Tell us about your player",
    body: "A short form: birth year, side, position, and where they play now. Two minutes, no fee, no commitment.",
  },
  {
    step: "2",
    title: "A coach replies within 48 hours",
    body: "A real coach from that age group, not an automated reply, with a time and a place to come and play.",
  },
  {
    step: "3",
    title: "Play, then get placed honestly",
    body: "Your player trains with the group. Coaches review as a staff and place them where they will be challenged and still get minutes.",
  },
];

const FAQS = [
  {
    question: "Does Chula Vista FC take players from across San Diego?",
    answer:
      "Yes. Chula Vista FC is based in the South Bay and draws players from across San Diego County. The club trains and plays at Victory Christian Academy in Chula Vista, Hoover High School in City Heights, and O'Farrell Charter School on Skyline Drive in southeastern San Diego, plus parks across the South Bay.",
  },
  {
    question: "When can my child be evaluated?",
    answer:
      "Year-round. Chula Vista FC accepts individual evaluation requests at any point in the season, which matters for families new to San Diego or moving between clubs. Submit a request and a coach responds within 48 hours to arrange a session.",
  },
  {
    question: "What ages does the club serve?",
    answer:
      "Ages 4 through U19, boys and girls. Mini Maestros and CVFC Youth cover ages 4 to 9. From U10 the competitive pathways run through MLS NEXT, Elite Academy, DPL, NPL and SoCal Flight, with a dedicated goalkeeper pathway alongside every age group.",
  },
  {
    question: "Which leagues does Chula Vista FC play in?",
    answer:
      "Boys play in MLS NEXT, MLS NEXT Academy, Elite Academy, Elite Academy II and the SoCal Soccer League Flight system. Girls play in the Development Player League (DPL), National Premier League (NPL) and SoCal Flight; the club has applied for Girls Academy Aspire. The First Team competes in the Southwest Premier League and US Open Cup qualifying.",
  },
  {
    question: "What does competitive youth soccer cost at Chula Vista FC?",
    answer:
      "Independent parent guides place Chula Vista FC fees in the $800–$2,000 per year range depending on program and age. The club is a 501(c)(3) nonprofit, and need-based financial assistance is available. Ask during your evaluation.",
  },
  {
    question: "How far is the club from where we live?",
    answer:
      "Training is centered in Chula Vista, roughly 20 minutes from downtown San Diego and close to the 805 and 54. Families travel from Bonita, Eastlake, Otay Ranch, National City, Imperial Beach, San Ysidro, City Heights and southeastern San Diego. Match days are often at Hoover High School, on El Cajon Boulevard.",
  },
];

/** Where a family from outside the South Bay will actually drive to. */
const VENUE_IDS = ["vca", "hoover-hs", "indoor-training-center"];

/**
 * The county-wide pillar page.
 *
 * Keyword research (docs/keyword-demand-2026-09.md) found the "san diego"
 * head terms — youth soccer san diego, soccer club san diego, soccer academy
 * san diego — sitting at ~500/mo each on low competition, with no page on this
 * site aimed at them: everything was written South Bay-first. This page answers
 * the county-wide search and routes the reader into a pathway, so it has to
 * convert, not just rank. Hence: answer up top, one CTA repeated, and the
 * three-step process stated plainly.
 */
export function YouthSoccerSanDiegoScreen({
  className,
}: {
  className?: string;
}) {
  const venues = VENUE_IDS.map((id) =>
    FACILITIES.find((facility) => facility.id === id),
  ).filter((facility) => facility !== undefined);

  return (
    <div className={cn("youth-soccer-san-diego-screen", className)}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          {
            name: "Youth soccer in San Diego",
            path: "/youth-soccer-san-diego",
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQS)} />

      <PageHero
        eyebrow="San Diego County"
        heading="Youth soccer in San Diego"
        description="Chula Vista FC is a 501(c)(3) nonprofit club that has developed San Diego players since 1982 — ages 4 through U19, boys and girls, from first touches to MLS NEXT. Evaluations run year-round, and a coach replies within 48 hours."
        actions={<EvaluationCTA />}
      />

      <Section>
        <div className="ysd-lead">
          <p>
            A club for everyone. Not a club for one neighborhood, one budget, or
            one kind of family. Players come to Chula Vista FC from across the
            county — the South Bay, City Heights, southeastern San Diego — and
            train under the same coaches and the same curriculum whether they
            are six years old or being watched by college programs.
          </p>
          <p>
            Forty-four years in, the club is still run as a nonprofit, which is
            why the whole pathway sits under one roof instead of behind a series
            of upgrades.
          </p>
        </div>
      </Section>

      <Section bg="bone">
        <Heading
          heading="Find your player's starting point"
          headingSize="section"
          align="left"
          description="Four ways in. Every one of them is evaluated the same way, year-round."
        />

        <ul className="ysd-pathways">
          {PATHWAYS.map((pathway) => (
            <li key={pathway.href} className="ysd-pathway">
              <p className="ysd-pathway-label">{pathway.label}</p>
              <h3 className="ysd-pathway-name">
                <Link href={pathway.href}>{pathway.name}</Link>
              </h3>
              <p className="ysd-pathway-body">{pathway.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Heading
          heading="How to join, start to finish"
          headingSize="section"
          align="left"
          description="No tryout window to wait for. Players join mid-season all the time."
        />

        <ol className="ysd-steps">
          {STEPS.map((step) => (
            <li key={step.step} className="ysd-step">
              <span className="ysd-step-number" aria-hidden="true">
                {step.step}
              </span>
              <h3 className="ysd-step-title">{step.title}</h3>
              <p className="ysd-step-body">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="ysd-actions">
          <EvaluationCTA />
        </div>
      </Section>

      <Section bg="bone">
        <Heading
          heading="Where we train and play"
          headingSize="section"
          align="left"
          description="Chula Vista is home, and match days bring the club into central San Diego."
        />

        <ul className="ysd-venues">
          {venues.map((venue) => (
            <li key={venue.id} className="ysd-venue">
              <h3 className="ysd-venue-name">{venue.name}</h3>
              <p className="ysd-venue-address">
                {venue.address.street}, {venue.address.city}
              </p>
              <p className="ysd-venue-role">{venue.roleLabel}</p>
            </li>
          ))}
        </ul>

        <p className="ysd-venues-note">
          Community training also runs at Mountain Hawk, Salt Creek, Eucalyptus,
          Veterans, Bonita Long Canyon, Lauderbach, Rohr and Harvest parks.{" "}
          <Link href="/about/facilities">See every field</Link>.
        </p>
      </Section>

      <Section>
        <Heading
          heading="What the pathway has produced"
          headingSize="section"
          align="left"
          description="Development, not recruitment — players who came up here and kept going."
        />

        <div className="ysd-lead">
          <p>
            Recent alumni have signed professionally with the Colorado Rapids,
            FC Dallas, Atlas FC, Club Tijuana and Rayados de Monterrey. The club
            has won State Cup and SoCal State Cup titles, and the First Team has
            played in US Open Cup qualifying.
          </p>
          <p>
            That pathway matters for the players chasing it. For everyone else,
            the promise is the ordinary one: better player, better person, same
            coaches season after season.{" "}
            <Link href="/champions">See the honors and alumni</Link>.
          </p>
        </div>
      </Section>

      <Section bg="bone">
        <Heading
          heading="Questions San Diego families ask"
          headingSize="section"
          align="left"
        />

        <dl className="ysd-faq">
          {FAQS.map((faq) => (
            <div key={faq.question} className="ysd-faq-item">
              <dt className="ysd-faq-question">{faq.question}</dt>
              <dd className="ysd-faq-answer">{faq.answer}</dd>
            </div>
          ))}
        </dl>

        <div className="ysd-actions">
          <EvaluationCTA />
        </div>
      </Section>
    </div>
  );
}
