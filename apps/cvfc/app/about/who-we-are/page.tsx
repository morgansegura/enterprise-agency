import type { Metadata } from "next";

import { WhoWeAreScreen } from "@/components/screen/who-we-are-screen";

export const metadata: Metadata = {
  title: "Who We Are — 44 Years of South Bay Soccer",
  description:
    "Founded 1982. The local club, not a franchise. Chula Vista FC's mission, values, and 44-year story of developing players through MLS NEXT, Elite Academy, DPL, NPL — and into MLS Colorado Rapids, FC Dallas, Atlas FC, and Club Tijuana.",
  alternates: { canonical: "/about/who-we-are" },
};

export default function Page() {
  return <WhoWeAreScreen />;
}
