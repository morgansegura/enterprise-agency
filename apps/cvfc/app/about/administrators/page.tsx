import type { Metadata } from "next";

import { AdministratorsScreen } from "@/components/screen/administrators-screen";

export const metadata: Metadata = {
  title: "Administrators",
  description:
    "Meet the directors leading Chula Vista FC — Academy Director (UEFA C License), Technical Director (Real Madrid + FC Barcelona youth academies), Director of Operations, and Director of Coaching.",
  alternates: { canonical: "/about/administrators" },
  openGraph: {
    title: "Administrators — Chula Vista FC",
    description:
      "The directors running Chula Vista FC, the South Bay's premier youth soccer club.",
    url: "/about/administrators",
    type: "website",
  },
};

export default function Page() {
  return <AdministratorsScreen />;
}
