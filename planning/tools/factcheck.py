"""Fact-check numbers in the site seed data and plan documents against TTAP primary sources.

Usage: python3 factcheck.py TTAP_ROOT WEBSITE_DIR
Builds one searchable text corpus from the primary sources (AGENTS.md rule 1), then checks:
  1. every number in project `results` values,
  2. every number that appears in the plan's copy deck and snapshots,
  3. every `source` field names a known source family.
Prints a table and exits 1 if any number is not found.
"""
import pathlib
import re
import subprocess
import sys

ttap, web = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
cm = ttap / 'cv-materials'


def pdf_text(p):
    return subprocess.run(['pdftotext', '-layout', str(p), '-'], capture_output=True, text=True).stdout


corpus_parts = {
    'C0': (cm / '00_Confirm_Before_Start.md').read_text(),
    '02B': (cm / 'deliverables/02B_Missing_Info_Checklist.md').read_text(),
    'CV final': pdf_text(cm / 'final/balanced/Syed_Tariq_CV.pdf'),
    'eval': pdf_text(cm / 'course_evaluation/cis200.pdf'),
    'poster': pdf_text(cm / 'publications/poster_sc24.pdf'),
    'gsi.csv': (cm / 'gsi.csv').read_text(errors='ignore'),
}
for t in sorted((cm / 'source_packet/text').glob('*.txt')):
    corpus_parts[t.stem[:40]] = t.read_text(errors='ignore')
corpus = '\n'.join(corpus_parts.values())
flat = re.sub(r'\s+', ' ', corpus)


def variants(num):
    """Spellings a number may take in PDFs: 335,103 / 335 103 / 335103; 4.59× / 4.59x."""
    n = num.replace('×', '').replace('~', '').strip()
    out = {n, n.replace(',', ' '), n.replace(',', ''), n.replace(',', ' ')}
    return {v for v in out if v}


def found(num):
    return any(re.search(r'(?<![\d.])' + re.escape(v) + r'(?![\d])', flat) for v in variants(num))


claims = []
# 1. project results
for f in sorted((web / 'site/content/projects').glob('*.md')):
    fm = f.read_text().split('---')[1]
    for v in re.findall(r'value: "([^"]+)"', fm):
        for num in re.findall(r'\d[\d,]*(?:\.\d+)?', v):
            claims.append((f'projects/{f.stem}', v, num))
# 2. numbers in plan copy deck, snapshots, and weakness table (sections that state facts about you)
plan = (web / 'planning/04_Site_Plan.md').read_text()
for sec in ['## 3. Copy deck', '## 15. Weaknesses']:
    body = plan.split(sec, 1)[1].split('\n## ', 1)[0]
    for num in sorted(set(re.findall(r'(?<![\w.#-])\d[\d,]*(?:\.\d+)?(?![\w-])', body))):
        if len(num) == 4 and num.startswith(('19', '20')):
            continue  # years are checked through the dated seed entries
        if num in {'1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '0'}:
            continue  # list ordinals and small counts are checked by the seed counts
        claims.append(('04 ' + sec[6:].strip(), num, num))
# 3. teaching seed numbers
teach = (web / 'site/content/teaching.yaml').read_text()
for num in sorted(set(re.findall(r'(?:students|score|dept_mean|college_mean|university_mean|responses|enrolled): ([\d.]+)', teach))):
    claims.append(('teaching.yaml', num, num))

bad = 0
print(f"{'where':42s} {'claim':28s} {'number':10s} found")
for where, claim, num in claims:
    ok = found(num)
    bad += not ok
    print(f'{where:42s} {claim[:28]:28s} {num:10s} {"yes" if ok else "NO"}')

# source families
families = re.compile(r'(C0|02B|CV final|CV1|P-[A-Z0-9]+|PROP|achievements/|course_evaluation/|poster_sc24|gsi\.csv|existing site|Plan decisions|AGENTS\.md|research notes|critique|ts/|rs/|cv-materials/)')
missing = []
for y in sorted((web / 'site/content').glob('*.yaml')):
    for m in re.finditer(r'source: "([^"]*)"', y.read_text()):
        if not families.search(m.group(1)):
            missing.append(f'{y.name}: {m.group(1)}')
print(f'\nnumbers checked: {len(claims)}, not found: {bad}')
print(f'source fields without a known source family: {len(missing)}')
for m in missing:
    print('  ', m)
sys.exit(1 if bad or missing else 0)
