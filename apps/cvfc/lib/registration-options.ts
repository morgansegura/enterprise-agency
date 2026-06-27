// Player-profile options for the registration form. Client-safe (no server deps).
// "Highest level played" differs by gender; the girls list is a placeholder until
// Morgan provides the girls-specific levels.

export type PlayerGender = "boys" | "girls";

export const PATHWAY_LABELS: Record<PlayerGender, string> = {
  boys: "Boys Pathway",
  girls: "Girls Pathway",
};

const BOYS_LEVELS = [
  "MLS NEXT",
  "Elite Club National League (ECNL)",
  "MLS NEXT 2",
  "Elite Club Regional League (ECRL)",
  "Elite Academy (EA)",
  "EA 2",
  "SoCal Flight 1",
  "SoCal Flight 2",
  "SoCal Flight 3",
  "Recreational / AYSO",
  "New to club soccer",
];

const GIRLS_LEVELS = [
  "Girls Academy (GA)",
  "Elite Club National League (ECNL)",
  "GA Aspire",
  "Elite Club Regional League (ECRL)",
  "Development Player League (DPL)",
  "National Premier League (NPL)",
  "SoCal Flight 1",
  "SoCal Flight 2",
  "SoCal Flight 3",
  "Recreational / AYSO",
  "New to club soccer",
];

export const LEVELS_BY_GENDER: Record<PlayerGender, string[]> = {
  boys: BOYS_LEVELS,
  girls: GIRLS_LEVELS,
};

// Union of all level labels (for the Monday dropdown column).
export const ALL_LEVELS = Array.from(
  new Set([...LEVELS_BY_GENDER.boys, ...LEVELS_BY_GENDER.girls]),
);

export const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

// "Where did you hear about tryouts?" — keeps referral data clean/structured.
export const REFERRAL_SOURCES = [
  "A CVFC coach",
  "Friend or family",
  "Current CVFC player or family",
  "Social media",
  "Web search",
  "Flyer or event",
  "Other",
];
