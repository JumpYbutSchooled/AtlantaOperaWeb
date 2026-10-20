// Saves every upcoming performance on tickets.atlantaopera.org to public/data/season.json.
// .github/workflows/season.yml runs this every day; the Season and show pages then add any
// shows and dates they don't list yet. Run it by hand with: node scripts/update-season.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises";

const API = "https://tickets.atlantaopera.org/api/products/productionseasons";
const OUT = new URL("../public/data/season.json", import.meta.url);

const day = (d) => d.toISOString().slice(0, 10) + "T00:00:00";
const from = new Date();
const to = new Date();
to.setFullYear(to.getFullYear() + 3);

const res = await fetch(API, {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify({ startDate: day(from), endDate: day(to), keywords: "", productionSeasonIdFilter: [] }),
});
if (!res.ok) throw new Error(`The ticket site answered ${res.status}`);
const { productions } = await res.json();
if (!Array.isArray(productions)) throw new Error("The ticket site's answer has no list of productions");

// "2026-11-07T19:30:00.0000000-05:00" -> "2026-11-07T19:30-05:00", the same form the pages use
const when = (s) => {
  const m = /^(\d{4}-\d\d-\d\dT\d\d:\d\d):\d\d(?:\.\d+)?([+-]\d\d:\d\d)$/.exec(s || "");
  return m ? m[1] + m[2] : null;
};

const season = productions
  .map((p) => ({
    id: String(p.productionSeasonId),
    title: String(p.productionTitle || "").trim(),
    performances: (p.performances || [])
      .filter((x) => x.isPerformanceVisible !== false)
      .map((x) => when(x.iso8601DateString))
      .filter(Boolean)
      .sort((a, b) => Date.parse(a) - Date.parse(b)),
  }))
  .filter((p) => /^\d+$/.test(p.id) && p.title && p.performances.length)
  .sort((a, b) => Date.parse(a.performances[0]) - Date.parse(b.performances[0]));

const old = await readFile(OUT, "utf8").catch(() => "");
// Nothing at all usually means the ticket site is having trouble, so keep what we had.
if (!season.length && old) {
  console.warn("The ticket site listed no performances; leaving season.json as it was.");
  process.exit(0);
}

const json = JSON.stringify(season, null, 2) + "\n";
if (json === old) {
  console.log("No change.");
} else {
  await mkdir(new URL(".", OUT), { recursive: true });
  await writeFile(OUT, json);
  console.log(`Saved ${season.length} shows: ${season.map((p) => p.title).join(", ")}`);
}
