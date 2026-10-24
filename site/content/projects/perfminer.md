---
title: "PerfMiner"
tagline: "LLM-guided mining of performance-related commits at scale"
layer: software-evolution
status: published
years: { start: 2023, end: 2026 }  # evidence: mentoring began Aug 2023 (02B item 7), SC24 poster, EASE 2026
role: "Co-author (second author); began as the SC24 poster PcMINER."
order: 4
hidden: true # hidden from Research projects at your request (2026-10-24); the paper stays under Publications
publications: [azad-ease26-perfminer, azad-sc24-pcminer]
results:
  - value: "335,103"
    featured: true
    label: "performance-related commits in the released dataset"
    source: { publication: azad-ease26-perfminer, locator: "p.1 abstract; p.8" }
  - value: "~170M"
    label: "commits analyzed across 323,700 repositories"
    source: { publication: azad-ease26-perfminer, locator: "p.1 abstract" }
  - value: "381×"
    featured: true
    label: "faster inference than the 20B-parameter teacher model"
    source: { publication: azad-ease26-perfminer, locator: "p.1 abstract; p.8" }
artifacts:
  - { label: "Replication package and dataset", url: "https://figshare.com/s/48bc6fcc2eb1f94c41d9", kind: dataset }
source: "P-PM pp.1, 6, 8; C0 decision 3; critique row 5 (co-author wording)"
---
The study distills an open-weight LLM's labels into a compact classifier (PerfAnnotator-mini) so
performance-related commits can be found across millions of repositories at practical cost.
