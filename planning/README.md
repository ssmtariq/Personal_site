# Planning: analysis, plan, design log, launch

Until 2026-10-24 this folder was `_redesign/` in the public repository, and the site was `_redesign/spike/`. It now lives here, and the site is `../site/`. The older documents (01 to 06) still say `spike/`; read it as `site/`.

## Read in this order

| File | What it answers |
| --- | --- |
| `08_Launch_Guide.md` | **Start here to launch:** the private and public repositories, testing at `/v2/`, going live, rollback, everyday updates |
| `07_Design_Feedback_Log.md` | Every piece of your design feedback, what changed, your answers, and the open items |
| `09_Open_Source_Stack.md` | Every tool and its license and popularity; the proprietary pieces and why they stay or go |
| `04_Site_Plan.md` | The plan: goals, copy, design system, features, architecture, rollout, visitor stats, weaknesses, phases, decisions (Section 19) |
| `05_Data_Input_Spec.md` | The data format, all rules, and copy-paste recipes for adding new items |
| `06_Verification_and_Readiness.md` | What was verified and how, and the scorecard against the reference and peer sites |
| `01_Reference_Site_Analysis.md` | Every feature and defect of the reference site |
| `02_Peer_Sites_and_Winning_Strategy.md` | The six peer sites, what they show, and the winning move for each |
| `03_Alternatives_Research.md` | Build options, analytics options, sources, pinned versions |

## Folders

| Folder | Contents |
| --- | --- |
| `evidence/` | Screenshots and crops behind every claim. `evidence/sample/` holds the current design: full pages (light, dark, phone) and the interaction sheets |
| `tools/` | Capture, fact-check, negative-test, figure-cropping, and screenshot scripts |

## Re-running the checks

```bash
# fact checks (read your TTAP_Package sources; never write to them), from the repository root
python3 planning/tools/factcheck.py /users/ssmtariq/TTAP_Package .
python3 planning/tools/locator_check.py /users/ssmtariq/TTAP_Package .

# screenshots and behaviour checks of a build (Playwright); writes PNGs and checks.json
python3 planning/tools/shoot_sample.py site/dist /tmp/site-shots
```
