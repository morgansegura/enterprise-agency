import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AreaScreen } from "@/components/screen/area-screen";
import { AREAS, getArea } from "@/data/areas";
import { metadataForPage } from "@/lib/seo";

type RouteParams = {
  slug: string;
};

export function generateStaticParams(): RouteParams[] {
  return AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return { title: "Area not found" };
  return metadataForPage({
    slug: `areas/${slug}`,
    path: `/areas/${slug}`,
    title: area.meta.title,
    description: area.meta.description,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();
  return <AreaScreen area={area} />;
}
