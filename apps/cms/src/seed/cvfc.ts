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
import { COACHES, getActiveCoaches, getFeaturedCoaches } from '../../../cvfc/data/coaches'
import { ADMINISTRATORS, getActiveAdministrators } from '../../../cvfc/data/administrators'
import { NEWS_POSTS, getActiveNews } from '../../../cvfc/data/news'
import { FACILITIES } from '../../../cvfc/data/facilities'
import { htmlToLexical } from './html-to-lexical'

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
    cta: {
      kind: 'evaluation',
      label: 'Request an Evaluation',
      href: '/evaluations',
      variant: 'default',
    },
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
    cta: {
      kind: 'evaluation',
      label: 'Request an Evaluation',
      href: '/evaluations',
      variant: 'default',
    },
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
    cta: {
      kind: 'evaluation',
      label: 'Request an Evaluation',
      href: '/evaluations',
      variant: 'default',
    },
  },
]

/** /about/who-we-are — pure block composition (validates the headingSection block). */
const WHO_WE_ARE_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Who We Are',
    heading: 'A youth soccer club, started in 1982.',
    description:
      'Chula Vista FC develops boys and girls from every walk of life into competitors at the highest levels of youth, college, and professional soccer — and into people who carry the work into the rest of their lives.',
    background: 'white',
    actions: [{ kind: 'evaluation', label: 'Request an Evaluation', variant: 'default' }],
  },
  {
    blockType: 'welcomeBanner',
    eyebrow: 'Since 1982',
    heading: 'Built by the community, for the community.',
    imageUrl: '/media/image/image-cvfc-founders.png',
    body: "Established in 1982, Chula Vista FC has been in the upper echelon of clubs in the South Bay area for over 40 years. As a member of the MLS Next League and Elite Academy League, we offer the highest standards and level of play at the youth level in San Diego under our core values of attitude, unity, respect, and passion.\n\nSince the club's beginnings, many changes have been made to foster and improve the development of players while maintaining a strong culture of local community identity. The goal for us is clear — to provide its members with value and for Chula Vista FC to continue functioning as one of the most professional clubs in the United States.",
  },
  {
    blockType: 'iconCards',
    eyebrow: 'Our Values',
    heading: 'Passion. Unity. Respect. Attitude.',
    description: 'Creating champions on the field and leaders in life.',
    background: 'white',
    cards: [
      {
        title: 'Attitude',
        description:
          'Show up ready to learn, ready to work, and ready to grow — every practice, every match, every moment.',
      },
      {
        title: 'Respect',
        description:
          'For your teammates, your coaches, your opponents, and yourself. The foundation everything else is built on.',
      },
      {
        title: 'Unity',
        description:
          'We rise together. The team is always larger than the player, and the club is always larger than the team.',
      },
      {
        title: 'Passion',
        description:
          'Love the game. Love the work. Love the journey. The players who go furthest are the ones who care most.',
      },
    ],
  },
  {
    blockType: 'mediaSplit',
    eyebrow: 'The Mission',
    heading: 'The work is the same for every player who walks in.',
    body: "That's the work — and it has been since 1982. Chula Vista FC was founded in the South Bay and we're still rooted here, but the gate has always been open. Families come to us from across San Diego County, the Imperial Valley, the border region, and beyond. We measure players by what they're willing to do, not where they're coming from.\n\nRecent partnerships extend that reach: in 2025, San Diego FC partnered with Chula Vista FC to help grow the beautiful game across the region. In 2024, CVFC joined a campaign to improve soccer fields throughout Chula Vista — investing in the infrastructure the next generation of players will share.",
    imageUrl: `${PHOTO}/2024/05/IMG_0867.jpg`,
    imageAlt: 'Chula Vista FC players in competition',
    tags: [
      { label: 'Boys & Girls' },
      { label: 'Every Player' },
      { label: 'San Diego FC Partnership' },
    ],
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Cultural Continuity',
    heading: 'Former players giving back',
    background: 'white',
    headingSize: 'section',
    body: "Some of our coaches once wore the same crest they now teach under. Fernando Mares, our Assistant Academy Director, played for CVFC from 2000 to 2010 before returning as a coach. Mathias Medel, our Director of Mini Maestros, played his entire life with the club. Javier Castorena wore the Chula Vista Pumas shirt (now CVFC) from 1999 to 2008.\n\nThat continuity matters. Coaches who came up through the pathway understand it. They mentor with the perspective of having walked the same field as the players in front of them — and they carry the club's identity forward.",
    cta: {
      label: 'Meet the Coaching Staff',
      href: '/about/coaching-staff',
      variant: 'secondary',
      iconToken: 'ri:soccer-ball',
    },
  },
  {
    blockType: 'statBand',
    eyebrow: 'By the Numbers',
    heading: 'Inside Chula Vista FC.',
    description:
      "Championships earned, professional contracts signed, and the families who've trusted Chula Vista FC across four decades.",
    variant: 'midnight',
    stats: [
      { value: '40+', label: 'Years Developing Players' },
      { value: '5', label: 'Active Pathways' },
      { value: '8+', label: 'Leagues & Programs' },
      { value: '30+', label: 'Licensed Coaches' },
    ],
    highlights: [
      {
        tag: 'Generational',
        title: 'Players who came back to give it back',
        body: 'Coaches like Fernando Mares (CVFC 2000–2010), Mathias Medel (lifelong), and Javier Castorena (Chula Vista Pumas 1999–2008) returned to coach the next generation in the same shirt they grew up in.',
      },
      {
        tag: 'All in One Club',
        title: 'Boys, girls, goalkeepers — all under one roof',
        body: 'MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, NPL, DPL, GA Aspire (coming), and Foundations from age four. One club, every pathway.',
      },
      {
        tag: 'Across Borders',
        title: 'Players moving to MLS and Liga MX',
        body: 'Recent CVFC alumni have signed with MLS Colorado Rapids, FC Dallas, Atlas FC Academy, Club Tijuana, and Club Rayados de Monterrey.',
      },
      {
        tag: 'MLS Partner',
        title: 'Trusted by an MLS expansion club',
        body: 'San Diego FC partnered with Chula Vista FC to help grow the beautiful game across the region.',
      },
      {
        tag: 'US Soccer',
        title: 'Hosted a US Soccer Talent ID Center',
        body: "US Soccer chose CVFC to host a Talent ID Center in Santee — recognition of the development environment we've built.",
      },
      {
        tag: 'Coaching',
        title: 'USSF B minimum. USSF A and UEFA on staff.',
        body: 'Every MLS NEXT head coach holds at least a USSF B License — and the staff also includes USSF A license holders. Academy Director J. Hector Diaz holds a UEFA C License earned in Scotland.',
      },
      {
        tag: 'Collegiate',
        title: 'Alumni continuing to college soccer',
        body: 'CVFC players have moved on to NCAA programs including Cal Poly San Luis Obispo (full scholarship), San Diego State University, Point Loma Nazarene, UC Riverside, and more.',
      },
      {
        tag: 'First Team',
        title: 'An adult First Team that competes',
        body: "CVFC's First Team has won the Southwest Premier League, advanced through the Lamar Hunt US Open Cup qualifying rounds, and reached NISA semifinals — giving senior players a real competitive ceiling at the club.",
      },
      {
        tag: 'From Day One',
        title: 'A pathway from age four',
        body: 'Players can start with Mini Maestros at age four and stay all the way through MLS NEXT, EA, NPL, or DPL — without ever changing clubs.',
      },
    ],
    footnote:
      'CVFC alumni have signed with MLS Colorado Rapids, FC Dallas, Austin FC, Atlas FC Academy, Club Tijuana, Club Rayados de Monterrey, and Barça Academy Arizona — and have represented the US National Team and the Mexican National Team. Competing through MLS NEXT, Elite Academy, NPL, DPL, the Southwest Premier League, and the Lamar Hunt US Open Cup.',
  },
  {
    blockType: 'callout',
    eyebrow: 'Be Part of the Next 40 Years',
    heading: "Join the South Bay's premier youth soccer club.",
    variant: 'bone',
    body: 'Whether your player is just getting started in Mini Maestros or ready to compete in MLS NEXT, the path begins with a conversation. Request an evaluation and a CVFC coach will be in touch.',
    cta: {
      kind: 'evaluation',
      label: 'Request an Evaluation',
      href: '/evaluations',
      variant: 'default',
    },
  },
]

