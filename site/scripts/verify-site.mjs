#!/usr/bin/env node
// Checks the assembled files before they are published to the public repository.
// Usage: node scripts/verify-site.mjs preview|live OUT_DIR LEGACY_DIR
//   1. Every local link and asset in the new site's HTML resolves to a published file.
//   2. No source or data files are published (YAML, Markdown, TypeScript, Astro, LaTeX, source maps ...).
//   3. Preview: the legacy files are byte-identical to legacy/ (only the old résumé PDF is replaced).
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

// 1. links in the new site's pages (legacy pages are checked byte-for-byte instead)
const htmlPages = all.filter((f) => f.endsWith('.html') && f.startsWith(newSite) && !(mode === 'live' && /^(skeleton|v2)\//.test(f)));
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
// In preview the legacy files are published as they are today (checked byte-for-byte below), so only the new site is scanned.
for (const f of all.filter((f) => mode === 'live' || f.startsWith('v2/'))) if (SOURCE.test(f)) fail(`source or data file would be published: ${f}`);

// 3. legacy integrity in preview
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if (mode === 'preview') {
  const legacyFiles = ['index.html', ...['assets', 'images', 'skeleton'].flatMap((d) =>
    fs.readdirSync(path.join(legacy, d), { recursive: true, withFileTypes: true }).filter((e) => e.isFile())
      .map((e) => path.relative(legacy, path.join(e.parentPath, e.name)).split(path.sep).join('/')))];
  for (const f of legacyFiles) {
    if (!published.has(f)) fail(`legacy file missing: ${f}`);
    else if (sha(path.join(out, f)) !== sha(path.join(legacy, f))) fail(`legacy file changed: ${f}`);
  }
  if (sha(path.join(out, 'Resume_of_SSM_TARIQ.pdf')) !== sha(path.join(out, 'v2/cv/Syed_Tariq_CV.pdf'))) fail('the old résumé URL does not serve the web CV');
} else {
  for (const f of ['cv.pdf', 'Resume_of_SSM_TARIQ.pdf']) if (!published.has(f)) fail(`missing ${f}`);
  if (all.some((f) => /^(assets|images)\//.test(f))) fail('legacy assets are still published in live mode');
}

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
console.log(`verify-site (${mode}): ${all.length} files, ${(size / 1048576).toFixed(1)} MiB; ${checked} local links resolve; no source files; ${mode === 'preview' ? 'legacy files unchanged' : 'legacy pages retired'}`);
