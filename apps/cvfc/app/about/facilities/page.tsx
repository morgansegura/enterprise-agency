import type { Metadata } from "next";

import { FacilitiesScreen } from "@/components/screen/facilities-screen";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Where CVFC players train and compete — our home fields and partner venues across Chula Vista and South San Diego.",
};

export default function Page() {
  return <FacilitiesScreen />;
}
