import Link from "next/link";

import { Section } from "@/components/layout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Heading } from "@/components/feature/heading";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import {
  breadcrumbSchema,
  definedTermSetSchema,
  faqPageSchema,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

import "./youth-soccer-leagues-screen.css";

type League = {
  name: string;
  full?: string;
  side: "Boys" | "Girls" | "Both";
  /** One-sentence definition — this is the text answer engines lift. */
  definition: string;
  detail: string;
  /** Whether Chula Vista FC fields teams in it. Honesty here is the point. */
  cvfc: boolean;
};

const LEAGUES: League[] = [
  {
    name: "MLS NEXT",
    side: "Boys",
    definition:
      "MLS NEXT is the top tier of boys youth soccer in the United States, launched by Major League Soccer in 2020, combining MLS academy teams and independent clubs in one league and showcase system.",
    detail:
      "The highest level of scouting exposure, and the heaviest calendar: year-round training, weekend league play and travel to showcases. Chula Vista FC competes here, and also fields MLS NEXT Academy teams at the age groups below.",
    cvfc: true,
  },
  {
    name: "Elite Academy",
    full: "EA and EA II",
    side: "Boys",
    definition:
      "Elite Academy is a competitive boys league tier below MLS NEXT, offering strong regional competition with less national travel and a lighter cost.",
    detail:
      "The right level for a large number of serious players. Many move up to MLS NEXT from here as they develop; the coaching and curriculum at Chula Vista FC are the same either way.",
    cvfc: true,
  },
  {
    name: "ECNL",
    full: "Elite Clubs National League",
    side: "Both",
    definition:
      "ECNL is a national youth league for boys and girls, run independently of Major League Soccer, with its own regional conferences and college showcase events.",
    detail:
      "A parallel national route rather than a step above or below. Chula Vista FC does not field ECNL teams; families who want that specific league should look at clubs that do.",
    cvfc: false,
  },
  {
    name: "Girls Academy",
    full: "GA and GA Aspire",
    side: "Girls",
    definition:
      "The Girls Academy is a national girls youth league with regional conferences and college showcases, comparable in level to ECNL on the girls side.",
    detail:
      "Chula Vista FC does not field Girls Academy teams today — the girls program plays DPL, NPL and SoCal Flight. The club has applied for GA Aspire, the entry tier, so ask where that stands during an evaluation.",
    cvfc: false,
  },
  {
    name: "DPL",
    full: "Development Player League",
    side: "Girls",
    definition:
      "The Development Player League is a competitive girls league that runs alongside the national tiers, giving strong players a full season of league play and showcase opportunities.",
    detail:
      "One of the two leagues Chula Vista FC girls teams compete in, and a realistic route for a player aiming at college soccer.",
    cvfc: true,
  },
  {
    name: "NPL",
    full: "National Premier Leagues",
    side: "Both",
    definition:
      "The National Premier Leagues are a set of regional competitive leagues operated under US Club Soccer, feeding regional and national championship play.",
    detail:
      "Serious competition on a schedule most families can sustain. Chula Vista FC girls teams play NPL alongside DPL.",
    cvfc: true,
  },
  {
    name: "SoCal Soccer League",
    full: "Flight system",
    side: "Both",
    definition:
      "The SoCal Soccer League is Southern California's regional club competition, organized into flights by ability so teams play opponents at their own level.",
    detail:
      "Where most competitive players in the region actually play, and where a lot of development happens without weekly flights. Chula Vista FC fields teams across the Flight system on both sides.",
    cvfc: true,
  },
];

const FAQS = [
  {
    question: "What is the difference between MLS NEXT, ECNL and NPL?",
    answer:
      "MLS NEXT is the top boys tier, run by Major League Soccer, with the most scouting and the heaviest travel. ECNL is a separate national league for boys and girls with its own conferences and showcases. The National Premier Leagues (NPL) are regional competitive leagues under US Club Soccer, a level below the national tiers, with a schedule most families find easier to sustain.",
  },
  {
    question: "Which leagues does Chula Vista FC play in?",
    answer:
      "Boys: MLS NEXT, MLS NEXT Academy, Elite Academy, Elite Academy II and the SoCal Soccer League Flight system. Girls: Development Player League (DPL), National Premier League (NPL) and SoCal Flight. The club has applied for Girls Academy Aspire but does not field GA teams today, and does not field ECNL teams.",
  },
  {
    question: "Does a higher league mean better development?",
    answer:
      "Not automatically. A higher league means stronger opponents and more scouting, but development comes from coaching, training hours and minutes played. A player who trains well and plays a full season in SoCal Flight often develops faster than a player sitting on an MLS NEXT bench.",
  },
  {
    question: "Can a player move up a league mid-season?",
    answer:
      "At Chula Vista FC, yes. Players are placed by the coaching staff and move between the MLS NEXT, Elite Academy, DPL, NPL and Flight rosters as they develop, without changing clubs.",
  },
  {
    question: "Which league should my child play in?",
    answer:
      "Start with three questions: how many hours a week your family can commit, how much travel you can absorb, and whether the player wants college or professional soccer. A good club answers those honestly, including when the answer means a lower tier than a parent hoped for.",
  },
];

