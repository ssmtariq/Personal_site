#!/usr/bin/env node
// Build-time fetch of aggregated visitor stats from GoatCounter -> src/data/visitors.json.
// Runs only in CI with a read-only API key; the key never reaches the browser.
// Env: GOATCOUNTER_SITE (e.g. "ssmtariq"), GOATCOUNTER_TOKEN, STATS_START (ISO hour, e.g. 2026-11-01T00:00:00Z),
//      GOATCOUNTER_BASE (tests only; overrides https://<site>.goatcounter.com).
// Never fails the build: on any problem it keeps the previous file or writes { available: false }.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'src', 'data', 'visitors.json');
const site = process.env.GOATCOUNTER_SITE;
const token = process.env.GOATCOUNTER_TOKEN;
const start = process.env.STATS_START ?? '2026-11-01T00:00:00Z';
const base = process.env.GOATCOUNTER_BASE ?? (site ? `https://${site}.goatcounter.com` : '');

const keepOrStub = (reason) => {
  if (fs.existsSync(OUT)) {
    console.log(`visitor stats: ${reason}; keeping previous ${path.relative(process.cwd(), OUT)}`);
  } else {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify({ available: false, reason }, null, 2) + '\n');
    console.log(`visitor stats: ${reason}; wrote placeholder`);
  }
  process.exit(0);
};

if (!base || !token) keepOrStub('GOATCOUNTER_SITE or GOATCOUNTER_TOKEN not set');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(pathAndQuery) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(`${base}${pathAndQuery}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    if (res.status === 429) { await sleep(1000 * attempt); continue; } // documented limit: 4 requests/second
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${pathAndQuery}`);
    return res.json();
  }
  throw new Error(`rate limited on ${pathAndQuery}`);
}

try {
  const end = new Date(Date.now() - (Date.now() % 3600000)).toISOString().replace('.000Z', 'Z'); // rounded to the hour
  const range = `start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
  const total = await get(`/api/v0/stats/total?${range}`);
  const countries = [];
  for (let offset = 0, more = true; more; offset += 100) {
    const page = await get(`/api/v0/stats/locations?${range}&limit=100&offset=${offset}`);
    countries.push(...(page.stats ?? []).map((s) => ({ code: s.id, name: s.name, count: s.count })));
    more = Boolean(page.more);
    await sleep(300);
  }
  const known = countries.filter((c) => c.code && c.code !== '(unknown)' && c.code.length === 2);
  const data = {
    available: true,
    updated: new Date().toISOString(),
    since: start,
    total: total.total ?? 0,
    countryCount: known.length,
    countries: known.sort((a, b) => b.count - a.count),
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`visitor stats: ${data.total} visitors from ${data.countryCount} countries since ${start}`);
} catch (e) {
  keepOrStub(`fetch failed (${e.message})`);
}
