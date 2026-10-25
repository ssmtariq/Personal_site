# 05 · Data Input Specification

**Purpose.** Every fact on the site lives in one place, in a format that your editor autocompletes and the build verifies. Adding a publication, service role, certification, experience, news item, or talk means copying a template, filling in the fields, and pushing. If anything is wrong, the build stops and names the file, the entry, and the problem.

**Canonical implementation (tested):**

| File | What it is |
| --- | --- |
| `spike/src/content.config.ts` | Schemas for 18 collections |
| `spike/scripts/check-content.mjs` | Integrity and policy checker |
| `spike/content/*.yaml` and `spike/content/projects/*.md` | Seed data from your primary sources |
| `tools/negtest.py`, `tools/negtest2.py` | 18 negative tests; all 17 distinct error types are caught |

At implementation these files move to `site/` unchanged.

---

## 1. Principles

1. **One fact, one place.** People and venues are registries. A publication refers to `roy-probir` and `saner-2026` by id; it never retypes the name. That makes misspellings such as "Alexender/Alexendar" impossible.
2. **Provenance on every entry.** A required `source` field (for example `"P-CS p.1; 02B item 1"`) is never rendered, but it makes the quarterly CV/site audit a grep.
3. **Precision you have, not precision you guess.** Dates accept `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` (your rule 3: never guess dates). The site shows only that precision.
4. **Policy is code.** Your CV rules are enforced, not remembered: earlier papers stay off featured lists, there are no numbers on unsubmitted work, AI wording stays within decision 8, and the response count is always shown.
5. **Hidden is not deleted.** `hidden: true` keeps a record without showing it, for example compliance trainings.

## 2. File layout

```
site/content/
  profile.yaml      site.yaml        people.yaml      venues.yaml
  publications.yaml talks.yaml       news.yaml        teaching.yaml
  mentoring.yaml    service.yaml     experience.yaml  education.yaml
  awards.yaml       certifications.yaml  skills.yaml  writing.yaml  materials.yaml
  projects/<project-id>.md          # frontmatter fields + a short Markdown body
site/src/assets/{people,figures,evidence,logos,writing}/   # images referenced as ../src/assets/...
site/public/{cv,publications/<id>,og}/                     # files that need stable URLs (PDFs)
```

Each YAML file starts with a schema line such as `# yaml-language-server: $schema=../.astro/collections/news.schema.json`. With the Red Hat YAML extension for VS Code, you get autocompletion, enum dropdowns, and red underlines as you type. Astro generates the schemas on `npm run check` or `npm run dev` *(verified: 18 schema files)*.

## 3. Conventions (all collections)

