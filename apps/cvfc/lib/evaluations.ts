/**
 * Evaluation routing — maps a parent's player profile (track + birth year)
 * to the correct external signup URL (PlayMetrics or JotForm).
 *
 * The modal does not capture signup data. The destination form (PlayMetrics
 * for older/competitive ages, JotForm for younger/recreational ages) owns
 * the actual registration flow. We disambiguate, then hand off.
 *
 * ============================================================
 *  TO ROLL THIS LIST FORWARD EACH SEASON:
 *    1. Bump SEASON_START_YEAR by 1
 *    2. Update SEASON_LABEL
 *    3. (Optional) Update individual signupUrl values if CVFC creates
 *       new PlayMetrics programs for the new season
 *  Birth years auto-shift — programs are declared by U-band.
 * ============================================================
 *
 * Source: https://chulavistafc.com/join-our-club/
 */

export type EvaluationTrack = "boys" | "girls" | "goalkeeper";

export type EvaluationProgram = {
  id: string;
  track: EvaluationTrack;
  birthYears: number[];
  label: string;
  status: "open" | "closed" | "year-round";
  signupUrl: string;
  windowLabel?: string;
  description?: string;
};

// ============================================================
// Season anchor — change these two lines each year
// ============================================================
const SEASON_START_YEAR = 2026;
const SEASON_LABEL = "2026/27 Season";

// ============================================================
// PlayMetrics tokens (two distinct programs in CVFC's PlayMetrics)
// ============================================================
const PM_TOKEN_A =
  "TG9naW4tQ2x1Yi52MS02OC0xNzc0OTk1NjAzfFFDTFRmMjRyMDdTRUM1VjE2L0JwY3RGZi9nWDJLWmRhSzNPMU1MdkZRWk09";
const PM_TOKEN_B =
  "TG9naW4tQ2x1Yi52MS02OC0xNzgwMDYyNzYwfFJKWXk1TGxab2IzNTNFNVY3QnJJenVwc0I1TktFRm94ZG12V0VYcVVaRnM9";

const pm = (token: string, programId: string) =>
  `https://playmetrics.com/signup?clubToken=${token}&program_id=${programId}`;

// ============================================================
// Helper — declare programs by U-band, birthYears computed automatically
// ============================================================
const uToBirthYear = (u: number) => SEASON_START_YEAR - u;

type ProgramInput = {
  id: string;
  track: EvaluationTrack;
  uBands: number[];
  label: string;
  signupUrl: string;
  status?: EvaluationProgram["status"];
  description?: string;
};

const pgm = (input: ProgramInput): EvaluationProgram => ({
  id: input.id,
  track: input.track,
  birthYears: input.uBands.map(uToBirthYear),
  label: input.label,
  status: input.status ?? "open",
  signupUrl: input.signupUrl,
  windowLabel: SEASON_LABEL,
  description: input.description,
});

