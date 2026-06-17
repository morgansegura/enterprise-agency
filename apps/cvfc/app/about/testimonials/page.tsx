import type { Metadata } from "next";

import { TestimonialsScreen } from "@/components/screen/testimonials-screen";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Voices from CVFC parents, players, alumni, and coaches — filterable by role.",
};

export default function Page() {
  return <TestimonialsScreen />;
}
