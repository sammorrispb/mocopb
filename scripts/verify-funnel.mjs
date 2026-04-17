// Sanity check for the unified funnel wiring.
// Run: node scripts/verify-funnel.mjs
import { createHmac } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const fails = [];

function assert(cond, msg) {
  if (!cond) fails.push(msg);
}

// 1) HMAC signature is deterministic and matches the Hub's contract.
//    Signed string format: v1:<ms>:<site_id>:<event_type>:<visitor_id>:<email>:<marketing_ref>
function sign(secret, params) {
  const { timestamp, siteId, eventType, visitorId, email, marketingRef } = params;
  const signed = `v1:${timestamp}:${siteId}:${eventType}:${visitorId}:${email}:${marketingRef}`;
  return createHmac("sha256", secret).update(signed).digest("hex");
}

const SECRET = "test-secret-xyz";
const TS = "1700000000000";
const SNAPSHOT = sign(SECRET, {
  timestamp: TS,
  siteId: "mocopb",
  eventType: "cta_click",
  visitorId: "visitor-abc",
  email: "alice@example.com",
  marketingRef: "mocopb_city_rockville",
});
const expected = createHmac("sha256", SECRET)
  .update("v1:1700000000000:mocopb:cta_click:visitor-abc:alice@example.com:mocopb_city_rockville")
  .digest("hex");
assert(SNAPSHOT === expected, `HMAC mismatch: got ${SNAPSHOT} expected ${expected}`);

// 2) Empty visitor / email / marketingRef → empty string in the signed payload.
const EMPTY = sign(SECRET, {
  timestamp: TS,
  siteId: "mocopb",
  eventType: "lead_submitted",
  visitorId: "",
  email: "",
  marketingRef: "",
});
const expectedEmpty = createHmac("sha256", SECRET)
  .update("v1:1700000000000:mocopb:lead_submitted:::")
  .digest("hex");
assert(EMPTY === expectedEmpty, `empty-field HMAC mismatch`);

// 3) Zero @vercel/analytics imports remain in src/.
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(p)) out.push(p);
  }
  return out;
}
const hits = walk("src").filter((f) => readFileSync(f, "utf8").includes("@vercel/analytics"));
assert(hits.length === 0, `@vercel/analytics imports remain: ${hits.join(", ")}`);

// 4) package.json no longer depends on @vercel/analytics.
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
assert(
  !pkg.dependencies?.["@vercel/analytics"] && !pkg.devDependencies?.["@vercel/analytics"],
  "@vercel/analytics still listed in package.json dependencies",
);

// 5) Funnel primitives exist at expected paths with the right SITE_ID + env.
const server = readFileSync("src/lib/funnelServer.ts", "utf8");
assert(/SITE_ID\s*=\s*"mocopb"/.test(server), "funnelServer SITE_ID no longer 'mocopb'");
assert(
  /FUNNEL_INGEST_SECRET_MOCOPB/.test(server),
  "funnelServer no longer reads FUNNEL_INGEST_SECRET_MOCOPB",
);
assert(
  /linkanddink\.com\/api\/funnel-event/.test(server),
  "funnelServer no longer posts to Hub /api/funnel-event",
);

const client = readFileSync("src/lib/funnelClient.ts", "utf8");
assert(/\/api\/funnel-track/.test(client), "funnelClient no longer posts to /api/funnel-track");
assert(/getRefSource/.test(client), "funnelClient no longer uses getRefSource");

const route = readFileSync("src/app/api/funnel-track/route.ts", "utf8");
assert(/sendFunnelEvent/.test(route), "funnel-track route no longer delegates to sendFunnelEvent");

// 6) getRefSource mappings match the plan's naming convention.
const tracking = readFileSync("src/lib/tracking.ts", "utf8");
assert(/export function getRefSource/.test(tracking), "getRefSource export missing from tracking.ts");
assert(/export function hubUrl/.test(tracking), "hubUrl export missing from tracking.ts");
assert(/export function businessUrl/.test(tracking), "businessUrl export missing from tracking.ts");

async function loadRefSource() {
  // tracking.ts imports only types (./businesses) at the top of the module. The runtime
  // export we care about is getRefSource — parse it out lexically rather than import the
  // whole TS module (which would need a loader).
  const src = readFileSync("src/lib/tracking.ts", "utf8");
  const match = src.match(/export function getRefSource\(pathname: string\): string \{([\s\S]*?)\n\}/);
  if (!match) throw new Error("could not locate getRefSource body");
  // Build a runnable JS closure from the TS body by stripping the type annotation on the argument
  // (there isn't one inside the body) — the body is already plain JS expressions.
  const fn = new Function("pathname", match[1]);
  return fn;
}

const getRefSource = await loadRefSource();
const cases = [
  ["/", "mocopb"],
  ["/play/rockville", "mocopb_city_rockville"],
  ["/play/north-bethesda", "mocopb_city_north-bethesda"],
  ["/city/rockville", "mocopb_city_rockville"],
  ["/business/link-and-dink", "mocopb_business_link-and-dink"],
  ["/courts", "mocopb_courts"],
  ["/courts/dill-dinkers-rockville", "mocopb_courts"],
  ["/faq", "mocopb_faq"],
  ["/lessons", "mocopb_lessons"],
  ["/youth", "mocopb_youth"],
];
for (const [input, expected] of cases) {
  const got = getRefSource(input);
  assert(got === expected, `getRefSource(${JSON.stringify(input)}) → ${got}, expected ${expected}`);
}

// 7) analytics.ts now delegates to funnelClient.trackEvent.
const analytics = readFileSync("src/lib/analytics.ts", "utf8");
assert(
  /from\s+"\.\/funnelClient"/.test(analytics),
  "analytics.ts no longer imports from ./funnelClient — transport may have regressed",
);
assert(!/@vercel\/analytics/.test(analytics), "analytics.ts still references @vercel/analytics");

// 8) layout.tsx no longer mounts <Analytics /> from @vercel/analytics.
const layout = readFileSync("src/app/layout.tsx", "utf8");
assert(
  !/@vercel\/analytics/.test(layout),
  "layout.tsx still references @vercel/analytics",
);

if (fails.length) {
  console.error("FAIL:");
  for (const f of fails) console.error("  -", f);
  process.exit(1);
}
console.log("OK — funnel wiring verified.");
