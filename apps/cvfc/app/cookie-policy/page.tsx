import type { Metadata } from "next";

import { CookiePolicyScreen } from "@/components/screen/cookie-policy-screen";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Chula Vista Fútbol Club uses cookies and similar technologies on our website.",
  alternates: { canonical: "/cookie-policy" },
  openGraph: {
    title: "Cookie Policy — Chula Vista FC",
    description: "How CVFC uses cookies on our site.",
    url: "/cookie-policy",
    type: "website",
  },
};

export default function Page() {
  return <CookiePolicyScreen />;
}
