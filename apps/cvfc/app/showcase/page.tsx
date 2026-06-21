import type { Metadata } from "next";

import { ShowcaseScreen } from "@/components/screen/showcase-screen";

export const metadata: Metadata = {
  title: "Component Library",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ShowcaseScreen />;
}
