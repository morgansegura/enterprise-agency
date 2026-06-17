import Link from "next/link";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { FieldGrid } from "@/components/feature/field-grid";
import { Heading } from "@/components/feature/heading";
import { MediaSplit } from "@/components/feature/media-split";
import { PageHero } from "@/components/feature/page-hero";
import {
  FACILITIES,
  getFeaturedFacilities,
  getParkFacilities,
  type Facility,
} from "@/data/facilities";

function formatAddressLine(facility: Facility) {
  const { street, city, state, zip } = facility.address;
  return `${street} • ${city}, ${state} ${zip}`;
}

function FeaturedFacilityRow({
  facility,
  index,
}: {
  facility: Facility;
  index: number;
}) {
  const bg = index % 2 === 0 ? "bone" : "white";

  const body = (
    <>
      <p className="font-bold text-(--color-midnight)">
        {formatAddressLine(facility)}
      </p>
      <p>{facility.description}</p>
      {facility.features.length > 0 ? (
        <p className="text-sm text-(--color-midnight)/70">
          <span className="font-bold uppercase tracking-(--tracking-eyebrow) text-(--color-gold)">
            On-site:
          </span>{" "}
          {facility.features.join(" · ")}
        </p>
      ) : null}
    </>
  );

  if (facility.image) {
    return (
      <MediaSplit
        eyebrow={facility.roleLabel}
        heading={facility.name}
        background={bg}
        reverse={index % 2 === 1}
        body={body}
        image={{ src: facility.image.src, alt: facility.image.alt }}
        buttons={[
          {
            label: "Open in Maps",
            href: facility.mapsUrl,
            variant: "outline",
            target: "_blank",
          },
        ]}
      />
    );
  }

  return (
    <Section bg={bg} size="default">
      <Heading
        eyebrow={facility.roleLabel}
        heading={facility.name}
        headingSize="section"
        description={body}
      />
      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          render={
            <a
              href={facility.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <span>Open in Maps</span>
          <Icon token="ri:arrow-right" aria-hidden="true" />
        </Button>
      </div>
    </Section>
  );
}

export function FacilitiesScreen() {
  const featured = getFeaturedFacilities(FACILITIES);
  const parks = getParkFacilities(FACILITIES);

  return (
    <>
      <main>
        <PageHero
          eyebrow="Facilities"
          heading="Where we train, play, and compete."
          description="Chula Vista FC trains across Chula Vista and South San Diego — full-size pitches, lit fields for evening sessions, and match-day venues that feel like real game days. Below are the venues that make up the CVFC week."
          actions={
            <>
              <EvaluationCTA variant="default" label="Request an Evaluation" />
              <Button
                variant="outline"
                render={<Link href="/about/coaching-staff" />}
              >
                <span>Meet the Coaching Staff</span>
                <Icon token="ri:arrow-right" aria-hidden="true" />
              </Button>
            </>
          }
        />

        {featured.map((f, i) => (
          <FeaturedFacilityRow key={f.id} facility={f} index={i} />
        ))}

        {parks.length > 0 ? (
          <Section
            bg="bone"
            size="default"
            className="border-t border-(--color-gold)/30"
          >
            <Heading
              eyebrow="Community Fields"
              heading="Parks across Chula Vista and the South Bay."
              headingSize="section"
              description={
                <p>
                  CVFC trains at community parks across the South Bay — close to
                  home for South Bay families and an easy drive for families
                  further out. Tap a park to open it in Maps.
                </p>
              }
            />
            <FieldGrid className="mt-10" fields={parks} />
          </Section>
        ) : null}

        <Callout
          eyebrow="Come Train With Us"
          heading="Walk a CVFC field this week."
          variant="bone"
          body={
            <>
              The fastest way to feel CVFC is to step onto one of our fields
              during an evaluation. Choose your player&rsquo;s pathway and birth
              year and a coach will be in touch with the next session.
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
