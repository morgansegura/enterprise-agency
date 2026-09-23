import type { Metadata } from "next";

import { YouthSoccerLeaguesScreen } from "@/components/screen/youth-soccer-leagues-screen";
import { metadataForPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "guides/youth-soccer-leagues",
    path: "/guides/youth-soccer-leagues",
    title: "Youth Soccer Leagues Explained: MLS NEXT, ECNL, DPL, NPL",
    description:
      "MLS NEXT, ECNL, Elite Academy, DPL, NPL, Girls Academy and the SoCal Flight system — what each league is, who it suits, and which ones Chula Vista FC plays in.",
  });
}

export default function Page() {
  return <YouthSoccerLeaguesScreen />;
}
