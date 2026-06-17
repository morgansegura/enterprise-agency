import type { Metadata } from "next";

import { CoachingStaffScreen } from "@/components/screen/coaching-staff-screen";

export const metadata: Metadata = {
  title: "Coaching Staff",
  description:
    "Meet the coaches building champions at Chula Vista FC — licensed professionals with experience across MLS NEXT, Elite Academy, college, and professional soccer.",
  alternates: { canonical: "/about/coaching-staff" },
  openGraph: {
    title: "Coaching Staff — Chula Vista FC",
    description:
      "Coached by people who've been there — from former pros to lifelong CVFC alumni.",
    url: "/about/coaching-staff",
    type: "website",
  },
};

export default function Page() {
  return <CoachingStaffScreen />;
}
