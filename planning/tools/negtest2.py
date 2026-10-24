"""Mutations the integrity checker (not the schemas) must reject."""
import pathlib, subprocess, sys, os
root = pathlib.Path(sys.argv[1]); env = dict(os.environ, PATH=sys.argv[2] + os.pathsep + os.environ['PATH'])
cases = [
  ("misspelled co-author id", "content/publications.yaml", "    - { person: bosu-amiangshu }", "    - { person: bosu-amiangsu }"),
  ("first-author role but listed second", "content/publications.yaml", "    - { person: tariq }\n    - { person: menard-lance }", "    - { person: menard-lance }\n    - { person: tariq }"),
  ("news features a 2014 paper", "content/news.yaml", "refs: { publication: tariq-taco23-microprof }\n  source: \"P-MP p.1\"", "refs: { publication: bashir-icece14-complexity }\n  source: \"P-MP p.1\""),
  ("AI-powered in identity sentence", "content/profile.yaml", "I build developer-facing analysis tools", "I build AI-powered analysis tools"),
  ("[VERIFY] leaks into a shown field", "content/mentoring.yaml", "current_position: \"SDE at Amazon, USA\"", "current_position: \"SDE at Amazon, USA [VERIFY]\""),
  ("venue rank leaks into a contribution", "content/publications.yaml", "co-developed the SCABENCH benchmark.\"", "co-developed the SCABENCH benchmark (Rank: A).\""),
  ("numbers on an in-preparation project", "content/projects/perffinder.md", "Results will appear here after submission.", "It reaches +843% throughput on Nginx."),
  ("duplicate news id", "content/news.yaml", "- id: 2025-osdi-aec", "- id: 2025-best-poster"),
  ("missing image() file", "content/profile.yaml", "../src/assets/people/tariq-headshot.jpg", "../src/assets/people/missing-headshot.jpg"),
  ("future-dated news", "content/news.yaml", "  date: \"2026-01-29\"", "  date: \"2026-12-29\""),
]
for name, rel, old, new in cases:
    f = root / rel; orig = f.read_text()
    assert old in orig, f"pattern not found: {name}"
    f.write_text(orig.replace(old, new, 1))
    r = subprocess.run(['node', 'scripts/check-content.mjs', '--no-assets', '--today', '2026-10-24'], cwd=root, env=env, capture_output=True, text=True)
    f.write_text(orig)
    first = next((l for l in r.stdout.splitlines() if l.startswith('ERROR')), '(no error line)')
    print(f"{'REJECTED' if r.returncode else 'ACCEPTED(!)'} | {name} | {first[9:200]}")
