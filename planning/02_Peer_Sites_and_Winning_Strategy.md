# 02 · Peer Sites: What They Exhibit, and the Winning Strategy for Each

**Sites browsed (2026-10-24):**

1. Reference: <https://muttakiislambismoybracu18.github.io/PortfolioProject/>
2. <https://sites.google.com/view/khairulmottakin>, plus its Research, Project, Experience, and Resume pages
3. <https://dhiarzig.netlify.app/>
4. <https://anwarghammam.github.io/>, plus its Lab, Publications, Service, Teaching, Grants, News, and CV pages
5. <https://898djh.github.io/>
6. <https://abderrahmen-amich.netlify.app/>
7. Your current <https://ssmtariq.github.io/>, for the baseline

**Method.** Each site was loaded in headless Chromium 156 (Playwright) at 1440×900 and 390×844. For each load I recorded transfer size, requests, LCP, CLS, console errors, meta, Open Graph and JSON-LD tags, headings, nav, fonts, and image `alt` coverage. Full-page screenshots were taken, then retaken with animations disabled so reveal-on-scroll content shows. Later captures blocked visit-counter hosts, so the counts stayed clean; the first pass may have added up to 2 to the reference's public counter. Raw metrics are in `evidence/metrics/`, and the capture scripts are in `tools/`. All numbers are single lab runs from one machine: useful for comparing sites, not as field data.

**Facts about you** come only from your primary sources (C0, your 02B answers, the final CV, the paper PDFs, PROP). **Facts about peers** come only from their public pages, as shown on 2026-10-24.

---

## 0. Why these six matter

All six belong to your local academic network:

- Four are UM-Dearborn CIS Ph.D. candidates or graduates: Mottakin, Rzig, Z. Li, and Amich.
- Ghammam is an Assistant Professor in your department.
- The reference's owner lists a UM-Dearborn faculty member as his supervisor.

Two now hold tenure-track posts: **Zhengquan Li at UW Bothell**, which is posting J01, your best-fit ad in `deliverables/05`, and **Khairul Mottakin at SVSU**. Their sites show what a successful UM-Dearborn candidate looked like at the end of a search, and people who know these sites may read yours.

## 1. At a glance (measured)

| Site | Builder | Pages | Load (MB) / requests | LCP desktop / mobile | Desktop height | OG card | JSON-LD | Favicon | Dark mode | View counter | Freshness signal |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Reference (Bismoy) | Hand-written single HTML | 1 | 3.31 / 20 (42.3 MB total images) | 1,784 / 1,400 ms | 12,929 px | no | no | 404 | yes | Abacus, fragile | 2026 items |
| Mottakin | Google Sites | 5 | 1.52 / 26 | **2,836** / 1,832 ms | 1,070 px (home) | weak ("About Me") | no | Google default | no | none | Resume PDF still says "PhD Candidate" |
| Rzig | Hugo Blox 5.9.7 (Wowchemy) | 1 long page and per-paper pages | 1.26 / **91** (20+ failed images) | 1,284 / 592 ms | 14,018 px | yes | WebSite (home); Article (paper pages) | yes | yes, plus search | none | LinkedIn feed ends Sep 2024; "Planned: 12-2024" |
| Ghammam | Jekyll, Minimal Mistakes | 8 | **0.40** / 10 | not captured / 336 ms | 1,749 px | yes, buggy | Person with `name: null` | no | no (search yes) | none | 2026 news |
| Z. Li | Hand-written HTML | 1 | 0.96 / **2** | **232** / 116 ms | 2,021 px | no | no | no | no | none | undated news |
| Amich | Wowchemy 5.0 beta | 1 long page and per-paper pages | 0.80 / 42 | 1,152 / 832 ms | 7,060 px | yes (malformed `twitter:site`) | WebSite (home); Article (paper pages) | yes | yes, plus search | none | © 2024, "currently in the job market" |
| **You (current)** | HTML5 UP | 1 (+ /skeleton/) | 2.51 / 32 | 1,624 / 1,248 ms | 3,581 px | no | no | yes | no | GA4 (private) | 2023 résumé; "graduate student" |

Side-by-side first screens: `evidence/compare_first_impression_desktop.jpg` and `evidence/compare_first_impression_mobile.jpg`.

## 2. Reference: Muttaki I. Bismoy

The full analysis is in `01_Reference_Site_Analysis.md`. Strategy summary:

