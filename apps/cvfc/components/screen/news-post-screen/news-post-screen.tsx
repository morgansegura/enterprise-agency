import Link from "next/link";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout";
import { Button, Image } from "@/components/ui";
import { Icon } from "@/components/icon";
import { NewsCard } from "@/components/feature/news-card";
import { JsonLd } from "@/components/seo";
import { NEWS_POSTS, getActiveNews, getPostBySlug } from "@/data/news";
import { getCmsPostBySlug, getCmsPosts } from "@/lib/cms";
import { cmsPostToNewsPost } from "@/lib/cms-news";
import { breadcrumbSchema, newsArticleSchema } from "@/lib/schema";

import "./news-post-screen.css";

type NewsPostScreenProps = {
  slug: string;
};

export async function NewsPostScreen({ slug }: NewsPostScreenProps) {
  const cmsPost = await getCmsPostBySlug(slug);
  const post = cmsPost
    ? cmsPostToNewsPost(cmsPost)
    : getPostBySlug(NEWS_POSTS, slug);
  if (!post) notFound();

  const cmsAll = (await getCmsPosts())
    .map(cmsPostToNewsPost)
    .filter((p) => p.title);
  const pool = cmsAll.length ? cmsAll : getActiveNews(NEWS_POSTS);
  const related = pool.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          newsArticleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "News", path: "/news" },
            { name: post.title, path: `/news/${post.slug}` },
          ]),
        ]}
      />
      <main>
        <article className="news-post">
          <Section bg="white" size="hero" className="!pb-0">
            <header className="news-post-header">
              <p className="news-post-eyebrow">
                <span className="eyebrow-rule" aria-hidden="true" />
                Chula Vista FC
              </p>
              <h1 className="news-post-title">{post.title}</h1>
            </header>
          </Section>

          <Section bg="white" size="default" className="max-md:py-10">
            {post.image ? (
              <div className="news-post-image-wrap">
                <Image
                  src={post.image.src}
                  alt={post.image.alt}
                  className="news-post-image"
                />
              </div>
            ) : null}
            <div
              className="news-post-body prose-cvfc"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </Section>
        </article>

        {related.length > 0 ? (
          <Section
            bg="bone"
            size="default"
            className="border-t border-(--color-gold)/30"
          >
            <div className="news-related-head">
              <p className="news-related-eyebrow">
                <span className="eyebrow-rule" aria-hidden="true" />
                Keep Reading
              </p>
              <h2 className="news-related-heading">More from CVFC.</h2>
            </div>
            <ul className="news-related-grid">
              {related.map((p) => (
                <li key={p.id} className="news-related-item">
                  <NewsCard post={p} />
                </li>
              ))}
            </ul>
            <div className="news-related-cta">
              <Button variant="outline" render={<Link href="/news" />}>
                <span>See More News</span>
                <Icon token="ri:arrow-right" aria-hidden="true" />
              </Button>
            </div>
          </Section>
        ) : null}
      </main>
    </>
  );
}
