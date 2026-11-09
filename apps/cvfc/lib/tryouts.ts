// Younger-player (U7–U9) tryouts. Client-safe: the page, the homepage cards
// and the form all read this. One season at a time; next season is new values
// here (later, a CMS record), not new code.

export type TryoutPlayer = "boys" | "girls";

/** One tryout day. Times are 24-hour Pacific: "17:30". */
export type TryoutDay = { date: string; start: string; end: string };

/** A player's tryout: one day, or more than one. */
export type TryoutSession = { player: TryoutPlayer; days: TryoutDay[] };

export type TryoutAgeGroup = {
  label: string;
  /** Inclusive YYYY-MM-DD birth range. */
  bornFrom: string;
  bornTo: string;
};

export type TryoutSeason = {
  /** The switch: false takes the cards, form and dates down at once. */
  live: boolean;
  /** The first day the cards and form show (YYYY-MM-DD, Pacific). */
  opens: string;
  /** Season label, and the Monday dropdown value: "December 2026". */
  label: string;
  /** The Monday group new signups land in. */
  group: string;
  location: {
    name: string;
    /** The place's page on this site. */
    href: string;
    address: string;
    /** Directions, for the address on the cards. */
    mapUrl: string;
  };
  sessions: TryoutSession[];
  /** Youngest first. */
  ageGroups: TryoutAgeGroup[];
  /** What players bring, listed in the parent's email. */
  bring: string[];
};

export const TRYOUT_SEASON: TryoutSeason = {
  live: true,
  opens: "2026-11-09",
  label: "December 2026",
  group: "Tryouts · December 2026",
  location: {
    name: "Victory Christian Academy",
    href: "/about/facilities#vca",
    address: "810 Buena Vista Way, Chula Vista, CA 91910",
    mapUrl:
      "https://www.google.com/maps/search/810+Buena+Vista+Way,+Chula+Vista,+CA+91910",
  },
  sessions: [
    {
      player: "girls",
      days: [{ date: "2026-12-07", start: "17:30", end: "18:30" }],
    },
    {
      player: "boys",
      days: [
        { date: "2026-12-08", start: "18:45", end: "19:45" },
        { date: "2026-12-09", start: "17:30", end: "18:30" },
      ],
    },
  ],
  ageGroups: [
    { label: "U7", bornFrom: "2020-08-01", bornTo: "2021-07-31" },
    { label: "U8", bornFrom: "2019-08-01", bornTo: "2020-07-31" },
    { label: "U9", bornFrom: "2018-08-01", bornTo: "2019-07-31" },
  ],
  bring: [
    "A water bottle",
    "Shin guards",
    "Soccer cleats, or sneakers if they don't have cleats yet",
    "Comfortable athletic clothes",
  ],
};

export const PLAYER_LABELS: Record<TryoutPlayer, string> = {
  boys: "Boys",
  girls: "Girls",
};

export const TRYOUT_EXPERIENCE = [
  "New to soccer",
  "Recreational / AYSO",
  "Club team",
];

const ZONE = "America/Los_Angeles";

/** A YYYY-MM-DD as a calendar day, read at noon so no timezone moves it. */
const day = (iso: string) => new Date(`${iso}T12:00:00`);

/** "Monday, December 7" */
export const longDate = (iso: string) =>
  day(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: ZONE,
  });

/** "Aug 1, 2019" */
export const shortDate = (iso: string) =>
  day(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: ZONE,
  });

/** "Tue, Dec 8" */
export const shortDay = (iso: string) =>
  day(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: ZONE,
  });

const clock = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return { text: `${h % 12 || 12}:${String(m).padStart(2, "0")}`, pm: h >= 12 };
};

/** "5:30 – 6:30 PM", or "11:30 AM – 12:30 PM" across noon. */
export const timeRange = ({ start, end }: TryoutDay) => {
  const a = clock(start);
  const b = clock(end);
  const meridiem = (pm: boolean) => (pm ? "PM" : "AM");
  return a.pm === b.pm
    ? `${a.text} – ${b.text} ${meridiem(b.pm)}`
    : `${a.text} ${meridiem(a.pm)} – ${b.text} ${meridiem(b.pm)}`;
};

