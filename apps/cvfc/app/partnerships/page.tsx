import type { Metadata } from "next";

import { PartnershipsScreen } from "@/components/screen/partnerships-screen";

export const metadata: Metadata = {
  title:
    "Partnerships — CVFC's League, Academy & Community Network · Chula Vista FC",
  description:
    "MLS NEXT, Elite Academy League, DPL, NPL, San Diego FC, Liga MX academies (Atlas, Xolos, Rayados), Hoover High School, and the South Bay community partners that power Chula Vista FC.",
  alternates: { canonical: "/partnerships" },
  openGraph: {
    title: "Partnerships — Chula Vista FC",
    description:
      "League affiliations, academy partners, and South Bay community ties that shape CVFC.",
    url: "/partnerships",
    type: "website",
  },
};

export default function Page() {
  return <PartnershipsScreen />;
}
