"use server";

import {
  upsertSignup,
  updateExperience,
  matchCoach,
  markCoachNotified,
  type ParentInput,
  type PlayerCore,
  type ExperienceInput,
} from "@/lib/monday";
import { sendParentThankYou, sendCoachNotification } from "@/lib/email/send";
import { createLogger } from "@/lib/logger";

const log = createLogger("signup");

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

        // Notify the coach this player was matched to. When no coach matches,
        // the row lands on the board with an empty Coach column and Isella
        // assigns one by hand — the Monday webhook
        // (app/api/monday/coach-assigned) sends the same email at that point.
        if (coach?.email) {
          const to = coach.email.toLowerCase();
          try {
            await sendCoachNotification(to, notifyData);
            await markCoachNotified(signupId, to);
            log.info("coach notified", {
              signupId,
              coach: to,
              gender: player.gender,
            });
          } catch (err) {
            log.error("coach notification failed", {
              signupId,
              coach: to,
              err,
            });
          }
        } else {
          log.info("no coach matched, awaiting manual assignment", {
            signupId,
            gender: player.gender,
            birthYear: year,
          });
        }
      } catch (emailErr) {
        log.error("signup email failed", { signupId, err: emailErr });
      }
    }

    return { ok: true as const, signupId, coachMatched: Boolean(coach) };
  } catch (e) {
    log.error("saveSignup failed", { err: e });
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
    log.error("saveExperience failed", { signupId, err: e });
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Submission failed",
    };
  }
}
