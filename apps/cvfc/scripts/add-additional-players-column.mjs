// Adds an "Additional Players" Yes/No column to the CVFC Signups parent board.
// Run from apps/cvfc:  bun scripts/add-additional-players-column.mjs
const TOKEN = process.env.MONDAY_API_KEY;
if (!TOKEN) {
  console.error("✗ MONDAY_API_KEY not set");
  process.exit(1);
}
const API = "https://api.monday.com/v2";
const BOARD = "18414196382";
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
const existing = (
  await gql(`query ($id: [ID!]) { boards(ids: $id) { columns { title } } }`, {
    id: [BOARD],
  })
).boards[0].columns.map((c) => c.title.toLowerCase());
if (existing.includes("additional players")) {
  console.log("= Additional Players already exists, skipping");
  process.exit(0);
}
await gql(
  `mutation ($b: ID!, $t: String!, $d: JSON) { create_column(board_id: $b, title: $t, column_type: status, defaults: $d) { id } }`,
  {
    b: BOARD,
    t: "Additional Players",
    d: JSON.stringify({ labels: { 1: "Yes", 2: "No" } }),
  },
);
console.log("+ Additional Players (status)");
