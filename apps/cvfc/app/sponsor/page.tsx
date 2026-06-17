import type { Metadata } from "next";

import { SponsorScreen } from "@/components/screen/sponsor-screen";

export const metadata: Metadata = {
  title:
    "Become a Sponsor — Youth Soccer Sponsorship in San Diego · Chula Vista FC",
  description:
    "Sponsor Chula Vista FC — Bronze, Silver, Gold, or custom packages. Jersey logos, banner placement, match-day recognition, scholarship funding. 501(c)(3) nonprofit, tax-deductible. Founded 1982.",
  alternates: { canonical: "/sponsor" },
  openGraph: {
    title: "Become a Sponsor — Chula Vista FC",
    description:
      "Bronze, Silver, Gold, and Title sponsorships at South Bay's longest-running youth soccer club.",
    url: "/sponsor",
    type: "website",
  },
};

export default function Page() {
  return <SponsorScreen />;
}