/**
 * The league glossary.
 *
 * Together these terms are worth roughly 7,000 searches a month in San Diego
 * (docs/keyword-demand-2026-09.md) and no club page explains them in one place.
 * Published as DefinedTerms because AI assistants lift definitions close to
 * verbatim — and stating plainly which leagues CVFC does NOT play in is what
 * makes the rest of the page credible enough to be quoted.
 */
export function YouthSoccerLeaguesScreen({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("youth-soccer-leagues-screen", className)}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          {
            name: "Youth soccer leagues explained",
            path: "/guides/youth-soccer-leagues",
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQS)} />
      <JsonLd
        data={definedTermSetSchema(
          "Youth soccer leagues in Southern California",
          "/guides/youth-soccer-leagues",
          LEAGUES.map((league) => ({
            name: league.full ? `${league.name} (${league.full})` : league.name,
            description: league.definition,
          })),
        )}
      />

      <PageHero
        eyebrow="Guide"
        heading="Youth soccer leagues, explained"
        description="MLS NEXT, ECNL, Elite Academy, DPL, NPL, Girls Academy, SoCal Flight. What each one actually is, who it suits, and which ones Chula Vista FC plays in."
        actions={<EvaluationCTA />}
      />

      <Section>
        <div className="leagues-prose">
          <p className="leagues-answer">
            Youth soccer in Southern California is organized into leagues that
            sit at different levels. MLS NEXT is the top boys tier; ECNL and the
            Girls Academy are national leagues run independently of it; Elite
            Academy, DPL and NPL are strong competitive tiers with less travel;
            and the SoCal Soccer League&rsquo;s flight system is where most
            competitive players in the region play. The league a team plays in
            sets the schedule, the travel and most of the cost.
          </p>
        </div>
      </Section>

      <Section bg="bone">
        <Heading
          heading="Every league, in one place"
          headingSize="section"
          align="left"
          description="Including the ones this club does not play in — a family deserves the whole map, not the part that flatters us."
        />

        <ul className="leagues-list">
          {LEAGUES.map((league) => (
            <li key={league.name} className="leagues-item">
              <div className="leagues-item-head">
                <h3 className="leagues-item-name">
                  {league.name}
                  {league.full ? (
                    <span className="leagues-item-full"> {league.full}</span>
                  ) : null}
                </h3>
                <span className="leagues-item-side">{league.side}</span>
              </div>
              <p className="leagues-item-definition">{league.definition}</p>
              <p className="leagues-item-detail">{league.detail}</p>
              <p
                className="leagues-item-cvfc"
                data-plays={league.cvfc ? "yes" : "no"}
              >
                {league.cvfc
                  ? "Chula Vista FC fields teams here"
                  : "Chula Vista FC does not field teams here"}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Heading
          heading="How to choose a level"
          headingSize="section"
          align="left"
        />

        <div className="leagues-prose">
          <p>
            Answer three questions before looking at any badge. How many nights
            a week can your family train? How much weekend travel can you
            absorb, financially and practically? And is the player chasing
            college or professional soccer, or playing because they love it?
          </p>
          <p>
            Those answers point at a level. A club&rsquo;s job is to confirm it
            honestly &mdash; including when the honest answer is a tier below
            what a parent hoped for, or a different club entirely. At Chula
            Vista FC the placement decision is made by the coaching staff
            together, and players move between rosters as they develop rather
            than changing clubs to change level.{" "}
            <Link href="/guides/mls-next-san-diego">
              More on MLS NEXT specifically
            </Link>
            .
          </p>
        </div>

        <div className="leagues-actions">
          <EvaluationCTA />
        </div>
      </Section>

      <Section bg="bone">
        <Heading
          heading="Common questions about leagues"
          headingSize="section"
          align="left"
        />

        <dl className="leagues-faq">
          {FAQS.map((faq) => (
            <div key={faq.question} className="leagues-faq-item">
              <dt className="leagues-faq-question">{faq.question}</dt>
              <dd className="leagues-faq-answer">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}
