/**
 * CVFC testimonials — voices from parents, players, alumni, and coaches.
 * Powers /about/testimonials.
 *
 * ============================================================
 *  HOW TO UPDATE
 *  - New quote         → push a new entry below
 *  - Promote to top    → set featured: true and add longform + image
 *  - Take down         → set status: "archived" (soft delete)
 *
 *  Eventually this file goes away — CMS serves the same shape via API.
 * ============================================================
 */

export type TestimonialRole = "Parent" | "Player" | "Alumnus" | "Coach";

export type TestimonialStatus = "active" | "archived";

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: TestimonialRole;
  /** Optional context line — e.g. "Parent of B2011 MLS NEXT", "Class of 2022". */
  context?: string;
  /** When true, the entry shows in the featured story rail at the top of the page. */
  featured?: boolean;
  /** Long-form body for featured entries — 2–4 sentences after the headline quote. */
  longform?: string;
  image?: { src: string; alt: string };
  status?: TestimonialStatus;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "diaz-director",
    quote:
      "At Chula Vista FC, we focus on developing well-rounded athletes — technically, tactically, and mentally. Passion. Unity. Respect. Attitude.",
    author: "J. Hector Diaz",
    role: "Coach",
    context: "Academy Director",
    featured: true,
    longform:
      "We've been at this for more than four decades because we believe the game teaches more than the game. Players who come through CVFC leave with the technical foundation to compete, the tactical sense to read a match, and the character to lead a team — whether they go on to MLS NEXT, college soccer, or never play another organized minute. That's the standard, and we hold ourselves to it every session.",
    image: {
      src: "https://chulavistafc.com/wp-content/uploads/2023/12/JHD_Headshot21.png",
      alt: "J. Hector Diaz, Academy Director",
    },
  },
  {
    id: "cvfc-parent-confidence",
    quote:
      "The coaching staff at Chula Vista FC truly cares about each player's growth, both on and off the field. My son's confidence has soared since joining.",
    author: "Morgan Segura",
    role: "Parent",
    context: "Parent",
    featured: true,
    longform:
      "We came to CVFC looking for a club that took development seriously without forgetting these are still kids. What we found is coaches who push hard but always treat the player as a whole person — academics, attitude, the way he carries himself off the field. He's a different player than the one who walked in, and a different kid in the best way.",
  },
  {
    id: "luis-coach",
    quote:
      "We emphasize quality over quantity — every drill has a purpose, and every player leaves training better than they came.",
    author: "Luis Guzman",
    role: "Coach",
    image: {
      src: "https://chulavistafc.com/wp-content/uploads/2025/07/53517d04ec70095bbacb153e985a82ce.avif",
      alt: "Luis Guzman, CVFC Coach",
    },
  },
  {
    id: "gk-program-parent",
    quote:
      "The goalkeeper program is top-notch — my daughter's skills and reaction time have improved more in one season here than in years elsewhere.",
    author: "Anonymous",
    role: "Parent",
  },
  {
    id: "shooting-clinics-parent",
    quote:
      "The shooting clinics have made a huge difference. My son is scoring more and playing with real confidence in front of the net.",
    author: "Rebecca Muñoz",
    role: "Parent",
  },
  {
    id: "speed-agility-parent",
    quote:
      "The speed and agility training is amazing. My daughter is faster, more balanced, and sharper in every game.",
    author: "Jason Wright",
    role: "Parent",
  },
  {
    id: "organized-practices-parent",
    quote:
      "I appreciate how organized and intense the practices are. My kid comes home tired but proud of the hard work they put in.",
    author: "J. Carlos Gonzalez",
    role: "Parent",
  },
  {
    id: "strength-training-parent",
    quote:
      "The strength training has helped my son stay injury-free and compete against older, stronger players without hesitation.",
    author: "Xavier Ruiz",
    role: "Parent",
  },
  {
    id: "extra-training-parent",
    quote:
      "We love that extra training is always available. The optional sessions have really accelerated my daughter's development.",
    author: "Anonymous",
    role: "Parent",
  },
  {
    id: "gk-coach-voice",
    quote:
      "Our goalkeeper program is built to push players beyond their comfort zone. I've seen keepers improve their skills and reaction times more than they thought possible.",
    author: "CVFC Goalkeeping Staff",
    role: "Coach",
  },
  {
    id: "alumnus-college-placeholder",
    quote:
      "CVFC didn't just prepare me for college soccer — it prepared me for college, period. The work ethic carries over.",
    author: "[Alumnus name to confirm]",
    role: "Alumnus",
    context: "NCAA roster — placeholder pending verification",
  },
  {
    id: "player-pathway-placeholder",
    quote:
      "I started at Foundations and stayed all the way through. Same crest, same coaches who knew my game. Nowhere else does that.",
    author: "[Player name to confirm]",
    role: "Player",
    context: "Pathway player — placeholder pending verification",
  },
];

export function getActiveTestimonials(
  testimonials: Testimonial[],
): Testimonial[] {
  return testimonials.filter((t) => t.status !== "archived");
}

export function getFeaturedTestimonials(
  testimonials: Testimonial[],
): Testimonial[] {
  return getActiveTestimonials(testimonials).filter((t) => t.featured === true);
}

export const TESTIMONIAL_ROLES: TestimonialRole[] = [
  "Parent",
  "Player",
  "Alumnus",
  "Coach",
];
