// Submit the site's sitemap URLs to IndexNow (Bing, Yandex, etc.). Google does
// NOT support IndexNow, but Bing/Copilot do — instant notification on new/changed
// pages. Run after a deploy that adds/changes URLs: `bun run indexnow`.
//
// The key is public (served at https://<host>/<key>.txt); IndexNow fetches that
// file to verify ownership before accepting the submission.

const HOST = process.env.INDEXNOW_HOST || "chulavistafc.com";
const KEY = "bb7272d67e8b7981ba9cbd87e4031d21";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;

async function main() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("no <loc> URLs found in sitemap");

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  // IndexNow returns 200 (accepted) or 202 (accepted, pending verification).
  console.log(`IndexNow → ${r.status} for ${urls.length} URLs on ${HOST}`);
  if (r.status !== 200 && r.status !== 202) {
    console.error(await r.text());
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