const EVAL_HERO_ACTIONS = [
  { kind: 'evaluation', label: 'Request an Evaluation', variant: 'default' },
  { kind: 'link', label: 'Learn About Tryouts', href: '/evaluations', variant: 'outline' },
]
const EVAL_CALLOUT_CTA = {
  kind: 'evaluation',
  label: 'Request an Evaluation',
  href: '/evaluations',
  variant: 'default',
}
const STAFF_CTA = {
  label: 'Meet the Coaching Staff',
  href: '/about/coaching-staff',
  variant: 'secondary',
  iconToken: 'ri:soccer-ball',
}

/** /programs/foundations */
const FOUNDATIONS_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Foundations',
    heading: 'Soccer starts here.',
    description:
      'Foundations is where every CVFC pathway begins — Mini Maestros and CVFC Youth for ages 4 through 9. Technique first, fun first. The skills that carry a player through MLS NEXT, college, and the rest of life all start in this tier.',
    background: 'white',
    actions: EVAL_HERO_ACTIONS,
  },
  {
    blockType: 'mediaSplit',
    eyebrow: 'Player Development',
    heading: 'Technique is #1.',
    body: "Foundations players come to us as four-year-olds and leave at nine ready for competitive tryouts. The job in those years isn't winning — it's ball mastery, dribbling, shooting, and 1v1 attacking and defending. Build the skills first, and confidence follows.\n\nOur Foundations program is COED, runs Monday through Wednesday with matches on Saturdays, and rotates new technical content every week. New families are welcome year-round.",
    imageUrl: `${PHOTO}/2024/02/TurnerMedia-5199-scaled-e1707609763493.jpg`,
    imageAlt: 'Mini Maestros training',
    tags: [{ label: 'Ages 4–9' }, { label: 'Mini Maestros' }, { label: 'CVFC Youth' }],
  },
  {
    blockType: 'iconCards',
    eyebrow: 'The Foundations Tier',
    heading: 'From first touch to first competitive year.',
    description: 'Four divisions, one progression. Each step prepares players for the next.',
    background: 'white',
    cards: [
      {
        iconToken: 'custom:soccer-ball',
        title: 'Super Juniors',
        description:
          'Ages 4–5 (born 2021–2022). First introduction to the ball, coordination, and the joy of the game.',
      },
      {
        iconToken: 'custom:cleats',
        title: 'Juniors',
        description:
          'Age 6 (born 2020). Ball mastery and 1v1 confidence. Saturday matches start to feel like real soccer.',
      },
      {
        iconToken: 'custom:soccer-field',
        title: 'U8 Mini Maestros',
        description:
          'Ages 7–8 (born 2018–2019). Technical content rotates weekly. Players begin learning shape, spacing, and decision-making.',
      },
      {
        iconToken: 'custom:bullseye',
        title: 'CVFC Youth (U9)',
        description:
          'Age 9 (born 2017). The bridge into competitive play. Ready to try out for boys, girls, or goalkeeper pathways at U10.',
      },
    ],
  },
  {
    blockType: 'headingSection',
    eyebrow: 'The Pathway',
    heading: 'Where Foundations leads.',
    background: 'bone',
    headingSize: 'section',
    body: "At U10, Foundations players try out for one of three competitive pathways: Boys (MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, SoCal Flight), Girls (DPL, NPL, GA Aspire, SoCal Flight), or the Goalkeeper pathway. Every competitive pathway leads to college recruiting visibility, and a few alumni go on to sign professional contracts with MLS clubs and Liga MX academies.\n\nMost of our Foundations players won't turn pro. That was never the point. They'll learn how to compete, how to lose and come back, how to lead a teammate, and how to keep showing up — skills that matter long after the last whistle blows.",
    cta: {
      label: 'Explore the Pathway',
      href: '/programs',
      variant: 'secondary',
      iconToken: 'ri:soccer-ball',
    },
  },
  {
    blockType: 'callout',
    eyebrow: 'Get Started',
    heading: 'Bring your player out.',
    variant: 'bone',
    body: "Foundations welcomes new families year-round. Choose your player's pathway and birth year, and a CVFC coach will be in touch with the next step.",
    cta: EVAL_CALLOUT_CTA,
  },
]

