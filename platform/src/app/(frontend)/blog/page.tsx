import { headers } from 'next/headers'

import { getPosts } from '@/lib/posts'
import { resolveTenantByHost } from '@/lib/tenants'

type PostCard = {
  id: string | number
  title?: string
  slug?: string
  excerpt?: string
  publishedAt?: string
  coverImage?: { url?: string; alt?: string } | number | string | null
}

export default async function BlogPage() {
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  const posts = (tenant ? await getPosts(tenant.id) : []) as PostCard[]

  return (
    <main className="page">
      <section className="block">
        <h1 className="content-heading">Blog</h1>
        {posts.length ? (
          <div className="post-grid">
            {posts.map((p) => {
              const img =
                p.coverImage && typeof p.coverImage === 'object'
                  ? p.coverImage
                  : null
              return (
                <a
                  key={String(p.id)}
                  className="post-card"
                  href={`/blog/${p.slug}`}
                >
                  {img?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="post-card-img"
                      src={img.url}
                      alt={img.alt ?? p.title ?? ''}
                    />
                  ) : null}
                  <h2 className="post-card-title">{p.title}</h2>
                  {p.publishedAt ? (
                    <p className="post-card-date">
                      {new Date(p.publishedAt).toLocaleDateString()}
                    </p>
                  ) : null}
                  {p.excerpt ? (
                    <p className="post-card-excerpt">{p.excerpt}</p>
                  ) : null}
                </a>
              )
            })}
          </div>
        ) : (
          <p className="content-body">No posts yet.</p>
        )}
      </section>
    </main>
  )
}
