import type { Metadata } from "next";

import { EvaluationsScreen } from "@/components/screen/evaluations-screen";

export const metadata: Metadata = {
  title:
    "Youth Soccer Tryouts in San Diego — Year-Round Evaluations · Chula Vista FC",
  description:
    "Free youth soccer tryouts and year-round evaluations at Chula Vista FC — South Bay San Diego's most affordable MLS NEXT and Elite Academy club. Choose your pathway and birth year. Coaches respond within 48 hours.",
  keywords: [
    "youth soccer tryouts San Diego",
    "Chula Vista FC tryouts",
    "soccer evaluations South Bay",
    "MLS NEXT tryouts San Diego",
    "Elite Academy soccer tryouts",
    "girls soccer tryouts San Diego",
    "goalkeeper tryouts",
    "free youth soccer tryouts",
    "club soccer near me",
  ],
  alternates: { canonical: "/evaluations" },
  openGraph: {
    title:
      "Youth Soccer Tryouts in San Diego — Year-Round Evaluations · Chula Vista FC",
    description:
      "Free tryouts and year-round evaluations. MLS NEXT, Elite Academy, DPL, NPL pathways. Coaches respond within 48 hours.",
    url: "/evaluations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Youth Soccer Tryouts in San Diego — Chula Vista FC Evaluations",
    description:
      "Free, year-round youth soccer tryouts. MLS NEXT, Elite Academy, ECNL, DPL, NPL pathways. A coach responds within 48 hours.",
  },
};

export default function Page() {
  return <EvaluationsScreen />;
}
