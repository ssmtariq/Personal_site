# 01 · Reference Site Analysis

**Site:** <https://muttakiislambismoybracu18.github.io/PortfolioProject/> (owner: Muttaki I. Bismoy)
**Accessed:** 2026-10-24. Source read in full (`index.html`, 1,942 lines, 85,193 bytes; GitHub Pages `last-modified: Tue, 26 May 2026`). Rendered in headless Chromium 156 (Playwright) at 1440×900 (desktop) and 390×844 (iPhone-class mobile).
**Evidence files:** `evidence/ref_*.jpg`, `evidence/compare_first_impression_*.jpg`, `evidence/metrics/muttakiislambismoybracu18_github_io_PortfolioProject.json`. Line numbers below refer to the downloaded `index.html`.

---

## Summary

The reference is a polished single-page portfolio: one static HTML file with about 1,000 lines of inline CSS and about 150 lines of vanilla JavaScript, three Google Fonts, and no build step. Its editorial look is its strength: a serif display face with italic accent words, numbered mono section labels, generous whitespace, dark mode, and gentle motion.

It was built for a different goal than yours. It targets a Ph.D. seat and industry roles (hero chip, two timed pop-ups), so it has no teaching, mentoring, or service depth, and no application materials. Under the polish it is hand-maintained HTML with data errors, 42.3 MB of unoptimized images, missing metadata, and a visit counter that shows a fabricated number whenever its third-party host is blocked.

| Adopt (pattern, not copy) | Avoid |
| --- | --- |
| A one-line identity plus an availability chip above the fold | Loading screen and timed pop-ups |
| An editorial type system: serif display, sans body, mono labels | Hand-coded HTML data (it has already produced filter bugs) |
| Results shown as numbers | 42.3 MB of full-resolution images |
| Dark mode that defaults to the system setting | A counter that falls back to a fake per-browser number |
| `prefers-reduced-motion` support | Items that cost credibility with a faculty committee (Section 5) |

---

## 1. Snapshot

| Item | Value |
| --- | --- |
| Builder | Hand-written static HTML; inline `<style>` (lines 13-1004) and inline `<script>` (lines 1785-1940) |
| Fonts | Fraunces (display), Inter (body), JetBrains Mono (labels) from Google Fonts (line 11) |
| Hosting | GitHub Pages project site (`/PortfolioProject/`) |
| Structure | One page, 12 numbered sections plus hero, footer, and 2 pop-ups |
| Navigation | 6 links (About, Research, Experience, Publications, Projects, Contact). Education, Skills, Awards, Certifications, References, and Photography have no nav entry |
| Page length | 12,929 px desktop (14,506 px with every section revealed); 22,903 px on mobile |
| Owner's stated goals | "Open to PhD positions & research collaborations" (hero chip); pop-ups for a "PhD seat" and "ML / CV / Applied AI roles" |

## 2. Information architecture

| # | Section (heading) | Content | Notes |
| --- | --- | --- | --- |
| — | Hero | Chip, name, role sentence, meta row (role, city, email), 2 CTAs, 4:5 portrait, "Currently" tag, scroll cue | Full viewport height |
| 01 | About ("A researcher building AI that *survives the real world.*") | 3 paragraphs and 4 stat cards (4+ years, 7 publications, 98.7% accuracy, 8 state parks) | Stat cards stretch to the text column's height (defect D3) |
| 02 | Research Focus ("Where I'm *pushing.*") | 6 numbered cards (/01-/06) | Generic card grid; no program-level framing beyond one lede sentence |
| 03 | Experience ("Selected *work.*") | Vertical timeline, 6 roles, bullets, a "Volunteer" tag | Funder shown next to the organization |
| 04 | Education ("Trained *across continents.*") | 3 rows with a GPA column, including "U.S. eq. 3.82 (ECE)" | GPAs prominent |
| 05 | Publications ("Peer-reviewed *writing.*") | Filter tabs and 7 entries: year, title, authors and venue, status tag, link | Filter bugs, "—↗" non-links, own name not highlighted (D1, D2) |
| 06 | Projects ("Things I've *built.*") | 9 image cards with Code/Demo/Slides links | Images up to 4.1 MB each |
| 07 | Skills ("What I work *with.*") | 6 groups, about 75 tags | Tag cloud |
| 08 | Awards & Service ("Recognition & *service.*") | 8 cards | Includes credibility risks (Section 5) |
| 09 | Certifications ("Formal *credentials.*") | 6 cards: routine compliance trainings and IELTS | Low signal for faculty hiring |
| 10 | References ("People who *can vouch.*") | 3 cards with name, title, relation, and email | Referees' emails published |
| 11 | Off the clock ("A few *frames.*") | Masonry photo gallery, 13 photos | Zoom-in cursor with no zoom (D4) |
| 12 | Contact ("Let's *talk.*") | Email button; resume and CV buttons that open Google Drive folders | Not direct PDFs (D10) |
| — | Footer | Brand, tagline, 8 social icons, live local clock, visit counter, © year | Clock shows the visitor's own time (D13) |
| — | Pop-ups | 9 s: "Looking for a PhD seat"; 22 s: industry roles | Interrupt reading; on mobile they cover the Resume button (D6) |

