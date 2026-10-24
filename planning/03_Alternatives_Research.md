# 03 · Alternatives Research

**Question.** How should a faculty-market personal site be built so that it beats the reference and the peer sites, follows your package's fact rules, uses the maize-and-blue theme, keeps the existing site, and lets you add new items safely?

**Date.** Web sources accessed 2026-10-24 unless marked otherwise. Package version numbers come from the npm registry and GitHub release APIs on 2026-10-24. Web research shapes structure and tooling only; it adds no facts about you (AGENTS.md rule 7).

---

## 1. Requirements (from your request)

| ID | Requirement | Source |
| --- | --- | --- |
| R1 | Rigorous, structured data input so new publications, service, certifications, experience, news, and talks are easy and safe to add | Your item 7 |
| R2 | A clearly better first impression than the reference and every peer, including "fancy UI" | Your items 2, 3, 8 and the note |
| R3 | A rigorous impression; strengths shown, weaknesses avoided and reported to you | Your note |
| R4 | Images from your resources, used appropriately | Your note |
| R5 | A view count with possible visitor location | Your note |
| R6 | Maize-and-blue theme | Your item 6 |
| R7 | Keep the existing site while building the new one | Your item 6 |
| R8 | Ready to implement, with verified details | Your items 4, 5, 9 |
| R9 | Fact discipline: primary sources only, `[VERIFY]` for unknowns, earlier papers kept off identity, precise AI claims | TTAP `AGENTS.md` |

## 2. How to build it: ten options compared

Scores run 0-3 per criterion; the weight is in brackets. "Verified" means I tested it in the scratch spike (`spike/`; log in `06`).

| Option | R1 data rigor [3] | Rich UI [2] | Performance and image pipeline [2] | Theming freedom [2] | Coexists with legacy [2] | GitHub Pages / CI [1] | Upgrade stability [2] | Local toolchain [1] | Distinct from peers [1] | **Total / 48** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| O1 Patch the current HTML5 UP page | 0 | 1 | 1 | 2 | 3 | 3 | 2 | 3 | 0 | 24 |
| O2 Extend your Skeleton generator (`content/site.json` → `render-site.mjs`) | 1 (JSON, no schema) | 1 | 1 | 2 | 3 | 2 | 2 | 1 (needs Node) | 1 | 25 |
| O3 Google Sites (Mottakin) | 0 | 0 | 1 | 0 | 0 | 0 | 3 | 3 | 0 | 11 |
| O4 Jekyll al-folio v1.x (now a starter plus plugin gems) | 1 (BibTeX good; YAML unvalidated) | 2 | 2 | 2 | 2 | 3 | 1 (restructured in 2026) | 1 (Ruby/Docker) | 0 (very common) | 25 |
| O5 Jekyll Minimal Mistakes / academicpages (Ghammam) | 1 | 1 | 1 | 1 | 2 | 3 | 2 | 1 | 0 | 21 |
| O6 Hugo Blox / Wowchemy (Rzig, Amich) | 1 | 2 | 2 | 1 | 2 | 3 | 1 (breaking renames) | 2 | 0 | 24 |
| O7 One hand-written HTML file (reference) | 0 | 2 | 0 | 3 | 3 | 3 | 1 | 3 | 1 | 25 |
| O8 Jon Barron-style table template | 0 | 1 | 1 | 2 | 3 | 3 | 3 | 3 | 0 | 26 |
| **O9 Astro 7, custom and data-driven (recommended)** | **3** (Zod schemas, `reference()`, generated JSON Schemas, integrity checker; verified) | **3** (static SVG plus small interactive islands; verified probe) | **3** (sharp AVIF/WebP; verified: 7.6 KiB headshot) | **3** | **3** (base-path switch and assembly; verified) | **3** (workflow passes actionlint) | 2 (majors 5.0 Dec 2024, 6.0 Mar 2026, 7.0 Jun 2026; pin exact versions) | 2 (Node 24 installs per-user; verified) | **3** | **45** |
| O10 Python generator (Jinja2 + YAML + jsonschema) | 3 | 2 (everything hand-built) | 2 (Pillow pipeline hand-built) | 3 | 3 | 3 | 2 | 3 (Python present) | 3 | 42 |

**Recommendation: O9, Astro 7.**

- It is the only option where rigorous data entry comes built in and is already verified with your data. The schemas reject bad types and enums, and Astro generates editor schemas that underline mistakes in VS Code as you type.
- It optimizes images for free, keeps pages static (no JavaScript unless a feature needs it), and lets each page switch between `/v2/` (preview) and `/` (live) with one variable.
- **Runner-up: O10.** Choose it only if you refuse to install Node. It reaches similar rigor, but every UI and image feature would have to be hand-written.
- **Honest cost of O9:** Astro released two major versions in 2026. The plan pins exact versions and treats upgrades as optional; deployed static HTML keeps working whether or not the toolchain is upgraded.

