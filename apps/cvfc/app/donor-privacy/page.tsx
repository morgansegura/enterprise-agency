import type { Metadata } from "next";

import { DonorPrivacyScreen } from "@/components/screen/donor-privacy-screen";

export const metadata: Metadata = {
  title: "Donor Privacy Policy",
  description:
    "Chula Vista FC never sells, rents, trades, or shares donor information. Our commitment to the Donor Bill of Rights, recognition, communication preferences, and records.",
  alternates: { canonical: "/donor-privacy" },
  openGraph: {
    title: "Donor Privacy Policy — Chula Vista FC",
    description: "We never sell, rent, trade, or share donor information.",
    url: "/donor-privacy",
    type: "website",
  },
};

export default function Page() {
  return <DonorPrivacyScreen />;
}
