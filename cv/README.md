# Web CV (decision D3)

`make-web-cv.py` builds the public CV, `site/public/cv/Syed_Tariq_CV.pdf`, from your CV in TTAP_Package. It never writes to TTAP_Package. It:

1. copies `cv.tex`, `awesome-cv.cls`, `cv-sections/`, and `fonts/` to a temporary folder;
2. edits the copy;
3. compiles it with XeLaTeX;
4. checks the PDF text with `check_cv.py`;
5. only then writes the PDF.

CI runs the same check on every build.

```bash
python3 cv/make-web-cv.py             # TTAP_Package at /users/ssmtariq/TTAP_Package
python3 cv/check_cv.py site/public/cv/Syed_Tariq_CV.pdf
```

After you change your CV in TTAP_Package, run the first command, then commit the new PDF. If one of the edits below no longer matches your source, the script stops and names that edit. Update it in `EDITS`.

## What differs from your TTAP CV (`cv.tex`, the balanced variant)

| Change | Why |
| --- | --- |
| Phone number removed from the header (the home address in `\address{}` was not printed, and is removed from the copy too) | D3: no personal contact details beyond email |
| References section removed | D3: referees' email addresses |
| GPAs removed (Ph.D., M.S., B.Sc.) | D4 |
| Ph.D. dates read "Jan 2022 – Present", not "Apr 2027" | As on the site (no expected graduation date) |
| Research Mentoring section removed | As on the site (mentoring hidden); your request, 2026-10-25 |
| "Executive Member, PSTU CSE Alumni Association" and "Moderator, PSTU Computer Club" removed from Academic Leadership and Outreach | As on the site; your request, 2026-10-25 |
| Committee order: Dr. Probir Roy (Chair), Dr. Zheng Song, Dr. Jinhua Guo, Dr. Junaid Farooq | Your correction, 2026-10-24 |
| BJIT title: "Senior Software Engineer (Software Engineer until Oct 2018)", dates Oct 2016 – Dec 2021 | Your correction, 2026-10-24 |
| "from client Rakuten Inc." → "from Rakuten Inc." | Your correction for the site |
| "knowledge distillation" removed from Skills | Your correction for the site |

Everything else is your CV as written: the same sections, order, wording, venue metrics, A4 size, and 4 pages. Co-author names in publication entries stay, because they are part of each citation. Your TTAP CV still has the old wording in the last four rows; change it there if you want the two to match.
