const KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.RESEND_FROM ?? "Chula Vista FC <onboarding@resend.dev>";
if (!KEY) {
  console.error("RESEND_API_KEY not loaded from env");
  process.exit(1);
}
console.log("from:", FROM);
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: FROM,
    to: "morgansegura@gmail.com",
    subject: "CVFC Resend test",
    html: "<p>Test from the CVFC registration system.</p>",
  }),
});
console.log("status:", res.status);
console.log("body:", await res.text());
