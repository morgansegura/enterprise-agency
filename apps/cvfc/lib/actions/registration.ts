"use server";

import {
  upsertSignup,
  updateExperience,
  matchCoach,
  type ParentInput,
  type PlayerCore,
  type ExperienceInput,
} from "@/lib/monday";
import { sendParentThankYou, sendCoachNotification } from "@/lib/email/send";
import { getSignupNotifyEmails } from "@/lib/cms";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Step 1 (Save & continue): create-or-update the player's Signups row (one flat
 * row per player, deduped by token), match a coach by gender + age, and email
 * the parent and the matched coach — but only on the FIRST create, so Back→Save
 * never re-sends. Returns the row id for step 2.
 */
export async function saveSignup(
  token: string,
  parent: ParentInput,
  player: PlayerCore,
) {
  try {
    const genderLabel = player.gender === "boys" ? "Boys" : "Girls";
    const birthYear = Number(player.dob.slice(0, 4));
    const coach = await matchCoach(genderLabel, birthYear, false);
    const { signupId, created } = await upsertSignup({
      token,
      parent,
      player,
      coach,
    });

    if (created) {
      try {
        const parentName = `${parent.firstName} ${parent.lastName}`.trim();
        await sendParentThankYou(parent.email, {
          parentName,
          playerFirstName: player.firstName,
        });

        const [year, month] = player.dob.split("-");
        const notifyData = {
          coachName: coach?.name,
          playerName: `${player.firstName} ${player.lastName}`.trim(),
          birthYear: year,
          birthMonth: MONTHS[Number(month) - 1],
          gender: player.gender === "boys" ? "Boys" : "Girls",
          priorLeagueLevel: player.priorLeagueLevel,
          parentName,
          parentEmail: parent.email,
          parentPhone: parent.phone,
        };

        // Notify the club-admin list (they alert the proper coaches). The email
        // includes the auto-matched coach as a suggestion. Fall back to emailing
        // the matched coach directly only if no admins are configured yet, so
        // signups are never silently unnotified. Best-effort, deduped.
        const admins = await getSignupNotifyEmails();
        const recipients = admins.length
          ? admins
          : coach
            ? [coach.email.toLowerCase()]
            : [];
        await Promise.allSettled(
          recipients.map((email) => sendCoachNotification(email, notifyData)),
        );
      } catch (emailErr) {
        console.error("signup email failed:", emailErr);
      }
    }

    return { ok: true as const, signupId, coachMatched: Boolean(coach) };
  } catch (e) {
    console.error("saveSignup failed:", e);
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Submission failed",
    };
  }
}

/** Step 2 (Experience): fill the remaining columns onto the same Signups row. */
export async function saveExperience(
  signupId: string,
  experience: ExperienceInput,
  additionalPlayers: boolean,
) {
  try {
    await updateExperience(signupId, experience, additionalPlayers);
    return { ok: true as const };
  } catch (e) {
    console.error("saveExperience failed:", e);
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Submission failed",
    };
  }
}
