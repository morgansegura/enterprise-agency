import { Section } from "@/components/layout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Heading } from "@/components/feature/heading";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";

import "./san-diego-youth-soccer-clubs-screen.css";

/** The tiers a San Diego family is actually choosing between. */
const LEAGUES = [
  {
    name: "MLS NEXT",
    who: "The top of the U.S. youth pyramid, run by Major League Soccer.",
    what: "Full-season league against academy teams, scouted by MLS clubs and college programs. Highest commitment: year-round training, regular travel, showcase events.",
  },
  {
    name: "Girls Academy (GA) and ECNL",
    who: "The equivalent national tiers on the girls' side.",
    what: "National-league play and college showcases. The route most college-bound girls take.",
  },
  {
    name: "Elite Academy League / NPL",
    who: "Strong regional competition below the national tiers.",
    what: "Serious training and travel within Southern California, with less national travel and cost.",
  },
  {
    name: "SoCal / league play",
    who: "Competitive club soccer without the national schedule.",
    what: "Where most players start. Good coaching, local games, a manageable calendar.",
  },
];

/** What to ask on a visit — the questions that reveal how a club runs. */
const QUESTIONS = [
  "What happens to my child if they do not make the top team? A club with one real pathway and a holding pen underneath it is a different offer from a club that develops every roster.",
  "Who coaches this age group, and how long have they been here? Coaching turnover tells you more about a club than a trophy cabinet does.",
  "What is the all-in cost for a season, including travel, kit, tournaments and any assessments? Ask for the number a family actually pays, not the club fee.",
  "What financial assistance exists, and who qualifies? A club that answers this clearly has thought about who it is for.",
  "How many minutes will my child play? Ask directly. The answer varies enormously between clubs at the same level.",
  "Where do players go after this club? College, MLS NEXT, or nowhere in particular — the honest answer is a good sign either way.",
];

const FAQS = [
  {
    question: "What is the best youth soccer club in San Diego?",
    answer:
      "There is no single best club, because families are choosing between different things: level of competition, travel and cost, coaching, and how far a player wants to go. San Diego County has clubs competing at every tier, from MLS NEXT and Girls Academy down to local league play. The right question is which club matches your player's level and your family's calendar and budget.",
  },
  {
    question: "What is MLS NEXT, and does a player need it?",
    answer:
      "MLS NEXT is the top competitive tier of U.S. youth soccer, run by Major League Soccer, and it is where MLS clubs and college programs scout. It asks for year-round training and regular travel in return. It is the right level for a player aiming at college or professional soccer, and more than most families need or want.",
  },
  {
    question: "How much does competitive youth soccer cost in San Diego?",
    answer:
      "Club fees are only part of it. Once travel, kit, tournament fees and assessments are counted, a competitive season commonly runs into the thousands of dollars, and the national tiers cost more than regional play. Ask any club for the all-in number a family actually pays, and ask what financial assistance is available.",
  },
  {
    question: "When are youth soccer tryouts in San Diego?",
    answer:
      "Most San Diego clubs hold their main evaluations in late spring, for teams that form over the summer and play the following season. Many run additional evaluations through the year as rosters change, so a player who misses the main window is usually not shut out.",
  },
  {
    question: "Does Chula Vista FC serve families outside Chula Vista?",
    answer:
      "Yes. Chula Vista FC is based in the South Bay and draws players from across San Diego County, including Bonita, Eastlake, Otay Ranch, National City, Imperial Beach, San Ysidro and southeastern San Diego.",
  },
];

/**
 * A guide, not a pitch.
 *
 * Written for the search a parent actually runs — "best youth soccer clubs in
 * San Diego" — and answered honestly, including the parts where the answer is
 * "it depends" or "not this club". That is what makes it worth citing: an
 * answer engine summarizing this page has something to quote, and a parent who
 * reads it and picks somewhere else was never going to be a good fit here.
 */
export function SanDiegoYouthSoccerClubsScreen() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          {
            name: "Youth soccer clubs in San Diego",
            path: "/guides/san-diego-youth-soccer-clubs",
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQS)} />

      <PageHero
        eyebrow="Guide"
        heading="Youth soccer clubs in San Diego: how to choose"
        description="San Diego County has clubs at every level, from MLS NEXT and Girls Academy to local league play. This is what separates them, what a season really costs, and the questions worth asking before a family commits."
      />

      <Section>
        <Heading
          heading="Start with the level, not the badge"
          headingSize="section"
          align="left"
          description="Almost every difference between clubs follows from the league they play in. It sets the schedule, the travel, the cost, and who is watching."
        />

        <ul className="sd-guide-leagues">
          {LEAGUES.map((league) => (
            <li key={league.name} className="sd-guide-league">
              <h3 className="sd-guide-league-name">{league.name}</h3>
              <p className="sd-guide-league-who">{league.who}</p>
              <p className="sd-guide-league-what">{league.what}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Heading
          heading="What a season actually costs"
          headingSize="section"
          align="left"
          description="Club fees are the number families are quoted. They are rarely the number families pay."
        />

        <div className="sd-guide-prose">
          <p>
            Travel, kit, tournament entry and assessment fees sit on top of the
            club fee, and the national tiers carry more of all four. A
            competitive season in San Diego commonly runs into the thousands of
            dollars once everything is counted, and the gap between a regional
            league and a national one is measured in flights.
          </p>
          <p>
            Ask every club for the all-in figure, in writing, before tryouts —
            not after a player has been offered a place and the family is
            emotionally committed. Ask what financial assistance exists and who
            qualifies. A club that cannot answer either question quickly has
            told you something.
          </p>
        </div>
      </Section>

      <Section>
        <Heading
          heading="Six questions worth asking on a club visit"
          headingSize="section"
          align="left"
          description="These are the ones that separate clubs at the same level."
        />

        <ol className="sd-guide-questions">
          {QUESTIONS.map((question) => (
            <li key={question.slice(0, 40)}>{question}</li>
          ))}
        </ol>
      </Section>

      <Section>
        <Heading
          heading="Where Chula Vista FC fits"
          headingSize="section"
          align="left"
        />

        <div className="sd-guide-prose">
          <p>
            Chula Vista FC has been a club in the South Bay since 1982 and
            competes in MLS NEXT, so a player who wants the top tier can reach
            it without leaving the south end of the county. It is a registered
            501(c)(3) nonprofit rather than a for-profit academy, and it draws
            players from across San Diego County.
          </p>
          <p>
            It is not the right club for every family. A player in North County
            will spend a lot of the season on the freeway, and a family looking
            for recreational soccer will find the commitment heavier than they
            want. Both are reasonable reasons to choose somewhere else.
          </p>
        </div>
      </Section>

      <Section>
        <Heading
          heading="Common questions"
          headingSize="section"
          align="left"
        />

        <dl className="sd-guide-faq">
          {FAQS.map((faq) => (
            <div key={faq.question} className="sd-guide-faq-item">
              <dt className="sd-guide-faq-question">{faq.question}</dt>
              <dd className="sd-guide-faq-answer">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <EvaluationCTA />
    </>
  );
}
