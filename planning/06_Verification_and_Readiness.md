# 06 · Verification, Evidence, and Readiness

**Verdict: ready to implement.** The plan has been checked against your primary sources, against the live reference and peer sites, and against working code:

- **Technical feasibility.** The schemas, checker, image pipeline, visitor pipeline, coexistence assembly, and workflows were built and tested in a scratch spike, then saved to `spike/`. A clean copy rebuilds from its lockfile.
- **Facts.** 56 numbers were checked against your primary sources, and all 14 headline results against the exact pages they cite. One wrong locator was found and fixed.
- **Design direction.** A probe page built only from your real data is in `evidence/probe_*`.

**On "outstanding":** the proposed site beats the reference and every peer on presentation, verifiability, teaching legibility, maintainability, and analytics. The rubric is in Section 5. It does not change your record, and it never pretends to (Section 6). Two conditions are open: your Stage-1 decisions D1-D6 (defaults provided) and actions A1-A3 (`04` Section 19).

---

## 1. Requirements traceability

| Your request | Where it is met | Status |
| --- | --- | --- |
| 1. Extract every feature of the reference (UX, UI, …) into a Markdown file | `01_Reference_Site_Analysis.md`: 35 features (F01-F35) with line numbers, 13 defects (D1-D13) with evidence, design system, performance, accessibility, SEO, data, counter | Done |
| 2. Search for alternatives for a better site | `03_Alternatives_Research.md`: 10 build options scored, 5 analytics options, research inputs with sources | Done |
| 3. How the new site stands out, including fancy UI | `04` Sections 0, 6, 7; `02` (per peer); Sections 4-5 here | Done |
| 4. Confirm it outstands the reference, with evidence and justification | Sections 4-5 here; `evidence/compare_first_impression_*.jpg`; measured metrics | Done (presentation dimensions; record limits in Section 6) |
| 5. Verify the plan and fix it where needed | Sections 2-3 here: 15 verification steps, 25 fixes | Done |
| 6. Implement alongside the existing site; maize and blue | `04` Section 10 (preview/live, tested); `04` Section 6 (official hex values, contrast-verified tokens) | Done |
| 7. Rigorous data input format for future changes | `05` plus `spike/` schemas and checker; recipes for publication, service, certification, experience, news, talk, and more | Done (17 of 17 injected errors caught) |
| 8. Verify against all six peer sites: what, how, and a winning strategy per exhibit | `02`: each site browsed, including subpages; per-exhibit strategy tables grounded in your sources | Done |
| 9. Justify outstanding; confirm readiness | Section 7 here | Done |
| Note: rigorous impression | Cited results, provenance on every entry, validation, honest counts | Planned and verified |
| Note: images from your resources | `04` Section 8; probe uses your headshot and a MicroProf figure; logos and 4 certificates prepared EXIF-free | Done in spike |
| Note: strengths shown impressively | Results at a glance, research map, artifacts, OSDI artifact evaluation, teaching ownership, mentoring outcomes | Planned; probe shows the main pieces |
| Note: view count with location | `04` Section 12; fetcher and map tested against a mock API | Verified, pending account |
| Note: avoid weaknesses and report them with justification | `04` Section 15 (W1-W16) | Done |

## 2. Verification log

