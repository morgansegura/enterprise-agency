import Link from "next/link";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui";

import {
  PLAYER_LABELS,
  TRYOUT_SEASON,
  birthRange,
  birthYears,
  longDate,
  timeRange,
  tryoutOpen,
  tryoutsHref,
  type TryoutPlayer,
} from "@/lib/tryouts";
import { cn } from "@/lib/utils";

import "./tryout-cards.css";

/**
 * The U7–U9 tryout cards: one per tryout, with its date and a chip per birth
 * year. Every card and chip links to the form with that player (and year)
 * already chosen. Used on the tryouts page, the homepage and the pathway pages.
 */
export function TryoutCards({
  players = ["girls", "boys"],
  heading,
  years = true,
  background = "bone",
  className,
}: {
  players?: TryoutPlayer[];
  /** A heading over the cards, for pages other than /tryouts. */
  heading?: string;
  /** Bone by default; white where the next section is bone too. */
  background?: "bone" | "white";
  /** The birth-year chips. Off on /tryouts, where the form asks instead. */
  years?: boolean;
  className?: string;
}) {
  const season = TRYOUT_SEASON;
  // A tryout whose signups have closed drops off; the cards go with the last.
  const sessions = season.sessions.filter(
    (s) => players.includes(s.player) && tryoutOpen(s.player),
  );
  if (!sessions.length) return null;

  return (
    <section
      className={cn("tryout-cards", className)}
      data-years={years ? undefined : "false"}
      data-bg={background}
      aria-label={heading ? undefined : "Tryout dates"}
      aria-labelledby={heading ? "tryout-cards-heading" : undefined}
    >
      <div className="tryout-cards-inner contain">
        {heading ? (
          <header className="tryout-cards-header">
            <p className="eyebrow-full">
              <span>U7–U9 Tryouts · {season.label}</span>
            </p>
            <h2 id="tryout-cards-heading" className="tryout-cards-heading">
              {heading}
            </h2>
            <p className="tryout-cards-description">
              Free tryouts for players born {birthRange()}, at{" "}
              <Link href={season.location.href} className="tryout-cards-place">
                {season.location.name}
              </Link>
              .
            </p>
          </header>
        ) : null}
        <div className="tryout-cards-grid" data-count={sessions.length}>
          {sessions.map((s) => (
            <article key={s.player} className="tryout-card">
              <h3 className="tryout-card-tag">{PLAYER_LABELS[s.player]}</h3>
              <ul className="tryout-card-days">
                {s.days.map((d) => (
                  <li key={d.date} className="tryout-card-day">
                    <Link
                      href={tryoutsHref(s.player)}
                      className="tryout-card-date"
                    >
                      {longDate(d.date)}
                    </Link>
                    <span className="tryout-card-time">{timeRange(d)}</span>
                  </li>
                ))}
              </ul>
              <a
                href={season.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tryout-card-place"
              >
                {season.location.name}
                <span className="tryout-card-address">
                  {season.location.address}
                </span>
              </a>
              {years ? (
                <>
                  <p className="tryout-card-label">Born in</p>
                  <ul className="tryout-card-years">
                    {birthYears().map((year) => (
                      <li key={year}>
                        <Link
                          href={tryoutsHref(s.player, year)}
                          className="tryout-card-year"
                          aria-label={`${PLAYER_LABELS[s.player]} born in ${year}`}
                        >
                          {year}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="tryout-card-action">
                    <Button
                      variant="default"
                      render={<Link href={tryoutsHref(s.player)} />}
                    >
                      <span>Sign up for {s.player} tryouts</span>
                      <Icon token="ri:arrow-right" aria-hidden="true" />
                    </Button>
                  </div>
                </>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
