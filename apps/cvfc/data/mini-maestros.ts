/**
 * Mini Maestros seasonal program. This block is time-boxed — the screen hides
 * it automatically once `endDate` passes, and hides the early-bird price once
 * `earlyBirdDeadline` passes. Pages revalidate every 60s, so expiry takes
 * effect without a deploy. To run the next season, update this file.
 */

export const MINI_MAESTROS = {
  season: "Winter 2026",
  description:
    "Our winter league helps young players build skills and confidence, make friends, and fall in love with soccer. Beginners are welcome, with one practice and one game a week.",
  /** Program runs between these dates (inclusive). */
  startDate: "2026-11-04",
  endDate: "2026-12-19",
  /** Break noted on the club flyer. */
  breakNote: "Thanksgiving week break",
  weeks: 6,
  earlyBirdPrice: "$110",
  earlyBirdDeadline: "2026-10-23",
  registerUrl:
    "https://app.playmetrics.com/signup?clubToken=TG9naW4tQ2x1Yi52MS02OC0xNzk3MTk5NDMzfERsKzJCbjlXa3BSaE5sMXBzUHM2c0xnR28xQ2hzOU56SGhNbW1lYjlEeEk9&program_id=126172",
  divisions: [
    {
      id: "super-juniors",
      title: "Super Juniors",
      birthYears: "Born 2022–2023",
    },
    { id: "juniors", title: "Juniors", birthYears: "Born 2020–2021" },
    { id: "maestros", title: "Maestros", birthYears: "Born 2018–2019" },
  ],
  columns: [
    {
      id: "schedule",
      label: "Practice & game schedule",
      items: [
        "Games on Saturdays, 8:00 AM to 12:00 PM, at Terra Nova Park.",
        "One weekday practice, Monday through Friday, scheduled after registration.",
        "Six weeks, including playoffs and finals.",
      ],
    },
    {
      id: "venues",
      label: "Training locations",
      items: [
        "DV7 Field",
        "Terra Nova Park",
        "Veterans Park",
        "CVFC Futbol Training Center",
      ],
    },
    {
      id: "included",
      label: "Included",
      items: ["Team jersey", "Coaching", "Training sessions and games"],
    },
    {
      id: "who",
      label: "Who it's for",
      items: [
        "Beginner and intermediate players.",
        "Approved first-year competitive players may join Juniors or Maestros.",
        "Super Juniors is only for non-competitive players.",
      ],
    },
  ],
  referral:
    "Bring a friend and save: refer a new player and both families get $5 off registration.",
  contact: {
    name: "Mathias Medel",
    title: "League Director",
    email: "mathias.medel@chulavistafc.com",
  },
} as const;

const at = (iso: string) => new Date(`${iso}T23:59:59-07:00`).getTime();

/** Hide the whole block once the season has finished. */
export function isMiniMaestrosSeasonOpen(now: number = Date.now()): boolean {
  return now <= at(MINI_MAESTROS.endDate);
}

/** Early-bird pricing is only shown while it is genuinely available. */
export function isEarlyBirdOpen(now: number = Date.now()): boolean {
  return now <= at(MINI_MAESTROS.earlyBirdDeadline);
}

/** "July 25" — the early-bird cut-off, for inline copy. */
export function formatEarlyBirdDeadline(): string {
  return new Date(
    `${MINI_MAESTROS.earlyBirdDeadline}T12:00:00-07:00`,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

/** "August 17 – October 3, 2026" */
export function formatSeasonRange(): string {
  const fmt = (iso: string, withYear = false) =>
    new Date(`${iso}T12:00:00-07:00`).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      ...(withYear ? { year: "numeric" } : {}),
      timeZone: "America/Los_Angeles",
    });
  return `${fmt(MINI_MAESTROS.startDate)} – ${fmt(MINI_MAESTROS.endDate, true)}`;
}
