#!/usr/bin/env node
// Checks the assembled files before they are published to the public repository.
// Usage: node scripts/verify-site.mjs preview|live OUT_DIR LEGACY_DIR
//   1. Every local link and asset in the new site's HTML resolves to a published file.
//   2. No source or data files are published (YAML, Markdown, TypeScript, Astro, LaTeX, source maps ...).
//   3. The legacy files are byte-identical to legacy/: at / in preview (only the old résumé PDF is replaced), at /v1/
//      when live (its two pages only gain a noindex tag and lose the defunct Google Analytics tag).
//   4. The new site's pages carry the right robots rule (noindex on the preview).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [, , mode, out, legacy] = process.argv;
const errors = [];
const fail = (msg) => errors.push(msg);
const files = (dir) => fs.readdirSync(dir, { recursive: true, withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => path.relative(out, path.join(d.parentPath, d.name)).split(path.sep).join('/'));
const all = files(out);
const published = new Set(all);
const newSite = mode === 'preview' ? 'v2/' : '';
const oldSite = mode === 'preview' ? '' : 'v1/';

// 1. links in the new site's pages (legacy pages are checked byte-for-byte instead)
const htmlPages = all.filter((f) => f.endsWith('.html') && f.startsWith(newSite) && !(mode === 'live' && /^(skeleton|v1|v2)\//.test(f)));
if (!published.has(`${newSite}index.html`)) fail(`missing ${newSite}index.html`);
let checked = 0;
for (const page of htmlPages) {
  const html = fs.readFileSync(path.join(out, page), 'utf8');
  for (const [, url] of html.matchAll(/\s(?:href|src|srcset|content)="([^"]+)"/g)) {
    for (const candidate of url.split(',').map((s) => s.trim().split(/\s+/)[0])) {
      if (!candidate.startsWith('/') || candidate.startsWith('//')) continue; // external, mailto:, anchors, relative text
      const clean = decodeURIComponent(candidate.split(/[?#]/)[0]);
      const target = clean.endsWith('/') ? `${clean.slice(1)}index.html` : clean.slice(1);
      checked++;
      if (!published.has(target)) fail(`${page}: broken link ${candidate}`);
    }
  }
}

// 2. nothing that looks like source or data
const SOURCE = /\.(ya?ml|md|mdx|ts|tsx|astro|mjs|cjs|jsx|tex|cls|py|sh|map|lock)$|(^|\/)(package(-lock)?\.json|\.env[^/]*|\.git(ignore|attributes)?|\.nvmrc)$/i;
// The legacy files are published as they are today (checked byte-for-byte below), so they are not scanned.
for (const f of all.filter((f) => (mode === 'live' ? !f.startsWith(oldSite) : f.startsWith(newSite)))) if (SOURCE.test(f)) fail(`source or data file would be published: ${f}`);

// 3. legacy integrity
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
// The two edits assemble-site.sh makes to the archived pages at /v1/.
const ARCHIVED_PAGES = ['index.html', 'skeleton/index.html'];
const archived = (html) => html
  .replace(/\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]*"><\/script>\s*<script>[^<]*gtag\([^<]*<\/script>/, '')
  .replace(/(<meta charset="utf-8">)/i, '$1\n<meta name="robots" content="noindex">');
const legacyFiles = ['index.html', ...['assets', 'images', 'skeleton'].flatMap((d) =>
  fs.readdirSync(path.join(legacy, d), { recursive: true, withFileTypes: true }).filter((e) => e.isFile())
    .map((e) => path.relative(legacy, path.join(e.parentPath, e.name)).split(path.sep).join('/')))];
for (const f of legacyFiles) {
  const at = oldSite + f;
  if (!published.has(at)) fail(`legacy file missing: ${at}`);
  else if (mode === 'live' && ARCHIVED_PAGES.includes(f)) {
    const html = fs.readFileSync(path.join(out, at), 'utf8');
    if (html !== archived(fs.readFileSync(path.join(legacy, f), 'utf8'))) fail(`legacy page changed beyond the archive edits: ${at}`);
    if (!/<meta name="robots" content="noindex">/.test(html)) fail(`archived page is not marked noindex: ${at}`);
    if (/googletagmanager|gtag\(/.test(html)) fail(`archived page still loads Google Analytics: ${at}`);
  } else if (sha(path.join(out, at)) !== sha(path.join(legacy, f))) fail(`legacy file changed: ${at}`);
}
const webCv = path.join(out, `${newSite}cv/Syed_Tariq_CV.pdf`);
for (const f of mode === 'preview' ? ['Resume_of_SSM_TARIQ.pdf'] : ['cv.pdf', 'Resume_of_SSM_TARIQ.pdf']) {
  if (!published.has(f)) fail(`missing ${f}`);
  else if (sha(path.join(out, f)) !== sha(webCv)) fail(`${f} does not serve the web CV`);
}
if (mode === 'live' && all.some((f) => /^(assets|images)\//.test(f))) fail('legacy assets are still published at / in live mode');

// 4. robots rule
const home = fs.existsSync(path.join(out, `${newSite}index.html`)) ? fs.readFileSync(path.join(out, `${newSite}index.html`), 'utf8') : '';
const noindex = /<meta name="robots" content="noindex/.test(home);
if (mode === 'preview' && !noindex) fail('the preview home page must carry noindex');
if (mode === 'live' && noindex) fail('the live home page must not carry noindex');

const size = all.reduce((s, f) => s + fs.statSync(path.join(out, f)).size, 0);
if (errors.length) {
  console.error(errors.map((e) => `  ✗ ${e}`).join('\n'));
  console.error(`verify-site: ${errors.length} problem(s); nothing was published`);
  process.exit(1);
}
console.log(`verify-site (${mode}): ${all.length} files, ${(size / 1048576).toFixed(1)} MiB; ${checked} local links resolve; no source files; ${mode === 'preview' ? 'legacy files unchanged' : 'previous site archived at /v1/'}`);
