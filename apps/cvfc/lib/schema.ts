/**
 * JSON-LD schema generators for SEO / structured data.
 * Inject via <Script type="application/ld+json"> or <JsonLd> component.
 */

import { siteConfig } from "@/lib/site-config";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.legalName,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    description: siteConfig.description,
    foundingDate: siteConfig.foundingDate,
    sport: "Soccer",
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.twitter,
      siteConfig.social.youtube,
    ],
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      areaServed: "US-CA",
      availableLanguage: ["English", "Spanish"],
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: [
      { "@type": "City", name: "Chula Vista" },
      { "@type": "City", name: "San Diego" },
      { "@type": "City", name: "Bonita" },
      { "@type": "City", name: "National City" },
      { "@type": "City", name: "Imperial Beach" },
      { "@type": "City", name: "San Ysidro" },
      { "@type": "AdministrativeArea", name: "South Bay, San Diego County" },
      { "@type": "AdministrativeArea", name: "South County, San Diego" },
      { "@type": "AdministrativeArea", name: "Eastlake, Chula Vista" },
      { "@type": "AdministrativeArea", name: "Otay Ranch, Chula Vista" },
    ],
    memberOf: [
      { "@type": "SportsOrganization", name: "MLS NEXT" },
      { "@type": "SportsOrganization", name: "MLS NEXT Academy" },
      { "@type": "SportsOrganization", name: "Elite Academy League" },
      { "@type": "SportsOrganization", name: "Elite Academy II" },
      { "@type": "SportsOrganization", name: "Development Player League" },
      { "@type": "SportsOrganization", name: "National Premier League" },
      { "@type": "SportsOrganization", name: "Girls Academy" },
      { "@type": "SportsOrganization", name: "Southwest Premier League" },
      { "@type": "SportsOrganization", name: "SoCal Soccer League" },
    ],
    nonprofitStatus: "Nonprofit501c3",
    taxID: siteConfig.ein,
    knowsLanguage: ["English", "Spanish"],
    knowsAbout: [
      "youth soccer development",
      "MLS NEXT pathway",
      "Elite Academy soccer",
      "goalkeeper training",
      "college soccer recruitment",
      "professional soccer pathway",
    ],
    award: [
      "SoCal State Cup Champions (B2014 Tuilla)",
      "SoCal State Cup Champions (B2011 Villa)",
      "Southwest Premier League Champions (First Team)",
      "MLS NEXT Cup Playoffs & Showcase Qualifiers",
    ],
    alumni: [
      {
        "@type": "Person",
        name: "Gavin Jestand",
        affiliation: "MLS Colorado Rapids",
      },
      { "@type": "Person", name: "Quincy Lamar", affiliation: "FC Dallas" },
      {
        "@type": "Person",
        name: "Joaquin Jackson",
        affiliation: "Atlas FC Academy",
      },
      {
        "@type": "Person",
        name: "Anthony Valadez",
        affiliation: "Club Tijuana Xolos",
      },
      {
        "@type": "Person",
        name: "Benjamin de la Herran",
        affiliation: "Club Rayados de Monterrey",
      },
      {
        "@type": "Person",
        name: "Bryan Yael Ramos",
        affiliation: "Club Tijuana Xolos",
      },
      {
        "@type": "Person",
        name: "Emilio Silva",
        affiliation: "Club Tijuana Xolos",
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.shortDescription,
    publisher: { "@id": `${siteConfig.url}#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    name: siteConfig.legalName,
    url: siteConfig.url,
    image: `${siteConfig.url}/icon.png`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: [
      "Chula Vista",
      "Bonita",
      "Eastlake",
      "Otay Ranch",
      "National City",
      "Imperial Beach",
      "San Ysidro",
      "South Bay, San Diego County",
      "South County, San Diego",
      "San Diego, California",
    ],
    priceRange: "$$",
    foundingDate: siteConfig.foundingDate,
    description:
      "Affordable youth soccer club in South Bay San Diego — MLS NEXT, Elite Academy, DPL, NPL pathways. Founded 1982.",
  };
}

type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteConfig.url}${it.path}`,
    })),
  };
}

type NewsArticleInput = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  body?: string;
  image?: { src: string; alt: string };
};

export function newsArticleSchema(post: NewsArticleInput) {
  const url = `${siteConfig.url}/news/${post.slug}`;
  const imageUrl = post.image
    ? `${siteConfig.url}${post.image.src}`
    : `${siteConfig.url}/og-image.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: [imageUrl],
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    publisher: { "@id": `${siteConfig.url}#organization` },
    author: {
      "@type": "SportsOrganization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    about: {
      "@type": "SportsOrganization",
      name: siteConfig.legalName,
    },
    articleSection: "News",
  };
}

type FaqItem = { question: string; answer: string };

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}
