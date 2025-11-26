# SEO Usage Guide

This guide explains how to use the comprehensive SEO utilities for the MH Bible Baptist Church website.

## Overview

The SEO system provides:

- **Open Graph** tags for social media sharing (Facebook, LinkedIn, etc.)
- **Twitter Cards** for optimized Twitter/X sharing
- **Meta tags** for search engines
- **JSON-LD structured data** for rich search results
- **Canonical URLs** and alternates
- **Robots directives** for search engine crawling

## Quick Start

### 1. Update Site Configuration

Edit `lib/site-config.ts` with your actual church information:

```typescript
export const defaultSEO: DefaultSEOConfig = {
  siteUrl: "https://yourdomain.com", // Your actual domain
  // ... update other fields
};

export const churchInfo = {
  telephone: "+1-555-123-4567", // Actual phone
  email: "info@yourchurch.org", // Actual email
  address: {
    streetAddress: "123 Main St",
    // ... complete address
  },
  // ... update other fields
};
```

### 2. Add Social Media Image

Create an Open Graph image at `public/og-image.jpg`:

- Dimensions: 1200x630px
- Format: JPG or PNG
- Content: Church logo, name, or representative image

### 3. Set Environment Variable

Add to `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Page-Level SEO

### Basic Usage

Add custom metadata to any page by exporting a `metadata` object:

```typescript
// app/events/page.tsx
import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import { defaultSEO } from "@/lib/site-config";

export const metadata: Metadata = generateMetadata(
  {
    title: "Events",
    description: "Upcoming events at MH Bible Baptist Church",
    url: "/events",
  },
  defaultSEO
);

export default function EventsPage() {
  return <div>Events content...</div>;
}
```

### Advanced Usage with Custom Images

```typescript
export const metadata: Metadata = generateMetadata(
  {
    title: "Easter Service 2024",
    description: "Join us for our special Easter celebration",
    url: "/events/easter-2024",
    images: [
      {
        url: "/images/easter-2024.jpg",
        width: 1200,
        height: 630,
        alt: "Easter Service 2024 at MH Bible Baptist Church",
      },
    ],
    keywords: ["Easter Service", "Resurrection Sunday", "Church Event"],
  },
  defaultSEO,
);
```

### Article/Blog Post SEO

For blog posts or articles with publish dates:

```typescript
export const metadata: Metadata = generateMetadata(
  {
    title: "Understanding Baptism",
    description: "A biblical perspective on baptism",
    url: "/blog/understanding-baptism",
    type: "article",
    article: {
      publishedTime: "2024-01-15T09:00:00Z",
      modifiedTime: "2024-01-20T14:30:00Z",
      authors: ["Pastor John Smith"],
      tags: ["Baptism", "Theology", "Church Practices"],
    },
  },
  defaultSEO,
);
```

## Dynamic Metadata (Server Components)

For dynamic routes, use `generateMetadata` function:

```typescript
// app/sermons/[slug]/page.tsx
import { generateMetadata as generateMeta } from "@/lib/seo";
import { defaultSEO } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch sermon data
  const sermon = await getSermon(params.slug);

  return generateMeta(
    {
      title: sermon.title,
      description: sermon.excerpt,
      url: `/sermons/${params.slug}`,
      images: [
        { url: sermon.thumbnail, width: 1200, height: 630, alt: sermon.title },
      ],
    },
    defaultSEO,
  );
}
```

## Robots and Indexing

### Allow Search Engines (Default)

```typescript
export const metadata: Metadata = generateMetadata(
  {
    title: "Contact Us",
    description: "Get in touch with our church",
    url: "/contact",
    // robots defaults to index: true, follow: true
  },
  defaultSEO,
);
```

### Prevent Indexing

```typescript
export const metadata: Metadata = generateMetadata(
  {
    title: "Member Dashboard",
    description: "Private member area",
    url: "/members",
    robots: {
      index: false,
      follow: false,
    },
  },
  defaultSEO,
);
```

## Structured Data (JSON-LD)

### Church Information

The church schema is automatically included in `app/layout.tsx`. Update `lib/site-config.ts` to modify church details.

### Custom Structured Data

For specific pages, you can add custom JSON-LD:

```typescript
// app/events/[id]/page.tsx
export default function EventPage({ event }) {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startDate,
    location: {
      "@type": "Place",
      name: "MH Bible Baptist Church",
      address: churchInfo.address,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {/* Page content */}
    </>
  );
}
```

## Twitter/X Configuration

Update Twitter handle in `lib/site-config.ts`:

```typescript
twitter: {
  card: "summary_large_image",
  site: "@yourchurchhandle",
  creator: "@yourchurchhandle",
}
```

## Verification Tags

Add search engine verification codes in page metadata:

```typescript
export const metadata: Metadata = generateMetadata(
  {
    title: "Home",
    description: "Welcome to our church",
    verification: {
      google: "your-google-site-verification-code",
      yandex: "your-yandex-verification-code",
    },
  },
  defaultSEO,
);
```

## Best Practices

1. **Titles**: Keep under 60 characters
2. **Descriptions**: Keep between 150-160 characters
3. **Images**: Always use 1200x630px for Open Graph images
4. **Keywords**: Use 5-10 relevant keywords per page
5. **URLs**: Use clean, descriptive paths (e.g., `/about` not `/page1`)
6. **Update Regularly**: Keep church info, service times, and contact details current

## Testing Your SEO

- **Open Graph**: Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter Cards**: Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **Rich Results**: Use [Google Rich Results Test](https://search.google.com/test/rich-results)
- **General SEO**: Use [Google Search Console](https://search.google.com/search-console)

## Example Pages

See these files for examples:

- `app/layout.tsx` - Root layout with default SEO and church schema
- `app/about/page.tsx` - Static page with custom SEO
- `lib/site-config.ts` - Site-wide configuration
