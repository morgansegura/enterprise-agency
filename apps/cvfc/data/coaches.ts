/**
 * CVFC coaching staff — verified roster sourced from chulavistafc.com/coach/.
 * Powers /about/coaching-staff and the homepage PortraitGrid.
 *
 * Administrators live separately in /data/administrators.ts (when added).
 *
 * ============================================================
 *  HOW TO UPDATE A COACH
 * ============================================================
 *  - New coach joins CVFC          → push a new entry to COACHES
 *  - Coach earns a license/degree  → add to `credentials[]`
 *  - Team wins a championship      → add to `achievements[]`
 *  - Coach gets a new team         → update `team` (display string)
 *  - Coach changes pathway/program → update `pathway[]`/`programs[]`
 *  - Coach goes on leave           → set `status: "on-leave"`
 *  - Coach departs CVFC            → set `status: "departed"` (soft delete;
 *                                    they vanish from the directory but
 *                                    historical pages/awards still resolve)
 *  - Bio/photo/contact update      → update those fields directly
 *
 *  Eventually this file goes away — CMS (see project_enterprise_agency_cms)
 *  serves the same shape via API.
 * ============================================================
 */

const PHOTO_BASE = "https://chulavistafc.com/wp-content/uploads";

export type CoachPathway = "boys" | "girls" | "goalkeeper" | "foundations";

export type CoachProgram =
  | "mls-next-homegrown"
  | "mls-next"
  | "mls-next-academy"
  | "elite-academy"
  | "ea-2"
  | "dpl"
  | "socal-flight"
  | "mini-maestros";

export type CoachRole =
  | "head-coach"
  | "assistant-coach"
  | "director-coach"
  | "specialist";

export type CoachStatus = "active" | "on-leave" | "departed";

export type Coach = {
  id: string;
  name: string;
  title: string;
  role: CoachRole;
  pathway: CoachPathway[];
  programs: CoachProgram[];
  team?: string;
  /** Explicit birth years the coach is responsible for (e.g. [2007, 2008, 2009] for U19). Preferred over team-string parsing. */
  birthYears?: number[];
  credentials?: string[];
  achievements?: string[];
  bio?: string;
  image?: { src: string; alt: string };
  contact?: { email?: string; phone?: string };
  isFeatured?: boolean;
  status?: CoachStatus;
  joinedYear?: number;
};

