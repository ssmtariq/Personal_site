"""Page-level check: does each project result's number appear on the page(s) its locator cites?
Usage: python3 locator_check.py TTAP_ROOT WEBSITE_DIR"""
import pathlib, re, sys
ttap, web = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
txt = ttap / 'cv-materials/source_packet/text'
paper = {'tariq-taco23-microprof': 'MicroProf', 'tariq-icdcs25-slimstart': 'Efficient_Serverless', 'tariq-saner26-cold-start': 'Cold-Start', 'azad-ease26-perfminer': 'LLM-Guided'}
pages = {pid: next(txt.glob(pre + '*.txt')).read_text(errors='ignore').split('\f') for pid, pre in paper.items()}
bad = 0
for f in sorted((web / 'site/content/projects').glob('*.md')):
    fm = f.read_text().split('---')[1]
    for value, pub, loc in re.findall(r'value: "([^"]+)"\n\s+label: "[^"]*"\n\s+source: \{ publication: ([\w-]+), locator: "([^"]+)" \}', fm):
        nums = [n for n in re.findall(r'\d[\d,]*(?:\.\d+)?', value) if not (len(n) == 1)]
        cited = set()
        for a, b in re.findall(r'pp?\.(\d+)(?:-(\d+))?', loc):
            cited.update(range(int(a), int(b or a) + 1))
        hits = []
        for n in nums:
            pats = {n, n.replace(',', ' '), n.replace(',', '')}
            on = [p for p in sorted(cited) if any(re.search(r'(?<![\d.])' + re.escape(v) + r'(?!\d)', re.sub(r'\s+', ' ', pages[pub][p - 1])) for v in pats)]
            hits.append((n, on))
        ok = all(on for _, on in hits) if hits else True
        bad += not ok
        print(f"{f.stem:18s} {value:10s} cites {loc:28s} -> " + ('; '.join(f'{n} on p.{on}' if on else f'{n} NOT on cited pages' for n, on in hits) or 'small counts (checked by reading)'))
print(f'\nresults with numbers missing from their cited page: {bad}')
sys.exit(1 if bad else 0)
