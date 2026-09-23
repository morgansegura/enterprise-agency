import type { Metadata } from "next";

import { GuidesScreen } from "@/components/screen/guides-screen";
import { metadataForPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "guides",
    path: "/guides",
    title: "Youth Soccer Guides for San Diego Families",
    description:
      "Leagues, levels, cost and commitment in San Diego youth soccer — explained for parents deciding where their player belongs.",
  });
}

export default function Page() {
  return <GuidesScreen />;
}
