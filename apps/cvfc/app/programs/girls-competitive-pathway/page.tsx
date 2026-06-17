import type { Metadata } from "next";

import { GirlsCompetitivePathwayScreen } from "@/components/screen/girls-competitive-pathway-screen";

export const metadata: Metadata = {
  title: "Girls Competitive Pathway — DPL, NPL & GA Aspire",
  description:
    "Chula Vista FC's girls competitive pathway: DPL (Development Player League), NPL, GA Aspire (coming), and SoCal Flight. Birth years 2007–2013. The South Bay's premier girls' soccer development environment.",
  alternates: { canonical: "/programs/girls-competitive-pathway" },
  openGraph: {
    title: "Girls Competitive Pathway — Chula Vista FC",
    description:
      "DPL, NPL, GA Aspire, SoCal Flight — the girls pathway in Chula Vista, San Diego, and the South Bay.",
    url: "/programs/girls-competitive-pathway",
    type: "website",
  },
};

export default function Page() {
  return <GirlsCompetitivePathwayScreen />;
}