| What it exhibits | How | Winning move for you, using your record | Your evidence |
| --- | --- | --- | --- |
| Editorial first impression | Serif name with italic accent, availability chip, portrait, two CTAs | Same clarity, framed for a faculty search. The first screen states status, completion date, the job-market chip, a one-line identity, and **Download CV**, all on Michigan blue | C0 decision 1; CV final header |
| "Research focus" cards | Six unconnected cards | One **cross-layer research map**: four dissertation layers around "performance observability", plus PerfMiner placed honestly as "beyond the dissertation" | PROP pp.8-9, 49 |
| Stat cards | 4+ years, 7 papers, 98.7%, 8 parks | **Results at a glance**: 4.59×, 2.30×, 64%, 335,103, each linked to its paper and page | P-MP p.14; P-SS p.1; P-CS p.1; P-PM p.1 |
| Publications list | Filter tabs (buggy), title and venue only | Validated explorer and per-paper pages: abstract, BibTeX, DOI, artifact, talk, Google Scholar tags | Publication seeds in `spike/content/publications.yaml` |
| Projects with screenshots | Unoptimized images | Real paper figures (MicroProf Fig. 3, SANER Fig. 2, …) served as 11-28 KB WebP | `evidence/figure_crop_*.jpg` |
| Awards, certificates, references, photos | Cards; weak items mixed in | Curated honors with certificates one click away; no routine trainings, referee emails, or GPAs | `achievements/` certificates; 02B item 14 |
| Counter | Abacus, then a fake local count | GoatCounter totals plus a **visitor-country map** built at deploy time, with "since" date and privacy note | Plan Section 12; mock test in `06` |
| Pop-ups and loader | Timed interruptions | None. The availability chip carries the message without interrupting | — |

**Where it is still stronger than you:** a field deployment story (8 state parks) and an open UAV dataset with a Zenodo DOI. You answer with your own artifacts: SCABENCH/INITSCOPE (Zenodo DOI), the PerfMiner dataset of 335,103 commits, and MicroProf's replication package.

## 3. Khairul Mottakin (Google Sites)

**Who.** Assistant Professor, Saginaw Valley State University (since Sept 2025). Ph.D. in CIS from UM-Dearborn (2025 dissertation "Multi-Modal WiFi Sensing for Smart Building", DOI 10.7302/28295). Lecturer at UIU, Oct 2015 - Dec 2019. He is on your CPS-IoT Week 2022 Honorable Mention team (02B item 10).

**What it exhibits.**

- **Home:** studio headshot and a three-paragraph About.
- **Research:** a numbered list of 17 publications. His name is bold, and only one entry links a DOI.
- **Project:** three projects (SWiLoc, BMEye, Drone-Car), each with a system figure, an abstract-length paragraph, and metrics.
- **Experience:** academic and industry entries.
- **Resume:** embedded Google Drive PDF viewer.

**How.** A stock Google Sites theme: a dark geometric banner on every page, a thin Lato title, and a top nav with search. No dark mode, news, teaching, service, or awards pages.

| Strengths (evidence) | Weaknesses (evidence) |
| --- | --- |
| Project pages pair a real system figure with an explanation and numbers (`evidence/peer_mottakin_projects.jpg`) | Slowest LCP in the set (2,836 ms desktop) |
| Long publication record, plainly listed (`evidence/peer_mottakin_publications.jpg`) | Open Graph description is just "About Me"; no favicon of his own; one image without `alt` |
| Concise, readable About | No teaching page despite four years as a lecturer; the résumé PDF still reads "PhD Candidate" |

| Exhibit | Their approach | Winning move for you | Your evidence |
| --- | --- | --- | --- |
| Publication count (17) | Numbered list | Don't compete on count; there is no "N publications" counter. Compete on depth per paper: abstract, your role, artifact, talk | 4 current-line papers, 1 poster, 1 manuscript (CV final) |
| Project figures | Static figure and paragraph | Figure, **cited result chips**, artifact badge, and "My role" line on each project page | Project seeds with locators |
| Teaching | Only bullets under Experience | A full **Teaching** page: role-coded record over 11 terms, instructor-of-record evidence with an honest response count, mentoring outcomes, prepared-to-teach areas | C0 teaching table; 02B items 3-7 |
| Résumé | Embedded viewer, stale | CV hub: HTML summary, direct PDF download, "updated" date | Plan Section 5 (CV page) |

**Where he is ahead on the record:** publication count, and lecturing years at UIU. The site can't change that, so it shouldn't invite a count comparison.

## 4. Dhia Elhaq Rzig (Hugo Blox / Wowchemy)

