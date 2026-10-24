#!/usr/bin/env node
// Renders the visitor world map to static SVG at build time (no map JavaScript ships to the browser).
// In the site this logic lives in src/components/VisitorMap.astro; this script lets CI and tests run it alone.
// Usage: node scripts/render-visitor-map.mjs src/data/visitors.json public/stats/visitors-map.svg
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import countries from 'i18n-iso-countries';

const require = createRequire(import.meta.url);
const world = require('world-atlas/countries-110m.json');
const [, , inFile, outFile] = process.argv;
const stats = JSON.parse(fs.readFileSync(inFile, 'utf8'));

// 480 x 235 user units at whole-unit precision is ample for a footer map and keeps the inlined SVG small.
const W = 480, H = 235;
// Antarctica (010) is dropped: it takes a fifth of the canvas and never has visitors.
const land = { ...feature(world, world.objects.countries) };
land.features = land.features.filter((f) => f.id !== '010');
const projection = geoEqualEarth().fitSize([W, H], land);
const pathFor = geoPath(projection).digits(0); // whole units: invisible at footer size, and the SVG stays small

// numeric ISO id (world-atlas) -> visitor count
const counts = new Map();
for (const c of stats.countries ?? []) {
  const numeric = countries.alpha2ToNumeric(c.code);
  if (numeric) counts.set(numeric, (counts.get(numeric) ?? 0) + c.count);
}
const max = Math.max(1, ...counts.values());
// Five-step sequential scale on log counts; colors are CSS custom properties so the map follows the theme.
const step = (n) => Math.min(4, Math.floor((Math.log(n) / Math.log(max + 1)) * 5));
const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);

const matched = new Set(land.features.map((f) => f.id));
const unmatched = [...counts.keys()].filter((id) => !matched.has(id));
if (unmatched.length) console.log(`visitor map: no 1:110m shape for ${unmatched.join(', ')}; shown as dots only`);
// Countries without visitors are one merged path; each visited country keeps its own shape and tooltip.
const unvisited = land.features.filter((f) => !counts.has(f.id)).map((f) => pathFor(f) ?? '').join('');
const shapes = [`<path class="nv" d="${unvisited}"/>`].concat(
  land.features
    .filter((f) => counts.has(f.id))
    .map((f) => {
      const n = counts.get(f.id);
      return `<path class="v v${step(n)}" d="${pathFor(f)}"><title>${esc(`${f.properties.name}: ${n.toLocaleString('en-US')} visitor${n === 1 ? '' : 's'}`)}</title></path>`;
    }),
);

// Proportional dots make small countries (Cyprus, Singapore) visible and readable on any map.
const dots = (stats.countries ?? []).map((c) => {
  const f = land.features.find((x) => x.id === countries.alpha2ToNumeric(c.code));
  const [x, y] = f ? pathFor.centroid(f) : [NaN, NaN];
  if (!Number.isFinite(x)) return '';
  const r = (1.5 + 5 * Math.sqrt(c.count / max)).toFixed(1);
  return `<circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"><title>${esc(`${c.name}: ${c.count.toLocaleString('en-US')}`)}</title></circle>`;
});
// Every selector is scoped to .vmap: when the SVG is inlined in a page, its <style> applies to the whole document.
const svg = `<svg class="vmap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="vm-t vm-d">
<title id="vm-t">Visitors by country</title>
<desc id="vm-d">${esc(`${stats.total ?? 0} visitors from ${stats.countryCount ?? 0} countries since ${String(stats.since ?? '').slice(0, 10)}.`)}</desc>
<style>.vmap .nv{fill:var(--map-empty,#E6EDF5)}.vmap .v0{fill:var(--map-1,#C9D7EA)}.vmap .v1{fill:var(--map-2,#9FB7D6)}.vmap .v2{fill:var(--map-3,#5583B5)}.vmap .v3{fill:var(--map-4,#1D4E80)}.vmap .v4{fill:var(--map-5,#00274C)}.vmap path{stroke:var(--map-stroke,#FBFAF6);stroke-width:.3}.vmap path.v:hover{fill:var(--maize,#FFCB05)}.vmap .dot{fill:var(--maize,#FFCB05);stroke:var(--blue,#00274C);stroke-width:.6}</style>
${shapes.join('\n')}
${dots.join('\n')}
</svg>`;
fs.mkdirSync(outFile.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(outFile, svg);
console.log(`visitor map: ${counts.size} shaded countries, ${(svg.length / 1024).toFixed(1)} KiB -> ${outFile}`);
