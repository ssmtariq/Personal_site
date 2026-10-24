#!/usr/bin/env node
// Integrity and policy checks that the per-entry Zod schemas cannot express.
// Usage: node scripts/check-content.mjs [--no-assets] [--today YYYY-MM-DD]
// Exit code 1 on any error; warnings never fail the build.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content');
const PUBLIC = path.join(ROOT, 'public');
const args = process.argv.slice(2);
const checkAssets = !args.includes('--no-assets');
const todayArg = args[args.indexOf('--today') + 1];
const TODAY = args.includes('--today') ? todayArg : new Date().toISOString().slice(0, 10);

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const load = (name) => parse(fs.readFileSync(path.join(CONTENT, `${name}.yaml`), 'utf8')) ?? [];
const frontmatter = (file) => {
  const m = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  return m ? parse(m[1]) : {};
};

const c = {};
for (const n of ['people', 'venues', 'publications', 'talks', 'news', 'teaching', 'mentoring', 'service', 'experience', 'education', 'awards', 'certifications', 'profile', 'site', 'skills', 'writing', 'materials', 'gallery']) c[n] = load(n);
c.projects = fs
  .readdirSync(path.join(CONTENT, 'projects'))
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => ({ id: f.replace(/\.mdx?$/, ''), ...frontmatter(path.join(CONTENT, 'projects', f)), __body: fs.readFileSync(path.join(CONTENT, 'projects', f), 'utf8').replace(/^---[\s\S]*?---/, '') }));

const ids = Object.fromEntries(Object.entries(c).map(([k, v]) => [k, new Set(v.map((e) => e.id))]));
const byId = (coll, id) => c[coll].find((e) => e.id === id);
const at = (coll, e) => `${coll}/${e.id}`;
const sortKey = (d) => String(d).padEnd(10, '-99').replace(/-99$/, '-31').replace(/-99-/, '-12-'); // undated parts sort late in their period

// R1 unique ids
for (const [coll, list] of Object.entries(c)) {
  const seen = new Set();
  for (const e of list) {
    if (!e.id) err(coll, 'entry without id');
    else if (seen.has(e.id)) err(`${coll}/${e.id}`, 'duplicate id');
    seen.add(e.id);
  }
}

// R2 exactly one "me"
const me = c.people.filter((p) => p.me);
if (me.length !== 1) err('people', `exactly one person needs me: true (found ${me.length})`);
const meId = me[0]?.id;

// R3-R5 publications
let selected = 0;
for (const p of c.publications) {
  const where = at('publications', p);
  const authors = p.authors ?? [];
  authors.forEach((a, i) => { if (!ids.people.has(a.person)) err(where, `authors[${i}] "${a.person}" is not in people.yaml`); });
  const mine = authors.map((a, i) => ({ ...a, i })).filter((a) => a.person === meId);
  if (mine.length !== 1) err(where, `you must appear exactly once in authors (found ${mine.length})`);
  const pos = mine[0]?.i;
  const equalGroup = authors.filter((a) => a.equal).length;
  if (p.role === 'first-author' && pos !== 0) err(where, 'role first-author but you are not listed first');
  if (p.role === 'co-first-author' && !(mine[0]?.equal && equalGroup >= 2 && authors.slice(0, equalGroup).every((a) => a.equal)))
    err(where, 'role co-first-author needs you inside a leading group of >= 2 authors marked equal: true');
  if (p.role === 'co-author' && (pos === 0 || mine[0]?.equal)) err(where, 'role co-author but you are listed first or marked equal');
  if (p.venue && !ids.venues.has(p.venue)) err(where, `venue "${p.venue}" is not in venues.yaml`);
  if (p.project && !ids.projects.has(p.project)) err(where, `project "${p.project}" has no file in content/projects/`);
  if (p.selected) selected++;
  if (p.selected && !['conference', 'journal'].includes(p.category)) err(where, 'only conference or journal papers can be selected');
  // R14 staleness guard: accepted long after the event -> remind to add DOI / mark published
  const v = p.venue && byId('venues', p.venue);
  const end = v?.dates?.end ?? v?.dates?.start;
  if (p.status === 'accepted' && end && daysBetween(end, TODAY) > 90)
    warn(where, `still "accepted" ${daysBetween(end, TODAY)} days after ${v.short} ${v.year}; add the DOI and set status: published`);
}
if (selected > 4) err('publications', `at most 4 selected papers (found ${selected})`);

// R6 news
for (const n of c.news) {
  const where = at('news', n);
  if (sortKey(n.date) > sortKey(TODAY) && String(n.date).length === 10) err(where, `date ${n.date} is in the future`);
  for (const [k, coll] of [['publication', 'publications'], ['talk', 'talks'], ['award', 'awards']]) {
    const ref = n.refs?.[k];
    if (ref && !ids[coll].has(ref)) err(where, `refs.${k} "${ref}" does not exist`);
    if (k === 'publication' && ref && byId('publications', ref)?.category === 'earlier') err(where, 'news must not feature earlier (2014/2017) publications');
  }
}

