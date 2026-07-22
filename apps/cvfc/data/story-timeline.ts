/** Our Story timeline — club history milestones. Mock-first: renders as the
 *  fallback until the CMS `storyTimeline` block provides content. Owner edits
 *  the full set in the CMS; this is the seed + graceful default. */

export type StoryEntry = {
  year: string;
  title: string;
  body?: string;
  image?: { src: string; alt: string };
};

export type StoryTimelineContent = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  entries: StoryEntry[];
};

export const STORY_TIMELINE: StoryTimelineContent = {
  eyebrow: "Our Story",
  heading: "Four decades on the pitch.",
  intro:
    "From a handful of South Bay teams in 1982 to MLS NEXT Cup finalists — the milestones that built Chula Vista FC.",
  entries: [
    {
      year: "1982",
      title: "The club is founded",
      body: "Jim Loughney founds the club as the Chula Vista Scorpions to serve South Bay youth soccer, starting with six to eight teams and San Diego State alumnus Allen Kelly on the sideline.",
    },
    {
      year: "2001",
      title: "A long-term vision",
      body: "Hugo Molina becomes president and sets long-term goals; the club grows to oversee 50+ teams across the region.",
    },
    {
      year: "2011",
      title: "An academy takes shape",
      body: "Jose Hector Diaz joins as academy director and the club is renamed Pumas Premier FC.",
    },
    {
      year: "2013–14",
      title: "National Cup champions",
      body: "The U19s win the CalSouth National Cup and the adult team takes the Adult Regional Championship in Salt Lake City. The club becomes Chula Vista FC.",
    },
    {
      year: "2015",
      title: "U.S. Open Cup + Development Academy",
      body: "The adult team reaches the third round of the Lamar Hunt U.S. Open Cup (beating FC Tucson and Phoenix Rising), and CVFC earns the South Bay's first U.S. Soccer Development Academy membership.",
    },
    {
      year: "2017",
      title: "A five-year pro plan",
      body: "A 3–2 U.S. Open Cup win over Albion SC, and UEFA PRO-licensed coach Ruben Caño (Real Madrid CF background) is appointed to build a five-year professionalization plan.",
    },
    {
      year: "2018",
      title: "Second academy age group",
      body: "CVFC is awarded a second Development Academy age group (U13) and the adult team wins the CalSouth Adult State Cup Championship.",
    },
    {
      year: "2019",
      title: "DV7 partnership",
      body: "The B2008s reach the State Cup Finals and the club signs a five-year partnership with David Villa's DV7 Academy.",
    },
    {
      year: "2020",
      title: "Founding member of MLS NEXT",
      body: "CVFC becomes a founding member of the MLS NEXT League and the Elite Academy League; the B2008s reach the National Cup Finals.",
    },
    {
      year: "2022",
      title: "Mini Maestros launches",
      body: "The B2012 Villa win the SoCal State Cup Championships, and the Mini Maestros program launches for the club's youngest players.",
    },
    {
      year: "2024",
      title: "A record-breaking season",
      body: "The B2011 (U13) MLS NEXT team finishes the regular season 28–2–2 and sweeps all three MLS NEXT Cup & Showcase games; the club joins Elite Academy 2.",
    },
    {
      year: "2025",
      title: "Into the DPL",
      body: "The B2011 Villa win the SoCal State Cup Championships and CVFC is accepted into the Development Player League (DPL).",
    },
    {
      year: "2026",
      title: "First-ever MLS NEXT Cup finalists",
      body: "The B2013 MLS NEXT team becomes MLS NEXT Cup finalists — a first in club history — as more age groups reach State Cup finals.",
    },
    {
      year: "Today",
      title: "The same core values",
      body: "44 years on, the club still runs on attitude, unity, respect, and passion — developing players and people across the CVFC pathway.",
    },
  ],
};