**Who.** UM-Dearborn CIS Ph.D. candidate in Dr. Foyzul Hassan's lab (Dr. Hassan co-authored your SANER, PerfMiner, and SC24 work). Research collaboration with Microsoft Research. His LinkedIn feed shows he also taught *Tools for Software Engineering* in the ESIEA program (Oct 2023), the same program you taught in Summer 2023.

**What it exhibits.** An avatar card with icons (email, ORCID, Scholar, LinkedIn, GitHub, X). Biography, interests, and education ("Ph.D. … Planned: 12-2024"). A **LinkedIn posts feed** via the third-party SociableKit widget. An experience timeline with logos that prints supervisors' email addresses. Featured publications with abstract snippets and PDF/Cite/PPTX buttons, then a full filterable list. Accomplishments with "See certificate" links: NSF travel grant ($2000), EXP+ ($500), SIGSOFT CAPS ($800), TOEFL, GRE, Coursera courses.

**How.** Wowchemy template: dark mode, search, Cite (BibTeX) modal, Montserrat/Roboto.

| Strengths | Weaknesses |
| --- | --- |
| Rich publication affordances: abstract, PDF, BibTeX, slides, filters | **91 requests**; the SociableKit feed's images fail to load (20+ `ERR_BLOCKED_BY_ORB`), leaving "Post image" placeholders (`evidence/peer_rzig_linkedin_feed_broken_images.jpg`) |
| Grants listed with certificate links (`evidence/peer_rzig_accomplishments.jpg`) | Stale: "Planned: 12-2024"; last feed post Sep 2024 |
| ORCID linked | TOEFL, GRE, and Coursera items dilute research signals; supervisors' emails published |

| Exhibit | Their approach | Winning move for you | Your evidence |
| --- | --- | --- | --- |
| Updates | Embedded LinkedIn feed | Your own **News** data file with dated, typed items and an RSS feed; no third-party widget, no broken images | 13 dated news seeds |
| Publication tools | Template Cite/PDF | The same, plus Google Scholar tags, artifact DOIs, a "My role" line, and figure teasers | `05_Data_Input_Spec.md` |
| Grants with certificates | "See certificate" link | Evidence lightbox only for meaningful items: CPS-IoT Honorable Mention, CECS Certificate of Appreciation, Rakuten certificate, BSTF | `achievements/` |
| ESIEA teaching | One LinkedIn post | A structured teaching record entry: *Lab Instructor, Tools for Software Engineering, ESIEA (France), 27 students, 4 weeks* | 02B items 15, 18.3 |

**Where he is ahead:** an industry research collaboration with Microsoft and an MSR Junior PC role. You answer with OSDI 2024/2025 and JSys 2026 artifact evaluation, on the Service page.

## 5. Anwar Ghammam (Jekyll, Minimal Mistakes)

**Who.** Tenure-track Assistant Professor, CIS, UM-Dearborn (your department). Ph.D. from Oakland University (2021-2025). Founder of the NeoSE Lab. Co-author with Rzig and Hassan (MSR 2025).

**What it exhibits.** Eight pages:

- **Home:** welcome, interests, academic background with GPAs, including a "Current GPA" line after graduating.
- **NeoSE Lab:** banner, mission, and a student-recruiting call.
- **Publications:** 5 entries with Pre-print/Citation/Abstract buttons.
- **Service:** about 15 program-committee roles from 2024-2026 (ICSE 2026 shadow PC, MSR 2026 junior PC, SIGCSE TS, ASE NIER, …) plus organizing roles.
- **Teaching:** courses and terms.
- **Grants:** RID Grant of $20K, among others.
- **News:** ICSE 2026 paper, awards.
- **CV:** an embedded PDF.

**How.** Default Minimal Mistakes: left sidebar profile, Lunr search, light theme only, Font Awesome loaded from jsDelivr with `@latest` (unpinned).

| Strengths | Weaknesses |
| --- | --- |
| Clear multi-page structure (Service, Teaching, Grants, News) that committees can scan (`evidence/peer_ghammam_service.jpg`) | A stray `</div>` prints on the Publications page, and one entry has smaller buttons (confirmed in the served HTML) (`evidence/peer_ghammam_publications_stray_div.jpg`) |
| Very light: 0.40 MB, 10 requests | The CV page is a bare `<embed>` with no fallback link. Headless Chromium shows "Couldn't load plugin.", and many mobile browsers behave the same (`evidence/peer_ghammam_cv_plugin_failure.jpg`) |
| Lab page signals mentoring capacity | Metadata bugs: `og:description` contains the literal text `description: "…"`; JSON-LD `Person` has `name: null`. Typos ("Commitee", "Committe") |

