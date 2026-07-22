/** Champions page content — Championships + Signings. Mock-first: renders as the
 *  fallback until the CMS page provides blocks. Owner edits in the CMS. Both
 *  sections use the portrait-grid card module. */

import type { PortraitEntry } from "@/components/feature/portrait-grid";

export const CHAMPIONSHIPS: PortraitEntry[] = [
  {
    id: "mls-next-cup-2026",
    name: "MLS NEXT Cup Finalists",
    role: "B2013 MLS NEXT",
    credential: "2026",
  },
  {
    id: "socal-state-cup-2025",
    name: "SoCal State Cup Champions",
    role: "B2011 Villa",
    credential: "2025",
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
    role: "Colorado Rapids",
    credential: "2025",
  },
  {
    id: "quincy-lamar",
    name: "Quincy Lamar",
    role: "FC Dallas",
    credential: "2025",
  },
];
