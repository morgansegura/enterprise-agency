/**
 * Mini Maestros seasonal program. This block is time-boxed — the screen hides
 * it automatically once `endDate` passes, and hides the early-bird price once
 * `earlyBirdDeadline` passes. Pages revalidate every 60s, so expiry takes
 * effect without a deploy. To run the next season, update the dates here.
 */

export const MINI_MAESTROS = {
  season: "Fall 2026",
  /** Program runs between these dates (inclusive). */
  startDate: "2026-08-17",
  endDate: "2026-10-03",
  /** Break noted on the club flyer. */
  breakNote: "Labor Day weekend break",
  weeks: 6,
  earlyBirdPrice: "$95",
  earlyBirdDeadline: "2026-07-25",
  registerUrl:
    "https://app.playmetrics.com/signup?clubToken=TG9naW4tQ2x1Yi52MS02OC0xNzkxMDYwMzk3fHM4K1Rjd1FwSWx4cGo4RzJSeExCd2pBVDlzeTl0b1JuZnJKU3VFNDJLTms9&program_id=113402",
  includes: [
    "CVFC shirt provided",
    "Inclusive environment",
    "Supportive coaching staff",
  ],
  divisions: [
    {
      id: "super-juniors",
      title: "Super Juniors",
      birthYears: "Born 2021–2022",
    },
    { id: "juniors", title: "Juniors", birthYears: "Born 2019–2020" },
    { id: "maestros", title: "Maestros", birthYears: "Born 2017–2018" },
  ],
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
