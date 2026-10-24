# Personal_site (private)

Source of https://ssmtariq.github.io, the website of Syed Salauddin Mohammad Tariq.

This repository is private. On every push, its workflow:
1. checks and builds the site;
2. verifies the result;
3. replaces the public repository `ssmtariq/ssmtariq.github.io` with the built files, plus a short README.

No source, data, or history ever reaches the public repository.

**To launch, follow [`planning/08_Launch_Guide.md`](planning/08_Launch_Guide.md).** It covers the steps only you can do on GitHub, testing at `/v2/`, going live, and rollback.

## Layout

| Path | What it holds |
| --- | --- |
| `site/content/` | **The only place you edit for content.** One YAML file per kind of item (publications, talks, teaching, news …), plus `projects/*.md` and `gallery/` photos. Recipes: `planning/05_Data_Input_Spec.md` |
| `site/` | The Astro 7 project: schemas (`src/content.config.ts`), the page (`src/pages/index.astro`), styles, scripts, and checks (`scripts/`) |
| `site/public/cv/Syed_Tariq_CV.pdf` | The public, sanitized CV, built by `cv/make-web-cv.py` |
| `cv/` | The web-CV builder and its privacy check (what it removes: `cv/README.md`) |
| `legacy/` | The old site, exactly as it was in the public repository (commit 023244c). Published unchanged at `/` during the preview; retired at cutover |
| `publish/README.md` | The note shown in the public repository |
| `planning/` | The analysis, plan, design feedback log (`07`), launch guide (`08`), open-source audit (`09`), evidence screenshots, and tools |
| `.github/workflows/` | `publish.yml` (build and publish: on push, daily, or by hand) and `links.yml` (weekly link check) |

## Common commands

```bash
# local preview (needs Node 24; see planning/04_Site_Plan.md, Section 9)
cd site && npm ci && npm run dev          # http://localhost:4321
npm run check                             # schemas, cross-references, wording rules

# rebuild the CV after changing it in TTAP_Package (needs TeX Live and poppler-utils)
python3 cv/make-web-cv.py

# fact checks against your TTAP_Package sources (read-only)
python3 planning/tools/factcheck.py /users/ssmtariq/TTAP_Package .
python3 planning/tools/locator_check.py /users/ssmtariq/TTAP_Package .
```

Keep `site/node_modules/` and `site/dist/` out of commits; `.gitignore` already does this.

## Settings the workflow reads (Personal_site → Settings → Secrets and variables → Actions)

| Name | Kind | Value |
| --- | --- | --- |
| `PAGES_DEPLOY_KEY` | secret | Private half of the deploy key that has write access to `ssmtariq.github.io` |
| `SITE_MODE` | variable | `preview` (old site at `/`, new site at `/v2/`) or `live` (new site at `/`) |
| `GOATCOUNTER_SITE` | variable | Your GoatCounter code, for example `ssmtariq` |
| `GOATCOUNTER_TOKEN` | secret | GoatCounter API key with read-statistics permission only |
| `STATS_START` | variable | Hour from which public visitor counts start (UTC), for example `2026-11-01T00:00:00Z` |
