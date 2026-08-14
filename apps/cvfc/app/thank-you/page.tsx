import type { Metadata } from "next";

import { ThankYouScreen } from "@/components/screen/thank-you-screen";

// Zeffy's redirect target — a confirmation page, never a search landing page.
export const metadata: Metadata = {
  title: "Thank you",
  description: "Your gift to Chula Vista FC has been received.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYouScreen />;
}
