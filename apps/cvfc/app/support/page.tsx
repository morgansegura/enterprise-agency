import type { Metadata } from "next";

import { SupportScreen } from "@/components/screen/support-screen";

export const metadata: Metadata = {
  title:
    "Donate to Chula Vista FC — South Bay's 501(c)(3) Youth Soccer Nonprofit",
  description:
    "Support South Bay youth soccer. Chula Vista FC is a 501(c)(3) nonprofit founded in 1982. Every dollar reinvested in player scholarships, lit field training, and the goalkeeper-specific pathway. Donate, sponsor, or partner.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "Donate to Chula Vista FC — Support South Bay Youth Soccer",
    description:
      "501(c)(3) nonprofit. Every dollar stays in the South Bay. Player scholarships, fields, and coaching.",
    url: "/support",
    type: "website",
  },
};

export default function Page() {
  return <SupportScreen />;
}
