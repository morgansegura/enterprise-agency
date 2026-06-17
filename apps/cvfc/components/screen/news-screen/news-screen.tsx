import Link from "next/link";

import { Section } from "@/components/layout";
import { Image } from "@/components/ui";
import { Heading } from "@/components/feature/heading";
import { NewsList } from "@/components/feature/news-list";
import { PageHero } from "@/components/feature/page-hero";
import { NEWS_POSTS, getActiveNews } from "@/data/news";

import "./news-screen.css";

export function NewsScreen() {
  const all = getActiveNews(NEWS_POSTS);
  const [featured, ...rest] = all;

  return (
    <>
      <main>
        <PageHero
          eyebrow="News"
          heading="Stories from the club."
          description="Signings, championships, alumni news, and the small moments that shape a Tuesday training session. Stories from across the CVFC pathway."
        />

        {featured ? (
          <Section bg="white" size="default">
            <Link
              href={`/news/${featured.slug}`}
              className="news-featured group"
            >
              {featured.image ? (
                <div className="news-featured-image-wrap">
                  <Image
                    src={featured.image.src}
                    alt={featured.image.alt}
                    className="news-featured-image"
                  />
                </div>
              ) : null}
              <div className="news-featured-body">
                <p className="news-featured-eyebrow">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  Latest Story
                </p>
                <h2 className="news-featured-title">{featured.title}</h2>
                {featured.excerpt ? (
                  <p className="news-featured-excerpt">{featured.excerpt}</p>
                ) : null}
                <span className="news-featured-read">Read story →</span>
              </div>
            </Link>
          </Section>
        ) : null}

        {rest.length > 0 ? (
          <Section
            bg="bone"
            size="default"
            className="border-t border-(--color-gold)/30"
          >
            <Heading
              eyebrow="More from the Club"
              heading="Every story, in one place."
              headingSize="section"
              description={
                <p>
                  Recent signings, results, and updates from across the CVFC
                  pathway.
                </p>
              }
            />
            <NewsList className="mt-10" posts={rest} />
          </Section>
        ) : null}
      </main>
    </>
  );
}
