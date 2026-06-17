/**
 * CVFC administrators / directors — verified roster sourced from
 * chulavistafc.com/director/. Powers /about/administrators.
 *
 * ============================================================
 *  HOW TO UPDATE
 *  - New director joins  → push a new entry to ADMINISTRATORS
 *  - Title/role changes  → update `title`
 *  - Photo update        → update `image.src`
 *  - Departure           → set status: "departed" (soft delete)
 *
 *  Eventually this file goes away — CMS serves the same shape via API.
 * ============================================================
 */

const PHOTO_BASE = "https://chulavistafc.com/wp-content/uploads";

export type AdminStatus = "active" | "on-leave" | "departed";

export type AdminMember = {
  id: string;
  name: string;
  title: string;
  /** Free-form department grouping (optional). e.g. "Executive", "Operations". */
  department?: string;
  credentials?: string[];
  bio?: string;
  image?: { src: string; alt: string };
  contact?: { email?: string; phone?: string };
  status?: AdminStatus;
  joinedYear?: number;
};

export const ADMINISTRATORS: AdminMember[] = [
  {
    id: "hector-diaz",
    name: "J. Hector Diaz",
    title: "Academy Director",
    department: "Executive",
    credentials: ["UEFA C License"],
    bio: "J. Hector Diaz began his coaching career at 15 years old as an assistant coach for Aztecs FC. He went on to lead Chula Vista FC's player development across every age group, earning his UEFA C License in Scotland.",
    image: {
      src: `${PHOTO_BASE}/2023/12/JHD_Headshot.png`,
      alt: "J. Hector Diaz",
    },
  },
  {
    id: "diego-gomez",
    name: "Diego Gomez",
    title: "Technical Director",
    department: "Executive",
    credentials: ["Real Madrid Youth Academy", "FC Barcelona Youth Academy"],
    bio: "Diego began his football journey in the elite youth academies of Real Madrid and FC Barcelona, where he developed as a player. He brings that European technical foundation to CVFC's player development model.",
    image: {
      src: `${PHOTO_BASE}/2025/07/Diego-Gomez-pic-scaled.jpg`,
      alt: "Diego Gomez",
    },
  },
  {
    id: "javier-castorena",
    name: "Javier Castorena",
    title: "Director of Operations",
    department: "Operations",
    credentials: [
      "MS Sports Performance & Injury Prevention",
      "BS Sports Medicine",
    ],
    bio: "Javier holds a Bachelor's in Sports Medicine from Point Loma Nazarene and a Master's in Sports Performance and Injury Prevention from Cal U. A CVFC alumnus from the Chula Vista Pumas era (1999–2008), he now leads day-to-day club operations.",
    image: {
      src: `${PHOTO_BASE}/2023/07/Javi_Castorena.png`,
      alt: "Javier Castorena",
    },
  },
  {
    id: "ruben-cano",
    name: "Ruben Cano",
    title: "Director of Coaching",
    department: "Coaching",
    credentials: ["International Instructor (24+ countries)"],
    bio: "Ruben Cano's reputation as both a recognized and respected instructor has allowed him to share his coaching seminars with fellow coaches in over 24 countries. He oversees the CVFC coaching curriculum and the development of coaches across every program.",
    image: {
      src: `${PHOTO_BASE}/2024/01/Ruben_Cano_2-scaled.jpg`,
      alt: "Ruben Cano",
    },
  },
];

export function getActiveAdministrators(
  admins: AdminMember[] = ADMINISTRATORS,
): AdminMember[] {
  return admins.filter((a) => a.status !== "departed");
}
