// Cleans up the CVFC — Coaches board: deletes the "Item N" sample rows, renames
// the first group to "Coaches", deletes any now-empty default groups. SAFE — it
// never deletes a real (non-sample) coach you've added.
// Run from apps/cvfc:  bun scripts/cleanup-monday-coaches.mjs
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
const SAMPLE = /^item\s*\d+$/i;

const data = await gql(
  `query ($id: [ID!]) {
    boards(ids: $id) {
      groups { id title }
      items_page(limit: 500) { items { id name group { id } } }
    }
  }`,
  { id: [BOARD_ID] },
);
const board = data.boards[0];
const items = board.items_page.items;

// 1. Delete sample items.
for (const it of items) {
  if (SAMPLE.test(it.name)) {
    await gql(`mutation ($id: ID!) { delete_item(item_id: $id) { id } }`, {
      id: it.id,
    });
    console.log(`  - deleted sample "${it.name}"`);
  }
}

const realItems = items.filter((it) => !SAMPLE.test(it.name));

// 2. Rename the first group to "Coaches".
const keep = board.groups[0];
if (keep) {
  await gql(
    `mutation ($b: ID!, $g: String!) {
      update_group(board_id: $b, group_id: $g, group_attribute: title, new_value: "Coaches") { id }
    }`,
    { b: BOARD_ID, g: keep.id },
  );
  console.log(`  ✓ renamed group "${keep.title}" → "Coaches"`);
}

// 3. Delete any OTHER group that has no real items.
for (const g of board.groups.slice(1)) {
  const hasReal = realItems.some((it) => it.group.id === g.id);
  if (hasReal) {
    console.log(`  ! kept "${g.title}" — it has real items`);
  } else {
    await gql(
      `mutation ($b: ID!, $g: String!) { delete_group(board_id: $b, group_id: $g) { id } }`,
      { b: BOARD_ID, g: g.id },
    );
    console.log(`  - deleted empty group "${g.title}"`);
  }
}
console.log("Done.");
