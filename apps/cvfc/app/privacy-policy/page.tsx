import type { Metadata } from "next";

import { PrivacyPolicyScreen } from "@/components/screen/privacy-policy-screen";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Chula Vista Fútbol Club collects, uses, shares, and protects your information — including parent and player data.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — Chula Vista FC",
    description: "How CVFC handles your information.",
    url: "/privacy-policy",
    type: "website",
  },
};

export default function Page() {
  return <PrivacyPolicyScreen />;
}