## 3. Feature inventory

Verdict key: **Adopt** = use the pattern; **Adapt** = use a fixed or reframed version; **Avoid** = leave out.

| ID | Feature | Implementation (lines) | Effect on visitors | Verdict for your site |
| --- | --- | --- | --- | --- |
| F01 | Loading screen: name with an animated underline, hidden 600 ms after `load` | 71-91, 1012, 1791-1793 | Delays all content on every visit | Avoid |
| F02 | 2 px scroll-progress bar | 64-68, 1806-1812 | Orientation on a 13,000 px page | Adapt: only on long pages (Research, Teaching) |
| F03 | Fixed "glass" nav: 14 px backdrop blur, border appears on scroll, pulsing brand dot | 94-123 | Modern feel | Adapt: sticky Michigan-blue bar with a maize rule, no pulse |
| F04 | Scroll-spy active link | 1814-1828 | Shows the current section | Adapt: also set `aria-current` |
| F05 | Mobile menu under 880 px | 147-163, 1830-1836 | Works; no `aria-expanded`, no focus handling | Adapt: accessible drawer |
| F06 | Light/dark toggle (`localStorage`, then `prefers-color-scheme`) | 136-145, 1838-1856 | Good, but the theme is applied after first paint, so the wrong theme can flash | Adopt, with an inline `<head>` script so it never flashes |
| F07 | Hero with a slowly drifting radial-gradient blob | 218-236 | Decorative motion | Adapt: static glow |
| F08 | Availability chip with a pulsing green dot | 248-262, 1049-1052 | Instantly signals intent | Adapt: "On the 2026-27 faculty job market", switched off automatically after a set date |
| F09 | Serif H1 with an italic accent surname | 263-274 | Memorable name treatment | Adapt: your CV's given-name/family-name treatment, so the site and CV match |
| F10 | Role sentence and meta row | 275-292, 1056-1063 | Identity in one line | Adopt |
| F11 | CTAs "Get in touch" and "Download Resume" (a Google Drive folder) | 1064-1073 | The download needs another click inside Drive | Adapt: direct PDF link |
| F12 | 4:5 portrait, grayscale until hover; "Currently: …" tag | 321-345, 1075-1081 | Personal and current | Adapt: a circular headshot inside the research loop; the "current work" line comes from data |
| F13 | Bouncing "Scroll" cue | 347-363 | Overlaps the photo tag on mobile | Avoid |
| F14 | Numbered mono section labels ("01 / About") and serif titles with italic accents | 177-201 | Strong editorial rhythm | Adopt the pattern, not the copy |
| F15 | Reveal-on-scroll with staggered delays; reduced-motion fallback | 204-215, 1859-1867 | Content stays at opacity 0 until JavaScript reveals it (D9) | Adapt: visible by default; animate only when JavaScript runs |
| F16 | About: 3 paragraphs and 4 stat cards | 366-405, 1090-1129 | Numbers draw the eye; cards stretch (D3) | Adapt: result cards, each citing paper and page |
| F17 | Research focus: 6 cards with a hover top bar | 407-447, 1131-1172 | A list, not a program | Adapt: interactive cross-layer research map |
| F18 | Experience timeline with dot markers | 449-508, 1174-1265 | Scannable | Adopt the pattern (About page) |
| F19 | Education rows with a GPA column | 510-543, 1267-1301 | Invites GPA comparison | Avoid GPAs (your undergraduate GPA is 3.37) |
| F20 | Publication filter tabs | 546-562, 1311-1316, 1869-1881 | Bugs D1 and D2 | Adapt: filters generated from validated data |
| F21 | Publication rows: year, title, venue, status tag, link | 563-610, 1318-1375 | No abstract, PDF, BibTeX, code, or slides; own name not highlighted | Adapt: per-paper pages with all of these |
| F22 | Thesis, dataset (Zenodo), and Scholar link row | 1377-1381 | Shows artifacts | Adopt: artifact badges on every paper |
| F23 | Project cards (16:10 image, hover zoom, links) | 612-669, 1385-1492 | Visual; images 0.1-4.1 MB | Adapt: real paper figures, optimized to WebP/AVIF |
| F24 | Skills tag clouds (6 groups) | 671-710, 1494-1564 | Long résumé-style list | Adapt: compact, on the About page |
| F25 | Awards and service cards | 712-741, 1566-1608 | Mixes strong and weak signals | Adapt: honors, grants, and service kept separate and in context |
| F26 | Certifications (6, including routine trainings) | 743-760, 1610-1644 | Low signal | Avoid routine items; keep research-ethics training only |
| F27 | Reference cards with emails | 761-796, 1646-1674 | Publishes referees' emails | Avoid: letters come through the portal |
| F28 | Masonry photo gallery | 798-825, 1676-1700 | Personal; 17 images with empty `alt` | Avoid |
| F29 | Downloads card (email, resume, CV) | 827-852, 1702-1725 | Drive folders | Adapt: CV hub page with direct PDFs |
| F30 | Footer with 8 PNG social icons, clock, counter | 854-920, 1727-1755 | Social icons inverted in dark mode; clock has no use | Adapt: SVG icons; no clock |
| F31 | Visit counter: local Flask API, then the Abacus API, then `localStorage` | 1894-1939 | Fabricates "1" when Abacus is blocked (D5) | Avoid this design; use a real counter with locations (plan, Section 12) |
| F32 | Two timed pop-ups (9 s and 22 s) with `role="dialog"` | 923-995, 1759-1783, 1884-1892 | Interrupt reading, no focus handling or Escape key, mixed messages (D6, D12) | Avoid |
| F33 | Print stylesheet hides nav and pop-ups | 1000-1004 | Clean print | Adopt and extend: print the home page as a one-page summary |
| F34 | `scroll-margin-top` for anchors under the sticky nav | 998 | Correct anchor landing | Adopt |
| F35 | Custom selection color, smooth scroll, font smoothing | 49, 61 | Polish | Adopt |