/** "Monday, December 7, 5:30 – 6:30 PM" */
export const dayLine = (d: TryoutDay) => `${longDate(d.date)}, ${timeRange(d)}`;

/** "2026-12-07T17:30:00-08:00": a day's start or end, for schema.org. */
export const isoTime = (date: string, hhmm: string) => {
  const offset =
    new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE,
      timeZoneName: "longOffset",
    })
      .formatToParts(day(date))
      .find((p) => p.type === "timeZoneName")
      ?.value.replace("GMT", "") || "+00:00";
  return `${date}T${hhmm}:00${offset}`;
};

export const sessionFor = (
  player: TryoutPlayer,
  season: TryoutSeason = TRYOUT_SEASON,
) => season.sessions.find((s) => s.player === player) ?? null;

/** "Boys · Tue, Dec 8 & Wed, Dec 9", the Monday Tryout label. */
export const sessionLabel = (session: TryoutSession) =>
  `${PLAYER_LABELS[session.player]} · ${session.days.map((d) => shortDay(d.date)).join(" & ")}`;

/** The age group a YYYY-MM-DD birth date plays in, or null if outside U7–U9. */
export const ageGroupFor = (
  dob: string,
  season: TryoutSeason = TRYOUT_SEASON,
) => season.ageGroups.find((g) => dob >= g.bornFrom && dob <= g.bornTo) ?? null;

/** Every birth year the tryouts cover, oldest first: 2018 … 2021. */
export const birthYears = (season: TryoutSeason = TRYOUT_SEASON) => {
  const from = Math.min(
    ...season.ageGroups.map((g) => +g.bornFrom.slice(0, 4)),
  );
  const to = Math.max(...season.ageGroups.map((g) => +g.bornTo.slice(0, 4)));
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
};

/** The full birth range: "Aug 1, 2018 – Jul 31, 2021". */
export const birthRange = (season: TryoutSeason = TRYOUT_SEASON) => {
  const from = season.ageGroups.map((g) => g.bornFrom).sort()[0];
  const to = season.ageGroups
    .map((g) => g.bornTo)
    .sort()
    .at(-1)!;
  return `${shortDate(from)} – ${shortDate(to)}`;
};

/** Link to the form with a player and birth year chosen: the homepage cards
 *  and the pathway pages use this, so the form opens preselected. */
export const tryoutsHref = (player?: TryoutPlayer, born?: number) => {
  const params = new URLSearchParams();
  if (player) params.set("player", player);
  if (born) params.set("born", String(born));
  const query = params.toString();
  return `/tryouts${query ? `?${query}` : ""}#tryouts-form`;
};

/** Read ?player= and ?born= back, ignoring anything that isn't valid. */
export function tryoutChoice(
  params: Record<string, string | string[] | undefined>,
  season: TryoutSeason = TRYOUT_SEASON,
): { player: TryoutPlayer | null; born: number | null } {
  const one = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const player = one(params.player);
  const born = Number(one(params.born));
  return {
    player: player === "boys" || player === "girls" ? player : null,
    born: birthYears(season).includes(born) ? born : null,
  };
}

const today = () => new Date().toLocaleDateString("en-CA", { timeZone: ZONE });

/**
 * Whether a player's tryout is up on the site and taking signups: the season
 * is live, it has opened, and its first day hasn't come yet. Everything reads
 * this (the cards, the form, the server, the search data), so a tryout comes
 * down everywhere at once, on its own, the day it happens.
 */
export const tryoutOpen = (
  player: TryoutPlayer,
  season: TryoutSeason = TRYOUT_SEASON,
) => {
  const first = sessionFor(player, season)?.days[0]?.date;
  const now = today();
  return season.live && now >= season.opens && Boolean(first) && now < first!;
};

/** Whether either tryout is up today. */
export const tryoutsOpen = (season: TryoutSeason = TRYOUT_SEASON) =>
  season.sessions.some((s) => tryoutOpen(s.player, season));
