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
import { getFeaturedCoaches } from '../../../cvfc/data/coaches'

const WELCOME_BODY =
  "Since 1982, Chula Vista FC has been dedicated and driven by a passion for developing players as athletes and as people. We're committed to providing the highest level of training, mentorship, and opportunity so every player can reach their full potential in the game and in life. Our passion lies in helping athletes grow, fostering a love for playing beautiful football, and creating opportunities for every player to reach their highest potential."

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

/** Default development-pathway cards (shared by landing + programs iconCards). */
const PATHWAY_CARDS = [
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
]

const PHOTO = 'https://chulavistafc.com/wp-content/uploads'

/**
 * The full landing layout (everything EXCEPT the hero, which is preserved from
 * the CMS so its R2 image uploads survive). Rich `<strong>` bodies are seeded as
 * plain text for now — rich-text upgrade is tracked separately. Images use the
 * external-URL escape-hatch (imageUrl); swap to R2 uploads in the CMS later.
 */
const LANDING_BLOCKS = [
  {
    blockType: 'welcomeBanner',
    eyebrow: 'Since 1982',
    heading: 'Welcome to Chula Vista Fútbol Club',
    body: WELCOME_BODY,
  },
  {
    blockType: 'iconCards',
    eyebrow: 'Our Values',
    heading: 'Passion. Unity. Respect. Attitude.',
    description: 'Creating champions on the field and leaders in life. P.U.R.A.',
    background: 'white',
    cards: [
      {
        title: 'Passion',
        description:
          'Love the game. Love the work. Love the journey. The players who go furthest are the ones who care most.',
      },
      {
        title: 'Unity',
        description:
          'We rise together. The team is always larger than the player, and the club is always larger than the team.',
      },
      {
        title: 'Respect',
        description:
          'For your teammates, your coaches, your opponents, and yourself. The foundation everything else is built on.',
      },
      {
        title: 'Attitude',
        description:
          'Show up ready to learn, ready to work, and ready to grow — every practice, every match, every moment.',
      },
    ],
  },
  {
    blockType: 'callout',
    eyebrow: 'Open Year-Round',
    heading: 'Did you know?',
    variant: 'midnight',
    body: "Even if our tryouts have ended, players can still be evaluated on an individual basis. Chula Vista FC offers individual evaluations for players who are new to the area or missed official tryout dates. Our comprehensive evaluation system is tailored to each player's level, style, and needs, with the goal of helping every athlete reach their full potential both on and off the field.",
  },
  {
    blockType: 'iconCards',
    eyebrow: 'The Pathway',
    heading: 'Strategic Development Pathway',
    description:
      'Our goal is simple — to prepare and train every athlete to advance, building the skills, mindset, and passion needed to move up and succeed at each stage of the game.',
    background: 'bone',
    cards: PATHWAY_CARDS,
    cta: {
      label: 'CVFC Development Pathways',
      href: '/programs',
      variant: 'secondary',
      iconToken: 'ri:soccer-ball',
    },
  },
  {
    blockType: 'mediaSplit',
    eyebrow: 'Player Development',
    heading: 'Foundations of the Game',
    body: 'From our Mini Maestros to CVFC Youth teams, Chula Vista FC builds a strong foundation for future success. Our youngest players learn the game through fun, engaging, and skill-focused sessions, while developing the confidence, discipline, and technique needed to thrive as they progress through our development pathway.',
    imageUrl: `${PHOTO}/2024/02/TurnerMedia-5199-scaled-e1707609763493.jpg`,
    imageAlt: 'Mini Maestros training',
    tags: [{ label: 'Mini Maestros' }, { label: 'CVFC Youth' }, { label: 'Ages 4–9' }],
    buttons: [
      {
        label: 'More about Foundations',
        href: '/programs/foundations',
        variant: 'secondary',
        iconToken: 'ri:soccer-ball',
      },
    ],
  },
  {
    blockType: 'mediaSplit',
    eyebrow: 'Goalkeeper Pathway',
    heading: 'Goalkeeper Pathway',
    background: 'white',
    reverse: true,
    body: 'From the youngest age groups to elite competition, our goalkeeper pathway provides specialized training at every stage. Players develop technical skills, tactical awareness, and mental resilience under expert guidance. The goal is clear — prepare keepers to excel at the highest levels of club, college, and professional play.',
    imageUrl: `${PHOTO}/2023/11/Goalkeepers-pic.jpg`,
    imageAlt: 'CVFC goalkeepers in training',
    tags: [
      { label: 'Specialty Training' },
      { label: 'All Ages' },
      { label: 'College/Pro Pathway' },
    ],
    buttons: [
      {
        label: 'Request an Evaluation',
        href: '/evaluations',
        variant: 'outline',
        iconToken: 'ri:badge',
      },
      {
        label: 'Goalkeepers',
        href: '/programs/goalkeeper-pathway',
        variant: 'secondary',
        iconToken: 'ri:soccer-ball',
      },
    ],
  },
  {
    blockType: 'mediaSplit',
    eyebrow: 'Girls Competitive Pathway',
    heading: 'Girls Competitive Pathway',
    body: "Chula Vista FC is proud to offer elite opportunities for our female athletes, including NPL and DPL competition, with Girl's Academy (GA) and GA Aspire coming soon. We also compete in the SoCal League Flight system, giving players the perfect level of competition to match their development. These top-tier leagues and pathways ensure our players receive the highest level of training, competition, and exposure — helping them reach their full potential on and off the field.",
    imageUrl: `${PHOTO}/2024/02/IMG_6349.jpg`,
    imageAlt: 'CVFC girls competitive player',
    tags: [
      { label: 'SoCal Flight' },
      { label: 'NPL' },
      { label: 'DPL' },
      { label: 'GA Aspire' },
      { label: 'GA' },
    ],
    buttons: [
      {
        label: 'Request an Evaluation',
        href: '/evaluations',
        variant: 'outline',
        iconToken: 'ri:badge',
      },
      {
        label: "Girl's Pathway",
        href: '/programs/girls-competitive-pathway',
        variant: 'secondary',
        iconToken: 'ri:soccer-ball',
      },
    ],
  },
  {
    blockType: 'mediaSplit',
    eyebrow: 'Boys Competitive Pathway',
    heading: 'Boys Competitive Pathway',
    background: 'white',
    reverse: true,
    body: 'Chula Vista FC offers one of the strongest competitive pathways for boys in Southern California, featuring MLS NEXT and MLS NEXT 2, along with Elite Academy (EA) and EA 2. We also compete in the SoCal League Flight system, providing the right level of competition for every stage of development. These platforms give our players elite training, top-level competition, and national exposure — preparing them to excel at the highest levels of the game.',
    imageUrl: `${PHOTO}/2024/05/IMG_0867.jpg`,
    imageAlt: 'CVFC boys competitive team',
    tags: [
      { label: 'SoCal Flight' },
      { label: 'EA 2' },
      { label: 'EA' },
      { label: 'MLS NEXT 2' },
      { label: 'MLS NEXT' },
    ],
    buttons: [
      {
        label: 'Request an Evaluation',
        href: '/evaluations',
        variant: 'outline',
        iconToken: 'ri:badge',
      },
      {
        label: "Boy's Pathway",
        href: '/programs/boys-competitive-pathway',
        variant: 'secondary',
        iconToken: 'ri:soccer-ball',
      },
    ],
  },
  {
    blockType: 'statBand',
    eyebrow: 'By the Numbers',
    heading: 'Built to compete. Trained to win.',
    description:
      "The pathway delivers — measured by championships earned, professional contracts signed, and the families who've trusted Chula Vista FC since 1982.",
    variant: 'midnight',
    stats: [
      { value: '40+', label: 'Years of Development' },
      { value: '7+', label: 'Recent Pro Signings' },
      { value: '5+', label: 'Recent Championships' },
      { value: '30+', label: 'Coaches on Staff' },
    ],
    highlights: [
      {
        tag: 'Champions',
        title: 'B2014 Tuilla — SoCal State Cup Champions',
        body: "CVFC's Tuilla program lifted the latest SoCal State Cup, the club's most recent State Cup title.",
      },
      {
        tag: 'Pro Signing',
        title: 'Gavin Jestand → MLS Colorado Rapids',
        body: 'From the CVFC pathway to a professional MLS contract.',
      },
      {
        tag: 'Pro Signing',
        title: 'Quincy Lamar → FC Dallas',
        body: "An MLS NEXT pathway success — CVFC alumnus signs with one of MLS's premier player-development academies.",
      },
      {
        tag: 'Pro Signing',
        title: 'Joaquin Jackson → Atlas FC Academy',
        body: 'B2009 player crosses into Liga MX — joining the Atlas FC academy in Guadalajara.',
      },
      {
        tag: 'Girls Pathway',
        title: 'G2009 Academy — Undefeated NPL Run',
        body: 'Kareli Rascon and the G2009 squad finished 7-0-5 in NPL play — proof of the Girls Pathway delivering on the field.',
      },
      {
        tag: 'Scholar-Athlete',
        title: 'Hannah Gomez — 4.0 GPA & All-Star',
        body: 'G2009 Academy multi-sport athlete: top NPL play, all-star field hockey honors, and a 4.0 in the classroom.',
      },
    ],
    footnote:
      'CVFC alumni have signed with MLS Colorado Rapids, FC Dallas, Atlas FC Academy, Club Tijuana, and Club Rayados de Monterrey — competing through MLS NEXT, Elite Academy (EA), DPL, NPL, the Southwest Premier League, and the Lamar Hunt US Open Cup.',
  },
  {
    blockType: 'portraitGrid',
    eyebrow: 'Coaching Staff',
    heading: "Coached by people who've been there.",
    description:
      'From former pro players to lifelong CVFC alumni, our staff brings real experience to every training session — and a deep commitment to developing the whole player.',
    background: 'white',
    people: getFeaturedCoaches().map((c) => ({
      name: c.name,
      role: c.title,
      credential: c.credentials?.join(' · '),
      imageUrl: c.image?.src,
    })),
    cta: {
      label: 'Meet the Full Coaching Staff',
      href: '/about/coaching-staff',
      variant: 'secondary',
      iconToken: 'ri:soccer-ball',
    },
  },
  {
    blockType: 'testimonialsSection',
    testimonials: TESTIMONIALS.map((t) => ({
      quote: t.quote,
      author: t.author,
      role: t.role,
    })),
  },
  {
    blockType: 'faqSection',
    heading: 'Questions from our community.',
    entries: FAQ_ENTRIES.map((e) => ({
      category: e.category,
      question: e.question,
      answer: e.answer,
    })),
  },
  {
    blockType: 'callout',
    eyebrow: 'Take the First Step',
    heading: 'Ready to play for Chula Vista?',
    variant: 'bone',
    body: "Whether you're new to the area, switching from another club, or ready to level up — we'd love to meet your player. CVFC has been here since 1982, with a full pathway from Mini Maestros to MLS NEXT, Elite Academy, DPL, and NPL. Request an evaluation and a coach will follow up within 48 hours.",
    cta: { label: 'Request an Evaluation', href: '/evaluations', variant: 'default' },
  },
]

/** Per-page SEO meta (title 30–60 chars, description ~120–160) for the CMS panel. */
const PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Chula Vista FC — South Bay Youth Soccer Since 1982',
    description:
      'Chula Vista FC develops players from Mini Maestros to MLS NEXT, Elite Academy, NPL, and DPL. A 44-year South Bay club shaping players and inspiring futures.',
  },
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

  // Preserve the hero (keeps its R2 image uploads); seed the full landing in order.
  const existing = Array.isArray(page.layout) ? page.layout : []
  const hero = existing.find((b) => (b as { blockType?: string }).blockType === 'hero')
  const homeLayout = [...(hero ? [hero] : []), ...LANDING_BLOCKS]

  await payload.update({
    collection: 'pages',
    id: page.id,
    data: {
      layout: homeLayout as never,
      _status: 'published',
      meta: PAGE_META.home,
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
    `✓ Seeded cvfc home — full landing (${homeLayout.length} blocks${hero ? ', hero preserved' : ''}).`,
  )
  console.log('✓ Seeded cvfc /programs + /about (pageHero, iconCards, callout) with SEO meta.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
