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

/** The /about hub page — page-hero + the "inside the club" card grid + callout. */
const ABOUT_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'About Chula Vista FC',
    heading: '44 years. One community. One crest.',
    description:
      'Since 1982, CVFC has been a hometown soccer club for South Bay families — coaches who stay, players who grow, and a 501(c)(3) nonprofit where every dollar goes back to the kids on the field.',
    background: 'white',
    actions: [
      { kind: 'evaluation', label: 'Request an Evaluation', variant: 'default' },
      {
        kind: 'link',
        label: 'Read our story',
        href: '/about/who-we-are',
        variant: 'outline',
      },
    ],
  },
  {
    blockType: 'iconCards',
    eyebrow: 'Inside the Club',
    heading: 'Get to know CVFC.',
    description:
      'Five places to start — the story, the people, the fields, and the voices that make Chula Vista FC.',
    background: 'bone',
    cards: [
      {
        iconToken: 'custom:torch',
        title: 'Who we are',
        description:
          'The story of CVFC — our mission, values, and the 44 years of South Bay families who built the club.',
        href: '/about/who-we-are',
      },
      {
        iconToken: 'custom:whistle',
        title: 'Coaching Staff',
        description:
          "Licensed coaches with experience across MLS NEXT, Elite Academy, college, and professional soccer — coached by people who've been there.",
        href: '/about/coaching-staff',
      },
      {
        iconToken: 'custom:soccer-desk',
        title: 'Administrators',
        description:
          'The directors and staff running the club day-to-day — registration, operations, and the work that keeps the pathway moving.',
        href: '/about/administrators',
      },
      {
        iconToken: 'custom:soccer-field',
        title: 'Facilities',
        description:
          'Where CVFC trains and plays — Victory Christian Academy, Hoover High School, Indoor Training Center, and community parks across the South Bay.',
        href: '/about/facilities',
      },
      {
        iconToken: 'custom:medal',
        title: 'Testimonials',
        description:
          'Parents, players, alumni, and coaches in their own words — what CVFC means on a Tuesday training session and on a Saturday match.',
        href: '/about/testimonials',
      },
      {
        iconToken: 'custom:trophy',
        title: 'News & Stories',
        description:
          'Pro signings, championships, alumni news, and the small moments that shape a Tuesday training session — from across the CVFC pathway.',
        href: '/news',
      },
      {
        iconToken: 'custom:tickets',
        title: 'Support the Club',
        description:
          'Donate, sponsor, or partner. Every gift to our 501(c)(3) goes back to the players, coaches, and fields here in the South Bay.',
        href: '/support',
      },
    ],
  },
  {
    blockType: 'callout',
    eyebrow: 'Come See For Yourself',
    heading: 'Walk a CVFC field this week.',
    variant: 'bone',
    body: "Reading about a club is one thing. Stepping onto a training pitch and meeting a coach is another. Submit an evaluation request and we'll be in touch within 48 hours — in English or Spanish.",
    cta: { label: 'Request an Evaluation', href: '/evaluations', variant: 'default' },
  },
]

/** Per-page SEO meta (title 30–60 chars, description ~120–160) for the CMS panel. */
const PAGE_META: Record<string, { title: string; description: string }> = {
  programs: {
    title: 'Programs & Pathways — Chula Vista FC',
    description:
      "From Mini Maestros at age 4 to MLS NEXT, Elite Academy, NPL, and DPL — Chula Vista FC's structured player development pathway across every age and ambition.",
  },
  about: {
    title: 'About Chula Vista FC — 44 Years of South Bay Soccer',
    description:
      "Chula Vista FC is South Bay San Diego's longest-running competitive soccer club, founded 1982. Meet the coaches, leadership, fields, and families behind it.",
  },
}

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

  // --- inner pages (find-or-create, idempotent, with per-page SEO meta) ---
  const upsertPage = async (
    slug: string,
    title: string,
    layout: unknown[],
    meta?: { title: string; description: string },
  ) => {
    const found = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: slug } }, { tenant: { equals: tenant.id } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const data = {
      layout: layout as never,
      _status: 'published' as const,
      ...(meta ? { meta } : {}),
    }
    if (found.docs[0]) {
      await payload.update({
        collection: 'pages',
        id: found.docs[0].id,
        data,
        depth: 0,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'pages',
        data: { title, slug, tenant: tenant.id, ...data },
        depth: 0,
        overrideAccess: true,
      })
    }
  }

  await upsertPage('programs', 'Programs & Pathways', PROGRAMS_LAYOUT, PAGE_META.programs)
  await upsertPage('about', 'About Chula Vista FC', ABOUT_LAYOUT, PAGE_META.about)

  console.log(
    `✓ Seeded cvfc home — welcomeBanner, faqSection (${faqSection.entries.length} Q&As), testimonialsSection (${testimonialsSection.testimonials.length}). Preserved ${kept.length} other block(s).`,
  )
  console.log('✓ Seeded cvfc /programs + /about (pageHero, iconCards, callout) with SEO meta.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