## 4. Visual design system

| Token | Light | Dark | Contrast (computed) |
| --- | --- | --- | --- |
| Background | `#FAFAF7` (warm off-white) | `#0A0A0B` | — |
| Text | `#0F0F10` | `#F5F5F0` | high |
| Muted text | `#6B6B6B` | `#9F9F9F` | 5.10:1 light, 7.48:1 dark (both pass AA) |
| Accent | `#1F4D3F` (forest green) | `#7FB69E` (sage) | 9.16:1 light, 8.56:1 dark |
| Radius / shadow / easing | 14 px and 10 px; two soft shadows; `cubic-bezier(.2,.7,.2,1)` | same | — |

- **Typography.** Fraunces 400 for display, with italic accent words in the accent color. Inter 16 px/1.6 for body text. JetBrains Mono for labels, years, and tags. Fluid sizes use `clamp()`; the H1 runs from 2.6 to 4.8 rem.
- **Layout.** 1,180 px container, 100 px section padding (70 px on mobile), card grids that collapse at 960, 720, and 640 px.
- **Motion inventory.** Loader, hero drift, three pulsing dots, floating scroll cue, staggered reveals, hover lifts, counter count-up.
- **Iconography.** Inline SVG for interface controls; PNG files for social icons.
- **Imagery.** Casual outdoor portrait, project screenshots, and personal photography.

## 5. Content and messaging, read as a faculty committee would

- **Audience mismatch.** The page says "PhD researcher, UofM" and also "Looking for a PhD seat", plus an industry pop-up. A search committee needs a teacher-scholar story: teaching, mentoring, service, and statements. None of these are present.
- **Credibility risks.** Two "Distinguished Speaker (Invited)" entries are for an infectious-diseases conference and a materials-science congress, outside the owner's field. "Top 10% on TestDome" and routine compliance trainings (cybersecurity, lab safety, respect training) dilute stronger items. Reviewers discount a page by its weakest item.
- **Missing scholarly depth.** No abstracts, PDFs, citation export, or per-paper pages. The owner's own name isn't highlighted in author lists. Four of seven publications have no link.
- **What works.** The hero states a clear thesis ("deployable AI for …"). The section titles have a voice. Quantified outcomes (98.68% on Oak Wilt; 8 state parks) are concrete.

## 6. Responsive behavior

Breakpoints are 880 px (nav collapses, hero stacks), 960/640 px (grids), 720 px (education and publication rows go to one column), and 540 px (pop-ups go full width). On a phone the page is 22,903 px long. The 9-second pop-up covers the "Download Resume" button (`evidence/ref_mobile_popup_covers_resume.jpg`), and the scroll cue overlaps the photo tag.

## 7. Performance (measured 2026-10-24; one lab run, not field data)

| Metric | Desktop | Mobile |
| --- | --- | --- |
| Largest Contentful Paint | 1,784 ms | 1,400 ms |
| DOMContentLoaded / load | 1,044 / 1,920 ms | — |
| Transfer during capture (includes lazy images reached while scrolling) | 3.31 MB, 20 requests | 0.93 MB |
| Cumulative Layout Shift | 0.00 | — |
| All 31 image files (measured individually) | **42.3 MB (40.3 MiB)** | same files; no responsive variants |

