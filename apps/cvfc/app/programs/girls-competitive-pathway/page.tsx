import type { Metadata } from "next";

import { GirlsCompetitivePathwayScreen } from "@/components/screen/girls-competitive-pathway-screen";
import { metadataForPage } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "programs/girls-competitive-pathway",
    path: "/programs/girls-competitive-pathway",
    title: "Girls Competitive Pathway — DPL, NPL & GA Aspire",
    description:
      "Chula Vista FC's girls competitive pathway: DPL (Development Player League), NPL, GA Aspire (coming), and SoCal Flight. Birth years 2007–2013. The South Bay's premier girls' soccer development environment.",
  });
}

export default function Page() {
  return <GirlsCompetitivePathwayScreen />;
}
