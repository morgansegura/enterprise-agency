/** Champions page content — Championships + Signings. Mock-first: renders as the
 *  fallback until the CMS page provides blocks. Owner edits in the CMS. Both
 *  sections use the portrait-grid card module. Compiled from the club's history
 *  (our-story) + news; the club can add photos, colleges, and more in the CMS. */

import type { PortraitEntry } from "@/components/feature/portrait-grid";

export const CHAMPIONSHIPS: PortraitEntry[] = [
  {
    id: "mls-next-cup-finalists-2026",
    name: "MLS NEXT Cup Finalists",
    role: "B2013 MLS NEXT — first in club history",
    credential: "2026",
  },
  {
    id: "state-cup-2026",
    name: "State Cup Champions",
    role: "B2014 Tuilla",
    credential: "2026",
  },
  {
    id: "socal-state-cup-2025",
    name: "SoCal State Cup Champions",
    role: "B2011 Villa",
    credential: "2025",
  },
  {
    id: "southwest-premier-2024",
    name: "Southwest Premier League Champions",
    role: "First Team",
    credential: "2024",
  },
  {
    id: "socal-state-cup-2022",
    name: "SoCal State Cup Champions",
    role: "B2012 Villa",
    credential: "2022",
  },
  {
    id: "adult-state-cup-2018",
    name: "CalSouth Adult State Cup Champions",
    role: "Adult Team",
    credential: "2018",
  },
  {
    id: "national-cup-2014",
    name: "CalSouth National Cup Champions",
    role: "U19",
    credential: "2013–14",
  },
  {
    id: "adult-regional-2014",
    name: "Adult Regional Champions",
    role: "Salt Lake City",
    credential: "2013–14",
  },
];

export const SIGNINGS: PortraitEntry[] = [
  {
    id: "gavin-jestand",
    name: "Gavin Jestand",
    role: "MLS · Colorado Rapids",
    credential: "2026",
  },
  {
    id: "quincy-lamar",
    name: "Quincy Lamar",
    role: "MLS · FC Dallas",
    credential: "2026",
  },
  {
    id: "joaquin-jackson",
    name: "Joaquin Jackson",
    role: "Liga MX · Atlas FC Academy",
    credential: "2025",
  },
  {
    id: "anthony-valadez",
    name: "Anthony Valadez",
    role: "Liga MX · Club Tijuana",
    credential: "2025",
  },
  {
    id: "benjamin-de-la-herran",
    name: "Benjamin de la Herran",
    role: "Liga MX · Rayados de Monterrey",
    credential: "2024",
  },
  {
    id: "bryan-yael-ramos",
    name: "Bryan Yael Ramos",
    role: "Liga MX · Club Tijuana",
    credential: "2023",
  },
  {
    id: "emilio-silva",
    name: "Emilio Silva",
    role: "Liga MX · Club Tijuana",
    credential: "2023",
  },
];
