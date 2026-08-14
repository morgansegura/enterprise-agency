"use server";

import {
  upsertSignup,
  updateExperience,
  type ParentInput,
  type PlayerCore,
  type ExperienceInput,
} from "@/lib/monday";
import { sendParentThankYou } from "@/lib/email/send";
import { createLogger } from "@/lib/logger";

const log = createLogger("signup");

/**
 * Step 1 (Save & continue): create-or-update the player's Signups row (one flat
 * row per player, deduped by token) and thank the parent — only on the FIRST
 * create, so Back→Save never re-sends. Returns the row id for step 2.
 *
 * No coach is emailed here. The row lands with an empty Coach column; a coach
 * is picked by hand on the board, and that assignment triggers their email via
 * `app/api/monday/coach-assigned`.
 */
export async function saveSignup(
  token: string,
  parent: ParentInput,
  player: PlayerCore,
) {
  try {
    const { signupId, created } = await upsertSignup({
      token,
      parent,
      player,
    });

    if (created) {
      try {
        await sendParentThankYou(parent.email, {
          parentName: `${parent.firstName} ${parent.lastName}`.trim(),
          playerFirstName: player.firstName,
        });
        log.info("parent thanked, awaiting coach assignment", {
          signupId,
          gender: player.gender,
        });
      } catch (emailErr) {
        log.error("parent thank-you failed", { signupId, err: emailErr });
      }
    }

    return { ok: true as const, signupId };
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
