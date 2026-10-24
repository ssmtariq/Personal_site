---
title: "MicroProf"
tagline: "Code-level attribution of unnecessary data transfer between microservices"
layer: distributed-services
status: published
years: { start: 2023, end: 2024 }  # evidence: TACO paper (2023), HiPEAC talk (2024)
role: "First author. Developed the tool and presented it at HiPEAC 2024."
order: 3
publications: [tariq-taco23-microprof]
results:
  - value: "4.59×"
    featured: true
    label: "speedup after MicroProf-guided API fixes (best case)"
    source: { publication: tariq-taco23-microprof, locator: "p.14, Table 1" }
  - value: "87.5%"
    featured: true
    label: "fewer fields in REST API responses (best case)"
    source: { publication: tariq-taco23-microprof, locator: "p.1 abstract; p.20" }
  - value: "5"
    label: "inefficient remote invocations found in 4 applications"
    source: { publication: tariq-taco23-microprof, locator: "p.1 abstract" }
artifacts:
  - { label: "Replication package", url: "https://figshare.com/s/5156839e442f03d97747", kind: replication-package }
source: "P-MP pp.1, 14, 20; CV final (Projects); research notes 2.1"
---
Microservices exchange remote objects whose fields callers often never read. MicroProf combines Jaeger
tracing (to find choke points on the critical path) with remote-object sampling and hardware debug
registers (to see which fields are actually used), then attributes the waste to source code.