/** /programs/goalkeeper-pathway */
const GOALKEEPER_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Goalkeeper Pathway',
    heading: 'Specialized training for the most specialized position.',
    description:
      'Goalkeeper is a different sport. Chula Vista FC has a dedicated goalkeeping staff — including a former Mexican Third Division goalkeeper, a Cal Poly San Luis Obispo scholarship alumnus, and an MLS NEXT goalkeeping coach — running specialty sessions at every age.',
    background: 'white',
    actions: EVAL_HERO_ACTIONS,
  },
  {
    blockType: 'mediaSplit',
    eyebrow: 'Why a Specialty Pathway',
    heading: 'The position demands its own curriculum.',
    body: "A keeper's development happens differently than an outfield player's. Footwork, handling, distribution, shot-stopping technique, decision-making in the box, and the mental game all need their own time on the training ground — not just whatever's left over at the end of a team session.\n\nOur goalkeepers train alongside their pathway team (Foundations, Boys, Girls, MLS NEXT, DPL, etc.) but get dedicated GK sessions led by goalkeeping specialists. That's how a CVFC keeper develops the technical foundation, tactical awareness, and mental resilience to excel at club, college, and professional levels.",
    imageUrl: `${PHOTO}/2023/11/Goalkeepers-pic.jpg`,
    imageAlt: 'CVFC goalkeepers in training',
    tags: [{ label: 'All Ages' }, { label: 'MLS NEXT GK Coach' }, { label: 'College Pathway' }],
  },
  {
    blockType: 'iconCards',
    eyebrow: 'What GK Training Builds',
    heading: 'The four pillars of a CVFC keeper.',
    description:
      'Specialty training is technical, tactical, mental, and physical — all four developed in parallel from first touch through senior soccer.',
    background: 'white',
    cards: [
      {
        iconToken: 'custom:cleats',
        title: 'Technical Foundation',
        description:
          'Handling, footwork, set position, diving, crossing, and distribution. The fundamentals every keeper rebuilds at every age.',
      },
      {
        iconToken: 'custom:soccer-field',
        title: 'Tactical Awareness',
        description:
          'Reading the game, organizing the back line, decision-making in the box, and playing out from the back in the modern style.',
      },
      {
        iconToken: 'custom:bullseye',
        title: 'Mental Resilience',
        description:
          'The keeper position is mostly mental. Confidence after a mistake, focus through long stretches, and the willingness to be the loudest voice on the field.',
      },
      {
        iconToken: 'custom:speed-bike',
        title: 'Athletic Development',
        description:
          'Explosive power, reaction speed, and the conditioning to perform 90 minutes from first whistle to last.',
      },
    ],
  },
  {
    blockType: 'headingSection',
    eyebrow: 'The Goalkeeping Staff',
    heading: 'Coached by professionals.',
    background: 'bone',
    headingSize: 'section',
    body: "CVFC's goalkeeping staff includes Ricardo Villalva, our MLS NEXT goalkeeper coach who played in Mexico's third division with Alebrijes de Oaxaca; Carlos Arce, a former Xolos U15 keeper who earned a full scholarship to Cal Poly San Luis Obispo (coached by former US National Team head coach Steve Sampson); and Victor Duran, who works with our developing keepers across the pathway.\n\nA few of our keepers will sign with college programs. Some may push toward professional environments. Most won't — and that's honest. What every CVFC keeper does take with them is composure under pressure, decisiveness, and the kind of mental toughness that pays off in every part of life after the game.",
    cta: {
      label: 'Meet the Goalkeeping Staff',
      href: '/about/coaching-staff',
      variant: 'secondary',
      iconToken: 'ri:soccer-ball',
    },
  },
  {
    blockType: 'callout',
    eyebrow: 'Get Started',
    heading: 'Bring your keeper out for a session.',
    variant: 'bone',
    body: "Goalkeepers tryout alongside their pathway team. Choose your player's pathway and birth year, and our goalkeeping staff will be in touch.",
    cta: EVAL_CALLOUT_CTA,
  },
]

/** /programs/boys-competitive-pathway */
const BOYS_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Boys Competitive Pathway',
    heading: 'MLS NEXT, Elite Academy, and a real pathway.',
    description:
      'The boys pathway at Chula Vista FC runs from U10 through U19 across MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, and the SoCal Flight system. One club, every level — built so players can climb without ever changing crests.',
    background: 'white',
    actions: EVAL_HERO_ACTIONS,
  },
  {
    blockType: 'mediaSplit',
    eyebrow: 'The Top of the Ladder',
    heading: 'Inside MLS NEXT.',
    body: 'Chula Vista FC is a proud member of the MLS NEXT League, where our top-flight boys’ teams are provided with a purpose-driven path to professional play and college athletics. MLS NEXT clubs combined have produced more than 90 percent of the U.S. Youth National Team players in 2019 — establishing it as the top destination for the best young players in North America.\n\nPlayers are scouted through the MLS NEXT Showcases held throughout the season and challenged by the best teams in the country. Coaches commit to a high-intensity regimen that focuses on player identification, environment, personal growth, and community.',
    imageUrl: `${PHOTO}/2024/05/IMG_0867.jpg`,
    imageAlt: 'CVFC boys MLS NEXT player',
    tags: [
      { label: 'MLS NEXT' },
      { label: 'Birth Years 2007–2013' },
      { label: 'Showcase Scouting' },
    ],
  },
  {
    blockType: 'iconCards',
    eyebrow: 'The Boys Pathway',
    heading: 'Boys leagues, by tier.',
    description:
      "Whether your player is just starting competitive soccer or aiming at MLS, there's a tier that matches their level — and a coach already developing players above and below it.",
    background: 'white',
    cards: [
      {
        iconToken: 'custom:trophy',
        title: 'MLS NEXT',
        description:
          'Top-flight competition across the U.S. Showcase scouting, national-tier opponents, and the most direct line to MLS academies and college recruiters.',
      },
      {
        iconToken: 'custom:medal',
        title: 'MLS NEXT Academy',
        description:
          'Sub-MLS-NEXT competitive tier within the same player development environment. A clear next step on the way up.',
      },
      {
        iconToken: 'custom:soccer-ball',
        title: 'Elite Academy (EA)',
        description:
          'High-level alternative to MLS NEXT for players who want top competition without the full MLS NEXT travel commitment.',
      },
      {
        iconToken: 'custom:soccer-field',
        title: 'Elite Academy II',
        description:
          'CVFC joined Elite Academy 2 for the 2024–25 season — adding a second EA tier so more players can compete at the elite level.',
      },
      {
        iconToken: 'custom:racing-flags',
        title: 'SoCal Flight System',
        description:
          'Regional competition tiered by ability so every team plays opponents at the right level. The right rung for steady, measurable development.',
      },
      {
        iconToken: 'custom:torch',
        title: 'First Team',
        description:
          "CVFC's adult First Team has won the Southwest Premier League and qualified for the Lamar Hunt US Open Cup. A real ceiling for senior players.",
      },
    ],
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Inside MLS NEXT Academy',
    heading: 'MLS NEXT Academy',
    background: 'bone',
    headingSize: 'section',
    body: "MLS NEXT Academy is the next-tier roster within the same MLS NEXT environment — same coaching standards, same curriculum, same training environment as MLS NEXT, with competition tuned for players still climbing toward the top tier.\n\nCVFC's MLS NEXT Academy program covers birth years 2007–2013 and gives players a clear, internal pathway to the top MLS NEXT roster as they develop.",
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Inside Elite Academy',
    heading: 'Elite Academy (EA) — top competition, regional commitment.',
    background: 'white',
    headingSize: 'section',
    body: "Elite Academy is a high-level alternative to MLS NEXT for players who want top competition without the full MLS NEXT national-travel commitment. EA matches CVFC up with the strongest clubs in Southern California in a competitive structure that still produces college and academy-bound players.\n\nCVFC's EA program covers birth years 2005–2013 and is led by coaches with experience at the U.S. Youth National Team level and beyond.",
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Inside Elite Academy II',
    heading: 'Elite Academy II',
    background: 'bone',
    headingSize: 'section',
    body: 'Chula Vista FC joined Elite Academy 2 (EA II) for the 2024–25 season, adding a second EA roster tier so more players can compete in the elite environment. EA II pairs with the main EA program to create internal competition, push-up opportunities, and a more developmental structure for players still building toward the top tier.',
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Inside SoCal Flight',
    heading: 'SoCal Flight System',
    background: 'white',
    headingSize: 'section',
    body: "The SoCal Flight system tiers regional boys competition by ability, so every team plays opponents at the level that pushes them without overwhelming them. For CVFC, Flight is where developing teams build the foundation to step up to EA or MLS NEXT when they're ready.\n\nFlight matches are local or regional, schedules are predictable, and the competitive environment is real without the travel commitment of national-tier leagues.",
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Inside the First Team',
    heading: 'The senior ceiling — Southwest Premier League and beyond.',
    background: 'bone',
    headingSize: 'section',
    body: "CVFC's adult First Team competes in the Southwest Premier League, where it has lifted the SWPL trophy. The First Team has also advanced through the qualifying rounds of the Lamar Hunt US Open Cup and reached NISA semifinals — a real adult ceiling for senior players who want to stay competitive after the youth pathway.\n\nFor players moving from U19 toward college, the First Team is also a training environment they can learn from even before they're old enough to play in it.",
  },
  {
    blockType: 'headingSection',
    eyebrow: 'The Pathway Story',
    heading: 'From U10 to MLS, FC Dallas, and Liga MX.',
    background: 'bone',
    headingSize: 'section',
    body: "Recent CVFC alumni have signed with MLS Colorado Rapids, FC Dallas, Austin FC, Atlas FC Academy, Club Tijuana, Club Rayados de Monterrey, and Barça Academy Arizona, and have represented the US National Team and the Mexican National Team. That's the ceiling — and it's real. The pathway works.\n\nBut most players who come through MLS NEXT, EA, or the SoCal Flight system don't turn pro. That was never the only point. They learn how to compete, how to lose and come back, how to lead a teammate, and how to keep showing up — skills that matter in college, in careers, and in everything that comes after.",
    cta: STAFF_CTA,
  },
  {
    blockType: 'callout',
    eyebrow: 'Take the Step',
    heading: 'Tryouts open year-round.',
    variant: 'bone',
    body: 'Whether your player is moving up from Foundations or coming in from another club, the path begins the same way. Choose their birth year and a CVFC coach will be in touch with the next step.',
    cta: EVAL_CALLOUT_CTA,
  },
]

