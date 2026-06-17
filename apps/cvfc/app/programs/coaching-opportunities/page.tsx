import type { Metadata } from "next";

import { CoachingOpportunitiesScreen } from "@/components/screen/coaching-opportunities-screen";

export const metadata: Metadata = {
  title: "Youth Soccer Coaching Jobs in San Diego — Apply at Chula Vista FC",
  description:
    "Coach at South Bay's longest-running competitive soccer club. Open roles across MLS NEXT, Elite Academy, DPL, NPL, Goalkeeper specialty, and Mini Maestros foundations. USSF / UEFA licensed coaches preferred. English + Spanish.",
  alternates: { canonical: "/programs/coaching-opportunities" },
  openGraph: {
    title: "Youth Soccer Coaching Jobs in San Diego — Chula Vista FC",
    description:
      "Open coaching roles across MLS NEXT, Elite Academy, DPL, NPL, Goalkeeper, and Foundations.",
    url: "/programs/coaching-opportunities",
    type: "website",
  },
};

export default function Page() {
  return <CoachingOpportunitiesScreen />;
}
