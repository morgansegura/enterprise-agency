import Link from "next/link";

import { ContactButton } from "@/components/analytics/contact-button";
import { Callout } from "@/components/feature/callout";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/feature/page-hero";
import { TryoutCards } from "@/components/feature/tryout-cards";
import { TryoutsForm } from "@/components/feature/tryouts-form";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import {
  PLAYER_LABELS,
  TRYOUT_SEASON,
  birthRange,
  isoTime,
  shortDate,
  tryoutOpen,
  tryoutsOpen,
  type TryoutPlayer,
} from "@/lib/tryouts";
import { cn } from "@/lib/utils";

import "./tryouts-screen.css";

/** "+1-619-500-3620" as "(619) 500-3620". */
const phone = (e164: string) =>
  e164.replace(/^\+1-?(\d{3})-?(\d{3})-?(\d{4})$/, "($1) $2-$3");

/** The younger-player (U7–U9) tryouts: when and where, then the signup. */
export function TryoutsScreen({
  player,
  born,
  className,
}: {
  /** Chosen by the link that brought the parent here. */
  player: TryoutPlayer | null;
  born: number | null;
  className?: string;
}) {
  const season = TRYOUT_SEASON;
  const open = tryoutsOpen();
  const pageUrl = `${siteConfig.url}/tryouts`;

  // Only tryouts that are up: a past one leaves the search data with its card.
  const events = season.sessions
    .filter((s) => tryoutOpen(s.player))
    .flatMap((s) =>
      s.days.map((d) => ({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: `Chula Vista FC ${PLAYER_LABELS[s.player]} U7–U9 Tryouts`,
        description: `Free tryouts for ${PLAYER_LABELS[s.player].toLowerCase()} born ${birthRange()}.`,
        startDate: isoTime(d.date, d.start),
        endDate: isoTime(d.date, d.end),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        sport: "Soccer",
        location: {
          "@type": "Place",
          name: season.location.name,
          address: season.location.address,
        },
        organizer: { "@id": `${siteConfig.url}#organization` },
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: pageUrl,
        },
      })),
    );

  return (
    <>
      <main className={cn("tryouts-screen", className)}>
        <PageHero
          eyebrow={open ? `U7–U9 Tryouts · ${season.label}` : "U7–U9 Tryouts"}
          heading="Tryouts for our youngest players."
          description={
            !open ? (
              <>
                The next tryout dates are posted here as soon as they&rsquo;re
                set. Until then, a coach can evaluate your player any time of
                year.
              </>
            ) : (
              <>
                Free tryouts for boys and girls born {birthRange()}, at{" "}
                <Link href={season.location.href} className="tryouts-place">
                  {season.location.name}
                </Link>{" "}
                in Chula Vista. Sign up below.
              </>
            )
          }
        />

        <TryoutCards years={false} />

        <section className="tryouts-register" id="tryouts-form">
          <div className="contain">
            <TryoutsForm
              key={`${player}-${born}`}
              player={player}
              born={born}
              open={open}
            />
          </div>
        </section>

        {/* Last season's birth ranges would mislead between seasons. */}
        {open ? (
          <section className="tryouts-groups" aria-labelledby="tryouts-groups">
            <div className="tryouts-groups-inner contain">
              <h2 id="tryouts-groups" className="tryouts-groups-heading">
                Age groups
              </h2>
              <p className="tryouts-groups-description">
                Players are grouped by school year: born August 1 through July
                31.
              </p>
              <ul className="tryouts-groups-list">
                {season.ageGroups.map((g) => (
                  <li key={g.label} className="tryouts-group">
                    <span className="tryouts-group-label">{g.label}</span>
                    <span className="tryouts-group-range">
                      Born {shortDate(g.bornFrom)} – {shortDate(g.bornTo)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="tryouts-groups-description">
                Older player?{" "}
                <Link href="/evaluations" className="tryouts-link">
                  Request an evaluation
                </Link>{" "}
                any time of year.
              </p>
            </div>
          </section>
        ) : null}

        <Callout
          eyebrow="Questions?"
          heading="Questions about tryouts?"
          body={
            <>
              Email or call us and we&rsquo;ll help with anything: age groups,
              what to bring, or which day works.
            </>
          }
          ctaSlot={
            <>
              <ContactButton
                variant="default"
                topic="tryouts"
                subject="U7–U9 tryouts question"
              >
                <span>Email us</span>
                <Icon token="ri:arrow-right" aria-hidden="true" />
              </ContactButton>
              <Button
                variant="outline"
                render={<a href={`tel:${siteConfig.contact.phone}`} />}
              >
                <span>Call {phone(siteConfig.contact.phone)}</span>
              </Button>
            </>
          }
        />
      </main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tryouts", path: "/tryouts" },
          ]),
          ...events,
        ]}
      />
    </>
  );
}