/** /programs/girls-competitive-pathway */
const GIRLS_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Girls Competitive Pathway',
    heading: 'GA, DPL, NPL, and a pathway built for the next generation.',
    description:
      'The girls pathway at Chula Vista FC runs from U10 through U19 across DPL, NPL, and the SoCal Flight system, with applications submitted for GA and GA Aspire. One club, every level — built so players can climb without ever changing crests.',
    background: 'white',
    actions: EVAL_HERO_ACTIONS,
  },
  {
    blockType: 'mediaSplit',
    eyebrow: 'Inside the DPL',
    heading: 'The Development Player League.',
    reverse: true,
    body: "The Development Player League is a prestigious club-vs-club platform specifically designed to elevate girls' soccer. CVFC was accepted into the DPL in April 2025 — a standards-driven national league that gives players a structured, reputable environment for long-term growth.\n\nDPL emphasizes both athletic and personal growth. It extends beyond soccer skills to life lessons, community, and collegiate opportunities — and it pits CVFC players against the elite clubs of Southern California, who are among the nation's best.",
    imageUrl: `${PHOTO}/2024/02/IMG_6349.jpg`,
    imageAlt: 'CVFC girls competitive player',
    tags: [{ label: 'DPL' }, { label: 'NPL' }, { label: 'Birth Years 2007–2013' }],
  },
  {
    blockType: 'iconCards',
    eyebrow: 'The Girls Pathway',
    heading: 'Girls leagues, by tier.',
    description:
      'From Girls Academy down through SoCal Flight — leagues ordered by competitive level, so players can find the right rung now and a clear way up.',
    background: 'white',
    cards: [
      {
        iconToken: 'custom:trophy',
        title: 'Girls Academy (GA)',
        description:
          'The top of the girls pathway — the Girls Academy League, the highest national-tier environment for elite female players. CVFC has applied for GA acceptance.',
      },
      {
        iconToken: 'custom:medal',
        title: 'GA Aspire',
        description:
          'The pre-Girls Academy environment that develops the next generation of GA players at the highest competitive level. CVFC has applied for GA Aspire acceptance.',
      },
      {
        iconToken: 'custom:soccer-ball',
        title: 'DPL',
        description:
          "The Development Player League — a prestigious club-vs-club platform specifically designed to elevate girls' soccer. CVFC accepted in April 2025.",
      },
      {
        iconToken: 'custom:torch',
        title: 'NPL',
        description:
          'National Premier Leagues — top-tier regional competition with national playoff visibility for girls who play at the highest club level.',
      },
      {
        iconToken: 'custom:racing-flags',
        title: 'SoCal Flight System',
        description:
          'Regional girls competition tiered by ability, so every team plays opponents at the right level. The right rung for steady, measurable progress.',
      },
    ],
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Inside Girls Academy',
    heading: 'Girls Academy (GA)',
    background: 'bone',
    headingSize: 'section',
    body: 'The Girls Academy League (GA) sits at the top of the girls competitive pathway — a national-tier environment built for the most committed female athletes, with full-year development, top opponents from across the country, and direct visibility for college recruiters and youth national team scouts.\n\nCVFC has applied for GA acceptance. Once placed, GA will sit above GA Aspire, DPL, NPL, and the SoCal Flight system in the girls competitive structure.',
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Inside GA Aspire',
    heading: 'GA Aspire',
    background: 'white',
    headingSize: 'section',
    body: "GA Aspire is the pre-Girls Academy environment that prepares the next generation of GA-level players. It pairs the daily standards of the top tier with a developmental focus, so players who aren't yet on a GA roster can train, compete, and grow toward it.\n\nCVFC has applied for GA Aspire acceptance. Once placed, GA Aspire will sit between GA and DPL in the girls competitive structure.",
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Inside the NPL',
    heading: 'National Premier League',
    background: 'bone',
    headingSize: 'section',
    body: "The National Premier League (NPL) is one of the highest levels of regional girls soccer in the U.S., with national playoff visibility for top regional finishers. It's built for players who want the rigor of a national-tier league while staying rooted in regional competition.\n\nCVFC NPL teams compete against the strongest clubs in Southern California and have a real path to the NPL Showcase and national playoff stages.",
  },
  {
    blockType: 'headingSection',
    eyebrow: 'Inside SoCal Flight',
    heading: 'SoCal Flight System',
    background: 'white',
    headingSize: 'section',
    body: "The SoCal Flight system tiers regional girls competition by ability, so every team plays opponents at the level that pushes them without overwhelming them. For CVFC, Flight is where developing teams build the foundation to step up to NPL or DPL when they're ready.\n\nFlight matches are local or regional, season schedules are predictable, and the competitive environment is real without the travel commitment of national-tier leagues.",
  },
  {
    blockType: 'headingSection',
    eyebrow: 'The Pathway Story',
    heading: 'Built for college soccer — and what comes after.',
    background: 'bone',
    headingSize: 'section',
    body: "The girls pathway is built around two real outcomes: college recruiting visibility for the players who want it, and life skills that carry every player forward whether soccer stays in the picture or not. DPL events, NPL playoffs, and Flight competition put players in front of college coaches at every level. Daily training builds the work ethic, leadership, and resilience that matter long after.\n\nMost CVFC girls won't play professionally — there's no honest pathway in youth soccer that pretends otherwise. But every player leaves better than she came: stronger, sharper, more accountable, more capable of leading a team.",
    cta: STAFF_CTA,
  },
  {
    blockType: 'callout',
    eyebrow: 'Take the Step',
    heading: 'Bring her out for a tryout.',
    variant: 'bone',
    body: 'CVFC accepts evaluations year-round across DPL, NPL, and the SoCal Flight system, with applications submitted for GA and GA Aspire. Choose her birth year and a CVFC coach will be in touch with the next step.',
    cta: EVAL_CALLOUT_CTA,
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
  'about/who-we-are': {
    title: 'Who We Are — Chula Vista FC Since 1982',
    description:
      'Chula Vista FC has developed South Bay players since 1982 — boys and girls, Mini Maestros to MLS NEXT, coached by alumni who came up through the club.',
  },
  'programs/foundations': {
    title: 'Foundations — CVFC Youth Soccer, Ages 4–9',
    description:
      "Mini Maestros and CVFC Youth for ages 4–9 at Chula Vista FC — technique-first development that begins every player's pathway toward competitive soccer.",
  },
  'programs/goalkeeper-pathway': {
    title: 'Goalkeeper Pathway — Chula Vista FC',
    description:
      "Specialized goalkeeper training at every age, led by CVFC's dedicated GK staff — technical, tactical, mental, and athletic development for keepers.",
  },
  'programs/boys-competitive-pathway': {
    title: 'Boys Competitive Pathway — Chula Vista FC',
    description:
      "CVFC's boys pathway from U10 to U19 — MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, and SoCal Flight, with alumni in MLS and Liga MX.",
  },
  'programs/girls-competitive-pathway': {
    title: 'Girls Competitive Pathway — Chula Vista FC',
    description:
      "CVFC's girls pathway from U10 to U19 — DPL, NPL, and SoCal Flight, with GA and GA Aspire applications submitted. Built for college visibility.",
  },
  evaluations: {
    title: 'Evaluations & Tryouts — Chula Vista FC',
    description:
      'Open tryouts and free evaluations across every CVFC pathway — Foundations to MLS NEXT, boys and girls. Find your fit; a coach follows up within 48 hours.',
  },
  faq: {
    title: 'FAQ — Chula Vista FC',
    description:
      'Answers for South Bay families — costs, tryouts, leagues, scholarships, and outcomes at Chula Vista FC. The questions parents ask before joining a club.',
  },
  partnerships: {
    title: 'Partnerships — Chula Vista FC',
    description:
      'League affiliations, academy partners, community organizations, and field hosts behind 44 years of Chula Vista FC. Join the network behind the pathway.',
  },
  sponsor: {
    title: 'Become a Sponsor — Chula Vista FC',
    description:
      'Sponsor Chula Vista FC — jersey logos, banner placement, and match-day recognition that fund player scholarships. Every sponsorship goes back to the kids.',
  },
  support: {
    title: 'Donate & Support — Chula Vista FC',
    description:
      'Every gift to Chula Vista FC, a 501(c)(3) nonprofit, stays with our players — keeping fields lit, kits clean, and the door open to South Bay families.',
  },
  'programs/coaching-opportunities': {
    title: 'Coaching Opportunities — Chula Vista FC',
    description:
      'Chula Vista FC is hiring coaches across the pathway — Mini Maestros to MLS NEXT, boys and girls, plus goalkeeper. Join a hometown club with deep roots.',
  },
  'about/coaching-staff': {
    title: 'Coaching Staff — Chula Vista FC',
    description:
      'USSF A and UEFA-licensed coaches developing players across MLS NEXT, Elite Academy, NPL, and DPL — college, elite, and professional experience in the South Bay.',
  },
  'about/administrators': {
    title: 'Administrators & Leadership — Chula Vista FC',
    description:
      'The directors and staff running Chula Vista FC day-to-day — registration, operations, and the work that keeps the South Bay pathway moving.',
  },
  'about/facilities': {
    title: 'Facilities — Chula Vista FC',
    description:
      'Where CVFC trains and plays — Victory Christian Academy, Hoover High School, the Indoor Training Center, and community parks across the South Bay.',
  },
  'about/testimonials': {
    title: 'Testimonials — Chula Vista FC',
    description:
      'Parents, players, alumni, and coaches in their own words — what Chula Vista FC means on a Tuesday training session and a Saturday match.',
  },
  'privacy-policy': {
    title: 'Privacy Policy — Chula Vista FC',
    description: 'How Chula Vista FC collects, uses, and protects your information.',
  },
  'terms-of-service': {
    title: 'Terms of Service — Chula Vista FC',
    description: 'The terms governing your use of the Chula Vista FC website.',
  },
  'cookie-policy': {
    title: 'Cookie Policy — Chula Vista FC',
    description: 'How Chula Vista FC uses cookies and similar technologies on this site.',
  },
  'link-policy': {
    title: 'Link Policy — Chula Vista FC',
    description: "Chula Vista FC's policy on linking to and from this website.",
  },
}

