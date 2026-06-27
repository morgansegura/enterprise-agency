// Diagnostic: confirms the MONDAY_API_KEY works and what the user can do.
const TOKEN = process.env.MONDAY_API_KEY;
if (!TOKEN) {
  console.error("✗ MONDAY_API_KEY not set");
  process.exit(1);
}
const res = await fetch("https://api.monday.com/v2", {
  method: "POST",
  headers: {
    Authorization: TOKEN,
    "Content-Type": "application/json",
    "API-Version": "2024-01",
  },
  body: JSON.stringify({
    query:
      "{ me { name is_admin is_guest is_view_only join_date } account { name plan { tier } } }",
  }),
});
console.log(JSON.stringify(await res.json(), null, 2));