// ============================================================
// Programs
// ============================================================
export const EVALUATION_PROGRAMS: EvaluationProgram[] = [
  // ---------- Boys ----------
  pgm({
    id: "boys-u06",
    track: "boys",
    uBands: [6],
    label: "U06 Boys Registration",
    signupUrl: "https://form.jotform.com/243167197472161",
  }),
  pgm({
    id: "boys-u07",
    track: "boys",
    uBands: [7],
    label: "U07 Boys Registration",
    signupUrl: "https://form.jotform.com/231081933402144",
  }),
  pgm({
    id: "boys-u08",
    track: "boys",
    uBands: [8],
    label: "U08 Boys Registration",
    signupUrl: "https://form.jotform.com/231081120194140",
  }),
  pgm({
    id: "boys-u09",
    track: "boys",
    uBands: [9],
    label: "U09 Boys Registration",
    signupUrl: "https://form.jotform.com/231081387926158",
  }),
  pgm({
    id: "boys-u10-u12",
    track: "boys",
    uBands: [10, 11, 12],
    label: "U10–U12 Boys Competitive Registration",
    signupUrl: pm(PM_TOKEN_A, "89273"),
  }),
  pgm({
    id: "boys-u13-u19",
    track: "boys",
    uBands: [13, 14, 15, 16, 17, 18, 19],
    label: "U13–U19 Boys Competitive Registration",
    signupUrl: pm(PM_TOKEN_B, "97456"),
  }),

  // ---------- Girls ----------
  pgm({
    id: "girls-u06",
    track: "girls",
    uBands: [6],
    label: "U06 Girls Registration",
    signupUrl: "https://form.jotform.com/243167968189172",
  }),
  pgm({
    id: "girls-u07",
    track: "girls",
    uBands: [7],
    label: "U07 Girls Registration",
    signupUrl: "https://form.jotform.com/231082091081143",
  }),
  pgm({
    id: "girls-u08",
    track: "girls",
    uBands: [8],
    label: "U08 Girls Registration",
    signupUrl: "https://form.jotform.com/231081836230145",
  }),
  pgm({
    id: "girls-u09",
    track: "girls",
    uBands: [9],
    label: "U09 Girls Registration",
    signupUrl: "https://form.jotform.com/231081782102143",
  }),
  pgm({
    id: "girls-u10",
    track: "girls",
    uBands: [10],
    label: "U10 Girls Registration",
    signupUrl: "https://form.jotform.com/231081256886158",
  }),
  pgm({
    id: "girls-u11-u12",
    track: "girls",
    uBands: [11, 12],
    label: "U11–U12 Girls Competitive Registration",
    signupUrl: pm(PM_TOKEN_A, "89273"),
  }),
  pgm({
    id: "girls-u13-u19",
    track: "girls",
    uBands: [13, 14, 15, 16, 17, 18, 19],
    label: "U13–U19 Girls Competitive Registration",
    signupUrl: pm(PM_TOKEN_B, "97456"),
  }),
];

/**
 * Year-round individual evaluation fallback. Used when no scheduled program
 * matches (off-season, goalkeeper track, or birth years outside age bands).
 *
 * TODO(CVFC): confirm whether you want a dedicated PlayMetrics inquiry
 * program_id, or route to a contact form on chulavistafc.com.
 */
export const YEAR_ROUND_EVALUATION: EvaluationProgram = {
  id: "year-round-inquiry",
  track: "boys",
  birthYears: [],
  label: "Individual Evaluation Request",
  status: "year-round",
  signupUrl: pm(PM_TOKEN_B, "97456"),
  description:
    "There are no scheduled tryouts for this age group right now — but coaches review every individual evaluation request and respond within 48 hours.",
};

export type EvaluationRouterInput = {
  track: EvaluationTrack | null;
  birthYear: number | null;
};

export type EvaluationRouterResult =
  | { kind: "incomplete" }
  | { kind: "match"; program: EvaluationProgram }
  | { kind: "year-round"; program: EvaluationProgram };

export function evaluateRoute(
  input: EvaluationRouterInput,
): EvaluationRouterResult {
  if (!input.track || !input.birthYear) return { kind: "incomplete" };

  const open = EVALUATION_PROGRAMS.find(
    (p) =>
      p.status === "open" &&
      p.track === input.track &&
      p.birthYears.includes(input.birthYear as number),
  );

  if (open) return { kind: "match", program: open };
  return { kind: "year-round", program: YEAR_ROUND_EVALUATION };
}

/**
 * Birth-year options offered in the modal. Auto-shifts each calendar year:
 * always covers ages ~5 (currentYear − 4) through ~19 (currentYear − 19).
 */
export function getBirthYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const oldest = currentYear - 19;
  const youngest = currentYear - 4;
  const years: number[] = [];
  for (let y = youngest; y >= oldest; y--) years.push(y);
  return years;
}

export const TRACK_LABELS: Record<EvaluationTrack, string> = {
  boys: "Boys Pathway",
  girls: "Girls Pathway",
  goalkeeper: "Goalkeeper Pathway",
};