The largest files are `DSC01760.jpg` (4.34 MB), `rpi5.png` (4.12 MB), `Hunting Eyes.jpg` (2.66 MB), `IMG_5079.jpg` (2.56 MB), `IMG_5415.jpg` (2.11 MB), `shi.png` (1.22 MB), and `p4.png` (1.09 MB). The hero portrait alone is 668 KB. There are no `srcset`, WebP, or AVIF variants; lazy loading is the only optimization. The console shows one 404 (`favicon.ico`).

## 8. Accessibility

- **Passes.**
  - `lang="en"` is set.
  - Text colors pass WCAG AA (Section 4).
  - Icon buttons have `aria-label`s.
  - Reveal animations respect reduced motion.
- **Problems.**
  - All 17 gallery photos have empty `alt`, though they are content.
  - The zoom-in cursor promises an action that doesn't exist.
  - Pop-ups declare `role="dialog"` but don't move focus or close on Escape.
  - The mobile toggle has no `aria-expanded`.
  - The active nav link isn't exposed with `aria-current`.
  - **D9:** `.reveal` sets `opacity: 0` in CSS whether or not JavaScript runs. If the script fails or is blocked, every section stays invisible except for reduced-motion users.

## 9. SEO and sharing metadata

| Present | Missing |
| --- | --- |
| `<title>`, meta description, `theme-color` | Canonical URL; Open Graph and Twitter cards, so shared links show no preview; JSON-LD (`Person`, `ScholarlyArticle`); favicon (404); `robots.txt` (404); `sitemap.xml` (404); per-paper pages; Google Scholar `citation_*` tags |

## 10. Data and maintainability

All content lives in about 900 lines of HTML. Each publication's status is typed twice: as a `data-cat` attribute for the filter and as a visible tag. That duplication already produced D1. Adding a paper means editing HTML in two or three places, with nothing to catch a mistake.

## 11. Visit counter, in detail

Lines 1894-1939 try three sources in turn. First `/api/visit`, which doesn't exist on GitHub Pages. Then `https://abacus.jasoncameron.dev/hit/muttaki-bismoy-portfolio/visits`, which counts every page load, not unique visitors. Finally `localStorage`, which counts only the current browser's own visits. All three feed the same count-up animation, so a visitor can't tell them apart.

- **Live:** "Visits: 197" (`evidence/ref_counter_live_shows_197.jpg`).
- **With the Abacus host blocked,** as an ad blocker would: "Visits: 1" (`evidence/ref_counter_blocked_shows_1.jpg`).
- **No location data** of any kind.
- **Disclosure:** my first capture pass loaded the page twice before I blocked counter hosts, which may have added up to 2 to its public count.

## 12. Defects found (with evidence)

| ID | Defect | Evidence |
| --- | --- | --- |
| D1 | A "Submitted" paper is tagged `data-cat="accepted"`, so it appears under **Accepted**. "In Review" works only through a text-matching hack (line 1877) | lines 1319-1324, 1877; `evidence/ref_publications_filter_and_dead_links.jpg` |
| D2 | Four publications show "—↗", an arrow that suggests a link with no link behind it | lines 1325, 1333, 1341, 1349 |
| D3 | The four About stat cards stretch to the paragraph column's height, leaving large empty boxes | `evidence/ref_about_stat_cards_stretched.jpg` |
| D4 | Gallery `cursor: zoom-in` with no lightbox | line 812 |
| D5 | The counter shows "1" when its host is blocked | `evidence/ref_counter_blocked_shows_1.jpg` |
| D6 | Timed pop-ups cover content on mobile and lack keyboard handling | `evidence/ref_mobile_popup_covers_resume.jpg` |
| D7 | The mobile scroll cue overlaps the photo tag | mobile capture |
| D8 | `favicon.ico` returns 404 (console error) | `evidence/metrics/…PortfolioProject.json` |
| D9 | Content is invisible without JavaScript (`.reveal { opacity: 0 }`) | lines 204-208 |
| D10 | Resume and CV open Google Drive folders, not PDFs | lines 1069, 1720-1721 |
| D11 | 42.3 MB of unoptimized images | Section 7 |
| D12 | Mixed messages: "PhD researcher, UofM" next to "Looking for a PhD seat" and an industry pitch | lines 1060, 1764, 1777 |
| D13 | The footer clock shows the visitor's own local time | lines 1796-1803 |

## 13. Carried into the plan

The plan (`04_Site_Plan.md`) uses this analysis as follows:

- **Kept:** the editorial rigor (type scale, labels, whitespace), an availability chip, results shown as numbers, dark mode, reduced-motion support, and a print stylesheet.
- **Replaced:** each "Avoid" verdict (D1-D13 and F01, F13, F19, F26-F28, F31, F32), with the validated, evidence-first alternative described in plan Sections 6-12.