/** Starter single-PageHero layout for routes whose deeper sections fall back to
 *  the hard-coded mock until wired section-by-section on the front end. */
const heroLayout = (eyebrow: string, heading: string, description: string) => [
  {
    blockType: 'pageHero',
    eyebrow,
    heading,
    description,
    background: 'white',
    actions: [],
  },
]

// Full /partnerships layout: hero + two iconCards + a callout. blockName matches
// the FE `blockFor(page, "<name>")` lookups so each section is editable.
const PARTNERSHIPS_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Partnerships',
    heading: 'The relationships behind 44 years of CVFC.',
    description:
      "Chula Vista FC is more than one club — it's a network. League affiliations, academy partners, community organizations, and field hosts all make the CVFC pathway possible. If your organization wants to join the work, we want to talk.",
    background: 'white',
    actions: [],
  },
  {
    blockType: 'iconCards',
    blockName: 'partnership-types',
    eyebrow: 'Partnership Types',
    heading: 'Four kinds of partners. One mission.',
    description: 'Every partnership is unique — here are the broad categories.',
    background: 'white',
    cards: [
      {
        iconToken: 'custom:soccer-field',
        title: 'League & Federation Partners',
        description:
          'MLS NEXT, Elite Academy League, Development Player League, National Premier League, SoCal Soccer League, Southwest Premier League — the competitions that shape the CVFC pathway.',
      },
      {
        iconToken: 'custom:trophy',
        title: 'Pro & Academy Partners',
        description:
          'Victory Christian Academy as primary training home, San Diego FC partnership, and academy-level relationships across MLS and Liga MX (Atlas, Club Tijuana, Rayados).',
      },
      {
        iconToken: 'custom:medal',
        title: 'Community Partners',
        description:
          'Local schools, parks, and South Bay organizations that share fields, host tournaments, and help CVFC stay rooted in Chula Vista.',
      },
      {
        iconToken: 'custom:soccer-desk',
        title: 'Facility Partners',
        description:
          'Hoover High School (match days), Indoor Training Center (indoor specialty), and the network of community parks across the South Bay where CVFC trains every week.',
      },
    ],
  },
  {
    blockType: 'iconCards',
    blockName: 'how-we-partner',
    eyebrow: 'How We Work Together',
    heading: 'What partnership looks like in practice.',
    description: 'The shape of CVFC partnerships, in three categories.',
    background: 'bone',
    cards: [
      {
        iconToken: 'custom:torch',
        title: 'Co-Built Programs',
        description:
          'Joint clinics, ID camps, scholarship initiatives, and pathway-specific programming with partner clubs and federations.',
      },
      {
        iconToken: 'custom:soccer-ball',
        title: 'Shared Fields & Tournaments',
        description:
          'Reciprocal field use, joint tournaments, and shared event hosting across South Bay venues.',
      },
      {
        iconToken: 'custom:target',
        title: 'Scouting & Talent Pipelines',
        description:
          'Direct relationships between CVFC coaches and college, MLS academy, and Liga MX scouts — players see the right eyes at the right time.',
      },
    ],
  },
  {
    blockType: 'callout',
    blockName: 'other-ways',
    eyebrow: 'Other Ways to Engage',
    heading: 'Donate or sponsor.',
    variant: 'bone',
    body: 'If your organization or family is closer to a sponsorship or a direct donation than a strategic partnership, both pages below walk through what we offer.',
  },
]

