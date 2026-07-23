import { Blocks } from "@/components/blocks";
import { Callout } from "@/components/feature/callout";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { FaqSection } from "@/components/feature/faq-section";
import { IconCards } from "@/components/feature/icon-cards";
import { PageHero } from "@/components/feature/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import type { Area } from "@/data/areas";
import { getPage } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";

/** Area (local geo) page — "Youth soccer in <community>". Mock-first: renders the
 *  CMS page layout when the club has built one at `areas/<slug>`, else the
 *  composed fallback. Local schema (SportsActivityLocation + FAQ + breadcrumb)
 *  always renders so the page is eligible for local + AI results either way. */
export async function AreaScreen({ area }: { area: Area }) {
  const page = await getPage(`areas/${area.slug}`);
  const url = `${siteConfig.url}/areas/${area.slug}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: `${siteConfig.name} — ${area.name}`,
      description: area.intro,
      url,
      sport: "Soccer",
      areaServed: { "@type": "Place", name: `${area.name}, CA` },
      parentOrganization: {
        "@type": "SportsOrganization",
        name: siteConfig.legalName,
        url: siteConfig.url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Areas",
          item: `${siteConfig.url}/areas`,
        },
        { "@type": "ListItem", position: 3, name: area.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: area.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <main>
      {page?.layout?.length ? (
        <Blocks page={page} />
      ) : (
        <>
          <PageHero
            eyebrow={area.eyebrow}
            heading={area.heading}
            description={area.intro}
            actions={
              <EvaluationCTA variant="default" label="Request an Evaluation" />
            }
          />

          <IconCards
            eyebrow="Programs near you"
            heading={`Every pathway, one club — for ${area.name} players.`}
            description="From first touches to the college and pro pathway, boys and girls train together under one club."
            cards={area.programs}
            cta={{
              label: "Explore our programs",
              href: "/programs",
              variant: "secondary",
              iconToken: "ri:soccer-ball",
            }}
            background="bone"
          />

          <Callout
            eyebrow={`Why ${area.name} families choose CVFC`}
            heading="Elite pathway. Community price. Right here in the South Bay."
            body={
              <>
                {area.name} players train at our Chula Vista home fields just
                minutes away — a full MLS NEXT and Elite Academy pathway without
                the premium-club price tag. It&rsquo;s the club that has moved
                South Bay kids on to college programs, professional academies,
                and Liga MX.
              </>
            }
            cta={{ label: "Request an Evaluation", href: "/evaluations" }}
            variant="midnight"
          />

          <FaqSection
            heading={`${area.name} soccer — parent questions.`}
            entries={area.faqs}
          />
        </>
      )}
      <JsonLd data={schema} />
    </main>
  );
}
