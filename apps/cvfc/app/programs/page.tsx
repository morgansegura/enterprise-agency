import type { Metadata } from "next";

import { ProgramsScreen } from "@/components/screen/programs-screen";
import { metadataForPage } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "programs",
    path: "/programs",
    title: "Programs & Pathways",
    description:
      "From Mini Maestros at age 4 to MLS NEXT, Elite Academy, NPL, and DPL — Chula Vista FC's structured player pathway across every age and ambition.",
  });
}

export default function Page() {
  return <ProgramsScreen />;
}
