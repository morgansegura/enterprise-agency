// Renames the CVFC — Coaches columns so they clearly read as coach COVERAGE.
// Run from apps/cvfc:  bun scripts/rename-monday-coaches-columns.mjs
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

const BOARD_ID = "18419262953";
const RENAMES = {
  Gender: "Gender Coached",
  "Birth Year From": "Coaches Birth Years (From)",
  "Birth Year To": "Coaches Birth Years (To)",
  Pathway: "Pathways Coached",
  Position: "Position Coached",
};

const data = await gql(
  `query ($id: [ID!]) { boards(ids: $id) { columns { id title } } }`,
  { id: [BOARD_ID] },
);
const columns = data.boards?.[0]?.columns ?? [];
for (const col of columns) {
  const next = RENAMES[col.title];
  if (!next) continue;
  try {
    await gql(
      `mutation ($board: ID!, $col: String!, $title: String!) {
        change_column_title(board_id: $board, column_id: $col, title: $title) { id title }
      }`,
      { board: BOARD_ID, col: col.id, title: next },
    );
    console.log(`  ✓ "${col.title}" → "${next}"`);
  } catch (e) {
    console.error(`  ! "${col.title}" failed: ${e.message}`);
  }
}
console.log("Done.");
