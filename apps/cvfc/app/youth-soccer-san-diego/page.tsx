import type { Metadata } from "next";

import { YouthSoccerSanDiegoScreen } from "@/components/screen/youth-soccer-san-diego-screen";
import { metadataForPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "youth-soccer-san-diego",
    path: "/youth-soccer-san-diego",
    title: "Youth Soccer in San Diego — Chula Vista FC",
    description:
      "A 501(c)(3) nonprofit club developing San Diego players since 1982. Ages 4 to U19, boys and girls, MLS NEXT to first touches. Year-round evaluations, and a coach replies in 48 hours.",
  });
}

export default function Page() {
  return <YouthSoccerSanDiegoScreen />;
}
