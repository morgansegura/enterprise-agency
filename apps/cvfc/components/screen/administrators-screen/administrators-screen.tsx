import Link from "next/link";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { AdminDirectory } from "@/components/feature/admin-directory";
import { Heading } from "@/components/feature/heading";
import { ADMINISTRATORS, getActiveAdministrators } from "@/data/administrators";
import { siteConfig } from "@/lib/site-config";

export function AdministratorsScreen() {
  const active = getActiveAdministrators(ADMINISTRATORS);

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
        <Section
          bg="white"
          size="default"
          className="pt-[calc(var(--header-height)+6rem)]"
        >
          <Heading
            eyebrow="Want to talk to the club?"
            heading="Reach the front office."
            headingSize="section"
            description={
              <p>
                For general questions about programs, registration, or the club,
                email{" "}
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
            eyebrow="Leadership"
            heading="Meet the Directors."
            headingSize="section"
            description={
              <p>
                Four Directors lead Chula Vista FC across academy, technical,
                operations, and coaching.
              </p>
            }
          />
        </Section>

        <AdminDirectory administrators={active} />
      </main>
      <JsonLd data={personSchemas} />
    </>
  );
}
