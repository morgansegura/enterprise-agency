import type { Metadata } from "next";

import { SafeguardingScreen } from "@/components/screen/safeguarding-screen";

export const metadata: Metadata = {
  title: "Youth Safeguarding Policy",
  description:
    "How Chula Vista FC keeps players safe — adult screening, SafeSport, two-deep leadership, photo consent, mandated reporting, and how to raise a concern.",
  alternates: { canonical: "/safeguarding" },
  openGraph: {
    title: "Youth Safeguarding Policy — Chula Vista FC",
    description: "How CVFC keeps players safe, and how to report a concern.",
    url: "/safeguarding",
    type: "website",
  },
};

export default function Page() {
  return <SafeguardingScreen />;
}