// /sponsor: hero + "why sponsor" iconCards + "or donate" callout. (The tier
// grid is bespoke and stays in the screen; not a CMS block.)
const SPONSOR_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Become a Sponsor',
    heading: 'Stand with the club, stand with the kids.',
    description:
      'Local businesses and community partners help keep CVFC strong. Jersey logos, banner placement, match-day recognition, and gifts that fund player scholarships — every sponsorship goes back into the work, and the kids feel it on Tuesday practice.',
    background: 'white',
    actions: [],
  },
  {
    blockType: 'iconCards',
    blockName: 'why-sponsor',
    eyebrow: 'Why Sponsor CVFC',
    heading: 'A relationship with the South Bay.',
    description: 'A few reasons businesses choose to support CVFC year after year.',
    background: 'white',
    cards: [
      {
        iconToken: 'custom:medal',
        title: 'Reach South Bay Families',
        description:
          'Hundreds of families pass through CVFC each year — from Mini Maestros parents to MLS NEXT alumni. A genuine community of families who shop, work, and live in the South Bay.',
      },
      {
        iconToken: 'custom:torch',
        title: 'Stand With a 44-Year Club',
        description:
          'CVFC has been in Chula Vista since 1982. Your sponsorship sits alongside four decades of South Bay soccer — a relationship, not a transaction.',
      },
      {
        iconToken: 'custom:tickets',
        title: 'Direct Impact, Tax-Deductible',
        description:
          'CVFC is a 501(c)(3) nonprofit. Your sponsorship is tax-deductible to the extent allowed by law, and it funds player scholarships, fields, and coaching — the work that keeps the club going.',
      },
    ],
  },
  {
    blockType: 'callout',
    blockName: 'or-donate',
    eyebrow: 'Or Donate Directly',
    heading: 'Not every gift fits a tier.',
    variant: 'bone',
    body: 'Individual donors, small businesses giving below sponsorship levels, and one-time gifts are equally important. Visit the donate page to give directly.',
  },
]

// /support: hero + "where your gift goes" iconCards + "other ways to help"
// callout. (The one-time/monthly tier grids + donate form are bespoke.)
const SUPPORT_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Donate to Chula Vista FC',
    heading: 'Help us show up for the next kid.',
    description:
      "Every gift to Chula Vista FC stays with our players. As a 501(c)(3) nonprofit, your support keeps the fields lit, the kits clean, and the door open to South Bay families who'd otherwise stay home. Thank you for being part of this.",
    background: 'white',
    actions: [],
  },
  {
    blockType: 'iconCards',
    blockName: 'where-gift-goes',
    eyebrow: 'Where Your Gift Goes',
    heading: 'To the kids on the field.',
    description:
      'CVFC is volunteer-led at the board level, so your gift moves directly into the day-to-day work — coaching the players, training on the fields, and keeping the door open.',
    background: 'white',
    cards: [
      {
        iconToken: 'custom:medal',
        title: 'Player Scholarships',
        description:
          "We never want a South Bay kid to miss out because their family can't afford the season. Need-based financial assistance helps players join CVFC and stay through the pathway.",
      },
      {
        iconToken: 'custom:soccer-field',
        title: 'Fields & Equipment',
        description:
          'Lit evening fields, indoor sessions at the Indoor Training Center, and the gear players need. Your gift keeps the space ready and welcoming for every team.',
      },
      {
        iconToken: 'custom:whistle',
        title: 'Coaching & Development',
        description:
          "Coaches who care about each player and have the licenses to back it up. Your gift keeps the pathway — including our goalkeeper specialty — staffed by people who know what they're doing.",
      },
    ],
  },
  {
    blockType: 'callout',
    blockName: 'other-ways-help',
    eyebrow: 'Other Ways to Help',
    heading: 'Sponsorships and partnerships.',
    variant: 'midnight',
    body: 'Local businesses and community partners help keep CVFC strong — through jersey logos, tournament sponsorships, and gifts directed to specific programs (the Goalkeeper Pathway, Mini Maestros, the Girls Pathway, the Facilities Campaign). Browse the tiers or reach out and we’ll find a fit together.',
  },
]

