import type { Metadata } from "next";

import { AreasScreen } from "@/components/screen/areas-screen";
import { metadataForPage } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "areas",
    path: "/areas",
    title: "Youth Soccer Across the South Bay",
    description:
      "Chula Vista FC serves families across the South Bay — Bonita, Eastlake, Otay Ranch and more. Find the CVFC pathway and fields close to home.",
  });
}

export default function Page() {
  return <AreasScreen />;
}