export const COACHES: Coach[] = [
  {
    id: "hector-diaz",
    name: "J. Hector Diaz",
    title: "Academy Director · Head Coach, B2010 MLS NEXT",
    role: "director-coach",
    pathway: ["boys"],
    programs: ["mls-next"],
    team: "B2010 MLS NEXT",
    credentials: ["UEFA C License", "Academy Director"],
    image: {
      src: `${PHOTO_BASE}/2023/12/JHD_Headshot.png`,
      alt: "J. Hector Diaz",
    },
    isFeatured: true,
  },
  {
    id: "fernando-mares",
    name: "Fernando Mares",
    title: "Assistant Academy Director · Head Coach, B2011 MLS NEXT",
    role: "director-coach",
    pathway: ["boys"],
    programs: ["mls-next"],
    team: "B2011 MLS NEXT",
    credentials: [
      "USSF B License",
      "Mexican Federation Technical Director License",
      "CVFC Alumnus",
    ],
    bio: "Proud CVFC alumnus and former player of the club from 2000 to 2010. Pursuing an MBA in Sports Management.",
    image: {
      src: `${PHOTO_BASE}/2023/06/Fernando_Mares-e1688029752768-1568x1986.png`,
      alt: "Fernando Mares",
    },
    isFeatured: true,
  },
  {
    id: "isaac-valencia",
    name: "Isaac Valencia",
    title: "Head Coach, B2009 MLS NEXT",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["mls-next"],
    team: "B2009 MLS NEXT",
    credentials: [
      "USSF C License",
      "NCAA Big West Div I (UC Riverside)",
      "NSCAA Jr College All-American",
    ],
    bio: "6+ years of coaching experience including MLS Next, Elite Academy, and SoCal. Two-time NSCAA Conference Champion and team captain at Mt. San Antonio College. BA in Sociology, AA in Kinesiology.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Isaac_Valencia_smile-1568x1045.png`,
      alt: "Isaac Valencia",
    },
    isFeatured: true,
  },
  {
    id: "khadim-seye",
    name: "Khadim Seye",
    title: "Head Coach, B2007 & B2012 MLS NEXT",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["mls-next"],
    team: "B2007 MLS NEXT · B2012 MLS NEXT",
    image: {
      src: `${PHOTO_BASE}/2025/07/2ec7f52e-a795-4272-b960-2c7c47dfbcb9.jpeg`,
      alt: "Khadim Seye",
    },
  },
  {
    id: "jose-antonio-govea",
    name: "Jose Antonio Govea",
    title: "Head Coach, B2013 MLS NEXT",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["mls-next"],
    team: "B2013 MLS NEXT",
    credentials: ["USSF B License"],
    bio: "Committing over 15+ years to serving the South Bay — born and raised in San Diego. Vocation is to inspire a growth mindset.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Antonio_Govea-1568x1045.png`,
      alt: "Jose Antonio Govea",
    },
    isFeatured: true,
  },
  {
    id: "marcos-valadez",
    name: "Marcos Valadez",
    title: "Head Coach, B2013 MLS NEXT Academy & BU09 Guaje",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["mls-next-academy", "socal-flight"],
    team: "B2013 MLS NEXT Academy · BU09 Guaje",
    credentials: [
      "7 yrs pro · Mexican Club Pachuca",
      "Physical Education degree (UABC)",
    ],
    bio: "Played professionally for 7 years for Mexican Club Pachuca. Started coaching in Tecate, BC, Mexico (2010–12).",
    image: {
      src: `${PHOTO_BASE}/2023/07/Marcos_Valadez-1568x1045.png`,
      alt: "Marcos Valadez",
    },
    joinedYear: 2017,
    isFeatured: true,
  },
  {
    id: "javier-castorena",
    name: "Javier Castorena",
    title: "Head Coach, B2009 MLS NEXT Academy",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["mls-next-academy"],
    team: "B2009 MLS NEXT Academy",
    credentials: [
      "USSF C License",
      "NASM Sports Performance Coach",
      "MS Sports Performance & Injury Prevention",
    ],
    bio: "11 years coaching. Played NCAA Division 2 at Point Loma Nazarene and at Chula Vista Pumas (now CVFC) from 1999 to 2008.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Javi_Castorena.png`,
      alt: "Javier Castorena",
    },
  },
  {
    id: "hector-romo",
    name: "Hector Romo",
    title: "Head Coach, B2010 MLS NEXT Academy",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["mls-next-academy"],
    team: "B2010 MLS NEXT Academy",
    credentials: [
      "US Soccer D License",
      "NSCAA Regional Diploma",
      "Coerver Coaching Youth Diplomas",
    ],
    bio: "16 years coaching with diverse youth experience.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Hector_Romo-e1700232407410.png`,
      alt: "Hector Romo",
    },
  },
  {
    id: "ricardo-del-castillo",
    name: "Ricardo Del Castillo",
    title: "Head Coach, B2007 & B2011 MLS NEXT Academy",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["mls-next-academy"],
    team: "B2007 MLS NEXT Academy · B2011 MLS NEXT Academy",
    credentials: [
      "US Soccer 4v4, 9v9 & 11v11 Licenses",
      "USSF D License (in progress)",
    ],
    bio: "Born in Tijuana; played for Club Tijuana's 3rd division team. Coaching since 2017.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Ricardo_DelCastillo.png`,
      alt: "Ricardo Del Castillo",
    },
  },
  {
    id: "hernan-maldonado",
    name: "Hernan Maldonado",
    title: "Head Coach, B2012 MLS NEXT Academy",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["mls-next-academy"],
    team: "B2012 MLS NEXT Academy",
    bio: "Passionate about teaching the game of fútbol. An active player.",
    image: {
      src: `${PHOTO_BASE}/2022/12/Hernan_Maldonado-1568x1045.png`,
      alt: "Hernan Maldonado",
    },
  },
  {
    id: "alberto-diaz",
    name: "Alberto Diaz",
    title: "Head Coach, B2014 & B2015 Elite Academy",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["elite-academy"],
    team: "B2014 EA · B2015 EA",
    credentials: ["Former US Youth National Team"],
    achievements: [
      "Lamar Hunt Open Cup — Player of the Tournament",
      "CalSouth Player of the Year",
      "Top 2011 team defeated LA Galaxy and LAFC",
    ],
    bio: "Former United States Youth National Team player. Coaching success includes players developed for MLS Youth Academies.",
    image: {
      src: `${PHOTO_BASE}/2023/07/U-1568x1045.png`,
      alt: "Alberto Diaz",
    },
    isFeatured: true,
  },
  {
    id: "luis-guzman",
    name: "Luis Guzman",
    title: "Head Coach, B2009 Elite Academy 2",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["ea-2"],
    team: "B2009 EA 2",
    bio: "Started coaching in 2013. Previously assisted with teams in Las Vegas.",
    image: {
      src: `${PHOTO_BASE}/2025/07/53517d04ec70095bbacb153e985a82ce.avif`,
      alt: "Luis Guzman",
    },
    joinedYear: 2020,
  },
  {
    id: "oscar-briseno",
    name: "Oscar Briseno",
    title: "Head Coach, B2010 Elite Academy 2",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["ea-2"],
    team: "B2010 EA 2",
    credentials: ["US Soccer D License", "BS International Business"],
    bio: "Born in Los Angeles, raised in Tijuana and Chula Vista. 10 years coaching.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Oscar_Briseno-e1700232341716.png`,
      alt: "Oscar Briseno",
    },
  },
  {
    id: "martin-sanchez",
    name: "Martin Sanchez",
    title: "Head Coach, B2011 EA 2 & BU07 Guaje",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["ea-2", "socal-flight"],
    team: "B2011 EA 2 · BU07 Guaje",
    image: {
      src: `${PHOTO_BASE}/2024/06/Martin-Sanchez.png`,
      alt: "Martin Sanchez",
    },
  },
  {
    id: "jose-antonio-lizaola",
    name: "Jose Antonio Lizaola",
    title: "Head Coach, G2007 DPL & GU10 Villa",
    role: "head-coach",
    pathway: ["girls"],
    programs: ["dpl", "socal-flight"],
    team: "G2007 DPL · GU10 Villa",
    bio: '"The important thing is not only to develop good soccer players but, more importantly, to shape excellent human beings."',
    image: {
      src: `${PHOTO_BASE}/2023/07/Antonio_Lizaola-1568x1045.png`,
      alt: "Jose Antonio Lizaola",
    },
  },
  {
    id: "james-hendrix",
    name: "James Hendrix",
    title: "Head Coach, G2009 DPL",
    role: "head-coach",
    pathway: ["girls"],
    programs: ["dpl"],
    team: "G2009 DPL",
    bio: "Born and raised in San Diego. Played competitive youth soccer throughout the area, competed at San Diego City College. Began coaching journey with DV7 Soccer Academy in 2018.",
    image: {
      src: `${PHOTO_BASE}/2025/04/IMG_4096.jpg`,
      alt: "James Hendrix",
    },
  },
  {
    id: "alfredo-toxqui",
    name: "Alfredo Toxqui",
    title: "Head Coach, G2010 DPL",
    role: "head-coach",
    pathway: ["girls"],
    programs: ["dpl"],
    team: "G2010 DPL",
    credentials: [
      "12 yrs pro · CHIVAS, Tijuana, Veracruz",
      "U-17 World Cup Japan '93",
      "Libertadores Cup",
    ],
    bio: "Played pro soccer for 12 years starting at CHIVAS. Goalkeeper who played in the U-17 World Cup in Japan '93 and the Libertadores Cup.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Alfredo_Toxqui-1568x1045.png`,
      alt: "Alfredo Toxqui",
    },
    isFeatured: true,
  },
  {
    id: "david-ochoa",
    name: "David Ochoa",
    title: "Head Coach, G2011 DPL",
    role: "head-coach",
    pathway: ["girls"],
    programs: ["dpl"],
    team: "G2011 DPL",
    bio: "13 years coaching, ignited by both his daughter's involvement in the sport and his profound passion.",
    image: {
      src: `${PHOTO_BASE}/2023/07/David_Ochoa-e1700231687634.png`,
      alt: "David Ochoa",
    },
  },
  {
    id: "alejandro-medel",
    name: "Alejandro Medel",
    title: "Head Coach, G2012 & G2013 DPL",
    role: "head-coach",
    pathway: ["girls"],
    programs: ["dpl"],
    team: "G2012 DPL · G2013 DPL",
    credentials: ["US National C License", "BS Computer Engineering"],
    bio: "Originally from San Diego; spent two decades in Chile. 16+ years of coaching experience.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Alejandro_Medel-1568x1045.png`,
      alt: "Alejandro Medel",
    },
    joinedYear: 2009,
  },
  {
    id: "freddy-aparicio",
    name: "Freddy Aparicio",
    title: "Head Coach, G2007",
    role: "head-coach",
    pathway: ["girls"],
    programs: ["dpl"],
    team: "G2007",
    bio: "Born and raised in San Diego. 20+ years playing soccer; 5 years coaching high school.",
    image: {
      src: `${PHOTO_BASE}/2024/06/IMG_2660.jpg`,
      alt: "Freddy Aparicio",
    },
  },
  {
    id: "jenny-rodriguez",
    name: "Jenny Rodriguez",
    title: "Head Coach, GU09 Villa",
    role: "head-coach",
    pathway: ["girls"],
    programs: ["socal-flight"],
    team: "GU09 Villa",
    credentials: ["MS Sport Psychology (in progress)", "CMPC candidate"],
    bio: "Born and raised in Chula Vista, played for the club for many years. Career-ending injury at the collegiate level. Pursuing Master's in Sport Psychology.",
    image: {
      src: `${PHOTO_BASE}/2025/03/Jenny.jpg`,
      alt: "Jenny Rodriguez",
    },
  },
  {
    id: "eduardo-romo",
    name: "Eduardo Romo",
    title: "Head Coach, GU08 Villa & BU13 Villa",
    role: "head-coach",
    pathway: ["girls", "boys"],
    programs: ["socal-flight"],
    team: "GU08 Villa · BU13 Villa",
    bio: "Born in San Diego. 14+ years coaching, started at Atlante San Diego FC.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Eddie_Romo-1568x1045.png`,
      alt: "Eduardo Romo",
    },
    joinedYear: 2020,
  },
  {
    id: "amanda-howard",
    name: "Amanda Howard",
    title: "Head Coach, GU07 Villa",
    role: "head-coach",
    pathway: ["girls"],
    programs: ["socal-flight"],
    team: "GU07 Villa",
    bio: "Started playing soccer at age six. Coaching career began at CVFC.",
    image: {
      src: `${PHOTO_BASE}/2025/04/IMG_8411-1568x1950.jpeg`,
      alt: "Amanda Howard",
    },
  },
  {
    id: "diego-mosqueda",
    name: "Diego Mosqueda",
    title: "Head Coach, BU11 Villa & BU12 Villa",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "BU11 Villa · BU12 Villa",
    bio: "Has both his sons playing for CVFC: B2012 EA and B2008 MLS NEXT.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Diego_Mosqueda.png`,
      alt: "Diego Mosqueda",
    },
    joinedYear: 2017,
  },
  {
    id: "jose-de-los-santos",
    name: "Jose De Los Santos",
    title: "Head Coach, B2007",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "B2007",
    credentials: ["USSF D License", "Hoover HS Boys & Girls Varsity"],
    bio: "Born in Los Angeles, raised in San Diego. Part of the San Diego soccer community for 20+ years as a player and 10 years as a coach.",
    image: {
      src: `${PHOTO_BASE}/2024/05/IMG_4260.jpg`,
      alt: "Jose De Los Santos",
    },
  },
  {
    id: "luis-ochoa",
    name: "Luis Ochoa",
    title: "Head Coach, B2010 Villa",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "B2010 Villa",
    image: {
      src: `${PHOTO_BASE}/2025/07/Luis-Ochoa-Coach.jpg`,
      alt: "Luis Ochoa",
    },
  },
  {
    id: "francisco-ramirez",
    name: "Francisco Ramirez",
    title: "Head Coach, B2011 Villa",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "B2011 Villa",
    bio: '"Coaching at CVFC has been a pleasure. Guiding talented youth has made me better."',
    image: {
      src: `${PHOTO_BASE}/2022/12/Francisco_Ramirez-1568x1045.png`,
      alt: "Francisco Ramirez",
    },
  },
  {
    id: "daniel-vergara",
    name: "Daniel Vergara",
    title: "Head Coach, BU09 Tuilla, BU11 Guaje & BU14 Villa",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "BU09 Tuilla · BU11 Guaje · BU14 Villa",
    bio: "Came from Spain two years ago. Grew up watching and playing soccer.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Daniel_Vergara.png`,
      alt: "Daniel Vergara",
    },
  },
  {
    id: "paulo-gustavo-serrano",
    name: "Paulo Gustavo Serrano",
    title: "Head Coach, BU15 Villa & BU13 Guaje",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "BU15 Villa · BU13 Guaje",
    bio: 'Soccer coach with 15+ years of experience. "Discipline and work are the tools to develop talent."',
    image: {
      src: `${PHOTO_BASE}/2024/11/IMG_3402-1.png`,
      alt: "Paulo Gustavo Serrano",
    },
  },
  {
    id: "aldo-huerta",
    name: "Aldo Huerta",
    title: "Head Coach, BU08 Villa",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "BU08 Villa",
    credentials: ["US Soccer D License (in progress)"],
    bio: "Born and raised in Chula Vista. College-level player who also played in the US Army against military teams. 4 years coaching competitive soccer.",
    image: {
      src: `${PHOTO_BASE}/2024/05/Huerta-pic.png`,
      alt: "Aldo Huerta",
    },
  },
  {
    id: "paul-abe",
    name: "Paul Abe",
    title: "Head Coach, BU12 Guaje",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "BU12 Guaje",
    image: {
      src: `${PHOTO_BASE}/2025/07/Attachment-1.jpeg`,
      alt: "Paul Abe",
    },
  },
  {
    id: "jose-altamirano",
    name: "Jose Altamirano",
    title: "Head Coach, BU10 Guaje",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "BU10 Guaje",
    credentials: [
      "US National Youth Soccer Team (2003–2010)",
      "San Diego State Men's Soccer (2009–2013)",
      "Pac-12 All-Academic (2011)",
    ],
    bio: "Played for the US National Youth Soccer Team and San Diego State Men's Soccer. SDSU Team's MVP (2010), Pac-12 All-Academic (2011), Best Newcomer (2009).",
    image: {
      src: `${PHOTO_BASE}/2023/07/Altamirano.jpg`,
      alt: "Jose Altamirano",
    },
  },
  {
    id: "juan-meza",
    name: "Juan Meza",
    title: "Head Coach, B2010 & BU12 Tuilla",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "B2010 Tuilla · BU12 Tuilla",
    image: {
      src: `${PHOTO_BASE}/2025/10/Juan-Meza.jpeg`,
      alt: "Juan Meza",
    },
  },
  {
    id: "mathias-medel",
    name: "Mathias Medel",
    title: "Director of Mini Maestros · Head Coach, BU09 Villa",
    role: "director-coach",
    pathway: ["foundations", "boys"],
    programs: ["mini-maestros", "socal-flight"],
    team: "BU09 Villa",
    credentials: [
      "Director of Mini Maestros",
      "Juventus Youth Academy Camps (2023)",
    ],
    bio: "Born in Chile, moved to USA at age six, played his entire life with CVFC. SDSU graduate (Journalism). Started coaching at 18.",
    image: {
      src: `${PHOTO_BASE}/2025/04/IMG_9214-1568x2010.jpg`,
      alt: "Mathias Medel",
    },
    isFeatured: true,
  },
  {
    id: "jesse-lopez",
    name: "Jesse Lopez",
    title: "Head Coach, BU10 Villa",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "BU10 Villa",
    bio: "Started playing at a young age. Played in Chula Vista since 2012.",
    image: {
      src: `${PHOTO_BASE}/2022/12/Jesse_Lopez-1568x1045.png`,
      alt: "Jesse Lopez",
    },
  },
  {
    id: "jesse-marquez",
    name: "Jesse Marquez",
    title: "Head Coach, BU08 Guaje",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "BU08 Guaje",
    image: {
      src: `${PHOTO_BASE}/2026/03/Jesse-Marquez.jpeg`,
      alt: "Jesse Marquez",
    },
  },
  {
    id: "armando-valencia",
    name: "Armando Valencia",
    title: "Head Coach, BU07 Villa",
    role: "head-coach",
    pathway: ["boys"],
    programs: ["socal-flight"],
    team: "BU07 Villa",
    credentials: ["3rd Division Mexico · Necaxa"],
    bio: "Played for almost 15 years; achieved the goal of playing third division football in Mexico City for Necaxa.",
    image: {
      src: `${PHOTO_BASE}/2025/04/IMG_0761-1568x1711.jpeg`,
      alt: "Armando Valencia",
    },
  },

  // ==================== GOALKEEPER STAFF ====================
  {
    id: "ricardo-villalva",
    name: "Ricardo Villalva",
    title: "Goalkeeper Coach, MLS NEXT",
    role: "specialist",
    pathway: ["goalkeeper", "boys"],
    programs: ["mls-next-homegrown", "mls-next-academy"],
    team: "MLS NEXT Goalkeepers",
    credentials: ["3rd Division Mexico · Alebrijes de Oaxaca"],
    bio: "Started as an assistant high school coach in 2018. Took an opportunity to play with the third division of Alebrijes de Oaxaca in Mexico City.",
    image: {
      src: `${PHOTO_BASE}/2024/06/image0-20-1-e1707607182961.jpeg`,
      alt: "Ricardo Villalva",
    },
  },
  {
    id: "carlos-arce",
    name: "Carlos Arce",
    title: "Goalkeeping Coach",
    role: "specialist",
    pathway: ["goalkeeper"],
    credentials: [
      "Cal Poly San Luis Obispo (full scholarship)",
      "Xolos U15 · Mexico 3rd Division",
      "BS Kinesiology (2022)",
    ],
    achievements: [
      "Cal Poly SLO — 2nd all-time goals against avg, 4th in clean sheets",
      "Nomads U18 — US Development Academy semifinals",
    ],
    bio: "Played goalkeeper for Xolos U15 and Mexico's Third Division. Earned a full scholarship to Cal Poly San Luis Obispo, coached by former US National Team head coach Steve Sampson.",
    image: {
      src: `${PHOTO_BASE}/2024/06/f93b1145-b81a-4685-8979-0bc4fd3d8f0c-238x300-1.jpg`,
      alt: "Carlos Arce",
    },
    programs: [],
  },
  {
    id: "victor-duran",
    name: "Victor Duran",
    title: "Goalkeeper Coach",
    role: "specialist",
    pathway: ["goalkeeper"],
    image: {
      src: `${PHOTO_BASE}/2024/06/Victor-Duran.jpeg`,
      alt: "Victor Duran",
    },
    programs: [],
  },
];

