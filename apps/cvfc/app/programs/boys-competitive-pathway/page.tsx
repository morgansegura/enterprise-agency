import type { Metadata } from "next";

import { BoysCompetitivePathwayScreen } from "@/components/screen/boys-competitive-pathway-screen";

export const metadata: Metadata = {
  title: "Boys Competitive Pathway — MLS NEXT, Elite Academy & SoCal Flight",
  description:
    "Chula Vista FC's boys competitive pathway: MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, and SoCal Flight. Birth years 2007–2013. The South Bay's most direct path to college recruiting and MLS academies.",
  alternates: { canonical: "/programs/boys-competitive-pathway" },
  openGraph: {
    title: "Boys Competitive Pathway — Chula Vista FC",
    description:
      "MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, SoCal Flight — the boys pathway in Chula Vista, San Diego, and the South Bay.",
    url: "/programs/boys-competitive-pathway",
    type: "website",
  },
};

export default function Page() {
  return <BoysCompetitivePathwayScreen />;
}
