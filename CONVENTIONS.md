# Engineering Conventions & Contracts

This document defines standards and machine-readable contracts that static linters cannot automatically enforce.

---

## 1. Persona File Contracts (Strict Line-1 Headers)

The orchestrator and headless CI scripts parse line 1 of persona artifacts deterministically. Every persona MUST adhere to these exact prefixes:

| Artifact | Required Line 1 | Allowed Values |
|---|---|---|
| `build.md` | `STATUS: <VALUE>` | `STATUS: READY`, `STATUS: BLOCKED` |
| `round-<N>/review-*.md` | `VERDICT: <VALUE>` | `VERDICT: PASS`, `VERDICT: CHANGES` |
| `decision.md` | `<VALUE>` | `APPROVE`, `ESCALATE` |

Never wrap line 1 in markdown code fences, headings, or leading blank lines.

---

## 2. Structured Logging Format

All agent logs written to `factory/jobs/<job-id>/logs/<agent>.log` and `combined.log` MUST use the format:

```text
[HH:MM:SS] [<agent-name>] <concise message>
```

Example:
```text
[16:00:00] [builder] Running validation suite: ./tests/factory-verify.sh
[16:00:05] [builder] STATUS: READY
```

---

## 3. Headless Execution & Error Handling

1. **Deterministic Exit Codes**: All scripts in `factory/scripts/` MUST use `set -euo pipefail` (Bash) or explicit `process.exit(code)` (Node.js):
   - `0`: Success / valid / ready to dispatch
   - `1`: Validation or runtime error
   - `2`: Blocked by unresolved `Depends-On` dependency (not an error; skip dispatch)
2. **No Interactive Prompts in CI**: Any script invoked in `.github/workflows/` MUST accept arguments via flags or environment variables and never call `read -p`.
3. **Zero External Dependencies**: Core scripts in `factory/scripts/` and `tests/` MUST run using only standard POSIX/Bash tools, `git`, `node` built-ins, and `gh` CLI—no `npm install` required.
4. **Scoped Commits**: Never use `git add -A` or `git add .`. Stage explicit file paths only.

---

## 4. Issue & Backlog Format (Level 4 SRI Standard)

Issues eligible for headless execution MUST satisfy the Outcome-Oriented Single-Responsibility Issue (SRI) contract:
- **Scope**: 1–3 files / verifiable in a single CI run.
- **Required Sections**: `## Context`, `## Acceptance Criteria` (checklist or Gherkin), and `## Out of Scope`.
- **Dependency Metadata**: Cross-issue or cross-repo blockers MUST be declared on their own line as:
  ```text
  Depends-On: #42
  Depends-On: org/repo#108
  ```
- **Backlog Queue Format** (`factory/backlog.md`):
  ```markdown
  - [ ] Issue #42: Short title (Depends-On: #41)
  ```

---

## 5. Level 4 PR Evidence Standard

Every Pull Request opened by a headless pipeline run MUST include:
- Linked issue (`Closes #<issue_number>`)
- Summary of `spec.md` and `build.md`
- Review verdict matrix (Security, UX, UI, Code)
- `decision.md` rationale
- Token usage & round count metadata
- Explicit notice that human approval is required before merge
