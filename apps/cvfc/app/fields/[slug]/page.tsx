import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FieldScreen } from "@/components/screen/field-screen";
import { FACILITIES } from "@/data/facilities";
import { metadataForPage } from "@/lib/seo";

/** Venue pages exist for the named venues, not the community parks. */
const FIELD_IDS = [
  "vca",
  "hoover-hs",
  "ofarrell-charter",
  "indoor-training-center",
];

const getFacility = (slug: string) =>
  FIELD_IDS.includes(slug)
    ? FACILITIES.find((facility) => facility.id === slug)
    : undefined;

export function generateStaticParams() {
  return FIELD_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const facility = getFacility(slug);
  if (!facility) return {};

  return metadataForPage({
    slug: `fields/${slug}`,
    path: `/fields/${slug}`,
    title: `${facility.name} — Chula Vista FC ${facility.roleLabel}`,
    description: `${facility.name} in ${facility.address.city}: where Chula Vista FC ${facility.uses.join(", ").toLowerCase()} teams train and play. Year-round evaluations, ages 4 to U19.`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const facility = getFacility(slug);
  if (!facility) notFound();

  return <FieldScreen facility={facility} />;
}
