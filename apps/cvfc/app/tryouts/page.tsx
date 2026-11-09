import type { Metadata } from "next";

import { TryoutsScreen } from "@/components/screen/tryouts-screen";
import { birthRange, tryoutChoice } from "@/lib/tryouts";

const description = `Free U7–U9 youth soccer tryouts at Chula Vista FC for boys and girls born ${birthRange()}. Sign up online in two minutes.`;

export const metadata: Metadata = {
  title: "U7–U9 Youth Soccer Tryouts in Chula Vista",
  description,
  alternates: { canonical: "/tryouts" },
  openGraph: {
    title: "U7–U9 Youth Soccer Tryouts · Chula Vista FC",
    description,
    url: "/tryouts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "U7–U9 Youth Soccer Tryouts · Chula Vista FC",
    description,
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { player, born } = tryoutChoice(await searchParams);
  return <TryoutsScreen player={player} born={born} />;
}
