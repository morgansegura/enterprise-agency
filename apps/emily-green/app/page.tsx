import type { Metadata } from "next";

import { LandingScreen } from "@/components/screen/landing-screen";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: site.name,
  description: site.description,
  path: "/",
});

export default function Home() {
  return <LandingScreen />;
}
