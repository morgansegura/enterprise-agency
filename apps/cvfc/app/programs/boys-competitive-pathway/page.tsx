import type { Metadata } from "next";

import { BoysCompetitivePathwayScreen } from "@/components/screen/boys-competitive-pathway-screen";
import { metadataForPage } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "programs/boys-competitive-pathway",
    path: "/programs/boys-competitive-pathway",
    title: "Boys Competitive Pathway — MLS NEXT, Elite Academy & SoCal Flight",
    description:
      "Chula Vista FC's boys competitive pathway: MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, and SoCal Flight. Birth years 2007–2013. The South Bay's most direct path to college recruiting and MLS academies.",
  });
}

export default function Page() {
  return <BoysCompetitivePathwayScreen />;
}