// /programs/coaching-opportunities: hero + "open roles" iconCards + "why coach"
// iconCards + "apply today" callout. (Requirements list + "more from CVFC" are
// bespoke.)
const COACHING_OPPS_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Coaching Opportunities',
    heading: 'Coach with us.',
    description:
      "Chula Vista FC is hiring across the pathway — Mini Maestros through MLS NEXT, on the boys side and the girls side, plus our goalkeeper specialty. If you love developing young players and want to be part of a hometown club with deep South Bay roots, we'd love to hear from you.",
    background: 'white',
    actions: [],
  },
  {
    blockType: 'iconCards',
    blockName: 'open-roles',
    eyebrow: 'Open Roles',
    heading: "Where we're hiring.",
    description:
      "Specific openings vary by season — reach out with your background and we'll match you to the right team and pathway.",
    background: 'white',
    cards: [
      {
        iconToken: 'custom:whistle',
        title: 'Head Coach — Competitive Pathway',
        description:
          'Lead a team across MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, DPL, NPL, or SoCal Flight. USSF C+ or UEFA equivalent preferred.',
      },
      {
        iconToken: 'custom:soccer-desk',
        title: 'Assistant Coach',
        description:
          'Support a head coach across training and match days. Strong technical knowledge, clear communication, and a player-first approach.',
      },
      {
        iconToken: 'custom:target',
        title: 'Goalkeeper Coach',
        description:
          'Run age-banded goalkeeper sessions across the CVFC pathway. Specialty GK certification or playing experience at college/pro level.',
      },
      {
        iconToken: 'custom:soccer-ball',
        title: 'Foundations Coach',
        description:
          'Coach Mini Maestros and CVFC Youth (ages 4–9). Build technical foundations, fall in love with the game, and set the tone for everything that comes next.',
      },
    ],
  },
  {
    blockType: 'iconCards',
    blockName: 'why-coach',
    eyebrow: 'Why Coach at CVFC',
    heading: 'The kind of club that earns long tenures.',
    description: "Coaches who join CVFC tend to stay. Here's why.",
    background: 'bone',
    cards: [
      {
        iconToken: 'custom:torch',
        title: '44 Years of Player Development',
        description:
          'CVFC has been a Chula Vista club since 1982. Recent alumni have gone on to MLS Colorado Rapids, FC Dallas, Atlas FC, Club Tijuana Xolos, and Rayados de Monterrey — and many more to college and to the rest of their lives.',
      },
      {
        iconToken: 'custom:mountain-peak',
        title: 'A Full Development Pathway',
        description:
          'Coach across MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, DPL, NPL, GA Aspire, and SoCal Flight — a complete pathway from Mini Maestros to U19, all under one club.',
      },
      {
        iconToken: 'custom:medal',
        title: 'A Hometown Community',
        description:
          '501(c)(3) nonprofit. Coaches who stay across years. Bilingual program in English and Spanish. The kind of place where families know each other and players grow up together.',
      },
    ],
  },
  {
    blockType: 'callout',
    blockName: 'apply-today',
    eyebrow: 'Apply Today',
    heading: 'Send us your story.',
    variant: 'midnight',
    body: 'Email contact@chulavistafc.com with your coaching résumé, current certifications, languages spoken, and the age groups you’d most like to work with. We respond within a week and follow up with the relevant Director of Coaching.',
  },
]

// /faq: hero + "still have questions" callout. (The category Q&A accordion is a
// large editorial dataset that stays in data/faq.ts — see roadmap.)
const FAQ_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Frequently Asked Questions',
    heading: 'Real answers for South Bay families.',
    description:
      'Everything parents ask before joining a club — costs, tryouts, leagues, scholarships, comparisons, and outcomes. If we missed your question, request an evaluation and a coach will follow up within 48 hours.',
    background: 'white',
    actions: [],
  },
  {
    blockType: 'callout',
    blockName: 'still-questions',
    eyebrow: 'Still Have Questions?',
    heading: 'Talk to a coach this week.',
    variant: 'bone',
    body: 'Every family is different. Submit an evaluation request with your player’s pathway and birth year, and a coach will follow up within 48 hours — in English or Spanish, whichever works for your family.',
  },
]