export type CoachFilter = {
  id: string;
  label: string;
  match: (c: Coach) => boolean;
};

export const COACH_FILTERS: CoachFilter[] = [
  { id: "all", label: "All Coaches", match: () => true },
  {
    id: "boys",
    label: "Boys Pathway",
    match: (c) => c.pathway.includes("boys"),
  },
  {
    id: "girls",
    label: "Girls Pathway",
    match: (c) => c.pathway.includes("girls"),
  },
  {
    id: "goalkeepers",
    label: "Goalkeepers",
    match: (c) => c.pathway.includes("goalkeeper"),
  },
  {
    id: "foundations",
    label: "Foundations",
    match: (c) =>
      c.pathway.includes("foundations") || c.programs.includes("mini-maestros"),
  },
];

/** Hide departed coaches from public-facing views. On-leave still shows. */
export function getActiveCoaches(coaches: Coach[] = COACHES): Coach[] {
  return coaches.filter((c) => c.status !== "departed");
}

export function filterCoaches(coaches: Coach[], filterId: string): Coach[] {
  const f = COACH_FILTERS.find((x) => x.id === filterId);
  if (!f) return coaches;
  return coaches.filter(f.match);
}

export function getFeaturedCoaches(coaches: Coach[] = COACHES): Coach[] {
  return getActiveCoaches(coaches).filter((c) => c.isFeatured);
}

