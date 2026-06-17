import type { Metadata } from "next";

import { EvaluationsScreen } from "@/components/screen/evaluations-screen";

export const metadata: Metadata = {
  title:
    "Youth Soccer Tryouts in San Diego — Year-Round Evaluations · Chula Vista FC",
  description:
    "Free youth soccer tryouts and year-round evaluations at Chula Vista FC — South Bay San Diego's most affordable MLS NEXT and Elite Academy club. Choose your pathway and birth year. Coaches respond within 48 hours.",
  alternates: { canonical: "/evaluations" },
  openGraph: {
    title:
      "Youth Soccer Tryouts in San Diego — Year-Round Evaluations · Chula Vista FC",
    description:
      "Free tryouts and year-round evaluations. MLS NEXT, Elite Academy, DPL, NPL pathways. Coaches respond within 48 hours.",
    url: "/evaluations",
    type: "website",
  },
};

export default function Page() {
  return <EvaluationsScreen />;
}
