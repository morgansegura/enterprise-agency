import type { Metadata } from "next";

import { GoalkeeperPathwayScreen } from "@/components/screen/goalkeeper-pathway-screen";

export const metadata: Metadata = {
  title:
    "Goalkeeper Training in San Diego & Chula Vista — Specialty Pathway · Chula Vista FC",
  description:
    "Dedicated goalkeeper pathway in South Bay San Diego. MLS NEXT-level GK coaching, college and pro pathway development, and specialty training at every age — Mini Maestros to U19. Year-round.",
  alternates: { canonical: "/programs/goalkeeper-pathway" },
  openGraph: {
    title: "Goalkeeper Training in San Diego & Chula Vista — Chula Vista FC",
    description:
      "Specialty goalkeeper training at every age. Year-round. South Bay San Diego.",
    url: "/programs/goalkeeper-pathway",
    type: "website",
  },
};

export default function Page() {
  return <GoalkeeperPathwayScreen />;
}
