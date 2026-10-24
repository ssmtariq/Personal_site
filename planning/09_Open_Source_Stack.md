# 09 · Open-source stack

You asked that everything be open source and widely used, with nothing proprietary. Every tool that builds, checks, or runs the site meets that. Only the hosting is proprietary: GitHub, which you already use.

Star counts are GitHub stars on 2026-10-24, a rough measure of popularity.

## What builds and runs the site

| Part | Tool (version) | License | Stars |
| --- | --- | --- | --- |
| Site generator | Astro 7.3.8 (bundles Vite and Zod) | MIT | 63k |
| Runtime for the build | Node.js 24.21.0 | MIT | 123k |
| Image resizing (AVIF/WebP) | sharp, with libvips | Apache-2.0; LGPL-3.0 | 33k |
| Fonts (self-hosted, no font CDN) | Source Serif 4, IBM Plex Sans and Mono, via Fontsource | SIL OFL 1.1; packaging MIT | 6k (Fontsource) |
| Visitor map (drawn at build time, no map JavaScript) | d3-geo, topojson-client, world-atlas (Natural Earth data), i18n-iso-countries | ISC; ISC; ISC (public-domain data); MIT | 114k (D3) |
| Flags | flag-icons 7.5.0, inlined as SVG | MIT | 12k |
| Scholar and GitHub icons | Simple Icons 16.34.0 (the other icons are drawn for the site) | CC0-1.0 (the logos stay trademarks of their owners) | 26k |
| Data files | YAML, read by `yaml` 2.9.1 | ISC | — |
| Visitor counting | GoatCounter: `count.v4.js` served from your own site (SHA-256 `b9f5c4c0…de86c03`); free hosted service | ISC (script); EUPL-1.2 (service) | 6k |
| Favicon | "ST" drawn from Source Serif 4 outlines; needs no installed font | SIL OFL 1.1 | — |

**Why GoatCounter.** Umami (40k stars) and Plausible (30k) are more popular, but both cost something here:
- Plausible's hosted plan is paid.
- Umami's free cloud plan keeps only 6 months of data.
- Self-hosting either one needs a server and a database.

GoatCounter keeps all history for free and works with a static site, so the footer can honestly say "since launch".

## What produces and checks the CV

| Part | Tool | License |
| --- | --- | --- |
| Typesetting | TeX Live: XeLaTeX and latexmk | LPPL, GPL, and other free licenses |
| CV template | Awesome-CV (29k stars) | LPPL-1.3c (your `cv.tex` header says CC BY-SA 4.0) |
| CV fonts | Roboto, Source Sans Pro, FontAwesome 4 | Apache-2.0; SIL OFL 1.1; SIL OFL 1.1 |
| Privacy check of the PDF | pdftotext (Poppler) | GPL-2.0/3.0 |

## What automates and tests

| Part | Tool | License |
| --- | --- | --- |
| Workflow steps | actions/checkout v7, actions/setup-node v7, actions/cache v6 | MIT |
| Weekly link check | lychee (4k stars), through lychee-action v2.9.0 | Apache-2.0 / MIT |
| Workflow lint | actionlint 1.7.12 | MIT |
| Browser checks and screenshots (on this machine) | Playwright (98k stars) with Chromium | Apache-2.0; BSD-3-Clause |
| Fact checks, contact sheets | Python 3, Pillow | PSF; MIT-CMU |
| Version control | Git | GPL-2.0 |

## The proprietary pieces, and why they stay

| Piece | Where | Decision |
| --- | --- | --- |
| GitHub: repositories, Actions runners, Pages hosting | Hosting | **Kept.** `ssmtariq.github.io` is already on your CV and profiles, and the free plan does everything needed. The site uses no GitHub-specific code: it is plain static files, so moving to an open-source host (Codeberg Pages, or a self-hosted Forgejo or GitLab) means changing only the publish step. The address would change with the host |
| Google Analytics (`UA-80541256-2`) and the Search Console verification tag | Old pages only | **Gone at cutover** (step 7 of `08`). Google shut that Analytics version down in July 2023, so it has counted nothing since. The new site has neither tag; the archived copy at `/v1/` drops the Analytics tag and keeps only the verification tag, which has no effect off the home page |
| Links to Google Scholar, LinkedIn, GitHub, and the UM-Dearborn page | Content | Kept. These are links to your profiles, not software the site uses |

The old pages also use Font Awesome 4.7 (SIL OFL and MIT), Academicons (SIL OFL), jQuery (MIT), skel (MIT), and the HTML5 UP template (CC BY 3.0). All are open source, and after cutover they load only on the archived copy at `/v1/`.
