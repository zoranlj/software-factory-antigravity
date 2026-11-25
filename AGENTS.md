# Repository Ground Truth & Instructions for Agents

This document is the authoritative ground truth for all AI agents, subagents, and headless pipeline runs operating on `software-factory-antigravity`.

Read these companion machine-readable contracts before making changes:
- [ARCHITECTURE.md](ARCHITECTURE.md) — System topology, module boundaries, and allowed job state transitions.
- [CONVENTIONS.md](CONVENTIONS.md) — File contracts, logging formats, error handling, and git hygiene.
- [TESTING_HARNESS.md](TESTING_HARNESS.md) — Headless test execution, fixture seeding, and CI verification.
- [factory/schemas/job.schema.json](factory/schemas/job.schema.json) — Machine-readable schema for `job.json`.

---

## 1. Project Overview

**Software Factory for Google Antigravity** is a multi-agent development orchestration framework that supports both interactive local runs (Level 3) and headless CI/CD pipeline runs (Level 4).

- **Orchestrator & Personas:** Markdown skill & persona contracts in `.agents/skills/factory/`.
- **Headless Pipeline & CLI Scripts:** Portable POSIX/Bash + Node.js scripts in `factory/scripts/` and GitHub Actions workflows in `.github/workflows/`.
- **Visual Dashboard:** Zero-dependency static HTML/CSS/JS Kanban & console viewer in `factory/dashboard.html`.
- **Consumer Templates:** Reusable repo-seeding templates in `templates/` installed via `./install.sh`.
- **Testing:** End-to-end shell/Node verification suite in `tests/factory-verify.sh`.

---

## 2. Fresh Checkout Setup

No build step or third-party `npm install` is required for the core factory repository. Required runtime tools:
- `bash` (4+ or macOS `/usr/bin/env bash`)
- `git` (with `git worktree` support)
- `node` (v18+ for JSON schema, DAG, and KPI scripts)
- `python3` (for serving `factory/dashboard.html` locally)
- `gh` CLI (required for GitHub issue sync and headless PR automation)

---

## 3. Dev Server Commands

Start the static dashboard on a dynamic port assigned by the factory runner:

```bash
python3 -m http.server <port> --directory factory
```

Dashboard URL: `http://localhost:<port>/dashboard.html`

---

## 4. Validation Commands

All changes MUST pass before a build or review round is marked `STATUS: READY`:

- **End-to-End Verification Suite:**
  ```bash
  ./tests/factory-verify.sh
  ```
- **Shell Syntax Check (for modified `.sh` files):**
  ```bash
  bash -n install.sh tests/factory-verify.sh factory/scripts/*.sh
  ```
- **Node Script Check (for modified `.mjs`/`.js` files):**
  ```bash
  node --check factory/scripts/*.mjs
  ```

---

## 5. Directory Structure

```
software-factory-antigravity/
├── AGENTS.md                       # Root ground truth (this file)
├── ARCHITECTURE.md                 # System topology & state transition machine
├── CONVENTIONS.md                  # File contracts & engineering standards
├── TESTING_HARNESS.md              # Headless verification & fixture guide
├── install.sh                      # Multi-mode installer (global, target repo, Level 4 scaffolding)
├── .agents/skills/factory/         # Orchestrator SKILL.md & 7 specialized personas
├── .github/
│   ├── ISSUE_TEMPLATE/             # Level 4 Outcome-Oriented SRI issue forms
│   └── workflows/                  # Headless CI verification & factory pipeline workflows
├── factory/
│   ├── backlog.md                  # Queue with Depends-On DAG metadata
│   ├── dashboard.html              # Zero-dependency Kanban & Live Agent Console
│   ├── schemas/job.schema.json     # Formal JSON Schema for runtime job state
│   ├── scripts/                    # Headless runner helpers (DAG check, PR builder, KPI reporter)
│   └── jobs/                       # Runtime job state (gitignored)
├── templates/                      # Consumer repository templates (AGENTS, ARCHITECTURE, CONVENTIONS, TESTING_HARNESS)
└── tests/
    └── factory-verify.sh           # Full contract & Level 4 verification suite
```
