"use server";

import { sendTryoutConfirmation } from "@/lib/email/send";
import { createLogger } from "@/lib/logger";
import { upsertTryout, type TryoutInput } from "@/lib/monday-tryouts";
import {
  PLAYER_LABELS,
  TRYOUT_SEASON,
  ageGroupFor,
  dayLine,
  sessionFor,
  tryoutOpen,
} from "@/lib/tryouts";

const log = createLogger("tryouts");

const filled = (v: string | undefined) => Boolean(v?.trim());

/** The form checks these too; the server checks again so a hand-built
 *  request can't put a player outside U7–U9 on the board. */
function problem(input: TryoutInput): string | null {
  const { parent, player } = input;
  if (
    ![parent.firstName, parent.lastName, parent.email, parent.phone].every(
      filled,
    ) ||
    ![player.firstName, player.lastName].every(filled)
  )
    return "Please fill in every required field.";
  if (player.gender !== "boys" && player.gender !== "girls")
    return "Please choose boys or girls.";
  if (!tryoutOpen(player.gender))
    return `Signups for the ${player.gender} tryouts have closed.`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(player.dob) || !ageGroupFor(player.dob))
    return "This date of birth is outside the U7–U9 tryouts.";
  return null;
}

/**
 * Put the player on CVFC Tryouts and email the parent their tryout details.
 * The email goes only when the row is first made, so a retry never sends two.
 * No coach is emailed here: assigning one on the board does that.
 */
export async function saveTryout(token: string, input: TryoutInput) {
  const invalid = problem(input);
  if (invalid) return { ok: false as const, error: invalid };

  try {
    const { rowId, created } = await upsertTryout(token, input);

    if (created) {
      const session = sessionFor(input.player.gender);
      try {
        await sendTryoutConfirmation(input.parent.email, {
          parentName:
            `${input.parent.firstName} ${input.parent.lastName}`.trim(),
          playerName:
            `${input.player.firstName} ${input.player.lastName}`.trim(),
          playerFirstName: input.player.firstName.trim(),
          player: PLAYER_LABELS[input.player.gender],
          ageGroup: ageGroupFor(input.player.dob)?.label ?? "",
          when: session?.days.map(dayLine) ?? [],
          location: `${TRYOUT_SEASON.location.name}, ${TRYOUT_SEASON.location.address}`,
          bring: TRYOUT_SEASON.bring,
        });
      } catch (err) {
        log.error("tryout confirmation failed", { rowId, err });
      }
      log.info("tryout signup", { rowId, gender: input.player.gender });
    }

    return { ok: true as const };
  } catch (err) {
    log.error("saveTryout failed", { err });
    return {
      ok: false as const,
      error: "We couldn't save the signup. Please try again in a minute.",
    };
  }
}
