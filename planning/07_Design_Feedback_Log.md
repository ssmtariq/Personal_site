# Design sample: your feedback and what changed

Revision 4 (2026-10-24). The design sample is now the home page: `site/src/pages/index.astro` in the private repository `Personal_site`. Revisions 1–3 were `_redesign/spike/src/pages/sample.astro` in the public repository. Every fact on the page comes from `site/content/`, and the build validates it.

**See it**

- Screenshots: `evidence/sample/`
  - `sample_desktop_light_full.jpg`
  - `sample_desktop_dark_full.jpg`
  - `sample_mobile_full.jpg`
  - `sample_interactions.jpg`: first screen, sticky nav with progress, availability card, filters, lightbox, gallery
  - `sample_mobile_interactions.jpg`
- Live, while this session runs: `http://localhost:4321/`. If VS Code is connected to this machine remotely, it forwards the port; check the Ports panel.
  - `?card=show` shows the availability card at once.
  - `?theme=dark` forces dark mode.
- On the internet, after step 4 of `08_Launch_Guide.md`: `https://ssmtariq.github.io/v2/`.
- The review build has two kinds of placeholder, labelled on the page and never published:
  - gallery tiles;
  - footer visitor data.

  Your `site/content/gallery/` folder is empty, and with no photos the Gallery section and its menu item disappear. Real visitor numbers appear once GoatCounter is set up.

## First round

| # | Your feedback | Change |
| --- | --- | --- |
| 1 | Easy-to-communicate, dynamic interface like the reference | One availability card ("Email me" / "Later"): it appears once, after 12 s or on reaching Publications, never while Contact is on screen, closes with Esc, and is remembered for 7 days. Contact section with topic buttons that open a pre-addressed email, plus a copy-email button. Sticky nav with scroll-spy and a reading-progress bar. Publication filters and search. Abstract and BibTeX panels with copy. Figure and certificate lightbox. Count-up numbers. Reveal-on-scroll. Theme toggle. Back-to-top button |
| 2 | "Measure, Validate, Attribute, Act" around the photo | Removed. Plain portrait with a maize ring |
| 3 | No AI, LLM, or systems wording in "who am I" | Hero now reads: "I build tools that find, explain, and fix performance problems in cloud and distributed systems, combining program analysis, empirical studies, and AI (LLMs)." The About text adds the CV's research-interest sentence (systems, cloud, software engineering, AI). Within C0 decision 8 |
| 4 | Remove "Expected April …" | Not shown anywhere: Ph.D. reads "2022 – Present" (`showExpectedGraduation: false`). Your CV keeps the date |
| 5 | "On the job market" wording | "Open to faculty positions & research collaborations" |
| 6 | The 2022 → 2027 map | Removed |
| 7 | Start with who I am, then interests, experience, education …; imply "one question, four layers" | Order: About (with interests and news) → Experience → Education → Publications → Teaching → Research → Service → Awards → Gallery → Contact. The headline numbers sit inside each research project, each citing its paper and page. The "four layers" heading is gone; each project's label (Microservices, Serverless runtime, Configuration …) implies the structure |
| 9 | One scrolling page; current tab highlighted; nav follows | Done, and tested: the right link lights up in all 10 sections |
| 10 | Scholar, GitHub, LinkedIn, email left of CV | Done (maize icons; CV stays rightmost) |

## Your decisions

D1 Astro; D2 show venue metrics; D3 sanitized web CV; D4 no GPAs; D5 no response count, no PDF; D6 GoatCounter and map; D10 no mentee names or positions on the site or the web CV. Recorded in `04` Section 19.

## Second round

