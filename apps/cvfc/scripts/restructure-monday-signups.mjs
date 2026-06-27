// Finishes the parent-item / player-subitem model on CVFC Signups:
//  1. Moves the per-player FEEDBACK fields onto the subitems (where the player is)
//  2. Removes the now-redundant per-player columns from the parent item
// Parent item is left as: Name, Subitems, Parent Name/Email/Phone, Status, Submission Token.
// Run from apps/cvfc:  bun scripts/restructure-monday-signups.mjs
const TOKEN = process.env.MONDAY_API_KEY;
if (!TOKEN) {
  console.error("✗ MONDAY_API_KEY not set");
  process.exit(1);
}
const API = "https://api.monday.com/v2";
async function gql(query, variables) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
      "API-Version": "2024-01",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const MAIN = "18414196382"; // CVFC Signups
const SUBITEMS = "18414203458"; // Subitems of CVFC Signups

const cols = async (board) =>
  (
    await gql(
      `query ($id: [ID!]) { boards(ids: $id) { columns { id title } } }`,
      {
        id: [board],
      },
    )
  ).boards[0].columns;

// 1. Add feedback columns to the subitems board (idempotent).
const subExisting = (await cols(SUBITEMS)).map((c) => c.title.toLowerCase());
const FEEDBACK = [
  { title: "Feedback Link", type: "link" },
  { title: "Feedback Rating", type: "rating" },
  { title: "Feedback Comments", type: "long_text" },
];
for (const f of FEEDBACK) {
  if (subExisting.includes(f.title.toLowerCase())) {
    console.log(`  = subitem "${f.title}" exists, skipping`);
    continue;
  }
  await gql(
    `mutation ($b: ID!, $t: String!, $type: ColumnType!) {
      create_column(board_id: $b, title: $t, column_type: $type) { id }
    }`,
    { b: SUBITEMS, t: f.title, type: f.type },
  );
  console.log(`  + subitem "${f.title}" (${f.type})`);
}

// 2. Remove the redundant per-player columns from the parent (main) board.
const REMOVE = new Set(
  [
    "Player Birth Month",
    "Player Birth Year",
    "Gender",
    "Goalkeeper",
    "Matched Coach",
    "Matched Coach Email",
    "Feedback Link",
    "Feedback Rating",
    "Feedback Comments",
  ].map((s) => s.toLowerCase()),
);
for (const c of await cols(MAIN)) {
  if (!REMOVE.has(c.title.toLowerCase())) continue;
  try {
    await gql(
      `mutation ($b: ID!, $c: String!) { delete_column(board_id: $b, column_id: $c) { id } }`,
      { b: MAIN, c: c.id },
    );
    console.log(`  - removed from parent: "${c.title}"`);
  } catch (e) {
    console.error(`  ! could not remove "${c.title}": ${e.message}`);
  }
}
console.log("Done.");
