import Link from "next/link";

import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

import "./icon-cards.css";

export type IconCardEntry = {
  id: string;
  iconToken?: string;
  title: string;
  description: string;
  /** When present, the entire card becomes a link to this href. */
  href?: string;
};

type IconCardsCta = {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline";
  iconToken?: string;
};

type IconCardsProps = {
  className?: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  cards: IconCardEntry[];
  cta?: IconCardsCta;
  background?: "bone" | "white";
  /** Force a column count at lg breakpoint. Default: auto (3 if 3 cards, 4 if 4+). */
  cols?: 2 | 3 | 4;
};

const DEFAULT_PATHWAY_CARDS: IconCardEntry[] = [
  {
    id: "0",
    iconToken: "custom:soccer-ball",
    title: "Foundations of the Game",
    description:
      "Where players begin their journey in programs like Mini Maestros and CVFC Youth. We focus on technical skills, coordination, and a love for the game, building the right attitude for future growth.",
  },
  {
    id: "1",
    iconToken: "custom:soccer-field",
    title: "Growth and Development",
    description:
      "As players advance, training becomes more focused on tactical awareness, teamwork, and respect for the game. Our development stages prepare athletes for competitive play while keeping training fun and engaging.",
  },
  {
    id: "2",
    iconToken: "custom:medal",
    title: "Competitive Readiness",
    description:
      "Players enter leagues that match their level, from the SoCal League Flight system to advanced programs like DPL, NPL, EA, and MLS NEXT. Here, unity and team culture drive performance and prepare athletes for higher challenges.",
  },
  {
    id: "3",
    iconToken: "custom:mountain-peak",
    title: "Striving for Excellence",
    description:
      "For those ready to take the next step, this is where dreams become reality. Players showcase their talent where it matters most — in front of college recruiters and professional academy scouts.",
  },
];

export function IconCards({
  className,
  eyebrow = "The Pathway",
  heading = "Strategic Development Pathway",
  description = "Our goal is simple — to prepare and train every athlete to advance, building the skills, mindset, and passion needed to move up and succeed at each stage of the game.",
  cards = DEFAULT_PATHWAY_CARDS,
  cta,
  background = "bone",
  cols,
}: Partial<IconCardsProps> & Pick<IconCardsProps, never>) {
  const dataCols = cols
    ? String(cols)
    : cards.length >= 4
      ? "4"
      : String(cards.length);
  return (
    <section data-bg={background} className={cn("icon-cards", className)}>
      <div className="icon-cards-inner contain">
        <header className="icon-cards-heading-block">
          {eyebrow ? (
            <p className="eyebrow-full">
              <span>{eyebrow}</span>
            </p>
          ) : null}
          <h2 className="icon-cards-heading">{heading}</h2>
          {description ? (
            <p className="icon-cards-description">{description}</p>
          ) : null}
        </header>

        <div className="icon-cards-grid" data-cols={dataCols}>
          {cards.map((card, index) => {
            const inner = (
              <>
                <span className="icon-card-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {card.iconToken ? (
                  <div className="icon-card-icon-wrap">
                    <Icon
                      token={card.iconToken as never}
                      className="icon-card-icon"
                    />
                  </div>
                ) : null}
                <h3 className="icon-card-title">{card.title}</h3>
                <p className="icon-card-description">{card.description}</p>
                {card.href ? (
                  <span className="icon-card-arrow">
                    <span>Learn more</span>
                    <span aria-hidden="true">→</span>
                  </span>
                ) : null}
              </>
            );

            if (card.href) {
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="icon-card icon-card-link"
                >
                  {inner}
                </Link>
              );
            }

            return (
              <article key={card.id} className="icon-card">
                {inner}
              </article>
            );
          })}
        </div>

        {cta ? (
          <div className="icon-cards-cta-row">
            <Button
              variant={cta.variant ?? "secondary"}
              render={<Link href={cta.href} />}
            >
              {cta.iconToken ? (
                <Icon token={cta.iconToken as never} aria-hidden="true" />
              ) : null}
              <span>{cta.label}</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
