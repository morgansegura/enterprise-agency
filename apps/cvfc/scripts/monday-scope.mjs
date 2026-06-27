// Prints ONLY the Monday token's scope + account id (decoded from the JWT
// payload) — never the token itself. Helps diagnose 403s.
const t = process.env.MONDAY_API_KEY;
if (!t) {
  console.error("✗ MONDAY_API_KEY not set");
  process.exit(1);
}
try {
  const payload = JSON.parse(
    Buffer.from(t.split(".")[1], "base64").toString("utf8"),
  );
  console.log("token scope (per):", payload.per ?? "(none)");
  console.log("account id (actid):", payload.actid);
} catch (e) {
  console.log("could not decode token:", e.message);
}
