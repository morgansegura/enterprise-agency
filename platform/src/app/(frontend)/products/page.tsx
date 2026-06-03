import { headers } from 'next/headers'

import { getProducts } from '@/lib/products'
import { resolveTenantByHost } from '@/lib/tenants'

type ProductCard = {
  id: string | number
  name?: string
  slug?: string
  price?: number | null
  image?: { url?: string | null; alt?: string | null } | number | string | null
}

export default async function ProductsPage() {
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  const products = (tenant ? await getProducts(tenant.id) : []) as ProductCard[]

  return (
    <main className="page">
      <section className="block">
        <h1 className="content-heading">Products</h1>
        {products.length ? (
          <div className="product-grid">
            {products.map((p) => {
              const img =
                p.image && typeof p.image === 'object' ? p.image : null
              return (
                <a
                  key={String(p.id)}
                  className="product-card"
                  href={`/products/${p.slug}`}
                >
                  {img?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="product-card-img"
                      src={img.url}
                      alt={img.alt ?? p.name ?? ''}
                    />
                  ) : null}
                  <h2 className="product-card-name">{p.name}</h2>
                  {typeof p.price === 'number' ? (
                    <p className="product-card-price">${p.price}</p>
                  ) : null}
                </a>
              )
            })}
          </div>
        ) : (
          <p className="content-body">No products yet.</p>
        )}
      </section>
    </main>
  )
}
