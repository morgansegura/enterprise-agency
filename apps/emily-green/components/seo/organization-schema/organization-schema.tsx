import { absoluteUrl } from "@/lib/seo";
import { site } from "@/site.config";

import { JsonLd } from "../json-ld";

/**
 * Identity graph for the site: the mortgage practice (MortgageBroker
 * LocalBusiness) with its real aggregate rating, plus Emily as a Person /
 * founder. Feeds Google's knowledge panel, local pack, and AI citation.
 */
export function OrganizationSchema() {
  const id = absoluteUrl("/#business");
  const personId = absoluteUrl("/#emily");

  const person = {
    "@type": "Person",
    "@id": personId,
    name: site.founder.name,
    alternateName: site.founder.alternateName,
    jobTitle: site.founder.jobTitle,
    identifier: `NMLS #${site.founder.nmls}`,
    worksFor: { "@type": "Organization", name: site.company.name },
    url: site.url,
    sameAs: site.sameAs,
  };

  const business = {
    "@type": ["MortgageBroker", "FinancialService", "LocalBusiness"],
    "@id": id,
    name: site.name,
    legalName: `${site.founder.name} — ${site.company.name}`,
    description: site.description,
    slogan: site.tagline,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: absoluteUrl("/opengraph-image"),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    founder: person,
    employee: person,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: site.sameAs,
  };

  return (
    <>
      <JsonLd data={business} />
      <JsonLd data={person} />
    </>
  );
}
