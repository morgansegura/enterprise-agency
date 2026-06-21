import type { Metadata } from "next";

import { FoundationsScreen } from "@/components/screen/foundations-screen";
import { metadataForPage } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "programs/foundations",
    path: "/programs/foundations",
    title: "Foundations — Mini Maestros & CVFC Youth (Ages 4–9)",
    description:
      "Foundations is where every CVFC player begins. Mini Maestros and CVFC Youth for ages 4 through 9 — technique-first training in Chula Vista that prepares players for MLS NEXT, DPL, NPL, and the rest of life.",
  });
}

export default function Page() {
  return <FoundationsScreen />;
}
