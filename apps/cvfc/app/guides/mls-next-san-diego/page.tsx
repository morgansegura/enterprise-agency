import type { Metadata } from "next";

import { MlsNextSanDiegoScreen } from "@/components/screen/mls-next-san-diego-screen";
import { metadataForPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage({
    slug: "guides/mls-next-san-diego",
    path: "/guides/mls-next-san-diego",
    title: "MLS NEXT in San Diego: What It Is and How to Join",
    description:
      "MLS NEXT is the top tier of boys youth soccer in the US. What it asks of a family, what it costs, who it suits, and how a San Diego player gets evaluated for it.",
  });
}

export default function Page() {
  return <MlsNextSanDiegoScreen />;
}
