/**
 * Zeffy donation config.
 *
 * Zeffy is embedded as a cross-origin iframe so the donor never leaves the
 * site. Zeffy's post-donation redirect points at `/thank-you`, which renders
 * INSIDE that iframe — being same-origin with the parent is what lets
 * `DonationComplete` push the conversion into the parent's dataLayer.
 *
 * Inert until `NEXT_PUBLIC_ZEFFY_FORM_URL` is set: the embed renders nothing,
 * so this ships dark and goes live the moment the form URL lands (same pattern
 * as GTM). Note `NEXT_PUBLIC_*` is inlined at BUILD time — setting it in Vercel
 * requires a redeploy to take effect.
 */

export const ZEFFY_FORM_URL = process.env.NEXT_PUBLIC_ZEFFY_FORM_URL ?? "";

/** Whether the donation flow is configured and should render. */
export const donationsEnabled = Boolean(ZEFFY_FORM_URL);

/**
 * Anchor the tier buttons scroll to — the embed lives here on /support.
 * Matches the `/support#make-a-donation` links already in the header and
 * footer nav, which had no matching id and so scrolled nowhere.
 */
export const DONATE_ANCHOR = "make-a-donation";

export type DonationTier = {
  /** Display amount. */
  amount: string;
  /** Short tier name. */
  label: string;
  /**
   * What the gift does. TODO(cvfc): confirm against real club costs before
   * launch — season fees run $800–$2,400 by age/level and a kit is $500–700,
   * so these must be verified, not estimated. Publishing an impact claim the
   * club can't stand behind undercuts the transparency page.
   */
  body: string;
  custom?: boolean;
};

/** Monthly first — recurring donors are worth several times a one-time gift. */
export const MONTHLY_TIERS: DonationTier[] = [
  {
    amount: "$15/mo",
    label: "Supporter",
    body: "Steady support that keeps gear on the shelf and the lights on for evening training.",
  },
  {
    amount: "$30/mo",
    label: "Club Friend",
    body: "Covers a meaningful share of one player's season across a year of giving.",
  },
  {
    amount: "$75/mo",
    label: "Pathway Patron",
    body: "Helps keep a player on need-based assistance with the club through the full season.",
  },
  {
    amount: "$150/mo",
    label: "Champion",
    body: "Underwrites a player's place in the pathway, season after season.",
  },
  {
    amount: "Any amount",
    label: "Custom Monthly",
    body: "Choose your own monthly amount. Recurring gifts of any size compound by year-end.",
    custom: true,
  },
];

export const ONE_TIME_TIERS: DonationTier[] = [
  {
    amount: "$35",
    label: "Match Day",
    body: "Referee fees and match-day costs so a team can play its weekend fixture.",
  },
  {
    amount: "$75",
    label: "Training Gear",
    body: "Training kit and equipment for a player heading into the season.",
  },
  {
    amount: "$175",
    label: "Field Time",
    body: "An evening of lit-field training at the club's home ground.",
  },
  {
    amount: "$600",
    label: "Full Uniform Kit",
    body: "A complete home and away kit for a player on financial assistance.",
  },
  {
    amount: "$1,500",
    label: "Sponsor a Season",
    body: "A substantial share of one player's full season with the club — fees, kit, and travel.",
  },
  {
    amount: "Any amount",
    label: "Custom",
    body: "Give whatever feels right. Every gift lands with a player on a CVFC field.",
    custom: true,
  },
];
