import Link from "next/link";

import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { PageHero } from "@/components/feature/page-hero";
import { StaffDirectory } from "@/components/feature/staff-directory";
import { COACHES, getActiveCoaches } from "@/data/coaches";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import "./coaching-staff-screen.css";

type CoachingStaffScreenProps = {
  className?: string;
};

export function CoachingStaffScreen({ className }: CoachingStaffScreenProps) {
  const activeCoaches = getActiveCoaches(COACHES);
  const personSchemas = activeCoaches.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.title,
    ...(p.credentials && p.credentials.length > 0
      ? { description: p.credentials.join(" · ") }
      : {}),
    ...(p.image ? { image: p.image.src } : {}),
    ...(p.contact?.email ? { email: p.contact.email } : {}),
    ...(p.contact?.phone ? { telephone: p.contact.phone } : {}),
    affiliation: {
      "@type": "SportsOrganization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
  }));

  return (
    <>
      <main className={cn("coaching-staff-screen", className)}>
        <PageHero
          eyebrow="Coaching Staff"
          heading="Coached by people who've been there."
          description="Meet the USSF A and UEFA-licensed coaches developing players across MLS NEXT, Elite Academy, NPL, and DPL at Chula Vista FC. Our South Bay staff brings college, elite, and professional playing experience — including alumni of Liga MX Pachuca, CHIVAS, the US Youth National Team, and Club Tijuana — to youth soccer in Chula Vista, San Diego, and the South Bay."
          actions={
            <>
              <EvaluationCTA variant="default" label="Request an Evaluation" />
              <Button variant="outline" render={<Link href="/programs" />}>
                <Icon token="ri:soccer-ball" aria-hidden="true" />
                <span>Explore Programs</span>
                <Icon token="ri:arrow-right" aria-hidden="true" />
              </Button>
            </>
          }
        />

        <StaffDirectory coaches={activeCoaches} />

        <Callout
          eyebrow="Coaching Opportunities"
          heading="Coach with Chula Vista FC"
          variant="bone"
          body={
            <>
              CVFC is always looking for licensed, dedicated coaches who share
              our values. If you&rsquo;re ready to develop the next generation
              of South Bay talent, we&rsquo;d love to talk.
            </>
          }
          cta={{
            label: "Coaching Opportunities",
            href: "/programs/coaching-opportunities",
            variant: "outline",
            iconToken: "ri:badge",
          }}
        />
      </main>
      <JsonLd data={personSchemas} />
    </>
  );
}
