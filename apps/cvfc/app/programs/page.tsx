import type { Metadata } from "next";

import { ProgramsScreen } from "@/components/screen/programs-screen";

export const metadata: Metadata = {
  title: "Programs & Pathways",
  description:
    "From Mini Maestros at age 4 to MLS NEXT, Elite Academy, NPL, and DPL — Chula Vista FC's structured player pathway across every age and ambition.",
  alternates: { canonical: "/programs" },
  openGraph: {
    title: "Programs & Pathways — Chula Vista FC",
    description:
      "From first touch to college and pro — CVFC's full player development pathway.",
    url: "/programs",
    type: "website",
  },
};

export default function Page() {
  return <ProgramsScreen />;
}
