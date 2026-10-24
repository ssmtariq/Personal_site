"""Apply one mutation at a time to the spike content, run `astro sync`, report whether it was rejected."""
import pathlib, shutil, subprocess, sys, os
root = pathlib.Path(sys.argv[1]); node_bin = sys.argv[2]
env = dict(os.environ, PATH=node_bin + os.pathsep + os.environ['PATH'])
cases = [
  ("earlier paper marked selected", "content/publications.yaml", "  category: earlier\n  role: co-author\n  doi: \"10.1109/ECACE", "  category: earlier\n  selected: true\n  role: co-author\n  doi: \"10.1109/ECACE"),
  ("misspelled co-author id", "content/publications.yaml", "    - { person: bosu-amiangshu }", "    - { person: bosu-amiangsu }"),
  ("news kind typo", "content/news.yaml", "  kind: milestone\n  headline: \"Passed", "  kind: milestone-x\n  headline: \"Passed"),
  ("evaluation enrolled disagrees with class size", "content/teaching.yaml", "    enrolled: 15", "    enrolled: 17"),
  ("free-text date", "content/news.yaml", "  date: \"2026-03-10\"", "  date: \"March 10, 2026\""),
  ("manuscript given a venue", "content/publications.yaml", "  target_venue: \"The ACM Web Conference (WWW 2027)\"", "  target_venue: \"The ACM Web Conference (WWW 2027)\"\n  venue: icdcs-2025"),
  ("talk not given by me", "content/talks.yaml", "  presented_by_me: true\n  publication: tariq-saner26-cold-start", "  presented_by_me: false\n  publication: tariq-saner26-cold-start"),
  ("result number without a source", "content/projects/microprof.md", "    source: { publication: tariq-taco23-microprof, locator: \"p.14, Table 1\" }\n", ""),
]
for name, rel, old, new in cases:
    f = root / rel; orig = f.read_text()
    assert old in orig, f"pattern not found for case: {name}"
    f.write_text(orig.replace(old, new, 1))
    shutil.rmtree(root / '.astro' / 'data-store.json', ignore_errors=True)
    r = subprocess.run(['npx', 'astro', 'sync'], cwd=root, env=env, capture_output=True, text=True)
    f.write_text(orig)
    out = (r.stdout + r.stderr)
    msg = next((l.strip() for l in out.splitlines() if any(k in l for k in ('**', 'Error', 'error', 'Invalid', 'does not exist'))), out.strip().splitlines()[-1] if out.strip() else '')
    print(f"{'REJECTED' if r.returncode else 'ACCEPTED(!)'} | {name} | {msg[:230]}")
