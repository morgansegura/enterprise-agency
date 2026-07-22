import type { Metadata } from "next";

import { ChampionsScreen } from "@/components/screen/champions-screen";
import { metadataForPage } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "champions",
    path: "/champions",
    title: "Champions",
    description:
      "Chula Vista FC's championships — state cups, national cups, and MLS NEXT finals — plus the players signing with college programs and professional academies.",
  });
}

export default function Page() {
  return <ChampionsScreen />;
}
