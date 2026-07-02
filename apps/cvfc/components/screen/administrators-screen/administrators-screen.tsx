import Link from "next/link";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { AdminDirectory } from "@/components/feature/admin-directory";
import { Heading } from "@/components/feature/heading";
import { ADMINISTRATORS, getActiveAdministrators } from "@/data/administrators";
import { getPage, getStaff } from "@/lib/cms";
import { blockFor } from "@/lib/media";
import { pageHeroFromPage, headingSectionFromBlock } from "@/lib/cms-blocks";
import { staffToAdmin } from "@/lib/cms-staff";
import { siteConfig } from "@/lib/site-config";

export async function AdministratorsScreen() {
  // Use the CMS Staff collection once it serves the rich fields (title present);
  // otherwise fall back to the static roster.
  const page = await getPage("about/administrators");
  const hero = pageHeroFromPage(page);
  const leadershipBlock = blockFor(page, "leadership", "headingSection");
  const leadership = leadershipBlock
    ? headingSectionFromBlock(leadershipBlock)
    : undefined;
  const cms = (await getStaff("Administrators"))
    .map(staffToAdmin)
    .filter((a) => a.title);
  const active = cms.length
    ? getActiveAdministrators(cms)
    : getActiveAdministrators(ADMINISTRATORS);

  const personSchemas = active.map((a) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.name,
    jobTitle: a.title,
    ...(a.credentials && a.credentials.length > 0
      ? { description: a.credentials.join(" · ") }
      : {}),
    ...(a.image ? { image: a.image.src } : {}),
    ...(a.contact?.email ? { email: a.contact.email } : {}),
    ...(a.contact?.phone ? { telephone: a.contact.phone } : {}),
    affiliation: {
      "@type": "SportsOrganization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
  }));

  return (
    <>
      <main>
        <Section bg="white" size="hero">
          <Heading
            eyebrow={hero?.eyebrow || "Want to talk to the club?"}
            heading={hero?.heading || "Reach the front office."}
            headingSize="section"
            description={
              hero?.description ? (
                <p>{hero.description}</p>
              ) : (
                <p>
                  For general questions about programs, registration, or the
                  club, email{" "}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="font-bold text-(--color-gold) underline-offset-4 hover:underline"
                  >
                    {siteConfig.contact.email}
                  </a>{" "}
                  or call{" "}
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="font-bold text-(--color-gold) underline-offset-4 hover:underline"
                  >
                    {siteConfig.contact.phone}
                  </a>
                  .
                </p>
              )
            }
          />
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              render={<Link href="/programs/coaching-opportunities" />}
            >
              <span>Coaching Opportunities</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </Button>
          </div>
        </Section>

        <Section bg="bone" size="intro">
          <Heading
            eyebrow={leadership?.eyebrow || "Leadership"}
            heading={leadership?.heading || "Meet the Directors."}
            headingSize="section"
            description={
              leadership?.paragraphs?.length ? (
                leadership.paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>
                  Four Directors lead Chula Vista FC across academy, technical,
                  operations, and coaching.
                </p>
              )
            }
          />
        </Section>

        <AdminDirectory administrators={active} />
      </main>
      <JsonLd data={personSchemas} />
    </>
  );
}
