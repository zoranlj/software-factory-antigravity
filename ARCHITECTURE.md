# System Architecture

This document defines the system topology, module boundaries, permitted dependency directions, and valid state transitions for `software-factory-antigravity`.

---

## 1. System Topology

```
┌─────────────────────────── Triggers ───────────────────────────┐
│  Level 3 (Interactive)          │  Level 4 (Headless CI/CD)    │
│  /factory <feature|next|sync>   │  GitHub Issue label          │
│                                 │  `factory-ready` / dispatch  │
└────────────────┬────────────────┴──────────────┬───────────────┘
                 ▼                               ▼
┌────────────────────────────── Orchestrator ────────────────────────────────┐
│  .agents/skills/factory/SKILL.md  +  factory/scripts/headless-run.sh       │
│  Sole author of job.json, git worktrees, PR creation, and KPI emission     │
└───────┬────────────────┬──────────────────────┬────────────────────┬───────┘
        ▼                ▼                      ▼                    ▼
  [spec-writer]      [builder]          [4x reviewers]          [approver]
  spec.md only     code + build.md     review-*.md only       decision.md only
        │                │                      │                    │
        └────────────────┴──────────┬───────────┴────────────────────┘
                                    ▼
                    ┌────────── Outputs ──────────┐
                    │ Level 3: merge / needs-human│
                    │ Level 4: Draft/Ready PR     │
                    │  (awaits human approval)    │
                    └─────────────────────────────┘
```

---

## 2. Module Boundaries & Permitted Dependencies

| Module | Path | Owns | MUST NOT |
|---|---|---|---|
| **Orchestrator** | `.agents/skills/factory/SKILL.md` | `job.json`, git worktrees, branch lifecycle, PR creation, log aggregation | Edit application source code directly |
| **Personas** | `.agents/skills/factory/agents/*.md` | Role-specific markdown artifact (`spec.md`, `build.md`, `review-*.md`, `decision.md`) | Modify `job.json` directly or bypass file contracts |
| **Headless Scripts** | `factory/scripts/*` | Deterministic CI operations: issue validation, DAG resolution, PR body generation, KPI calculation | Hardcode secrets or mutate `main` directly in Level 4 mode |
| **Schemas** | `factory/schemas/*` | Machine-readable JSON schemas (`job.schema.json`) | Depend on runtime job artifacts |
| **Dashboard** | `factory/dashboard.html` | Read-only visualization of `factory/jobs/*/job.json` and `logs/` | Require npm build steps or external CDN dependencies |
| **Templates** | `templates/*` | Starter files copied into consumer repositories by `install.sh` | Contain repo-specific hardcoded paths |

**Dependency Direction Rule:**
- `tests/` → may read all modules and execute `install.sh` and `factory/scripts/*`.
- `.github/workflows/` → may invoke `factory/scripts/*` and `tests/factory-verify.sh`.
- `factory/scripts/*` → may read `factory/schemas/*`, `factory/backlog.md`, and `factory/jobs/*`.
- `factory/dashboard.html` → read-only consumer of `factory/jobs/*`.

---

## 3. Job State Transition Machine

Agents and orchestrators MUST only transition `job.json.stage` along these permitted edges:

```
spec ──► build ──► review ──► approve ──► pr-open ──► merged
           ▲          │          │            │
           │          │          ▼            ▼
           └──────────┘     needs-human ◄─────┘
         (CHANGES &         (BLOCKED, rounds exhausted,
        round <= MAX)       ESCALATE, or CI failure)
```

### Valid Transitions Table

| From | Allowed Next States | Condition |
|---|---|---|
| *(init)* | `spec` | Job directory & worktree created |
| `spec` | `build`, `needs-human` | `spec.md` written (`build`), or invalid/blocked issue (`needs-human`) |
| `build` | `review`, `needs-human` | `build.md` line 1 is `STATUS: READY` (`review`) or `STATUS: BLOCKED` (`needs-human`) |
| `review` | `approve`, `build`, `needs-human` | All 4 `VERDICT: PASS` (`approve`); any `CHANGES` & `round <= MAX_RESUMES` (`build`); exhausted (`needs-human`) |
| `approve` | `pr-open`, `merged`, `needs-human` | `APPROVE` in headless mode (`pr-open`); `APPROVE` in local mode (`merged`); `ESCALATE` (`needs-human`) |
| `pr-open` | `merged`, `build`, `needs-human` | Human approves & merges PR (`merged`), requests rework (`build`), or closes/blocks (`needs-human`) |
| `needs-human` | `build`, `pr-open`, `merged` | Human runs `/factory rework` (`build`) or `/factory approve` (`pr-open` / `merged`) |
| `merged` | *(terminal)* | Worktree removed, branch deleted |

### Level 4 Gate Invariant
In **headless mode** (`mode: "headless"`), the pipeline MUST stop at `pr-open` (or `needs-human`) and **NEVER** self-merge to `main`. Merging requires human review and approval on the Pull Request.
