import Link from "next/link";

import { Section } from "@/components/layout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Heading } from "@/components/feature/heading";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo";
import { type Facility } from "@/data/facilities";
import { breadcrumbSchema, venueSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

import "./field-screen.css";

/**
 * One CVFC venue.
 *
 * The club genuinely trains and plays across the county — Chula Vista, City
 * Heights, southeastern San Diego — and these pages say where, in the
 * neighborhood's own terms, with SportsActivityLocation schema. That is the
 * honest route into local results for those areas, as against creating
 * Business Profile listings at fields the club does not staff.
 */
export function FieldScreen({
  facility,
  className,
}: {
  facility: Facility;
  className?: string;
}) {
  const path = `/fields/${facility.id}`;
  const fullAddress = `${facility.address.street}, ${facility.address.city}, ${facility.address.state} ${facility.address.zip}`;

  return (
    <div className={cn("field-screen", className)}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Facilities", path: "/about/facilities" },
          { name: facility.name, path },
        ])}
      />
      <JsonLd
        data={venueSchema({
          name: facility.name,
          description: facility.description,
          path,
          address: facility.address,
          mapsUrl: facility.mapsUrl,
        })}
      />

      <PageHero
        eyebrow={facility.roleLabel}
        heading={facility.name}
        description={facility.description}
        actions={<EvaluationCTA />}
      />

      <Section>
        <dl className="field-facts">
          <div className="field-fact">
            <dt>Address</dt>
            <dd>
              {facility.mapsUrl ? (
                <a href={facility.mapsUrl} target="_blank" rel="noreferrer">
                  {fullAddress}
                </a>
              ) : (
                fullAddress
              )}
            </dd>
          </div>
          <div className="field-fact">
            <dt>Used for</dt>
            <dd>{facility.uses.join(", ")}</dd>
          </div>
          <div className="field-fact">
            <dt>On site</dt>
            <dd>{facility.features.join(", ")}</dd>
          </div>
        </dl>
      </Section>

      <Section bg="bone">
        <Heading
          heading="Playing here with Chula Vista FC"
          headingSize="section"
          align="left"
        />

        <div className="field-prose">
          <p>
            Chula Vista FC has developed San Diego players since 1982 &mdash;
            boys and girls, ages 4 through U19, from Mini Maestros to MLS NEXT.
            Evaluations run year-round, so a player can join between seasons
            rather than waiting for a tryout window, and a coach replies within
            48 hours.
          </p>
          <p>
            Training and match days are spread across the county, so which field
            your player is at depends on their age group and program.{" "}
            <Link href="/about/facilities">See every CVFC field</Link>, or{" "}
            <Link href="/youth-soccer-san-diego">
              start with the pathways and how joining works
            </Link>
            .
          </p>
        </div>

        <div className="field-actions">
          <EvaluationCTA />
        </div>
      </Section>
    </div>
  );
}