// R7-R9 other references
for (const t of c.talks) {
  const where = at('talks', t);
  if (t.publication && !ids.publications.has(t.publication)) err(where, `publication "${t.publication}" does not exist`);
  if (t.award && !ids.awards.has(t.award)) err(where, `award "${t.award}" does not exist`);
  if (t.publication && byId('publications', t.publication)?.category === 'earlier' && !t.earlier) err(where, 'talks on earlier publications need earlier: true');
}
for (const m of c.mentoring) {
  const where = at('mentoring', m);
  if (m.project && !ids.projects.has(m.project)) err(where, `project "${m.project}" does not exist`);
  (m.publications ?? []).forEach((id) => { if (!ids.publications.has(id)) err(where, `publication "${id}" does not exist`); });
}
for (const pr of c.projects) {
  const where = at('projects', pr);
  (pr.publications ?? []).forEach((id) => {
    if (!ids.publications.has(id)) err(where, `publication "${id}" does not exist`);
    else if (byId('publications', id).project !== pr.id) warn(where, `publication "${id}" points to project "${byId('publications', id).project}"`);
  });
  (pr.results ?? []).forEach((r, i) => {
    if (!ids.publications.has(r.source?.publication)) err(where, `results[${i}] cites unknown publication "${r.source?.publication}"`);
  });
  if (pr.status === 'in-preparation' && /\d+(\.\d+)?\s*(%|×|x\b)/.test(pr.__body + JSON.stringify(pr.results ?? []))) err(where, 'in-preparation projects must not show numbers');
}

// R11 wording guardrails on research-facing text (AI claims, venue-metric leakage)
const BANNED = [/\bAI[- ]powered\b/i, /\bAI[- ]native\b/i, /\bAI researcher\b/i, /cutting[- ]edge AI/i, /\bRank:\s*(A\*|A|B|C|Q[1-4])\b/, /impact factor/i, /acceptance rate/i];
const scan = (where, text) => BANNED.forEach((re) => { if (re.test(text ?? '')) err(where, `wording guardrail: matches ${re}`); });
const p0 = c.profile[0] ?? {};
scan('profile/me', `${p0.identity} ${p0.bio}`);
c.projects.forEach((pr) => scan(at('projects', pr), `${pr.tagline} ${pr.role} ${pr.__body}`));
c.publications.forEach((p) => scan(at('publications', p), p.contribution));
c.news.forEach((n) => scan(at('news', n), n.headline));

// R13 [VERIFY] markers: allowed in notes (warning), never in displayed fields (error)
for (const [coll, list] of Object.entries(c)) {
  for (const e of list) {
    const { notes, source, __body, ...shown } = e;
    if (/\[VERIFY\]/.test(notes ?? '')) warn(`${coll}/${e.id}`, notes.replace(/\s+/g, ' ').slice(0, 140));
    if (/\[VERIFY\]/.test(JSON.stringify(shown) + (__body ?? ''))) err(`${coll}/${e.id}`, '[VERIFY] placeholder in a displayed field');
  }
}

// R15 job-market flag expiry
if (p0.job_market?.active && p0.job_market.until < TODAY) warn('profile/me', `job_market.until (${p0.job_market.until}) has passed; set active: false`);

// R16 assets: image() paths (../src/assets/...) must always exist, because the build needs them;
// site paths (/...) must exist in public/ (skip those with --no-assets during early phases).
{
  const paths = [];
  const walk = (o, where) => {
    if (typeof o === 'string' && /^\.\.\/src\/assets\//.test(o)) paths.push([where, o, 'image']);
    else if (typeof o === 'string' && o.startsWith('/') && !o.startsWith('//') && /\.[a-z0-9]{2,5}$/i.test(o)) paths.push([where, o, 'public']);
    else if (o && typeof o === 'object') Object.values(o).forEach((v) => walk(v, where));
  };
  for (const [coll, list] of Object.entries(c)) list.forEach((e) => walk({ ...e, __body: undefined }, `${coll}/${e.id}`));
  for (const [where, p, kind] of paths) {
    if (kind === 'image' && !fs.existsSync(path.join(CONTENT, p))) err(where, `image not found: ${p} (relative to content/)`);
    if (kind === 'public' && checkAssets && !fs.existsSync(path.join(PUBLIC, p))) err(where, `file not found: public${p}`);
  }
}

// R17 gallery: every entry names a photo that exists; photos without an entry get alt text from their file name (warning)
{
  const dir = path.join(CONTENT, 'gallery');
  const photos = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)) : [];
  for (const g of c.gallery) if (!photos.includes(g.file)) err(`gallery/${g.id}`, `photo not found: content/gallery/${g.file}`);
  for (const f of photos) if (!c.gallery.some((g) => g.file === f)) warn(`gallery/${f}`, 'no entry in gallery.yaml; alt text will come from the file name');
}

function daysBetween(a, b) {
  const d = (s) => new Date(String(s).length === 4 ? `${s}-12-31` : String(s).length === 7 ? `${s}-28` : s);
  return Math.round((d(b) - d(a)) / 86400000);
}

for (const w of warnings) console.log(`warning  ${w}`);
for (const e of errors) console.log(`ERROR    ${e}`);
console.log(`\ncheck-content: ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
