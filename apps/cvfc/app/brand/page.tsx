import type { Metadata } from "next";

import { BrandScreen } from "@/components/screen/brand-screen";
import { metadataForPage } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "brand",
    path: "/brand",
    title: "Brand Guidelines & Logo Downloads — Chula Vista FC",
    description:
      "Official Chula Vista FC crest downloads (SVG and PNG), club colors, typography, naming, and the rules partners, sponsors, and media follow when they use them.",
  });
}

export default function Page() {
  return <BrandScreen />;
}
