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

/**
 * The /programs page layout. Image-bearing sections (mediaSplit) are added once
 * the photos are uploaded in the CMS — these three blocks need no uploads, so
 * the page renders cleanly straight from the seed.
 */
const PROGRAMS_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Programs & Pathways',
    heading: 'From first touch to college and pro.',
    description:
      'CVFC offers a clear, structured pathway from Mini Maestros at age 4 through MLS NEXT, Elite Academy, NPL, and DPL. Every stage builds technical skill, tactical understanding, and character — preparing players for top leagues, college programs, and beyond.',
    background: 'white',
    actions: [
      { kind: 'evaluation', label: 'Request an Evaluation', variant: 'default' },
      {
        kind: 'link',
        label: 'Learn About Tryouts',
        href: '/evaluations',
        variant: 'outline',
        iconToken: 'ri:badge',
      },
    ],
  },
  {
    blockType: 'iconCards',
    eyebrow: 'The Pathway',
    heading: 'Strategic Development Pathway',
    description:
      'Our goal is simple — to prepare and train every athlete to advance, building the skills, mindset, and passion needed to move up and succeed at each stage of the game.',
    background: 'bone',
    cards: [
      {
        iconToken: 'custom:soccer-ball',
        title: 'Foundations of the Game',
        description:
          'Where players begin their journey in programs like Mini Maestros and CVFC Youth. We focus on technical skills, coordination, and a love for the game, building the right attitude for future growth.',
      },
      {
        iconToken: 'custom:soccer-field',
        title: 'Growth and Development',
        description:
          'As players advance, training becomes more focused on tactical awareness, teamwork, and respect for the game. Our development stages prepare athletes for competitive play while keeping training fun and engaging.',
      },
      {
        iconToken: 'custom:medal',
        title: 'Competitive Readiness',
        description:
          'Players enter leagues that match their level, from the SoCal League Flight system to advanced programs like DPL, NPL, EA, and MLS NEXT. Here, unity and team culture drive performance and prepare athletes for higher challenges.',
      },
      {
        iconToken: 'custom:mountain-peak',
        title: 'Striving for Excellence',
        description:
          'For those ready to take the next step, this is where dreams become reality. Players showcase their talent where it matters most — in front of college recruiters and professional academy scouts.',
      },
    ],
  },
  {
    blockType: 'callout',
    eyebrow: 'Take the First Step',
    heading: 'Ready to play for Chula Vista?',
    variant: 'bone',
    body: "Choose your player's date of birth and gender, complete the registration, and a CVFC coach will be in touch with your tryout invitation.",
    cta: { label: 'Request an Evaluation', href: '/evaluations', variant: 'default' },
  },
]

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

  // --- /programs page (find-or-create) ---
  const programsExisting = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: 'programs' } }, { tenant: { equals: tenant.id } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const programsPage = programsExisting.docs[0]
  if (programsPage) {
    await payload.update({
      collection: 'pages',
      id: programsPage.id,
      data: { layout: PROGRAMS_LAYOUT as never, _status: 'published' },
      depth: 0,
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Programs & Pathways',
        slug: 'programs',
        tenant: tenant.id,
        layout: PROGRAMS_LAYOUT as never,
        _status: 'published',
      },
      depth: 0,
      overrideAccess: true,
    })
  }

  console.log(
    `✓ Seeded cvfc home — welcomeBanner, faqSection (${faqSection.entries.length} Q&As), testimonialsSection (${testimonialsSection.testimonials.length}). Preserved ${kept.length} other block(s).`,
  )
  console.log(
    `✓ Seeded cvfc /programs — pageHero, iconCards (4), callout. Add media-splits after uploading their photos.`,
  )
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
