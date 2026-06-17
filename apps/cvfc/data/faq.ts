/**
 * Chula Vista FC FAQ — answers real parent search questions.
 * Powers /faq and the home page FaqSection feature.
 *
 * ============================================================
 *  HOW TO UPDATE
 *  - Add an entry      → push a new object below
 *  - Reorder           → put highest-intent questions first
 *
 *  Eventually this file goes away — CMS serves the same shape via API.
 * ============================================================
 */

export type FaqCategory =
  | "About the Club"
  | "Cost & Scholarships"
  | "Tryouts & Evaluations"
  | "Programs & Pathways"
  | "Practice & Games"
  | "Outcomes";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  category?: FaqCategory;
};

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "what-is-cvfc",
    category: "About the Club",
    question: "What is Chula Vista FC?",
    answer:
      "Chula Vista FC is a 501(c)(3) nonprofit youth soccer club founded in 1982. We're South Bay San Diego's longest-running competitive soccer club, with a complete pathway from Mini Maestros (U6) through MLS NEXT, Elite Academy, DPL, NPL, and the Southwest Premier League. The local club, not a franchise.",
  },
  {
    id: "how-much-does-it-cost",
    category: "Cost & Scholarships",
    question: "How much does Chula Vista FC cost?",
    answer:
      "Independent parent guides place CVFC fees in the $800–$2,000 per year range, depending on program and age — among the most affordable MLS NEXT and Elite Academy pathways in San Diego. Need-based financial assistance and scholarships are available for qualifying families.",
  },
  {
    id: "are-scholarships-available",
    category: "Cost & Scholarships",
    question: "Are scholarships or financial assistance available?",
    answer:
      "Yes. CVFC offers need-based financial assistance and scholarships so cost isn't the barrier between a player and competitive soccer. Reach out during your evaluation to ask about options for your family.",
  },
  {
    id: "age-groups",
    category: "Programs & Pathways",
    question: "What age groups does CVFC serve?",
    answer:
      "Ages 4 through high school graduating seniors (U19), boys and girls. Mini Maestros and CVFC Youth handle U6–U10 foundations. Boys move into MLS NEXT, MLS NEXT Academy, Elite Academy, EA II, and the SoCal Flight system. Girls play DPL, NPL, GA Aspire (applied), and SoCal Flight. A dedicated goalkeeper pathway runs alongside, every age.",
  },
  {
    id: "missed-tryouts",
    category: "Tryouts & Evaluations",
    question: "What if my child missed tryouts or just moved to the area?",
    answer:
      "CVFC accepts year-round individual evaluations. Submit a request, and a coach will respond within 48 hours to set up a session. Players who join mid-season are welcome — we evaluate and place them where they can thrive.",
  },
  {
    id: "leagues",
    category: "Programs & Pathways",
    question: "Which competitive leagues does CVFC play in?",
    answer:
      "Boys: MLS NEXT, MLS NEXT Academy, Elite Academy (EA), Elite Academy II (EA II), and the SoCal Soccer League Flight system. Girls: Development Player League (DPL), National Premier League (NPL), Girls Academy Aspire (applied), and SoCal Flight. First Team and senior men compete in the Southwest Premier League and Lamar Hunt US Open Cup qualifying rounds.",
  },
  {
    id: "where-practice",
    category: "Practice & Games",
    question: "Where do practices and games happen?",
    answer:
      "Primary training at Victory Christian Academy (810 Buena Vista Way, Chula Vista). Indoor specialty work at Indoor Training Center (925 Hale Pl, #A3). Match days often at Hoover High School. Community-level training at Mountain Hawk, Salt Creek, Eucalyptus, Veterans, Bonita Long Canyon, Lauderbach, Rohr, and Harvest parks across the South Bay.",
  },
  {
    id: "goalkeeper-pathway",
    category: "Programs & Pathways",
    question: "Do you have a goalkeeper-specific program?",
    answer:
      "Yes — CVFC runs a dedicated goalkeeper pathway from Mini Maestros through U19, with year-round GK-specific sessions led by experienced goalkeeper coaches. Indoor work at Indoor Training Center sharpens technique and reaction speed in the off-season.",
  },
  {
    id: "languages",
    category: "About the Club",
    question: "Are coaching and registration available in Spanish?",
    answer:
      "Yes. CVFC was founded by and for South Bay families and operates fully in both English and Spanish. Coaches, evaluators, and administrative staff serve players and parents in either language.",
  },
  {
    id: "vs-surf-albion",
    category: "About the Club",
    question:
      "How does CVFC compare to bigger national clubs like Surf or Albion?",
    answer:
      "Surf operates 4 California branches and is the top ECNL club in San Diego. Albion runs 30+ branches across the United States. CVFC is one community-rooted club that has been in Chula Vista continuously since 1982, with MLS NEXT and Elite Academy access at far lower cost (~$800–$2,000 vs Surf $8,000+). Same coaches across years. 501(c)(3) nonprofit — every dollar reinvested. Different model, different fit.",
  },
  {
    id: "how-old-is-cvfc",
    category: "About the Club",
    question: "How long has Chula Vista FC been around?",
    answer:
      "Since 1982 — over 44 years of player development in the South Bay. CVFC is the longest-running MLS NEXT pathway club in South County San Diego.",
  },
  {
    id: "do-players-go-pro",
    category: "Outcomes",
    question: "Do CVFC players go pro?",
    answer:
      "Recent CVFC alumni have signed professional contracts with MLS Colorado Rapids (Gavin Jestand), FC Dallas (Quincy Lamar), Atlas FC Academy (Joaquin Jackson), Club Tijuana Xolos (Anthony Valadez, Bryan Yael Ramos, Emilio Silva), and Club Rayados de Monterrey (Benjamin de la Herran). The pathway exists, with named outcomes — but our promise is that every player who comes through CVFC leaves a better player and person.",
  },
  {
    id: "how-to-sign-up",
    category: "Tryouts & Evaluations",
    question: "How do I sign up?",
    answer:
      "Request an evaluation at chulavistafc.com/evaluations (also at /tryouts). Choose your player's pathway and birth year, and a coach will follow up within 48 hours to set up the session.",
  },
  {
    id: "team-selection",
    category: "Tryouts & Evaluations",
    question: "How are teams formed and selected?",
    answer:
      "Teams are formed by age band and evaluated ability so every player is placed where they'll be challenged but able to grow. Coaches review evaluations as a staff and place players in MLS NEXT, MLS NEXT Academy, EA, EA II, DPL, NPL, GA Aspire, or the SoCal Flight tier that fits their current development.",
  },
];
