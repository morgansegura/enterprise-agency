import type { Metadata } from "next";

import { NewsScreen } from "@/components/screen/news-screen";

export const metadata: Metadata = {
  title: "News",
  description:
    "Signings, championships, alumni news, and the small moments that shape a Tuesday training session — stories from across the CVFC pathway.",
};

export default function Page() {
  return <NewsScreen />;
}
