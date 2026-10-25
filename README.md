# Software Factory for Google Antigravity

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Google Antigravity](https://img.shields.io/badge/Platform-Google%20Antigravity-4285F4.svg)](https://deepmind.google)
[![Tests: 37/37 Passing](https://img.shields.io/badge/Tests-37%2F37%20Passing-brightgreen.svg)](tests/factory-verify.sh)

An autonomous, multi-agent development factory running on **Google Antigravity**. Adapted and ported from [Alexander Galea's (ZazenCodes) Software Factory for Claude Code](https://github.com/zazencodes/zazencodes-season-3/tree/main/src/software-factory-claude-code).

Turn any feature prompt, backlog item, or GitHub issue into a production-grade pull request: agents draft a testable specification, implement the feature inside an isolated Git worktree, audit the diff across four parallel review lenses (Security, UX, UI, Code), resolve review feedback autonomously, and either cleanly merge to `main` or escalate to a human.

```
feature / issue → spec-writer → builder → [security, ux, ui, code] → WAIT FOR ALL
                                  ▲                                      │
                                  └──── any CHANGES: resume builder ◄────┤
                                                                         ▼ all PASS
                                            merge to main ◄─ APPROVE ─ approver ─ ESCALATE → needs-human
```

---

## Key Features & Antigravity Adaptations

- **Isolated Git Worktrees**: Every job builds and tests inside `factory/worktrees/<job-id>/` on dedicated `factory/<job-id>` branches without touching the main checkout.
- **7 Specialized Agent Personas**: Mapped to native Antigravity primitives (`view_file`, `write_to_file`, `run_command`, `browser_subagent`).
- **Native Browser Inspection**: Reviewers and builders use `browser_subagent` to visually test responsive UI layouts, animations, and user experience flows on dedicated ports.
- **Zero-Dependency Real-Time Kanban Dashboard**: A self-contained dark-themed HTML/CSS/JS dashboard polling `job.json` every 2 seconds with drag-free Kanban status columns.
- **Live Agent Console Dock**: Real-time streaming terminal dock showing active agent logs (`spec-writer.log`, `builder.log`, `reviewer-*.log`, `combined.log`) with auto-scroll and per-agent tab selection.
- **Token Tracking**: Real-time tracking of prompt, completion, and total tokens globally, on job cards, and with agent breakdown bar charts.
- **Automated Multi-Mode Installer**: Single-command installation globally (`~/.gemini/config/skills/factory`) or into any repository with `./install.sh`.

---

## Claude Code vs. Antigravity Port

| Feature | Claude Code Version | Antigravity Port (`software-factory-antigravity`) |
|---|---|---|
| **Skill Location** | `.claude/skills/factory/` | `.agents/skills/factory/` & global `~/.gemini/config/skills/` |
| **Agent Personas** | `.claude/agents/*.md` | `.agents/skills/factory/agents/*.md` |
| **Tool Calling** | Claude Code bash & file tools | Antigravity tools (`run_command`, `view_file`, `write_to_file`, `browser_subagent`) |
| **UI Testing** | Manual / Headless | Native `browser_subagent` visual navigation and interaction |
| **Ground Truth** | `CLAUDE.md` | `AGENTS.md` |
| **Console & Tokens**| File-based polling | Live Agent Console dock streaming agent logs + real-time token tracking |
| **Installer** | Manual copying | `./install.sh` supporting `--global`, `--target <repo>`, and interactive modes |

---

## Directory Structure

```
software-factory-antigravity/
├── README.md                      # Documentation & user guide
├── LICENSE                        # MIT License
├── .gitignore                     # Ignores runtime jobs, worktrees, scratch files
├── install.sh                     # Automated multi-mode installer
├── .agents/                       # Antigravity native skill structure
│   └── skills/
│       └── factory/
│           ├── SKILL.md           # The Factory orchestrator
│           └── agents/            # 7 specialized persona prompts
│               ├── spec-writer.md
│               ├── builder.md
│               ├── reviewer-code.md
│               ├── reviewer-security.md
│               ├── reviewer-ui.md
│               ├── reviewer-ux.md
│               └── approver.md
├── factory/                       # Visual dashboard & runtime scaffolding
│   ├── dashboard.html             # Standalone Kanban board, Live Console & Token Tracker
│   ├── backlog.md                 # Queue for /factory next
│   └── jobs/                      # Runtime job state (gitignored)
├── templates/
│   └── AGENTS.md                  # Ground truth template for consumer repositories
└── tests/
    └── factory-verify.sh          # End-to-end verification test suite (37/37 passing)
```

---

## Quickstart & Installation

### Option 1: Global Installation
Install the `/factory` skill globally to use in any project across Antigravity:

```bash
git clone https://github.com/<your-username>/software-factory-antigravity.git
cd software-factory-antigravity
./install.sh --global
```

### Option 2: Install into a Target Repository
Install the workspace skill, dashboard, and scaffolding into an existing project:

```bash
./install.sh --target /path/to/my-project
```

### Option 3: Interactive Guided Setup
Run without arguments to choose interactively:

```bash
./install.sh
```

---

## The 7 Specialized Agent Personas

All personas communicate through explicit file contracts in `factory/jobs/<job-id>/`:

1. **`spec-writer`**: Formulates `spec.md` with numbered context, requirements, testable acceptance criteria, and assumptions.
2. **`builder`**: Implements the feature in an isolated Git worktree, runs project tests/linters from `AGENTS.md`, conducts visual checks via `browser_subagent`, commits on `factory/<job-id>`, and outputs `build.md` with `STATUS: READY` or `STATUS: BLOCKED`.
3. **`reviewer-security`**: Audits diffs for secret leakage, OWASP vulnerabilities, permissions, and input sanitization (`review-security.md`).
4. **`reviewer-code`**: Evaluates maintainability, project idioms, cyclomatic complexity, and test coverage (`review-code.md`).
5. **`reviewer-ui`**: Audits visual styling, responsiveness (desktop and mobile), design tokens, and CSS conventions (`review-ui.md`).
6. **`reviewer-ux`**: Audits loading, empty, and error states, form validation, accessible labels, and user feedback (`review-ux.md`).
7. **`approver`**: Evaluates criteria evidence against git diffs and review verdicts to issue an `APPROVE` or `ESCALATE` decision.

---

## Available Commands

In Antigravity chat, use the `/factory` slash command:

- **`/factory <feature>`**: Run a feature or bug fix autonomously through the spec → build → multi-lens review → approve pipeline.
- **`/factory next`**: Claim and execute the first unchecked item (`- [ ]`) from `factory/backlog.md`.
- **`/factory sync-issues [label]`**: Query open GitHub issues using `gh` CLI and populate `factory/backlog.md`.
- **`/factory approve <job-id>`**: Merge a job that paused at `needs-human` into `main`.
- **`/factory rework <job-id> <note>`**: Provide feedback to the builder and restart the review cycle.

---

## Visual Dashboard & Live Agent Console

Start the visual board from your project repository:

```bash
cd factory && python3 -m http.server 8000
```

Open **`http://localhost:8000/dashboard.html`** in your browser.

- **Real-Time Kanban**: Drag-free visual columns for `Spec`, `Build`, `Review`, `Needs Human`, and `Merged`.
- **Live Agent Console Dock**: Real-time terminal streaming logs directly from active agents (`spec-writer.log`, `builder.log`, `reviewer-*.log`).
- **Token Counter**: Header statistics showing total prompt and completion tokens, card-level pill tags, and drawer agent breakdown charts.
- **Interactive File Drawer**: Click any card or file pill to inspect `spec.md`, `build.md`, review rounds, and `decision.md`.

---

## Verification Suite

To verify that the factory skill, dashboard, schemas, and worktree lifecycles comply with all contracts:

```bash
./tests/factory-verify.sh
```

---

## Credits & Attribution

This project is an adaptation of the [Software Factory for Claude Code](https://github.com/zazencodes/zazencodes-season-3) 
originally created by **Alexander Galea ([ZazenCodes](https://youtube.com/@zazencodes))**.

- Original architecture and concept: Alexander Galea (ZazenCodes)
- Ported, restructured, and optimized for **Google Antigravity** by **Zoran Ljubinković** ([@zoranlj](https://github.com/zoranlj)).
- Licensed under the [MIT License](LICENSE) in compliance with upstream terms.
