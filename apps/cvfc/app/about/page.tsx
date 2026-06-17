import type { Metadata } from "next";

import { AboutScreen } from "@/components/screen/about-screen";

export const metadata: Metadata = {
  title: "About Chula Vista FC — 44 Years of South Bay Soccer Since 1982",
  description:
    "Chula Vista FC is South Bay San Diego's longest-running competitive soccer club. Founded 1982. The local club, not a franchise. Meet the coaches, leadership, fields, and families behind 44 years of player development.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Chula Vista FC — 44 Years of South Bay Soccer",
    description:
      "Founded 1982. The local club, not a franchise. Meet the people, fields, and stories behind CVFC.",
    url: "/about",
    type: "website",
  },
};

export default function Page() {
  return <AboutScreen />;
}
