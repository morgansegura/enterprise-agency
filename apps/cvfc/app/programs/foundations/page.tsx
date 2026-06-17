import type { Metadata } from "next";

import { FoundationsScreen } from "@/components/screen/foundations-screen";

export const metadata: Metadata = {
  title: "Foundations — Mini Maestros & CVFC Youth (Ages 4–9)",
  description:
    "Foundations is where every CVFC player begins. Mini Maestros and CVFC Youth for ages 4 through 9 — technique-first training in Chula Vista that prepares players for MLS NEXT, DPL, NPL, and the rest of life.",
  alternates: { canonical: "/programs/foundations" },
  openGraph: {
    title: "Foundations — Chula Vista FC",
    description:
      "Mini Maestros and CVFC Youth — soccer for ages 4 through 9 in Chula Vista, San Diego, and the South Bay.",
    url: "/programs/foundations",
    type: "website",
  },
};

export default function Page() {
  return <FoundationsScreen />;
}