| # | Your feedback | Change |
| --- | --- | --- |
| 1 | "Open to …" glowing green | Green chip with a soft pulsing glow (hero, Contact, and the card's dot); static when reduced motion is on |
| 2 | Mar 2026 news wording | "… appeared at IEEE SANER 2026, Limassol, Cyprus, where I delivered the conference talk." HiPEAC now reads "Delivered a conference talk and a poster …" |
| 3 | "Memory Virtualization" case | Done (news and teaching table) |
| 4 | "6+ years building Java Enterprise applications" | Done (About, "Industry") |
| 5 | Remove "Knowledge distillation" | Removed from Methods and tools |
| 6 | ESIEA and B-JET as sub-roles; Software Engineer at BJIT 2016–2018 | ESIEA is a sub-role of Graduate Student Instructor (Summer 2023, 4 weeks, 27 students, France). BJIT is split: Senior Software Engineer (2018 – Dec 2021) with B-JET recruitment (2018–2021) as a sub-role, and Software Engineer (Oct 2016 – 2018) with duties from your older resume |
| 7 | More trainings and certifications | All 11 shown: research ethics (2); technical and professional (4: AWS Educate, Udemy, EY Top-up IT, BITM); and the five U-M compliance trainings in a collapsed list (see "Open items") |
| 8 | Research after Teaching | Done |
| 9 | "First author", not "Co-first author" | Done; the asterisk and "* Equal contribution" stay in the author list |
| 10 | Replace "Software history" | "Mining software repositories" |
| 11 | In-preparation wording | "Aiming to be submitted to The ACM Web Conference (WWW 2027). Results will be added upon decision." |
| 12 | "Poster + Talk" as two tags | Separate "Talk" and "Poster" tags |
| 13 | Other talks | The ICECE 2014 talk now shows under "Earlier publications". No other talks are in your sources (see "Open items") |
| 14 | CIS-450, Jan 2026: class size 62 | Guest-lecture row shows 62 (new `audience` field) |
| 15 | Hide PSTU items | Both hidden (`hidden: true`; the records stay) |
| 16 | "AI-assisted software engineering" | Done (Contact and the card) |
| 17 | Remove "client of BJIT Limited" | Award reads "Rakuten Inc." |
| 18 | Always name the country, with a flag | Every location ends with its country and a flag: experience, education, publications, talks, awards, news, Contact. Travel grants read "To attend HiPEAC 2024 in Munich, Germany 🇩🇪" (drawn as SVG flags so Windows shows them) |
| 19 | "Java enterprise applications using service-oriented architecture" | About, last paragraph |
| 20 | Progress bar below the sticky nav | A 4 px maize bar under the header shows how far the visitor has read (also announced to screen readers) |
| 21 | Advisor URL with an icon | Under "Dr. Probir Roy" in About and in the Ph.D. card |
| 22 | Hide Research mentoring | Hidden (`showMentoring: false`); the section is titled "Teaching experience" |
| 23 | Horizontal "Gallery" before Contact, from a folder | `content/gallery/` (later `site/content/gallery/`). Drop in JPG, PNG, WebP, or AVIF files; optional alt text and captions go in `content/gallery.yaml`. The strip scrolls sideways with snap and arrow buttons; photos open in the lightbox; the build strips GPS and other metadata |

## Third round

| # | Your feedback | Change |
| --- | --- | --- |
| 1 | "I delivered the conference talk" | "… appeared at IEEE SANER 2026, Limassol, Cyprus. I delivered the conference talk." |
| 2 | Remove "June 10–13" | "… accepted at EASE 2026 (Glasgow, Scotland, UK)." |
| 3 | A better title than "Recruitment examiner and interviewer" | "Hiring committee member, B-JET". The bullet below it keeps the duties: designed the screening problems, ran the hiring exams, interviewed. Your other suggestion, "Problem setter and interviewer", is a one-line swap in `experience.yaml` |
| 4 | Committee order | Dr. Probir Roy (chair), Dr. Zheng Song, Dr. Jinhua Guo, Dr. Junaid Farooq (site and web CV) |
| 5 | Remove the OOP course | Hidden (`show: false`; the record stays) |
| 6 | Drop "Learn" | "Java Functional Programming with Lambdas & Streams" |
| 7 | "Talks and presentations" | Renamed |
| 8 | "Memories" | The gallery heading reads "Memories"; the menu item stays "Gallery" |
| 9 | Replace "Open to opportunities" | The card's label reads "Let's get in touch" |
| 10 | "Get connected" (LinkedIn) instead of "Later" | It opens your LinkedIn profile in a new tab and closes the card (tested). "Email me" gained an envelope icon to match; the × still closes the card |

## Your answers to the open items

| Item | Answer | Effect |
| --- | --- | --- |
| BJIT promotion month | Oct 2018 | Software Engineer Oct 2016 – Oct 2018; Senior Software Engineer Oct 2018 – Dec 2021. The `[VERIFY]` note is gone |
| CIS-450 Winter 2026 size | Keep 54 | Unchanged (the guest lecture still shows 62) |
| "3-minute research" talk | Don't add | Not added |
| Compliance trainings | Keep as is | Unchanged (collapsed list) |
| PerfMiner | Hide from Research projects | `hidden: true`. The paper still appears under Publications, and the news item stays |
| Web CV | Build and add it | Built: `site/public/cv/Syed_Tariq_CV.pdf`, 4 pages. Every CV button now works. What it removes and changes: `../cv/README.md` |
| Dr. Roy's link | You'll check it yourself | The weekly link check skips that host |

## Additional tasks

| Task | Done |
| --- | --- |
| Open source only, most popular | Every tool that builds or runs the site is open source (table in `09_Open_Source_Stack.md`). The only proprietary piece is GitHub, which hosts the site; the reason is in `09`. The old pages' Google Analytics and Search Console tags don't carry over |
| Private repository, with only a forwarding note in the public one | `/users/ssmtariq/Personal_site` holds everything: the site, your data, the CV builder, these notes, and the old site. Its workflow publishes only built files plus a README to `ssmtariq.github.io`, as one fresh commit each time. Rehearsed locally: the public repository ends with one commit and no source. You create the GitHub repository and push (step 1 of `08`) |
| How to launch and test live | `08_Launch_Guide.md`: 7 steps. You test at `https://ssmtariq.github.io/v2/` while visitors still see the current site, then switch with one setting. Rollback uses the same setting |

## Open items (need your word)

1. **Old résumé link.** `/Resume_of_SSM_TARIQ.pdf` shows your phone number and "CGPA 4.0". The publish step now serves the web CV at that address, already in preview mode. That changes plan decision D9 ("leave untouched"). Say if you'd rather keep the old file until cutover.
2. **Old pages at cutover.** The plan kept them at `/classic/` and `/skeleton/`. Given your privacy request, the cutover now retires them: they redirect to the new site and stay in `legacy/` in the private repository. Say if you want them kept.
3. **Web CV facts aligned with the site.** The web CV:
   - shows "Jan 2022 – Present" (no Apr 2027 graduation date);
   - drops "knowledge distillation";
   - says "from Rakuten Inc." (no "client").

   Keep these, or match your TTAP CV?
4. **Google Search Console.** Its verification tag (a Google service) is not on the new site. Search engines still find the site through `robots.txt` and `sitemap.xml`. Add the tag back only if you use Search Console's reports.
5. **Still from earlier:**
   - the EASE 2026 DOI (the paper still shows "Accepted");
   - two `[VERIFY]` notes on teaching: the CIS-200L Fall 2024 materials and the CIS-581 modality (`05` Section 7).

   None of them blocks the launch.
