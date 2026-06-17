import type { Metadata } from "next";

import { LinkPolicyScreen } from "@/components/screen/link-policy-screen";

export const metadata: Metadata = {
  title: "Link Policy",
  description:
    "How Chula Vista Fútbol Club handles links to and from third-party websites.",
  alternates: { canonical: "/link-policy" },
  openGraph: {
    title: "Link Policy — Chula Vista FC",
    description: "Outbound and inbound linking policy for the CVFC website.",
    url: "/link-policy",
    type: "website",
  },
};

export default function Page() {
  return <LinkPolicyScreen />;
}