/**
 * Parse the `team` string into the birth years that coach is responsible for.
 * Handles both explicit birth-year teams (B2010, G2009) and U-band teams
 * (BU09, GU07) — for U-bands we anchor against SEASON_START_YEAR so the
 * mapping rolls forward each year.
 *
 * Keep in sync with lib/evaluations.ts:SEASON_START_YEAR.
 */
const SEASON_START_YEAR = 2026;

export function getCoachBirthYears(coach: Coach): number[] {
  // Prefer explicit field (CMS-shape). Fall back to parsing team string.
  if (coach.birthYears && coach.birthYears.length > 0) {
    return [...coach.birthYears].sort((a, b) => a - b);
  }
  if (!coach.team) return [];
  const years = new Set<number>();
  for (const m of coach.team.matchAll(/[BG](\d{4})/g)) {
    years.add(Number(m[1]));
  }
  for (const m of coach.team.matchAll(/[BG]U(\d{1,2})/g)) {
    years.add(SEASON_START_YEAR - Number(m[1]));
  }
  return Array.from(years).sort((a, b) => a - b);
}

export type PlayerLookup = {
  pathway: CoachPathway | null;
  birthYear: number | null;
};

/**
 * Match coaches whose team(s) cover the given pathway + birth year.
 * `pathway` "boys" matches B-team coaches; "girls" matches G-team coaches.
 * `pathway` "goalkeeper" matches any coach tagged as goalkeeper pathway.
 */
export function findCoachesForPlayer(
  coaches: Coach[],
  lookup: PlayerLookup,
): Coach[] {
  const { pathway, birthYear } = lookup;
  if (!pathway || !birthYear) return [];

  return coaches.filter((c) => {
    if (!c.pathway.includes(pathway)) return false;
    const years = getCoachBirthYears(c);
    return years.includes(birthYear);
  });
}

/** Birth-year options for the player lookup picker (U6 through U19). */
export function getCoachLookupBirthYears(): number[] {
  const oldest = SEASON_START_YEAR - 19;
  const youngest = SEASON_START_YEAR - 6;
  const years: number[] = [];
  for (let y = youngest; y >= oldest; y--) years.push(y);
  return years;
}
