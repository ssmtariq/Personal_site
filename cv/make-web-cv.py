#!/usr/bin/env python3
"""Build the public web CV from a copy of the TTAP_Package CV sources (decision D3).

TTAP_Package is only read. Its CV sources are copied to a temporary folder, the edits
below are applied to the copy, the copy is compiled with XeLaTeX, and the PDF text is
checked for anything that must not be public. The PDF is written to the site.

Usage: python3 cv/make-web-cv.py [--ttap /users/ssmtariq/TTAP_Package] [--out site/public/cv/Syed_Tariq_CV.pdf]
Needs: xelatex and latexmk (TeX Live), pdftotext (poppler-utils).

Every edit must match the TTAP source exactly once. If you change your CV in TTAP_Package
and an edit no longer matches, the build stops and names the edit; update it here.
"""
import argparse, pathlib, re, shutil, subprocess, sys, tempfile

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from check_cv import leaks_in  # noqa: E402  (the same check runs in CI)

# (file, text in the TTAP source, text in the web CV, why)
EDITS = [
    # --- privacy (D3) ---
    ('cv.tex', r"\address{7592 N Merriman Rd, Westland, MI 48185, USA}" "\n", '', 'home address'),
    ('cv.tex', r"% \mobile{(586) 480-6118}" "\n", '', 'phone number (commented out, removed anyway)'),
    ('cv.tex', r"      \textbf{Phone:} \href{tel:+15864806118}{(586) 480-6118} \,\textbar\," "\n", '', 'phone number'),
    ('cv.tex', r"\input{cv-sections/reference}" "\n", '', 'references and their email addresses'),
    # --- no GPAs (D4) and no expected graduation date (as on the site) ---
    ('cv-sections/education.tex', 'Ph.D. in Computer and Information Science, GPA: 4.0/4.0', 'Ph.D. in Computer and Information Science', 'GPA'),
    ('cv-sections/education.tex', 'Master of Science in Computer and Information Science, GPA: 4.0/4.0', 'Master of Science in Computer and Information Science', 'GPA'),
    ('cv-sections/education.tex', 'Bachelor of Science in Computer Science and Engineering, GPA: 3.37/4.0', 'Bachelor of Science in Computer Science and Engineering', 'GPA'),
    ('cv-sections/education.tex', '{Jan 2022 -- Apr 2027} % Date(s)', '{Jan 2022 -- Present} % Date(s)', 'expected graduation date'),
    # --- mentees: no names, current positions, or genders (D10) ---
    ('cv-sections/mentoring.tex',
     'Co{-}advised the research of graduate (two female and a male) and undergraduate CIS students.',
     'Co{-}advised the research of three graduate students and one undergraduate student in CIS.',
     'mentee genders'),
    ('cv-sections/mentoring.tex',
     r"""        \item {\textbf{Ali Al Zein} (M.S., UM{-}Dearborn; SDI at 365 Retail, USA). Project: serverless cold starts; co{-}authored SlimStart (ICDCS '25).}
        \item {\textbf{Soumya Vaidya} (M.S., UM{-}Dearborn; SDE at Amazon, USA). Project: serverless cold starts; co{-}authored SlimStart (ICDCS~'25).}
        \item {\textbf{Arati Khanolkar} (M.S., UM{-}Dearborn; PD at Epicor, USA). Project: serverless cold starts; co{-}authored SlimStart (ICDCS '25).}
        \item {\textbf{Matthew Alexender} (B.S., UM{-}Dearborn). Project: mining performance{-}related commits; co{-}authored the SC '24 poster.}""",
     r"""        \item {Three M.S. students, UM{-}Dearborn. Project: serverless cold starts; co{-}authored SlimStart (ICDCS~'25).}
        \item {One B.S. student, UM{-}Dearborn. Project: mining performance{-}related commits; co{-}authored the SC~'24 poster.}""",
     'mentee names and current positions'),
    # --- the same facts as the site (your corrections of 2026-10-24) ---
    ('cv-sections/education.tex',
     'Dr. Probir Roy (Chair), Dr. Jinhua Guo, Dr. Junaid Farooq, Dr. Zheng Song',
     'Dr. Probir Roy (Chair), Dr. Zheng Song, Dr. Jinhua Guo, Dr. Junaid Farooq',
     'committee order'),
    ('cv-sections/experience.tex',
     '{Senior Software Engineer} % Job title',
     r'{Senior Software Engineer {\mdseries\color{graytext}(Software Engineer until Oct 2018)}} % Job title',
     'promotion in Oct 2018'),
    ('cv-sections/experience.tex', 'from client Rakuten Inc.', 'from Rakuten Inc.', 'no "client" wording'),
    ('cv-sections/skills.tex', 'transformer{-}based classification, knowledge distillation, dataset', 'transformer{-}based classification, dataset', '"Knowledge distillation" removed'),
]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ttap', default='/users/ssmtariq/TTAP_Package')
    ap.add_argument('--out', default=str(HERE.parent / 'site/public/cv/Syed_Tariq_CV.pdf'))
    args = ap.parse_args()
    ttap, out = pathlib.Path(args.ttap), pathlib.Path(args.out)

    with tempfile.TemporaryDirectory(prefix='web-cv-') as tmp:
        work = pathlib.Path(tmp)
        shutil.copy2(ttap / 'cv.tex', work)
        shutil.copy2(ttap / 'awesome-cv.cls', work)
        shutil.copytree(ttap / 'cv-sections', work / 'cv-sections')
        shutil.copytree(ttap / 'fonts', work / 'fonts')

        for file, old, new, why in EDITS:
            p = work / file
            text = p.read_text(encoding='utf-8')
            n = text.count(old)
            if n != 1:
                sys.exit(f'edit "{why}" in {file}: expected the source text once, found it {n} times; update EDITS in {__file__}')
            p.write_text(text.replace(old, new), encoding='utf-8')
            print(f'  edited {file}: {why}')

        build = subprocess.run(['latexmk', '-xelatex', '-interaction=nonstopmode', '-halt-on-error', 'cv.tex'],
                               cwd=work, capture_output=True, text=True)
        if build.returncode != 0:
            sys.stdout.write(build.stdout[-4000:])
            sys.exit('xelatex failed (log above)')
        pdf = work / 'cv.pdf'

        leaks = leaks_in(pdf)
        if leaks:
            sys.exit('the PDF still contains: ' + '; '.join(leaks))
        pages = re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', str(pdf)], capture_output=True, text=True).stdout)

        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(pdf, out)
        print(f'web CV: {out} ({pages.group(1) if pages else "?"} pages, {out.stat().st_size // 1024} KiB); privacy checks passed')


if __name__ == '__main__':
    main()