| Exhibit | Their approach | Winning move for you | Your evidence |
| --- | --- | --- | --- |
| Service page | Long list | Grouped by kind (artifact evaluation, reviewing, leadership, membership), with venues spelled out and years | OSDI '24/'25, JSys '26, TCC '26, TACO '24-25, ACM chapter president (CV final; 02B item 8) |
| Lab / recruiting | NeoSE Lab page | Not applicable yet. The Teaching page's **Mentoring** section shows outcomes: 4 mentees, all co-authors (ICDCS 2025; SC24) | 02B item 7; CV final |
| CV | `<embed>` only | HTML CV summary plus a direct PDF link that works on every device | Plan Section 5 |
| Metadata | Buggy | Generated from validated data: OG cards, JSON-LD `Person` and `ScholarlyArticle`, and Scholar tags | Plan Section 13 |

**Where she is ahead:** she is already faculty, with grants, an ICSE paper, and program-committee service. You can't match those in quantity. The site presents your artifact-evaluation service as the systems-community signal it is.

## 6. Zhengquan Li (plain HTML), the closest peer

**Who.** Tenure-track Assistant Professor, Computing & Software Systems, **UW Bothell (J01)**. Ph.D. in CIS from UM-Dearborn; his papers are co-authored with Dr. Zheng Song, a member of your committee. Cisco Research. He was **Independent Instructor for CIS 200** with a public **[Teaching Evaluation]** PDF link, a TA for **CIS 450/ECE 478**, and gave 3 guest-lecture sessions in CIS 489.

**What it exhibits.** One page:

- Name, title, an obfuscated email, and a small photo.
- About Me (two short paragraphs).
- News: four undated bullets (joined UW Bothell; defended with Distinguished Performance; Rackham Predoctoral Fellowship; ICDCS 2024 Distinguished Paper Award).
- Selected Publications: 4, with [paper] PDFs and venue ranks.
- Teaching, Service (reviewer list), Awards and Honors, and Miscellaneous.

**How.** No CSS framework and no JavaScript; 2 requests; LCP 232 ms, the fastest in the set. No favicon, Open Graph, or nav.

| Strengths | Weaknesses |
| --- | --- |
| A 30-second read: everything that matters fits on about two screens (`evidence/peer_li_home.jpg`) | Undated news; no visual identity; no metadata or favicon |
| Teaching evidence one click away (evaluation PDF) | One-sentence research description; no project narrative or figures |
| Strong record stated plainly (Distinguished Paper, Rackham fellowship, Honor Scholar) | Not built for maintenance: hand-edited HTML |

| Exhibit | Their approach | Winning move for you | Your evidence |
| --- | --- | --- | --- |
| Concision | Single short page | A **home page that passes the same 30-second test** (status, identity, results, CV), with depth one click away on dedicated pages | Plan Section 2 |
| CIS-200 instructor evidence | Link to the evaluation PDF | The same course, with more context: sole instructor, **no TA**, designed all lecture slides, online asynchronous section, **4.75/5 against a department mean of 4.51**, and the response count (4 of 15) shown, per your honesty rule. Then CIS-200L twice, ESIEA, and 7 TA terms | 02B items 3-5, 15; `course_evaluation/cis200.pdf` p.3 |
| CIS-450 TA | One line | Five CIS-450 terms (classes 42-62) **plus** a guest lecture on memory virtualization (Winter 2026) | C0 teaching table; 02B item 6.4 |
| Research | One sentence | Research map, thesis statement, project pages with cited results and artifacts | PROP p.8; seeds |
| Service | One reviewer bullet | Artifact Evaluation Committee for **USENIX OSDI** twice and JSys; sub-reviewer for TCC and TACO; ACM chapter president | CV final; 02B item 8 |

**Where he is ahead (honest):** an ICDCS Distinguished Paper Award, the Rackham Predoctoral Fellowship (yours is pending), and a Ph.D. Honor Scholar Award. The site can't manufacture equivalents and must not imply them. It wins on presentation: coherence, evidence, teaching depth, artifacts, service, and maintainability.

## 7. Abderrahmen (Abe) Amich (Wowchemy 5)

**Who.** Ph.D. in CIS, University of Michigan (2024; Data-driven Security and Privacy Lab, Dearborn). First author at USENIX Security '23 with a recorded talk. SRI International research intern. **Part-time instructor at UM-Dearborn for CIS 545, CIS 546, CIS 150L, and CIS 200L.**