| # | What was verified | Method | Result | Evidence |
| --- | --- | --- | --- | --- |
| V1 | Every seed fact has provenance | `tools/factcheck.py` scans `source` fields | 0 entries without a recognized source family | console output |
| V2 | Numbers match your sources | `factcheck.py`: numbers in project results, copy deck, weakness table, and teaching seed, searched in C0, 02B, final CV, evaluation, poster, `gsi.csv`, and the paper/PROP/CV text copies | **56 checked, 0 missing** | `tools/factcheck.py` |
| V3 | Each headline result appears on the page it cites | `tools/locator_check.py` (page-level) | 13/14 at first; **14/14 after fixing "17 of 22"** (F10) | console output |
| V4 | Small counts | Read in source | "six … themes, six remediation strategies, and five …" (P-CS p.4); "five inefficient remote invocations" (P-MP p.1) | — |
| V5 | Schemas accept the seed | `astro sync` on 18 collections | Pass; **18 JSON Schemas generated** with enums and patterns for editor autocompletion | `spike/src/content.config.ts` |
| V6 | Validation rejects mistakes | `tools/negtest.py` (schema, 8 cases) and `tools/negtest2.py` (checker, 10 cases) | **17 of 17 distinct injected errors caught** (7 by schemas, 10 by the checker, which covers the one Astro only logs) | `05` Section 5 |
| V7 | Build reproducibility | Clean copy, then `npm ci`, sync, check, and build | Pass on Astro 7.3.8 / Node 24.21.0 (SHA-256 of the Node tarball verified) | — |
| V8 | Image pipeline and privacy | `<Picture>`/`image()` build; Pillow EXIF scan | Headshot AVIF 480 w = **7.6 KiB** (the reference's hero is 668 KB); figures 11-28 KB WebP; **14 source images, 0 with EXIF**; a missing image fails the checker and the build | `spike/src/assets/` |
| V9 | Coexistence with the legacy site | `assemble-site.sh` in both modes, served locally, checked with Playwright | Preview: `/` legacy and `/skeleton/` load all CSS and images, 0 broken, 0 4xx; `/v2/` new site with base-prefixed assets. Live: `/` new, `/classic/` and `/skeleton/` intact | `tools/check_served.py` |
| V10 | Visitor counter and location | GoatCounter OpenAPI (`locations` is a valid stats page); fetcher run against `tools/mock_goatcounter.py` | No token → placeholder; valid token → 577 visitors and 5 countries over 2 pages, "(unknown)" filtered; bad token → previous data kept. Map: 40.6 KiB gzipped, small countries as dots; ISO mapping checked for US, BD, IN, DE, CY | `evidence/probe_visitor_map_mockdata.jpg` |
| V11 | Workflows | actionlint 1.7.12 (checksum verified) | `deploy.yml` and `links.yml`: no problems | `spike/.github/workflows/` |
| V12 | Pinned versions exist and are at least two weeks old | npm registry and GitHub Releases API, 2026-10-24 | All pinned versions pass; `withastro/action` 6.1.4 (one day old) avoided | `03` Section 5 |
| V13 | Maize-and-blue contrast | WCAG 2.x relative luminance | All text pairs ≥ 4.5:1 in both themes; maize on white (1.52:1) banned by rule | `04` Section 6 |
| V14 | Design direction is achievable from data | Probe page built only from collections; light, dark, and mobile captures | Renders; 8 requests and 177 KiB (uncompressed local server); three defects found and fixed (F13) | `evidence/probe_*` |
| V15 | Peer and reference claims | Source reads, served-HTML checks, screenshots | Stray `</div>` in the served HTML; `<embed>`-only CV; 0 `citation_*` tags on 4 real paper pages; counter shows 197 live and 1 when blocked | `evidence/peer_*`, `evidence/ref_*` |

## 3. Problems found during verification, and the fixes applied

| # | Problem found | Fix |
| --- | --- | --- |
| F1 | Astro **logs but does not fail** on a broken reference (misspelled co-author id): `astro sync` exits 0 | CI fails on any `[ERROR]` line from sync; checker rule R3 |
| F2 | `astro sync` doesn't check image files (only `astro build` does) | Checker rule R15 checks `image()` paths on every run |
| F3 | Unquoted YAML dates and years become Date objects or numbers | `dateish` preprocessing in the schemas |
| F4 | My draft said "Led the empirical study" (stronger than the CV) | Reverted to the CV's "Investigated …" |
| F5 | My draft said "Elected president" (not in any source) | "As president … revitalized … organized …" (02B item 18.2) |
| F6 | EASE news implied a publication date | "was accepted", month precision, with a dating note |
| F7 | Project years were estimates | Years now come only from dated evidence (paper, poster, mentoring start) |
| F8 | I first applied critique row 15, which you rejected | Your wording restored ("the world's largest NGO") |
| F9 | CIS-581 modality and Fall 2024 lab materials have no source | `[VERIFY]` notes; the checker forbids `[VERIFY]` in shown fields |
| F10 | The "17 of 22" locator cited p.3, where 22 doesn't appear | Locator corrected to "pp.2-3; p.8" (p.8 says "17 out of 22") |
| F11 | Caption-anchored figure crop fails on two-column IEEE pages | Cropper gained `--column` and `--top`; a figure manifest pins the values |
| F12 | The map hid small countries, wasted space on Antarctica, and was 165 KiB | Proportional dots, Antarctica removed, 0.1 px precision: 118 KiB raw, 41 KiB gzipped |
| F13 | Probe: loop labels clipped by the photo; a trace row collided with the axis; a lazy figure was blank in captures | Labels moved below their nodes; explicit row offsets; capture now scrolls first |
| F14 | `<Picture>` kept a 315 KiB full-size JPEG fallback | Plan requires an explicit `width` |
| F15 | Seed images pointed into `/images/`, the legacy folder | Moved to `image()` assets; `/images/` reserved for the legacy site |
| F16 | `cp -n` is non-portable | Plain copy, since there are no name collisions by design |
| F17 | Planning docs in the site repo would be served publicly by today's branch deploy (it serves `README.md` and `content/site.json`) | Docs live in `_redesign/`: Jekyll (the current Pages build) skips folders starting with `_`, and the new deploy publishes only the build artifact. The repository itself is public on GitHub, so commit `_redesign/` only if you're comfortable with peers' critiques and your weakness analysis being readable there (see `README.md`) |
| F18 | The final CV PDFs contain your phone number and referee emails | D3: web CV variant |
| F19 | The teaching statement is tailored to one institution | D7: not published |
| F20 | GoatCounter's stats default to the last week | Fetcher always sends `start = STATS_START` |
| F21 | My first peer Scholar-tag check used a listing page | Re-checked on 4 real paper pages: 0 tags |
| F22 | Some reference line numbers were a few lines off | Corrected against the file with grep |
| F23 | The identity sentence was presented as settled | Now decision D16 (your notes list three candidates) |
| F24 | `withastro/action` latest is one day old | Plain workflow with established actions |
| F25 | `05` claimed images were checked "by Astro" at sync | Corrected: the checker plus `astro build` catch them, not `astro sync` |

## 4. Evidence that the plan beats the reference

| Dimension | Reference (measured or read) | Proposed (verified in spike/probe, or target tested at Phase 6) | Evidence |
| --- | --- | --- | --- |
| First screen | Strong design, but a Ph.D.-seat message and a pop-up covering the resume button on mobile | Faculty-market first screen: status, April 2027, job-market chip, identity, CV, method loop; no pop-ups | `evidence/compare_first_impression_desktop.jpg`, `…_mobile.jpg` |
| Research story | 6 separate cards | One question across 4 layers (map), method loop, trace timeline | `evidence/probe_desktop_light_full.jpg` |
| Numbers | Stat cards without sources | Every number cites paper and page (14/14 verified) | V3 |
| Publications | Filter bugs, dead "—↗" links, no abstract/BibTeX/PDF | Validated explorer and per-paper pages with Scholar tags, BibTeX, DOI, artifact | `05`; `04` Section 13 |
| Teaching | None | Dedicated page; instructor roles first; honest evaluation; mentoring outcomes | probe teaching card |
| Images | 42.3 MB unoptimized | 7.6 KiB headshot, 11-28 KB figures, AVIF/WebP | V8 |
| Counter | Fake "1" when blocked; no location | Real totals labeled "at least", plus country map | V10; `evidence/ref_counter_*` |
| Data integrity | Hand-coded; inconsistent statuses | 17/17 injected errors caught before deploy | V6 |
| Metadata | No OG, JSON-LD, favicon, sitemap | All present; Scholar tags per paper | `04` Section 13 |
| Without JavaScript | Content invisible (`.reveal` opacity 0) | Content visible; JavaScript only enhances | `04` Section 6 |

## 5. Scorecard: reference, peers, current site, proposed

**Rubric** (0-3 per criterion; definitions fixed before scoring):

| # | Criterion | 3 means |
| --- | --- | --- |
| C1 | First-screen clarity for a faculty search | Name, status, institution, identity, CV action, and photo visible on desktop and mobile, nothing blocking |
| C2 | Research coherence | Program-level framing: thesis, a unifying visual, project pages |
| C3 | Publication depth | Per-paper pages, abstract, PDF/DOI, citation export, code/artifact |
| C4 | Verifiability | Claims systematically linked to DOIs, artifacts, certificates, evaluations |
| C5 | Teaching | Dedicated page: roles, terms, sizes, evidence, philosophy |
| C6 | Service and mentoring | Structured sections with outcomes |
| C7 | Currency | Dated news, no stale claims, mechanisms that keep it fresh |
| C8 | Visual design | Custom, coherent, distinctive system |
| C9 | Meaningful interactivity ("fancy UI") | Several accessible interactive or animated features that carry research content |
| C10 | Performance (measured) | ≤ 1 MB first load, ≤ 30 requests, LCP ≤ 1.5 s |
| C11 | Metadata and accessibility (measured; 8 checks: lang, description, OG, favicon, valid JSON-LD, Scholar tags, no empty `alt` on content images, AA contrast) | ≥ 7 of 8 |
| C12 | Maintainability | Structured data plus automated validation |
| C13 | View count and location | Reliable count plus location view |

| Site | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | C11 | C12 | C13 | **Total / 39** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Reference (Bismoy) | 3 | 2 | 1 | 1 | 0 | 1 | 2 | 3 | 2 | 1 | 1 | 0 | 1 | **18** |
| Mottakin | 2 | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 1 | 0 | **11** |
| Rzig | 2 | 1 | 3 | 2 | 1 | 1 | 1 | 2 | 2 | 2 | 3 | 2 | 0 | **22** |
| Ghammam | 2 | 1 | 2 | 1 | 2 | 3 | 2 | 1 | 1 | 3 | 2 | 2 | 0 | **22** |
| Z. Li | 3 | 1 | 2 | 2 | 2 | 1 | 1 | 1 | 0 | 3 | 1 | 1 | 0 | **18** |
| Amich | 2 | 2 | 3 | 2 | 1 | 1 | 0 | 2 | 2 | 2 | 2 | 2 | 0 | **21** |
| You (current) | 1 | 0 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 1 | 0 | 1 | 0 | **7** |
| **Proposed** | 3 ✓ | 3 ✓ | 3 | 3 | 3 | 3 | 3 | 3 ✓ | 3 ✓ | 3 ✓ | 3 | 3 ✓ | 3 ✓ | **39** (target) |

- **✓** marks what the spike or probe already demonstrates. The rest are acceptance targets in Phase 6, measured with the same capture tools (`tools/capture.py`) used for the peers.
- **Bias caution:** I designed the plan and scored it. The definitions were fixed before scoring, and C10, C11, and C13 are computed from captures. Phase 6 re-measures the built site, and a blind look at `/v2/` by your advisor is recommended.

**Fancy UI, feature by feature:**

| Feature | Ref | Mottakin | Rzig | Ghammam | Li | Amich | **Proposed** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dark mode | ✓ | — | ✓ | — | — | ✓ | ✓ (probe) |
| Motion that carries meaning | generic | — | — | — | — | — | Method loop, trace (probe) |
| Research visualization | — | — | — | — | — | — | Cross-layer map (probe) |
| Cited result cards | — | — | — | — | — | — | ✓ (probe) |
| Publication filters / search | buggy | — | ✓ | search | — | ✓ | ✓ plus URL state |
| BibTeX / cite | — | — | ✓ | ✓ | — | ✓ | ✓ plus `/publications.bib` |
| Talk cards with slides and video | — | — | — | — | — | ✓ | ✓ |
| Evidence lightbox | broken cursor | — | links | — | eval PDF link | — | ✓ (`<dialog>`) |
| Visitor map | — | — | — | — | — | — (office map) | ✓ (verified with mock) |
| Command palette | — | — | — | — | — | — | ✓ |
| View transitions | — | — | — | — | — | — | ✓ (CSS) |
| Print summary | partial | — | — | — | — | — | ✓ |

## 6. What the site cannot change

The site doesn't add publications, awards, fellowships, or program-committee seats (see `02` Section 9). It makes your real strengths legible and keeps every claim checkable. That matters most to the committees you target first: teaching-focused and balanced institutions weigh teaching ownership, coherence, artifacts, and integrity heavily (`deliverables/04` Section 4). Where peers have stronger records (Z. Li's Distinguished Paper Award and Rackham fellowship; Ghammam's program-committee service; Amich's USENIX Security paper), the site doesn't invite a direct comparison. It leads with what is distinctively yours: cross-layer coherence, released artifacts, OSDI artifact evaluation, instructor-of-record teaching, and six-plus years of industry engineering.

## 7. Readiness

**Ready to implement.** Go/no-go checklist:

| Item | State |
| --- | --- |
| Toolchain, versions, and workflows verified | ✓ |
| Data model, seed data (from primary sources), and validation verified | ✓ |
| Coexistence with the legacy site verified in both modes | ✓ |
| Visitor pipeline verified (mock); live account pending (A3) | ✓ / pending |
| Design direction proven with real data (probe) | ✓ |
| Stage-1 decisions D1-D6 (defaults provided) | **needed** |
| Your actions A1 (Pages source → GitHub Actions) and A2 (variables/secret) | **needed at Stage 1** |
| Open `[VERIFY]` items (4) and the EASE DOI | can resolve during Phase 1 |

**Not yet verified, and when it will be:**

| Item | When |
| --- | --- |
| Full-site Lighthouse scores and axe results | Phase 6 |
| Firefox and Safari rendering, including the SMIL loop animation | Phase 6 (Playwright WebKit and Firefox) |
| GoatCounter's privacy wording and live counter CORS behavior | Account setup (A3) |
| Google Scholar indexing of the paper pages | Takes weeks after launch |
| How committees actually react | Cannot be verified; reduced by advisor review of `/v2/` |