// /evaluations: hero + "take the first step" callout. (The registration form,
// step cards, program tables, and tryout FAQ are functional/data-driven.)
const EVALUATIONS_LAYOUT = [
  {
    blockType: 'pageHero',
    eyebrow: 'Tryouts & Evaluations',
    heading: 'Find your fit at Chula Vista FC.',
    description:
      'Whether tryouts are open or you missed the window, every player gets a path. Choose a track and birth year to be routed to the right registration. Your coach will reach out within 48 hours!',
    background: 'white',
    actions: [],
  },
  {
    blockType: 'callout',
    blockName: 'take-first-step',
    eyebrow: 'Take the First Step',
    heading: 'Ready to play for Chula Vista?',
    variant: 'bone',
    body: 'Choose your player’s date of birth and gender, complete the registration, and a CVFC coach will be in touch with your tryout invitation.',
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
    const existing = found.docs[0] as { id: number | string; layout?: unknown[] } | undefined
    // Fill, never clobber: if the page already has a built-out layout (>1
    // block), the client may have edited it — keep their layout and only
    // refresh SEO meta. Only (re)seed the layout for empty/hero-only pages.
    const customized = (existing?.layout?.length ?? 0) > 1
    const data = {
      ...(customized ? {} : { layout: layout as never }),
      _status: 'published' as const,
      ...(meta ? { meta } : {}),
    }
    if (existing) {
      await payload.update({
        collection: 'pages',
        id: existing.id,
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
  await upsertPage(
    'about/who-we-are',
    'Who We Are',
    WHO_WE_ARE_LAYOUT,
    PAGE_META['about/who-we-are'],
  )
  await upsertPage(
    'programs/foundations',
    'Foundations',
    FOUNDATIONS_LAYOUT,
    PAGE_META['programs/foundations'],
  )
  await upsertPage(
    'programs/goalkeeper-pathway',
    'Goalkeeper Pathway',
    GOALKEEPER_LAYOUT,
    PAGE_META['programs/goalkeeper-pathway'],
  )
  await upsertPage(
    'programs/boys-competitive-pathway',
    'Boys Competitive Pathway',
    BOYS_LAYOUT,
    PAGE_META['programs/boys-competitive-pathway'],
  )
  await upsertPage(
    'programs/girls-competitive-pathway',
    'Girls Competitive Pathway',
    GIRLS_LAYOUT,
    PAGE_META['programs/girls-competitive-pathway'],
  )

  // --- remaining routes: create the page doc for every route so it's editable
  // in the CMS. Hero is seeded from the live screen; deeper sections fall back
  // to the hard-coded mock until each screen is wired section-by-section. ---
  await upsertPage(
    'evaluations',
    'Evaluations & Tryouts',
    EVALUATIONS_LAYOUT,
    PAGE_META.evaluations,
  )
  await upsertPage('faq', 'Frequently Asked Questions', FAQ_LAYOUT, PAGE_META.faq)
  await upsertPage('partnerships', 'Partnerships', PARTNERSHIPS_LAYOUT, PAGE_META.partnerships)
  await upsertPage('sponsor', 'Become a Sponsor', SPONSOR_LAYOUT, PAGE_META.sponsor)
  await upsertPage('support', 'Donate to Chula Vista FC', SUPPORT_LAYOUT, PAGE_META.support)
  await upsertPage(
    'programs/coaching-opportunities',
    'Coaching Opportunities',
    COACHING_OPPS_LAYOUT,
    PAGE_META['programs/coaching-opportunities'],
  )
  await upsertPage(
    'about/coaching-staff',
    'Coaching Staff',
    heroLayout(
      'Coaching Staff',
      "Coached by people who've been there.",
      'Meet the USSF A and UEFA-licensed coaches developing players across MLS NEXT, Elite Academy, NPL, and DPL at Chula Vista FC — college, elite, and professional playing experience brought to youth soccer in the South Bay.',
    ),
    PAGE_META['about/coaching-staff'],
  )
  await upsertPage(
    'about/administrators',
    'Administrators',
    heroLayout(
      'Leadership',
      'Meet the Directors.',
      'The directors and staff running Chula Vista FC day-to-day — registration, operations, and the work that keeps the South Bay pathway moving.',
    ),
    PAGE_META['about/administrators'],
  )
  await upsertPage(
    'about/facilities',
    'Facilities',
    heroLayout(
      'Facilities',
      'Where CVFC trains and plays.',
      'Victory Christian Academy, Hoover High School, the Indoor Training Center, and community parks across the South Bay — the grounds where Chula Vista FC trains and competes.',
    ),
    PAGE_META['about/facilities'],
  )
  await upsertPage(
    'about/testimonials',
    'Testimonials',
    heroLayout(
      'Voices',
      'Our community, in their own words.',
      'Parents, players, alumni, and coaches — the families and the staff who shape what Chula Vista FC means on a Tuesday training session and on a Saturday match. Below are their voices.',
    ),
    PAGE_META['about/testimonials'],
  )
  await upsertPage(
    'privacy-policy',
    'Privacy Policy',
    heroLayout(
      'Legal',
      'Privacy Policy',
      'How Chula Vista FC collects, uses, and protects your information.',
    ),
    PAGE_META['privacy-policy'],
  )
  await upsertPage(
    'terms-of-service',
    'Terms of Service',
    heroLayout(
      'Legal',
      'Terms of Service',
      'The terms governing your use of the Chula Vista FC website.',
    ),
    PAGE_META['terms-of-service'],
  )
  await upsertPage(
    'cookie-policy',
    'Cookie Policy',
    heroLayout(
      'Legal',
      'Cookie Policy',
      'How Chula Vista FC uses cookies and similar technologies on this site.',
    ),
    PAGE_META['cookie-policy'],
  )
  await upsertPage(
    'link-policy',
    'Link Policy',
    heroLayout(
      'Legal',
      'Link Policy',
      "Chula Vista FC's policy on linking to and from this website.",
    ),
    PAGE_META['link-policy'],
  )

  // --- blog: migrate cvfc news into the Posts collection (verbatim) ---
  const posts = getActiveNews(NEWS_POSTS)
  for (const post of posts) {
    const found = await payload.find({
      collection: 'posts',
      where: {
        and: [{ slug: { equals: post.slug } }, { tenant: { equals: tenant.id } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const data = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      author: 'Chula Vista FC',
      publishedAt: post.date,
      coverImageUrl: post.image?.src,
      content: htmlToLexical(post.body) as never,
      _status: 'published' as const,
    }
    if (found.docs[0]) {
      await payload.update({
        collection: 'posts',
        id: found.docs[0].id,
        data,
        depth: 0,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'posts',
        data: { ...data, tenant: tenant.id },
        depth: 0,
        overrideAccess: true,
      })
    }
  }

  // --- people: migrate coaches + administrators into the Staff collection ---
  const upsertStaff = async (key: string, group: string, data: Record<string, unknown>) => {
    const found = await payload.find({
      collection: 'staff',
      where: {
        and: [
          { key: { equals: key } },
          { group: { equals: group } },
          { tenant: { equals: tenant.id } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const payloadData = { ...data, key, group } as never
    if (found.docs[0]) {
      await payload.update({
        collection: 'staff',
        id: found.docs[0].id,
        data: payloadData,
        depth: 0,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'staff',
        data: { ...(payloadData as object), tenant: tenant.id } as never,
        depth: 0,
        overrideAccess: true,
      })
    }
  }

  const coaches = getActiveCoaches(COACHES)
  for (const [i, c] of coaches.entries()) {
    await upsertStaff(c.id, 'Coaching Staff', {
      name: c.name,
      title: c.title,
      pathway: c.pathway,
      programs: c.programs,
      team: c.team,
      credentials: c.credentials ?? [],
      achievements: c.achievements ?? [],
      bio: c.bio,
      imageUrl: c.image?.src,
      email: c.contact?.email,
      phone: c.contact?.phone,
      isFeatured: Boolean(c.isFeatured),
      joinedYear: c.joinedYear,
      status: c.status ?? 'active',
      order: i,
    })
  }

  const admins = getActiveAdministrators(ADMINISTRATORS)
  for (const [i, a] of admins.entries()) {
    await upsertStaff(a.id, 'Administrators', {
      name: a.name,
      title: a.title,
      department: a.department,
      credentials: a.credentials ?? [],
      bio: a.bio,
      imageUrl: a.image?.src,
      email: a.contact?.email,
      phone: a.contact?.phone,
      joinedYear: a.joinedYear,
      status: a.status ?? 'active',
      order: i,
    })
  }

  // --- testimonials + facilities → their collections (idempotent by key) ---
  const upsertByKey = async (collection: string, key: string, data: Record<string, unknown>) => {
    const found = await payload.find({
      collection: collection as never,
      where: { and: [{ key: { equals: key } }, { tenant: { equals: tenant.id } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const d = { ...data, key } as never
    if (found.docs[0]) {
      await payload.update({
        collection: collection as never,
        id: found.docs[0].id,
        data: d,
        depth: 0,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: collection as never,
        data: { ...(d as object), tenant: tenant.id } as never,
        depth: 0,
        overrideAccess: true,
      })
    }
  }

  for (const [i, t] of TESTIMONIALS.entries()) {
    await upsertByKey('testimonials', t.id, {
      quote: t.quote,
      author: t.author,
      role: t.role,
      context: t.context,
      longform: t.longform,
      featured: Boolean(t.featured),
      imageUrl: t.image?.src,
      status: t.status ?? 'active',
      order: i,
    })
  }

  for (const [i, f] of FACILITIES.entries()) {
    await upsertByKey('facilities', f.id, {
      name: f.name,
      tier: f.tier,
      role: f.role,
      roleLabel: f.roleLabel,
      address: f.address,
      description: f.description,
      uses: f.uses ?? [],
      features: f.features ?? [],
      imageUrl: f.image?.src,
      mapsUrl: f.mapsUrl,
      status: f.status ?? 'active',
      order: i,
    })
  }

  console.log(
    `✓ Seeded cvfc home — full landing (${homeLayout.length} blocks${hero ? ', hero preserved' : ''}).`,
  )
  console.log(
    '✓ Seeded cvfc pages: /programs, /about, /about/who-we-are, /programs/{foundations,goalkeeper-pathway,boys-competitive-pathway,girls-competitive-pathway} (with SEO meta).',
  )
  console.log(`✓ Seeded ${posts.length} blog posts into the Posts collection.`)
  console.log(
    `✓ Seeded ${coaches.length} coaches + ${admins.length} administrators into the Staff collection.`,
  )
  console.log(
    `✓ Seeded ${TESTIMONIALS.length} testimonials + ${FACILITIES.length} facilities into their collections.`,
  )
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
