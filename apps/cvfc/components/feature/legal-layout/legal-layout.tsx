import { Section } from "@/components/layout";
import { Heading } from "@/components/feature/heading";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import "./legal-layout.css";

export type LegalSection = {
  id: string;
  heading: string;
  body: React.ReactNode;
};

type LegalLayoutProps = {
  className?: string;
  /** Hero eyebrow — CMS-overridable; defaults to "Legal". */
  eyebrow?: string;
  title: string;
  /** ISO date or display string like "April 2026". */
  lastUpdated: string;
  /** Optional intro paragraph above the sections. */
  intro?: React.ReactNode;
  sections: LegalSection[];
};

export function LegalLayout({
  className,
  eyebrow = "Legal",
  title,
  lastUpdated,
  intro,
  sections,
}: LegalLayoutProps) {
  return (
    <main className={cn("legal-layout", className)}>
      <Section
        bg="white"
        size="default"
        className="border-b border-(--color-gold-bright)/40"
      >
        <Heading
          eyebrow={eyebrow}
          heading={title}
          headingAs="h1"
          headingSize="display"
          description={
            <p className="legal-layout-meta">
              Last updated: <strong>{lastUpdated}</strong>
            </p>
          }
        />
      </Section>

      <Section bg="white" size="default">
        <article className="legal-layout-article">
          {intro ? <div className="legal-layout-intro">{intro}</div> : null}

          <nav className="legal-layout-toc" aria-label="Table of contents">
            <p className="legal-layout-toc-label">On this page</p>
            <ol className="legal-layout-toc-list">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.heading}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-layout-sections">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="legal-layout-section"
              >
                <h2 className="legal-layout-section-heading">
                  <span className="legal-layout-section-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </h2>
                <div className="legal-layout-section-body">{section.body}</div>
              </section>
            ))}
          </div>

          <footer className="legal-layout-footnote">
            <p>
              Questions about this {title.toLowerCase()}? Contact us at{" "}
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>{" "}
              or{" "}
              <a href={`tel:${siteConfig.contact.phone}`}>
                {siteConfig.contact.phone}
              </a>
              .
            </p>
            <p className="legal-layout-footnote-address">
              Chula Vista Fútbol Club · {siteConfig.address.streetAddress},{" "}
              {siteConfig.address.addressLocality},{" "}
              {siteConfig.address.addressRegion} {siteConfig.address.postalCode}
            </p>
          </footer>
        </article>
      </Section>
    </main>
  );
}
