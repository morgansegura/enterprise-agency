import Link from "next/link";

import { Section } from "@/components/layout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Heading } from "@/components/feature/heading";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

import "./mls-next-san-diego-screen.css";

/** What a family is actually signing up for, stated as plainly as possible. */
const COMMITMENT = [
  {
    term: "Training",
    detail:
      "Three to four sessions a week, year-round, with a short off-season break rather than a summer off.",
  },
  {
    term: "Travel",
    detail:
      "League play across Southern California most weekends, and flights for showcase events during the season.",
  },
  {
    term: "Other sports",
    detail:
      "MLS NEXT asks players to prioritize the club calendar. Families with a second competitive sport should raise it before committing.",
  },
  {
    term: "Cost",
    detail:
      "The league itself has no fee for players, but training and travel do. At Chula Vista FC, competitive programs run roughly $800–$2,000 a year depending on age and program, and need-based assistance is available.",
  },
];

const FAQS = [
  {
    question: "What is MLS NEXT?",
    answer:
      "MLS NEXT is the top competitive tier of boys youth soccer in the United States, launched by Major League Soccer in 2020. It brings MLS academy teams and independent clubs into one league and showcase system, and it is where MLS clubs and college programs do most of their scouting.",
  },
  {
    question: "Which San Diego clubs play in MLS NEXT?",
    answer:
      "Several San Diego County clubs field MLS NEXT teams. Chula Vista FC is the MLS NEXT club in the South Bay, so a player from the south end of the county can reach the tier without a daily drive north.",
  },
  {
    question: "What age groups does MLS NEXT cover?",
    answer:
      "MLS NEXT runs age groups from roughly U13 through U19, with younger academy age groups training underneath it. At Chula Vista FC the pathway starts at ages 4 to 9 in Foundations and feeds the competitive age groups above it.",
  },
  {
    question: "How does a player join an MLS NEXT team?",
    answer:
      "Through a club evaluation. At Chula Vista FC, a family requests an evaluation online, a coach responds within 48 hours, and the player trains with the age group before coaches decide as a staff where to place them. Evaluations run year-round rather than in a single window.",
  },
  {
    question: "Is MLS NEXT right for every player?",
    answer:
      "No. It asks for year-round training, regular travel and priority over other sports, in return for the highest level of competition and the most scouting exposure. Many strong players are better served by Elite Academy or SoCal Flight, where the soccer is serious and the calendar is manageable. A good club will tell you which one fits.",
  },
  {
    question: "Does MLS NEXT cost money?",
    answer:
      "The league does not charge players, but participating in it does. Club fees, travel, kit and tournament costs apply. Chula Vista FC is a 501(c)(3) nonprofit and offers need-based financial assistance, so cost is worth raising directly during an evaluation rather than assuming the answer.",
  },
];

/**
 * The MLS NEXT explainer.
 *
 * `mls next` is the largest single term in the demand data (~5,000/mo, low
 * competition — see docs/keyword-demand-2026-09.md) and CVFC is genuinely an
 * MLS NEXT club, so this is the term the club has the strongest right to own.
 * Written as an explainer first: a parent searching "mls next" usually does not
 * know what it is yet, and the club that answers the question honestly — up to
 * and including "this may not be for your player" — is the one they trust with
 * the next question.
 */
export function MlsNextSanDiegoScreen({ className }: { className?: string }) {
  return (
    <div className={cn("mls-next-san-diego-screen", className)}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          {
            name: "MLS NEXT in San Diego",
            path: "/guides/mls-next-san-diego",
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQS)} />

      <PageHero
        eyebrow="Guide"
        heading="MLS NEXT in San Diego"
        description="MLS NEXT is the top tier of boys youth soccer in the United States, run by Major League Soccer. This is what it is, what it asks of a family, and how a San Diego player gets into it."
        actions={<EvaluationCTA />}
      />

      <Section>
        <div className="mls-prose">
          <p className="mls-answer">
            MLS NEXT is the highest competitive level of boys youth soccer in
            the country. Major League Soccer launched it in 2020 to bring MLS
            academy teams and independent clubs into one league, and it is where
            MLS clubs and college coaches do most of their scouting. Chula Vista
            FC competes in it, which means a South Bay player can reach the top
            tier without leaving the south end of San Diego County.
          </p>
          <p>
            What follows is the part clubs tend to skip: MLS NEXT is a serious
            commitment, it is not the right level for every good player, and the
            honest version of that conversation is worth having before tryouts
            rather than after.
          </p>
        </div>
      </Section>

      <Section bg="bone">
        <Heading
          heading="What MLS NEXT asks of a family"
          headingSize="section"
          align="left"
          description="Four things, stated plainly, so nobody finds out in October."
        />

        <dl className="mls-commitment">
          {COMMITMENT.map((item) => (
            <div key={item.term} className="mls-commitment-item">
              <dt className="mls-commitment-term">{item.term}</dt>
              <dd className="mls-commitment-detail">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <Heading
          heading="How a player gets in"
          headingSize="section"
          align="left"
        />

        <div className="mls-prose">
          <p>
            Through a club, not through the league. MLS NEXT teams are run by
            clubs, so a player joins by being evaluated and placed by one. At
            Chula Vista FC that means an online request, a coach&rsquo;s reply
            within 48 hours, and a session with the age group before any
            decision is made. Evaluations run year-round, so a player who moves
            to San Diego in November is not waiting until spring.
          </p>
          <p>
            Placement is a staff decision, not one coach&rsquo;s. A player who
            is not ready for the MLS NEXT roster is placed where they will be
            challenged and still play &mdash; MLS NEXT Academy, Elite Academy,
            EA II or SoCal Flight &mdash; and moves up when they are ready.{" "}
            <Link href="/guides/youth-soccer-leagues">
              Here is what each of those leagues means
            </Link>
            .
          </p>
        </div>

        <div className="mls-actions">
          <EvaluationCTA />
        </div>
      </Section>

      <Section bg="bone">
        <Heading
          heading="What the pathway has produced"
          headingSize="section"
          align="left"
        />

        <div className="mls-prose">
          <p>
            Chula Vista FC has developed players who went on to sign
            professionally with the Colorado Rapids, FC Dallas, Atlas FC, Club
            Tijuana and Rayados de Monterrey, and the club&rsquo;s teams have
            reached MLS NEXT Cup and won State Cup honors.{" "}
            <Link href="/champions">The full record is here</Link>.
          </p>
          <p>
            Those names matter to the players chasing that route. For everyone
            else, the useful measure of an MLS NEXT program is more ordinary:
            who is coaching the age group, how long they have been at the club,
            and how many minutes your player will actually get.
          </p>
        </div>
      </Section>

      <Section>
        <Heading
          heading="Common questions about MLS NEXT"
          headingSize="section"
          align="left"
        />

        <dl className="mls-faq">
          {FAQS.map((faq) => (
            <div key={faq.question} className="mls-faq-item">
              <dt className="mls-faq-question">{faq.question}</dt>
              <dd className="mls-faq-answer">{faq.answer}</dd>
            </div>
          ))}
        </dl>

        <div className="mls-actions">
          <EvaluationCTA />
        </div>
      </Section>
    </div>
  );
}
