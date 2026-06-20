/**
 * Seed the cvfc home page's CMS blocks from the front-end's static content, so
 * the content actually lives in the CMS (editable) instead of only in code.
 *
 *   Run locally (needs the CMS env — DATABASE_URI, PAYLOAD_SECRET, R2_*):
 *     bun run seed:cvfc
 *
 * Idempotent: it replaces the blocks it manages (welcomeBanner / faqSection /
 * testimonialsSection) and PRESERVES everything else (e.g. the hero you built).
 * Images aren't seeded — upload those in the CMS (they go to R2 = your LCP win).
 *
 * Excluded from typecheck (tsconfig) — it's a runtime script, and it imports the
 * FE data files directly so there's a single source of content.
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import { FAQ_ENTRIES } from '../../../cvfc/data/faq'
import { TESTIMONIALS } from '../../../cvfc/data/testimonials'

const WELCOME_BODY =
  "Since 1982, Chula Vista FC has been dedicated and driven by a passion for developing players as athletes and as people. We're committed to providing the highest level of training, mentorship, and opportunity so every player can reach their full potential in the game and in life. Our passion lies in helping athletes grow, fostering a love for playing beautiful football, and creating opportunities for every player to reach their highest potential."

const MANAGED = new Set(['welcomeBanner', 'faqSection', 'testimonialsSection'])

async function seed() {
  const payload = await getPayload({ config })

  const tenants = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: 'cvfc' } },
    limit: 1,
    overrideAccess: true,
  })
  const tenant = tenants.docs[0]
  if (!tenant) {
    console.error('✗ cvfc tenant not found — create it in the CMS first.')
    process.exit(1)
  }

  const pages = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: 'home' } }, { tenant: { equals: tenant.id } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const page = pages.docs[0]
  if (!page) {
    console.error('✗ cvfc "home" page not found — create it in the CMS first.')
    process.exit(1)
  }

  const existing = Array.isArray(page.layout) ? page.layout : []
  const kept = existing.filter((b) => !MANAGED.has((b as { blockType?: string }).blockType ?? ''))

  const welcomeBanner = {
    blockType: 'welcomeBanner',
    eyebrow: 'Since 1982',
    heading: 'Welcome to Chula Vista Fútbol Club',
    body: WELCOME_BODY,
  }

  const faqSection = {
    blockType: 'faqSection',
    heading: 'Questions from our community.',
    entries: FAQ_ENTRIES.map((e) => ({
      category: e.category,
      question: e.question,
      answer: e.answer,
    })),
  }

  const testimonialsSection = {
    blockType: 'testimonialsSection',
    testimonials: TESTIMONIALS.map((t) => ({
      quote: t.quote,
      author: t.author,
      role: t.role,
    })),
  }

  await payload.update({
    collection: 'pages',
    id: page.id,
    data: {
      layout: [...kept, welcomeBanner, faqSection, testimonialsSection],
      _status: 'published',
    },
    depth: 0,
    overrideAccess: true,
  })

  console.log(
    `✓ Seeded cvfc home — welcomeBanner, faqSection (${faqSection.entries.length} Q&As), testimonialsSection (${testimonialsSection.testimonials.length}). Preserved ${kept.length} other block(s). Upload images in the CMS.`,
  )
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
