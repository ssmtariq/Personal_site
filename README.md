# Personal_site (private)

Source of **https://ssmtariq.github.io**, the website of Syed Salauddin Mohammad Tariq.

Push to `main` and GitHub Actions checks, builds, and publishes the site in about 4 minutes. Only the built
files go to the public repository `ssmtariq/ssmtariq.github.io`; the source, data, and history stay here.
If any check fails, nothing is published and the live site stays as it was.

## Make an update

1. Edit a file in `site/content/` (see the table below).
2. Optional: check it on your machine (see [Check locally](#check-locally)).
3. Commit and push to `main`.
4. Watch **Actions → Build and publish the site**. The change is live about 4 minutes after a green run,
   though GitHub's cache can serve the old page for up to 10 more minutes.

Full field lists and copy-paste examples: [`planning/05_Data_Input_Spec.md`](planning/05_Data_Input_Spec.md), Section 6.

## How to …

### Content (`site/content/`)

| To | Edit | Notes |
| --- | --- | --- |
| Add a paper | `publications.yaml` | Add new co-authors to `people.yaml` and the venue to `venues.yaml` first. Also add a news item |
| Mark a paper published | `publications.yaml` | Add `doi` and `pages`, then set `status: published` |
| Post news | `news.yaml` | The five newest show; the rest sit under "Show earlier updates" |
| Add a talk or poster | `talks.yaml` | Only talks you presented (`presented_by_me: true`) |
| Add an award or grant | `awards.yaml` | A certificate image goes in `site/src/assets/evidence/` |
| Add service or reviewing | `service.yaml` | `category` sets the group (reviewing, artifact-evaluation, leadership …) |
| Add a teaching term or evaluation | `teaching.yaml` | Add the `evaluation` block when results arrive |
| Add a job | `experience.yaml` | At most four bullets |
| Add a certification | `certifications.yaml` | `show: false` for routine compliance training |
| Add a research project | `projects/<id>.md` | Every number in `results` cites a paper and page |
| Change bio, title, links, research areas | `profile.yaml` | |
| End the job-market banner | `profile.yaml` | `job_market.active: false` |
| Show or hide whole sections | `site.yaml` | `flags`: `showMentoring`, `showVenueMetrics`, `visitorStats` |
| Hide one item without deleting it | any file | `hidden: true` |

### Gallery ("Memories")

- Put the photo (JPG, PNG, WebP, or AVIF, under about 10 MB) in `site/content/gallery/` with a descriptive name.
- Add an entry to `site/content/gallery.yaml`: `alt`, `caption`, `date`, `location`, and `order` (1, 2, 3 … sets
  the position; photos without `order` follow, newest first).
- To remove a photo, delete the file and its entry. The build strips metadata such as GPS; originals are never published.

### CV

The public CV (`site/public/cv/Syed_Tariq_CV.pdf`) is a sanitized copy of your CV in TTAP_Package, which is only read.

1. Edit your CV in TTAP_Package.
2. Run `python3 cv/make-web-cv.py` (needs TeX Live and poppler-utils). It stops if the PDF leaks a phone number,
   address, GPA, referee email, or anything else on its blocklist.
3. Set `updated` on the `cv` entry in `site/content/materials.yaml`, then commit the PDF and push.

To leave something out of the **public** CV only, add an edit to `EDITS` in `cv/make-web-cv.py` and a pattern to
`FORBIDDEN` in `cv/check_cv.py`. What the web CV removes today, and why: [`cv/README.md`](cv/README.md).

## Rules every entry follows

- `id`: unique, kebab-case, never changed once published (other entries refer to it).
- `source`: required; where the fact comes from (CV, paper page, email …).
- Dates: `"2026"`, `"2026-03"`, or `"2026-03-17"`, in quotes. End dates may be `present`.
- Formatting: `**bold**`, `*italic*`, and links only; HTML is not rendered.
- `[VERIFY]` and working notes go in `notes`, which is never shown. A `[VERIFY]` in a shown field fails the build.

## Check locally

Optional; CI runs the same checks. Needs Node 24 (`site/.nvmrc`).

```bash
cd site && npm ci       # once
npm run check           # schemas, cross-references, wording rules (about 3 s)
npm run dev             # preview at http://localhost:4321
```

## Publishing

| What runs | When |
| --- | --- |
| `publish.yml`: checks, build, CV privacy check, pre-publish checks, publish | Every push to `main`; daily at 06:17 UTC (visitor stats); by hand |
| `links.yml`: link check of the live site | Mondays at 07:41 UTC |

GitHub emails you when a run fails. Open the run: the log of the red step says what to fix (for content,
the file and entry). Fix it and push again.

**Run it by hand** (**Actions → Build and publish the site → Run workflow**) only after changing a setting
below; a push already starts a run.

**Published addresses:** `/` new site · `/v1/` previous site (not indexed) · `/cv.pdf` and
`/Resume_of_SSM_TARIQ.pdf` the web CV · `/v2/` and `/skeleton/` redirect.

### Settings (Personal_site → Settings → Secrets and variables → Actions, repository level)

| Name | Kind | Value |
| --- | --- | --- |
| `SITE_MODE` | variable | `live` (new site at `/`, old at `/v1/`) or `preview` (old site at `/`, new at `/v2/`). Setting `preview` is the rollback |
| `PAGES_DEPLOY_KEY` | secret | Private half of the deploy key with write access to `ssmtariq.github.io` |
| `GOATCOUNTER_SITE` | variable | `ssmtariq` |
| `GOATCOUNTER_TOKEN` | secret | GoatCounter API key with read-statistics permission only |
| `STATS_START` | variable | UTC hour the public visitor count starts, for example `2026-10-25T00:00:00Z` |

## Repository layout

| Path | Holds |
| --- | --- |
| `site/content/` | All site content: YAML files, `projects/*.md`, `gallery/` |
| `site/` | The Astro project: schemas (`src/content.config.ts`), the page (`src/pages/index.astro`), checks (`scripts/`) |
| `cv/` | The web-CV builder and its privacy check |
| `legacy/` | The previous site, published at `/v1/` |
| `publish/README.md` | The note shown in the public repository |
| `planning/` | Plan, data spec (`05`), design log (`07`), launch guide (`08`), open-source audit (`09`) |
| `.github/workflows/` | `publish.yml` and `links.yml` |

## Don't

- Push to `ssmtariq.github.io` directly: the next run replaces it.
- Commit `site/node_modules/` or `site/dist/` (`.gitignore` covers both).
- Put private details (phone, address, GPAs, referee emails) in `site/content/`: everything shown there is public.
