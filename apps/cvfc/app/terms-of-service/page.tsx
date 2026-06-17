import type { Metadata } from "next";

import { TermsOfServiceScreen } from "@/components/screen/terms-of-service-screen";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing your use of the Chula Vista Fútbol Club website, evaluation tools, and club programs.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Terms of Service — Chula Vista FC",
    description: "The terms for using the CVFC website and services.",
    url: "/terms-of-service",
    type: "website",
  },
};

export default function Page() {
  return <TermsOfServiceScreen />;
}