**Why not a popular academic template (O4, O5, O6, O8)?** Three of the six peer sites already use one. A template makes you look like them, and none of them validates content. Their publication features (BibTeX, filters) are easy to rebuild; the validation and research-specific visuals are what set the site apart.

## 3. View counter and visitor location (R5)

| Option | What visitors see | Location data | Privacy | Ad-blocker effect | Setup | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| Abacus API (reference) | Page-load count | none | no cookies | Blocked → shows a fake local "1" (observed) | trivial | Reject |
| **GoatCounter** (hosted, open source) | Total via the public counter JSON (off by default; you enable "Allow adding visitor counts"). Responses cached up to 4 hours | **Countries** via the authenticated API (`/api/v0/stats/locations`, confirmed in GoatCounter's OpenAPI spec); regions in your private dashboard | No cookies; IP handling should be confirmed against GoatCounter's own privacy page (a third-party review says IPs are hashed with a daily salt and discarded) | Some blockers block it, so counts are a lower bound; label them "at least" | Account, one read-only API key in a GitHub secret, a daily build | **Recommended**: tested against a mock API; renders a maize/blue country map at build time with no browser JavaScript and no token in the browser |
| ClustrMaps widget | Branded map image with dots | city-level dots | Vendor privacy terms unclear in search; third-party script | partly blocked | trivial | Fallback only: can't be themed, adds third-party branding |
| Cloudflare Worker + D1 | Anything you design | Country and city from `request.cf` | You control it; city level needs care | Own domain is less likely to be blocked | Cloudflare account and code; D1 free tier caps writes at 100K rows/day, enforced since 2026-09-01; KV allows only about 1K writes/day | Optional later upgrade |
| GA4 (already on your legacy page: `UA-80541256-2` now loads GA4 tag `G-VQFN5HK9MP`) | Nothing public | City level, private dashboard | Sets cookies | often blocked | already present | Keep only on legacy pages, if you want them; not on the new site (privacy and weight) |

**Design consequence.** The site shows "N visitors from M countries since ⟨launch date⟩" in the footer and a `/stats/` page with a country choropleth plus proportional dots, so small countries such as Cyprus stay visible. It includes a top-countries table and a plain-language privacy note. The public view is country-level only, which protects small-town visitors from being identified; you see regions in your private GoatCounter dashboard.

## 4. Research that shapes the design

| Topic | Finding | Effect on the plan |
| --- | --- | --- |
| Do committees look at candidate sites? | A recent faculty-search write-up calls a findable academic website "0th-order advice", and an economics job-market guide recommends one with CV, photo, and contact. A counterpoint: some committees avoid extra lookups for equity reasons | Your application materials must stand alone; the site must **match the CV exactly** (your CV header already links `ssmtariq.github.io`) |
| What committees score | Your `deliverables/04` (Berkeley, Cornell, Penn, UCSF ACRA, Harvard, CRA, DORA, ACM artifacts; accessed 2026-10-12): identity, coherence, independence, teaching ownership, artifacts, integrity | Page-1 strategy carried onto the home page; artifacts as first-class items; metrics off |
| Google Scholar indexing of author pages | One paper per URL; `citation_title`, `citation_author`, and `citation_publication_date` are required; `citation_pdf_url` must sit in the same directory as the abstract page; PDFs ≤ 5 MB; every article reachable from the home page in ≤ 10 links | Per-paper pages `/publications/<id>/` with Highwire tags and `paper.pdf` beside them (only where posting is allowed) |
| Posting your own papers | **ACM became fully open access on 2026-01-01**; authors may post accepted versions on personal pages. **IEEE** lets authors post the *accepted* version with the IEEE notice and DOI, but not the Xplore PDF | MicroProf (TACO) and PerfMiner (EASE): link the open-access DOI. SANER: host your accepted version with the IEEE notice. SlimStart: link arXiv. 2014/2017 papers: DOI only. PerfFinder: nothing until submitted |
| Brand colors | Michigan Medicine's brand guide lists **Maize #FFCB05 and Blue #00274C** and recommends about **80% blue, 20% maize**. The UM-Dearborn colors page returned 403 to automated fetches | Tokens use the official hex values and the 80/20 balance |
| Contrast (my WCAG 2.x computation) | Maize on white **1.52:1 (fails even for UI)**; maize on blue 9.89:1; blue on white 15.06:1; deep maize `#7A5C00` on paper 5.99:1 | Maize only as a fill, an accent on blue, or deep-maize text; never maize text on white |
| Paper-thumbnail homepages | Jon Barron's template (≈3.7k stars) made a teaser figure per paper a common academic pattern | Paper cards use your real figures (cropped, credited) |
| Visitor map precedent | A GitHub Pages site already does GoatCounter counting plus a visitor map built from the API at deploy time | Confirms feasibility of Section 3 |

## 5. Pinned toolchain (verified 2026-10-24; each release at least two weeks old)

| Component | Version | Notes |
| --- | --- | --- |
| Node.js | **24.21.0** (LTS "Krypton", 2026-09-07) | Astro 7.3.8 needs ≥ 22.12; SHA-256 verified |
| Astro | **7.3.8** (2026-10-08) | 7.4.2 exists (2026-10-21) but is too new; Zod ^4.6, sharp ^0.35 |
| @astrojs/sitemap, @astrojs/rss | 3.7.4, 4.0.19 | |
| @astrojs/mdx (optional) | 8.0.3 | Plain `.md` project pages are enough |
| yaml | 2.9.1 | Used by the integrity checker |
| d3-geo, topojson-client, world-atlas, i18n-iso-countries | 3.1.1, 3.1.0, 2.0.2, 7.14.0 | Build-time map only; nothing ships to the browser |
| Fonts (self-hosted) | @fontsource-variable/source-serif-4 5.3.0, @fontsource-variable/ibm-plex-sans 5.3.0, @fontsource/ibm-plex-mono 5.3.0 | No Google Fonts requests |
| Pagefind (site search, Phase 5) | 1.5.2 | Static index |
| Quality gates | @lhci/cli 0.15.1; pa11y-ci 5.0.0 or @axe-core/cli 4.13.0 | Lighthouse budgets and accessibility |
| GitHub Actions | checkout@v7, setup-node@v7, upload-pages-artifact@v5, deploy-pages@v5; lychee-action v2.9.0 (weekly link check) | `withastro/action` v6.1.4 is a day old, so a plain workflow is used instead |
| Lint | actionlint 1.7.12 | Both workflows lint clean |

## 6. Sources (accessed 2026-10-24 unless noted)

**Analytics and location**
- [GoatCounter visitor counter](https://www.goatcounter.com/help/visitor-counter)
- [GoatCounter API](https://www.goatcounter.com/help/api)
- [GoatCounter OpenAPI spec](https://www.goatcounter.com/api.json)
- [Third-party GoatCounter review (privacy claim, to verify)](https://analytics-alternatives.com/goatcounter-review-2026/)
- [Precedent: GoatCounter visitor map on GitHub Pages](https://github.com/VictorZG33/VictorZG33.github.io/pull/4)
- [Cloudflare Workers geolocation](https://developers.cloudflare.com/workers/examples/geolocation-hello-world/)
- [Cloudflare D1 free-tier enforcement](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/)
- [ClustrMaps how-to](https://clustrmaps.com/how-to/)
- [ClustrMaps review](https://wp301redirects.com/clustrmaps-review-website-visitor-analytics-features-alternatives/)

**Brand and accessibility**
- [Michigan Medicine brand colors](http://med.umich.edu/branding/color.html)
- [UM-Dearborn brand colors (403 to automated fetch)](https://umdearborn.edu/external-relations/marketing/brand-identity-guidelines-material/colors)

**Scholarly publishing**
- [Google Scholar inclusion guidelines](https://scholar.google.com/intl/en/scholar/inclusion.html)
- [ACM author rights FAQ](https://authors.acm.org/author-resources/author-rights-faqs)
- [ACM publication rights and licensing policy](https://www.acm.org/publications/policies/publication-rights-and-licensing-policy)
- [ACM open access](https://authors.acm.org/open-access/initiatives-services-authors-site)
- [IEEE post-publication policies (journals)](https://journals.ieeeauthorcenter.ieee.org/become-an-ieee-journal-author/publishing-ethics/guidelines-and-policies/post-publication-policies/)
- [IEEE post-publication policies (conferences)](https://conferences.ieeeauthorcenter.ieee.org/author-ethics/guidelines-and-policies/post-publication-policies/)

**Frameworks and templates**
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro v6 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [al-folio](https://github.com/alshedivat/al-folio)
- [Jon Barron's template](https://github.com/jonbarron/jonbarron.github.io)

**Faculty search**
- [Oz Amram, faculty job search advice](https://ozamram.substack.com/p/faculty-job-search-advice)
- [AEA junior job market guide](https://www.aeaweb.org/content/file?id=869)
- [Harvard: the view from the search committee](https://careerservices.fas.harvard.edu/blog/2024/10/21/navigating-the-academic-job-market-the-view-from-the-search-committee/)
- Committee-expectation sources cited in `cv-materials/deliverables/04_Hiring_Committee_Expectations.md` (accessed 2026-10-12)

**Versions**
- npm registry (`https://registry.npmjs.org/<package>`)
- [Node.js release index](https://nodejs.org/dist/index.json)
- GitHub Releases API for the actions and tools listed in Section 5
