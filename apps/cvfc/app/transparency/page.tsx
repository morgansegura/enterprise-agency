import type { Metadata } from "next";

import { TransparencyScreen } from "@/components/screen/transparency-screen";

export const metadata: Metadata = {
  title: "Financial Transparency",
  description:
    "Where the money goes at Chula Vista FC — nonprofit status, Form 990 filings, how we steward each dollar, governance, and how to verify all of it independently.",
  alternates: { canonical: "/transparency" },
  openGraph: {
    title: "Financial Transparency — Chula Vista FC",
    description: "Where the money goes, and how to verify it independently.",
    url: "/transparency",
    type: "website",
  },
};

export default function Page() {
  return <TransparencyScreen />;
}
