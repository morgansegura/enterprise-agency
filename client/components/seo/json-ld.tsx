/**
 * JSON-LD Schema Components
 *
 * Reusable components for injecting structured data into pages.
 * These help search engines and answer engines understand your content.
 */

import {
  generateFAQSchema,
  generateHowToSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateLocalBusinessSchema,
  generateProductSchema,
  type FAQItem,
  type HowToStep,
  type BreadcrumbItem,
} from "@/lib/seo";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Base component for rendering JSON-LD script tags
 */
function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * FAQ Schema Component
 *
 * Use on pages with frequently asked questions.
 * Helps content appear in Google's FAQ rich results.
 *
 * @example
 * <FAQSchema items={[
 *   { question: "What is your return policy?", answer: "We offer 30-day returns..." },
 *   { question: "How long does shipping take?", answer: "Standard shipping is 3-5 days..." }
 * ]} />
 */
export function FAQSchema({ items }: { items: FAQItem[] }) {
  if (!items.length) return null;
  return <JsonLd data={generateFAQSchema(items)} />;
}

/**
 * HowTo Schema Component
 *
 * Use on tutorial/guide pages with step-by-step instructions.
 * Helps content appear in Google's HowTo rich results.
 *
 * @example
 * <HowToSchema
 *   name="How to Set Up Your Account"
 *   description="A step-by-step guide to creating your account"
 *   steps={[
 *     { name: "Sign up", text: "Visit our signup page and enter your email" },
 *     { name: "Verify", text: "Check your email and click the verification link" }
 *   ]}
 * />
 */
export function HowToSchema({
  name,
  description,
  image,
  totalTime,
  estimatedCost,
  supply,
  tool,
  steps,
}: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  estimatedCost?: { currency: string; value: string };
  supply?: string[];
  tool?: string[];
  steps: HowToStep[];
}) {
  if (!steps.length) return null;
  return (
    <JsonLd
      data={generateHowToSchema({
        name,
        description,
        image,
        totalTime,
        estimatedCost,
        supply,
        tool,
        steps,
      })}
    />
  );
}

/**
 * Breadcrumb Schema Component
 *
 * Use on all pages to help search engines understand site hierarchy.
 * Improves how breadcrumbs appear in search results.
 *
 * @example
 * <BreadcrumbSchema items={[
 *   { name: "Home", url: "https://example.com" },
 *   { name: "Products", url: "https://example.com/products" },
 *   { name: "Widget", url: "https://example.com/products/widget" }
 * ]} />
 */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) return null;
  return <JsonLd data={generateBreadcrumbSchema(items)} />;
}

/**
 * Article Schema Component
 *
 * Use on blog posts and articles.
 * Improves visibility in Google News and article carousels.
 *
 * @example
 * <ArticleSchema
 *   headline="10 Tips for Better SEO"
 *   description="Learn how to improve your website's search rankings"
 *   image="https://example.com/article-image.jpg"
 *   datePublished="2024-01-15T09:00:00Z"
 *   author={{ name: "John Doe", url: "https://example.com/authors/john" }}
 *   publisher={{ name: "Example Co", logo: "https://example.com/logo.png" }}
 *   url="https://example.com/blog/seo-tips"
 * />
 */
export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
  url,
}: {
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author: { name: string; url?: string };
  publisher: { name: string; logo: string };
  url: string;
}) {
  return (
    <JsonLd
      data={generateArticleSchema({
        headline,
        description,
        image,
        datePublished,
        dateModified,
        author,
        publisher,
        url,
      })}
    />
  );
}

/**
 * Local Business Schema Component
 *
 * Use on local business websites.
 * Essential for local SEO and Google Maps visibility.
 *
 * @example
 * <LocalBusinessSchema
 *   name="Joe's Coffee Shop"
 *   description="Best coffee in downtown"
 *   url="https://joescoffee.com"
 *   telephone="+1-555-123-4567"
 *   address={{
 *     streetAddress: "123 Main St",
 *     addressLocality: "Seattle",
 *     addressRegion: "WA",
 *     postalCode: "98101",
 *     addressCountry: "US"
 *   }}
 *   openingHours={["Mo-Fr 07:00-19:00", "Sa-Su 08:00-17:00"]}
 * />
 */
export function LocalBusinessSchema({
  name,
  description,
  url,
  telephone,
  email,
  image,
  priceRange,
  address,
  geo,
  openingHours,
  sameAs,
}: {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  email?: string;
  image?: string;
  priceRange?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: { latitude: number; longitude: number };
  openingHours?: string[];
  sameAs?: string[];
}) {
  return (
    <JsonLd
      data={generateLocalBusinessSchema({
        name,
        description,
        url,
        telephone,
        email,
        image,
        priceRange,
        address,
        geo,
        openingHours,
        sameAs,
      })}
    />
  );
}

/**
 * Product Schema Component
 *
 * Use on e-commerce product pages.
 * Essential for product rich results in Google Shopping.
 *
 * @example
 * <ProductSchema
 *   name="Premium Widget"
 *   description="Our best-selling widget"
 *   image="https://example.com/widget.jpg"
 *   price={29.99}
 *   priceCurrency="USD"
 *   availability="InStock"
 *   url="https://example.com/products/widget"
 *   brand="WidgetCo"
 *   sku="WGT-001"
 * />
 */
export function ProductSchema({
  name,
  description,
  image,
  sku,
  brand,
  price,
  priceCurrency,
  availability,
  url,
  reviewCount,
  ratingValue,
}: {
  name: string;
  description: string;
  image: string | string[];
  sku?: string;
  brand?: string;
  price: number;
  priceCurrency: string;
  availability: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued";
  url: string;
  reviewCount?: number;
  ratingValue?: number;
}) {
  return (
    <JsonLd
      data={generateProductSchema({
        name,
        description,
        image,
        sku,
        brand,
        price,
        priceCurrency,
        availability,
        url,
        reviewCount,
        ratingValue,
      })}
    />
  );
}
