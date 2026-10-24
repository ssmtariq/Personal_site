---
title: "Cold-start anti-patterns, SCABENCH, and INITSCOPE"
tagline: "An empirical study of how developers create, find, and fix serverless cold-start problems"
layer: software-lifecycle
status: published
years: { start: 2026 }  # evidence: SANER 2026 paper and talk
role: "First author. Investigated developer-visible cold-start anti-patterns, co-developed the SCABENCH benchmark, and presented the paper at SANER 2026."
order: 1
publications: [tariq-saner26-cold-start]
results:
  - value: "81"
    featured: true
    label: "adjudicated issues from 35 repositories"
    source: { publication: tariq-saner26-cold-start, locator: "pp.3-4" }
  - value: "6 · 6 · 5"
    label: "anti-patterns, refactoring strategies, and localization challenges"
    source: { publication: tariq-saner26-cold-start, locator: "p.4" }
  - value: "64%"
    featured: true
    label: "less diagnostic effort with INITSCOPE than prior tools"
    source: { publication: tariq-saner26-cold-start, locator: "p.1 abstract" }
  - value: "up to 40%"
    label: "better localization accuracy than prior tools"
    source: { publication: tariq-saner26-cold-start, locator: "p.1 abstract" }
artifacts:
  - { label: "SCABENCH and INITSCOPE", url: "https://doi.org/10.5281/zenodo.17375894", doi: "10.5281/zenodo.17375894", kind: benchmark }
source: "P-CS pp.1-4, 9; CV final (Projects); 02B items 6 and 9(a)"
---
Cold starts are usually treated as a black-box tuning target. This study treats them as a design
problem developers can see: it mines and adjudicates real issue reports, codes them into taxonomies,
and turns the findings into a reproducible benchmark and a lightweight diagnostic framework.
