import "server-only";

import {
  TRYOUTS_BOARD,
  buildValues,
  columnMap,
  findRowByToken,
  mondayGql,
  type ParentInput,
} from "@/lib/monday";
import {
  PLAYER_LABELS,
  TRYOUT_SEASON,
  ageGroupFor,
  sessionFor,
  sessionLabel,
  type TryoutPlayer,
} from "@/lib/tryouts";

/** What the tryouts form sends: one player per submission. */
export type TryoutInput = {
  parent: ParentInput;
  player: {
    firstName: string;
    lastName: string;
    gender: TryoutPlayer;
    dob: string; // YYYY-MM-DD
    experience?: string;
  };
  referral?: string;
  notes?: string;
};

/** Each season is a group on the board, created the first time a family
 *  signs up for it, so a new season needs no setup on Monday. */
async function seasonGroup(title: string): Promise<string> {
  const data = await mondayGql<{
    boards: { groups: { id: string; title: string }[] }[];
  }>(`query ($b: [ID!]) { boards(ids: $b) { groups { id title } } }`, {
    b: [TRYOUTS_BOARD],
  });
  const hit = data.boards[0]?.groups.find((g) => g.title === title);
  if (hit) return hit.id;
  const made = await mondayGql<{ create_group: { id: string } }>(
    `mutation ($b: ID!, $n: String!) { create_group(board_id: $b, group_name: $n) { id } }`,
    { b: TRYOUTS_BOARD, n: title },
  );
  return made.create_group.id;
}

/**
 * Create or update the player's row on CVFC Tryouts, deduped by the form's
 * token so a double submit never makes two rows. The coach is assigned by hand
 * on the board, which emails them through `app/api/monday/coach-assigned`.
 */
export async function upsertTryout(
  token: string,
  input: TryoutInput,
): Promise<{ rowId: string; created: boolean }> {
  const { parent, player } = input;
  const group = ageGroupFor(player.dob);
  const session = sessionFor(player.gender);
  const cols = await columnMap(TRYOUTS_BOARD);
  const playerName = `${player.firstName} ${player.lastName}`.trim();
  const fields = {
    Season: TRYOUT_SEASON.label,
    Tryout: session ? sessionLabel(session) : undefined,
    "Age Group": group?.label,
    Gender: PLAYER_LABELS[player.gender],
    "Date of Birth": player.dob,
    "Player Birth Year": Number(player.dob.slice(0, 4)),
    "Parent Name": `${parent.firstName} ${parent.lastName}`.trim(),
    "Parent Email": parent.email,
    "Parent Phone": parent.phone,
    Experience: player.experience,
    "Referral Source": input.referral,
    "Parent Notes": input.notes,
    "Submission Token": token,
  };

  const existing = await findRowByToken(token, TRYOUTS_BOARD);
  if (existing) {
    await mondayGql(
      `mutation ($b: ID!, $i: ID!, $cv: JSON!) {
        change_multiple_column_values(board_id: $b, item_id: $i, column_values: $cv, create_labels_if_missing: true) { id }
      }`,
      {
        b: TRYOUTS_BOARD,
        i: existing,
        cv: buildValues(cols, { ...fields, Player: playerName }),
      },
    );
    return { rowId: existing, created: false };
  }

  const item = await mondayGql<{ create_item: { id: string } }>(
    `mutation ($b: ID!, $g: String!, $n: String!, $cv: JSON) {
      create_item(board_id: $b, group_id: $g, item_name: $n, column_values: $cv, create_labels_if_missing: true) { id }
    }`,
    {
      b: TRYOUTS_BOARD,
      g: await seasonGroup(TRYOUT_SEASON.group),
      n: playerName,
      cv: buildValues(cols, { ...fields, Status: "New" }),
    },
  );
  return { rowId: item.create_item.id, created: true };
}
