import type { Metadata } from "next";

import { AboutScreen } from "@/components/screen/about-screen";
import { metadataForPage } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "about",
    path: "/about",
    title: "About Chula Vista FC — 44 Years of South Bay Soccer Since 1982",
    description:
      "Chula Vista FC is South Bay San Diego's longest-running competitive soccer club. Founded 1982. The local club, not a franchise. Meet the coaches, leadership, fields, and families behind 44 years of player development.",
  });
}

export default function Page() {
  return <AboutScreen />;
}
