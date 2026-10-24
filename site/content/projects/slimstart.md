---
title: "SlimStart"
tagline: "Profile-guided optimization of library loading in serverless cold starts"
layer: system-stack
status: published
years: { start: 2023, end: 2025 }  # evidence: mentoring began Jan 2023 (02B item 7), ICDCS 2025
role: "Co-first author (equal contribution). Developed the profile-guided optimizer; co-advised the three M.S. co-authors."
order: 2
publications: [tariq-icdcs25-slimstart]
results:
  - value: "2.30×"
    featured: true
    label: "faster initialization (best case)"
    source: { publication: tariq-icdcs25-slimstart, locator: "p.1 abstract; p.8 Table II" }
  - value: "2.26×"
    label: "improvement in end-to-end latency (best case)"
    source: { publication: tariq-icdcs25-slimstart, locator: "p.1 abstract" }
  - value: "1.51×"
    label: "lower memory use (best case)"
    source: { publication: tariq-icdcs25-slimstart, locator: "p.1 abstract" }
  - value: "17 of 22"
    featured: true
    label: "analyzed applications load library modules they do not need"
    source: { publication: tariq-icdcs25-slimstart, locator: "pp.2-3; p.8" }
source: "P-SS pp.1-3, 8; C0 decision 5; 02B item 7"
---
Static analysis prunes libraries that can never run, but misses libraries that are reachable yet rarely
used under real workloads. SlimStart samples call paths at run time, attributes import cost to the
import chain responsible, and defers rarely used imports, re-profiling as workloads shift.
