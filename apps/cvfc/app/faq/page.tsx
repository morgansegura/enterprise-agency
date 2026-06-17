import type { Metadata } from "next";

import { FaqScreen } from "@/components/screen/faq-screen";

export const metadata: Metadata = {
  title:
    "Youth Soccer FAQ — Costs, Tryouts, Leagues & Pathways · Chula Vista FC",
  description:
    "Real answers for South Bay families: how much youth soccer costs at Chula Vista FC ($800–$2,000), tryout windows, MLS NEXT and Elite Academy pathways, scholarships, and how CVFC compares to bigger national clubs like Surf and Albion.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Youth Soccer FAQ — Chula Vista FC",
    description:
      "Costs, tryouts, leagues, scholarships, and outcomes — answers for South Bay families.",
    url: "/faq",
    type: "website",
  },
};

export default function Page() {
  return <FaqScreen />;
}