**What it exhibits.** Avatar card; "Welcome!" with "I'm currently in the job market" (stale; © 2024). Interests, education, and an experience timeline (typos "SRI Internatinal", "Netwerk"). Accomplishments (2023 PhD Distinguished Research, Honors Scholar, ACM CCS travel grant, DAIR Best Presentation). **Selected Talks** with thumbnails and PDF/Code/Slides/**Video** buttons. **Recent Publications** with abstract snippets and PDF/Cite/Code/Slides/DOI. A contact form (Netlify) with an address and an OpenStreetMap map.

**How.** Wowchemy defaults: dark mode, search, and 21 requests to cdnjs.

| Strengths | Weaknesses |
| --- | --- |
| Talk cards with slides and video (`evidence/peer_amich_accomplishments_talks.jpg`) | Stale job-market claim and "Present" end dates |
| Code links per paper | Contact form and map add no value for a committee and invite spam (`evidence/peer_amich_contact_map.jpg`) |
| Clean template typography | Malformed `twitter:site`; 10 images with empty `alt` |

| Exhibit | Their approach | Winning move for you | Your evidence |
| --- | --- | --- | --- |
| Talks | Thumbnails, slides, video | **Talks** page from data: SANER 2026 (Limassol), HiPEAC 2024 talk and poster (Munich), guest lecture (Winter 2026), CECS poster (Best Poster). Slides and video links appear the day you add them | 02B items 6, 10; CV final |
| Job-market statement | Free text, now stale | A chip that **switches itself off after a set date** (`job_market.until`), with a build warning | Checker rule R15 |
| Contact | Form and map | Email shown with a copy button (scrape-resistant), Scholar, GitHub, LinkedIn; no form, no home address | Plan Section 5 |

**Where he is ahead:** a USENIX Security '23 first-author paper and talk video. You can add slides and recordings for SANER 2026 and HiPEAC 2024 if you have them (asset request A6).

## 8. Cross-peer patterns

**Everyone does:** a headshot, a short bio, a publication list, and contact icons.

**No one does** (open ground your site claims):

1. A **program-level research visual**, connecting projects as one research line.
2. **Results that cite their source** (paper and page).
3. **Per-paper pages with Google Scholar `citation_*` tags.** Checked on four real paper pages (two each on Rzig's and Amich's sites): 0 `citation_*` tags, only generic JSON-LD `Article` markup.
4. **Validated content**, where a broken reference, stale status, or banned phrase fails the build.
5. **A view counter with visitor locations**, honestly labeled.
6. **Measured performance and accessibility budgets** enforced in CI.
7. **A legacy-preserving rollout**, so an old link never breaks.

## 9. Record comparison: what a website cannot fix

| Signal | You | Strongest peer on this signal |
| --- | --- | --- |
| Peer-reviewed publications in the current line | 4 papers (TACO '23, ICDCS '25, SANER '26, EASE '26), 1 poster, 1 manuscript | Mottakin: 17 listed |
| Paper awards | none | Z. Li: ICDCS 2024 Distinguished Paper |
| Fellowships | Rackham pending (not shown) | Z. Li: Rackham Predoctoral Fellowship |
| Program committees | none (artifact evaluation and sub-reviewing) | Ghammam: about 15 PC roles |
| Flagship first-author venue | not yet (critique row 8) | Amich: USENIX Security '23 |
| Instructor-of-record teaching | CIS-200 (1 term), CIS-200L (2), ESIEA (1) | Mottakin: about 4 years as a lecturer |
| Artifact evaluation at a flagship systems venue | **OSDI 2024 and 2025, JSys 2026** | none of the peers |
| Released research artifacts | **Zenodo DOI (SCABENCH/INITSCOPE), a 335,103-commit dataset, MicroProf package** | Reference: 1 dataset |
| Industry engineering | **6+ years** (BRAC IT, BJIT; Rakuten client recognition) | others shorter or none listed |

**Implication.** The site should lead with the dimensions where your record is distinctive (cross-layer coherence, artifacts, systems service, teaching ownership, industry depth) and present the rest accurately without inviting counts.

## 10. Verdict

Against every peer, the planned site wins on:

- first-screen clarity for a faculty search;
- research coherence;
- verifiability;
- teaching and service presentation;
- performance and accessibility (measured budgets);
- maintainability;
- view counts with location.

It does not and cannot win on raw record counts where peers are ahead (Section 9). It also never manufactures parity: no venue ranks, no pending items, no inflated roles. The measured scorecard and acceptance tests are in `06_Verification_and_Readiness.md`.
