import type { Metadata } from "next";

import { GoalkeeperPathwayScreen } from "@/components/screen/goalkeeper-pathway-screen";
import { metadataForPage } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "programs/goalkeeper-pathway",
    path: "/programs/goalkeeper-pathway",
    title:
      "Goalkeeper Training in San Diego & Chula Vista — Specialty Pathway · Chula Vista FC",
    description:
      "Dedicated goalkeeper pathway in South Bay San Diego. MLS NEXT-level GK coaching, college and pro pathway development, and specialty training at every age — Mini Maestros to U19. Year-round.",
  });
}

export default function Page() {
  return <GoalkeeperPathwayScreen />;
}