| Field | Rule |
| --- | --- |
| `id` | Required, unique per file, kebab-case, stable (it becomes URLs and references). Example: `tariq-saner26-cold-start` |
| `source` | Required; at least 3 characters; your source short names (C0, 02B item n, CV final, P-xx p.n, PROP p.n) |
| `hidden` | Optional, default `false` |
| `notes` | Optional working notes; `[VERIFY]` goes here, never in shown fields |
| Dates | `"2026"`, `"2026-03"`, or `"2026-03-17"`. Quotes are recommended; unquoted dates are normalized |
| End dates | A date, or `present` |
| Links | `https://…` or a site path starting with `/` |
| Inline Markdown | `**bold**`, `*italic*`, and links only; raw HTML is not rendered (prevents bugs like Ghammam's stray `</div>`) |
| Images | `src` plus `alt` of at least 5 characters, plus `credit` for figures |

## 4. Collections and fields

`*` = required.

**publications.yaml**

| Field | Type / allowed values | Rule |
| --- | --- | --- |
| `title`* | text | |
| `authors`* | list of `{ person*: people id, equal: bool, corresponding: bool }` | You appear exactly once; your position must match `role` |
| `venue` | venues id | Omit for manuscripts |
| `target_venue` | text | Manuscripts only ("The ACM Web Conference (WWW 2027)") |
| `year`* | integer | |
| `status`* | `published` · `accepted` · `in-press` · `under-review` · `in-preparation` · `preprint` | `published` needs `doi` or `links.proceedings`; `in-preparation` can't have `venue` or `doi` |
| `category`* | `conference` · `journal` · `poster` · `manuscript` · `thesis` · `earlier` | `earlier` → never `selected`; topic `earlier-work` only |
| `role`* | `first-author` · `co-first-author` · `co-author` | Checked against author order and the `equal` flags |
| `doi` | `10.xxxx/…` | Pattern-checked |
| `pages`, `volume`, `number`, `article` | text | Feed the Google Scholar tags and BibTeX |
| `abstract` | text | Required for published or accepted conference and journal papers (Google Scholar) |
| `topics` | `serverless`, `microservices`, `performance-analysis`, `empirical-se`, `mining-software-repositories`, `configuration-tuning`, `llm-methods`, `earlier-work` | Drives the filters |
| `contribution` | Markdown | What *you* did, in CV-supported verbs |
| `project` | projects id | |
| `selected` | bool | At most 4 across the file; conference or journal only |
| `links` | `pdf`, `arxiv`, `slides`, `video`, `code`, `poster`, `proceedings` | |
| `artifact` | `{ label*, url*, doi }` | Shown as a badge |
| `teaser` | image | Paper card figure |
| `copyright_notice` | text | Required wording when you host an IEEE accepted version |

**projects/*.md** (frontmatter)

| Field | Type / allowed values | Rule |
| --- | --- | --- |
| `title`* | text | |
| `tagline`* | text, ≤ 140 characters | |
| `layer`* | `software-lifecycle` · `system-stack` · `distributed-services` · `control-plane` · `software-evolution` | |
| `status`* | `published` · `ongoing` · `in-preparation` | `in-preparation` → no numbers anywhere (checker) |
| `years`* | `{ start*, end }` | First and last years **with dated evidence** (paper, poster, mentoring start), not estimates |
| `role`* | text | |
| `order`* | integer | |
| `publications` | list of publication ids | |
| `results` | list of `{ value*, label*, source*: { publication*, locator* }, featured }` | **Every number cites paper and page**; at most 4 featured overall (Phase 1 adds `featured`) |
| `artifacts` | list of `{ label, url, doi, kind: code · dataset · benchmark · replication-package }` | |
| `figures` | list of images with `caption` | |

**news.yaml**

| Field | Type / allowed values | Rule |
| --- | --- | --- |
| `date`* | date | Not in the future (full dates) |
| `kind`* | `paper` · `talk` · `award` · `service` · `teaching` · `milestone` · `mentoring` · `media` · `other` | |
| `headline`* | Markdown, ≤ 160 characters | Wording guardrails apply |
| `links` | list of `{ label, url }` | |
| `refs` | `{ publication, talk, award }` | Must exist; never an earlier paper |
| `pinned`, `expires` | bool, date | |

**talks.yaml**

| Field | Type / allowed values | Rule |
| --- | --- | --- |
| `title`*, `event`*, `location`*, `date`* | | |
| `kind`* | `conference-talk` · `invited-talk` · `guest-lecture` · `poster` · `seminar` · `workshop` · `panel` | |
| `presented_by_me`* | must be `true` | Only talks you gave (02B R7) |
| `publication`, `award`, `course` | references / text | Must exist |
| `earlier` | bool | Required `true` for talks on 2014/2017 papers |
| `links` | `slides`, `video`, `poster`, `event` | |

**teaching.yaml**

| Field | Type / allowed values | Rule |
| --- | --- | --- |
| `course`* | `{ code, title*, level*: undergraduate · graduate · mixed, cross_list }` | |
| `institution`*, `program` | text | |
| `term`* | `{ season*: Winter · Summer · Fall, year* }` | |
| `role`* | `instructor-of-record` · `lab-instructor` · `teaching-assistant` · `guest-lecturer` · `co-instructor` | Instructor roles are listed first |
| `students`* | integer > 0 | |
| `length` | text ("4 weeks") | |
| `modality`* | `in-person` · `online-async` · `online-optional` · `hybrid` | At least one |
| `responsibilities`, `materials` | text | |
| `evaluation` | `{ instrument*, item*, score*, scale*, dept_mean, college_mean, university_mean, responses*, enrolled*, quotes, document, public_document }` | `responses ≤ enrolled`; `enrolled = students`; `score ≤ scale`; the site always prints "responses of enrolled" |

**service.yaml**

| Field | Type / allowed values |
| --- | --- |
| `category`* | `artifact-evaluation` · `reviewing` · `program-committee` · `organizing` · `leadership` · `outreach` · `membership` · `departmental` |
| `role`*, `organization`* | text |
| `short` | short venue name ("OSDI '25") |
| `start`*, `end` | dates |
| `location`, `details` (Markdown list), `url` | |

**experience.yaml**

| Field | Type / allowed values | Rule |
| --- | --- | --- |
| `kind`* | `academic` · `industry` | |
| `organization`*, `role`*, `start`*, `end`*, `location`* | | |
| `logo` | image path | |
| `bullets`* | Markdown list | **At most 4** |

**education.yaml**

| Field | Rule |
| --- | --- |
| `degree`*, `field`*, `institution`*, `unit`, `start`*, `end`*, `expected`, `location`* | |
| `advisor`, `dissertation` (`title`, `proposal_passed`), `committee` (list of `{name, role}`), `honors`, `logo` | |
| GPAs | **There is no GPA field**, and `site.flags.showGpa` must be `false` |

**awards.yaml**

| Field | Type / allowed values | Rule |
| --- | --- | --- |
| `title`*, `organization`*, `year`* | | |
| `category`* | `honor` · `best-paper` · `best-poster` · `fellowship` · `scholarship` · `travel-grant` · `research-grant` · `recognition` | There is no "pending" state: only awarded items |
| `purpose`, `team`, `location` | | |
| `evidence` | image (certificate shown in the lightbox) | |

**certifications.yaml**

| Field | Type / allowed values |
| --- | --- |
| `title`*, `issuer`*, `date`* | |
| `category`* | `research-ethics` · `technical` · `professional` · `compliance` |
| `detail`, `credential_id` | |
| `evidence` | image (certificate shown in the lightbox) |
| `show`* | bool; compliance items stay `false` |

**mentoring.yaml**

| Field | Type / allowed values |
| --- | --- |
| `name`*, `program`* | text |
| `level`* | `undergraduate` · `masters` · `phd` |
| `start`*, `end`* | dates |
| `project`, `publications` | references |
| `outcome`* | Markdown |
| `current_position` | text |

**profile.yaml**

| Field | Rule |
| --- | --- |
| `name`*, `title`*, `department`*, `institution`*, `advisor`*, `expected_graduation`* | |
| `identity`* | ≤ 170 characters |
| `bio`* | |
| `research_areas`* | 3-8 items |
| `email`* | |
| `links`* | scholar, github, linkedin; orcid and dblp optional |
| `headshot`* | `image()`, so it is optimized automatically |
| `job_market`* | `{ active, season, until }` |

**Registries and the rest**

| File | Fields |
| --- | --- |
| `people.yaml` | `name`*, `me` (exactly one), `aliases`, `affiliation`, `url` |
| `venues.yaml` | `short`*, `year`*, `full`*, `kind`*, `publisher`*, `location`, `dates`, `url`, `metrics` (stored; shown only if `showVenueMetrics`) |
| `site.yaml` | `title`, `url`, `flags` (`showVenueMetrics`, `visitorStats`, `showGpa: false`), `analytics` (`goatcounter`, `launched`) |
| `skills.yaml` | `label`*, `items`*, `order`* |
| `writing.yaml` | `title`*, `url`*, `date`*, `platform`*, `image` |
| `materials.yaml` | `label`*, `file`, `updated`*, `status`*: `available` · `coming-soon` · `private` |

## 5. Rules and the evidence that they work

**Schema rules** (checked by `astro sync` and `astro build`). Types, enums, date formats, required fields, and `alt` length, plus:

| ID | Rule |
| --- | --- |
| S1 | Earlier papers can't be featured |
| S2 | Earlier papers use only the `earlier-work` topic |
| S3 | Published needs a DOI or proceedings link |
| S4 | Manuscripts take `target_venue` only |
| S5 | Published or accepted papers need the abstract |
| S6 | Self-hosted PDFs need a venue |
| S7 | Evaluation arithmetic (responses ≤ enrolled; enrolled = students; score ≤ scale) |
| S8 | Talks must be yours |
| S9 | Every result cites `{publication, locator}` |
| S10 | At most 4 bullets per role |
| S11 | Identity ≤ 170 characters |
| S12 | `showGpa` is `false` |

**Integrity checker** (`check-content.mjs`; errors fail CI, warnings don't):

| ID | Rule |
| --- | --- |
| R1 | Unique ids in every collection |
| R2 | Exactly one `me` in `people` |
| R3 | Every author exists; you appear exactly once |
| R4 | Your author position matches `role` (first, co-first with `equal` group, co-author) |
| R5 | Venue and project references exist; at most 4 selected, conference or journal only |
| R6 | News: no future dates; references exist; never an earlier paper |
| R7 | Talks: references exist; talks on earlier papers flagged `earlier` |
| R8 | Mentoring references exist |
| R9 | Project publications and result citations exist (warns if a paper points to a different project) |
| R10 | In-preparation projects show no numbers |
| R11 | Wording guardrails in research-facing text: "AI-powered", "AI-native", "AI researcher", "cutting-edge AI", "Rank: A/A\*/Q1-Q4", "impact factor", "acceptance rate" |
| R12 | `[VERIFY]` allowed only in `notes` (warning) and never in a shown field (error) |
| R13 | Staleness: `accepted` more than 90 days after the venue's end date → warning |
| R14 | Job-market flag past `until` → warning |
| R15 | `image()` paths must exist (always checked) |
| R16 | Site paths must exist in `public/` (skipped with `--no-assets` until Phase 2) |

**Evidence.** On the clean seed: 0 errors and 5 meaningful warnings (the EASE staleness warning plus the 4 `[VERIFY]` notes).

| Injected error | Caught by |
| --- | --- |
| Earlier paper marked `selected` | schema |
| News `kind` typo | schema |
| `enrolled` 17 vs `students` 15 | schema |
| Free-text date "March 10, 2026" | schema |
| Manuscript given a venue | schema |
| Talk with `presented_by_me: false` | schema |
| Result without a source | schema |
| Misspelled co-author id | checker (Astro only *logs* it: `astro sync` exits 0) |
| First-author role while listed second | checker |
| News featuring a 2014 paper | checker |
| "AI-powered" in the identity sentence | checker |
| `[VERIFY]` in a shown field | checker |
| "(Rank: A)" in a contribution | checker |
| Numbers on PerfFinder | checker |
| Duplicate id | checker |
| Missing headshot file | checker (and `astro build`: `ImageNotFound`) |
| Future-dated news | checker |

**17 of 17 caught.**

## 6. Recipes

Run `npm run check` after any edit (about 3 seconds), then `npm run dev` to look at it, then commit and push. CI repeats every check before deploying.

### 6.1 New publication (accepted)

```yaml
- id: tariq-fse27-example            # firstauthor-venueYY-keyword
  title: "Exact Title as in the Paper"
  authors:
    - { person: tariq }
    - { person: roy-probir }          # add new co-authors to people.yaml first
  venue: fse-2027                     # add the venue to venues.yaml first
  year: 2027
  status: accepted
  category: conference
  role: first-author
  topics: [performance-analysis]
  project: perffinder                 # or a new project file
  contribution: "Developed …; evaluated …."
  abstract: >-
    Paste the author-written abstract verbatim.
  source: "P-XX p.1 (paper PDF in cv-materials/publications/)"
```

Also add a `news` item (`kind: paper`, `refs.publication`). Optionally set `selected: true`, but keep the total at 4 or fewer.

### 6.2 Accepted → published

Add `doi`, `pages` (and `volume`/`number` for journals), then set `status: published`. If you host an IEEE accepted version: put `public/publications/<id>/paper.pdf` (≤ 5 MB), set `links.pdf: /publications/<id>/paper.pdf`, and add the IEEE `copyright_notice`. For ACM papers (open access since 2026-01-01), link the DOI.

### 6.3 News item

```yaml
- id: 2027-02-fse-accepted
  date: "2027-02-10"
  kind: paper                      # paper|talk|award|service|teaching|milestone|mentoring|media|other
  headline: "Our paper on … was accepted at **FSE 2027**."
  refs: { publication: tariq-fse27-example }
  source: "acceptance email, 2027-02-10"
```

### 6.4 Talk

```yaml
- id: fse-2027-talk
  title: "Exact talk title"
  kind: conference-talk            # invited-talk|guest-lecture|poster|seminar|workshop|panel
  event: ACM FSE 2027
  location: City, Country
  date: "2027-07"
  presented_by_me: true
  publication: tariq-fse27-example
  links: { slides: "/talks/fse-2027-slides.pdf", video: "https://…" }
  source: "conference program"
```

### 6.5 Service

```yaml
- id: icse-2028-aec
  category: artifact-evaluation    # reviewing|program-committee|organizing|leadership|outreach|membership|departmental
  role: Artifact Evaluation Committee Member
  organization: International Conference on Software Engineering
  short: ICSE '28
  start: "2027"
  source: "invitation email, 2027-09-01"
```

### 6.6 Certification

```yaml
- id: crlt-teaching-certificate-2027
  title: "Exact certificate title"
  issuer: Issuing body
  date: "2027-04-15"
  category: professional           # research-ethics|technical|professional|compliance
  show: true                       # false for routine compliance training
  evidence: { src: ../src/assets/evidence/crlt-2027.png, alt: "CRLT teaching certificate, April 2027" }  # adds "View certificate"
  source: "certificate PDF in cv-materials/achievements/"
```

### 6.7 Experience

```yaml
- id: example-university-asst-prof
  kind: academic
  organization: Example University
  role: Assistant Professor of Computer Science
  start: "2027-08"
  end: present
  location: City, ST, USA
  logo: ../src/assets/logos/example.png
  bullets:
    - "At most four bullets."
  source: "offer letter"
```

### 6.8 Teaching term, with an evaluation when it arrives

```yaml
- id: f2026-cis200l               # already seeded; add the evaluation block later
  # … existing fields …
  evaluation:
    instrument: UM-Dearborn Fall 2026 course evaluations
    item: Overall instructor
    score: 4.8
    scale: 5
    dept_mean: 4.5
    responses: 12
    enrolled: 27                  # must equal students
    quotes: ["Exact student quote"]
    document: /teaching/cis200l-fall2026-evaluation.pdf
    public_document: false        # true only after you approve
```

### 6.9 Award (with certificate)

```yaml
- id: best-paper-2027
  title: Best Paper Award
  organization: Venue or body
  year: 2027
  category: best-paper
  purpose: "For *Paper title*."
  evidence: { src: ../src/assets/evidence/best-paper-2027.jpg, alt: "Best Paper Award certificate for …" }
  source: "certificate file"
```

### 6.10 Other updates

- **Mentee:** a `mentoring.yaml` entry (level, program, dates, project, outcome, publications).
- **New project:** a `projects/<id>.md` file with frontmatter. Every number under `results` needs `source.publication` and `source.locator`.
- **CV refresh:** run `python3 cv/make-web-cv.py` (it rebuilds `public/cv/Syed_Tariq_CV.pdf`; the publish step serves it at `/cv.pdf` too), and set `materials.cv.updated`.
- **End of job market:** set `profile.job_market.active: false`.

## 7. Seed inventory (from your primary sources)

| Collection | Entries | Notes |
| --- | --- | --- |
| people | 17 | "Alexender" spelled as on the poster (02B R8) |
| venues | 7 | Metrics stored, hidden by default |
| publications | 8 | 4 current-line papers, 1 poster, 1 manuscript, 2 earlier (collapsed) |
| projects | 5 | 14 results, each with paper and page |
| talks | 6 | Only talks you gave (R7); the 2014 talk flagged earlier |
| news | 13 | Dated only to the precision the sources give |
| teaching | 11 | 4 instructor or lab roles, 7 TA terms |
| mentoring | 4 | |
| service | 12 | |
| experience | 4 | |
| education | 3 | |
| awards | 9 | |
| certifications | 7 | 3 shown, 4 hidden |
| skills | 7 | |
| writing | 3 | |
| materials | 3 | |

**Open `[VERIFY]` items (shown as checker warnings until resolved):**

1. Did Fall 2024 CIS-200L also use your self-designed lab materials? (02B item 5 dates them to Fall 2026.)
2. CIS-581 modality: no online section is recorded.
3. Expand "SDI" (Ali Al Zein, 365 Retail), or keep it as written.
4. Expand "PD" (Arati Khanolkar, Epicor), or keep it as written.

**Plus one staleness warning:** EASE 2026 is still `accepted`. Add the DOI if the paper is in the ACM Digital Library.
