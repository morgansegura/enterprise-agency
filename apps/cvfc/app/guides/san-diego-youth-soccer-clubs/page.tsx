import type { Metadata } from "next";

import { SanDiegoYouthSoccerClubsScreen } from "@/components/screen/san-diego-youth-soccer-clubs-screen";
import { metadataForPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "guides/san-diego-youth-soccer-clubs",
    path: "/guides/san-diego-youth-soccer-clubs",
    title: "Youth Soccer Clubs in San Diego: How to Choose",
    description:
      "San Diego County has clubs at every level, from MLS NEXT and Girls Academy to local league play. What separates them, what a season really costs, and the questions to ask before committing.",
  });
}

export default function Page() {
  return <SanDiegoYouthSoccerClubsScreen />;
}
