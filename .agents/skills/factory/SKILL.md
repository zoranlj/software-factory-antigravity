---
name: factory
description: Run the Software Factory in Google Antigravity. Use when the user types /factory <feature>, /factory next, /factory sync-issues, /factory approve <job-id>, or /factory rework <job-id> <note>. Orchestrates the spec -> build -> review (security, ux, ui, code) -> approve loop in an isolated git worktree with live dashboard updates.
---

# Software Factory for Google Antigravity

You are the factory orchestrator for a job. You run the loop below, execute each agent role per its contract, and are the sole author of your job's `job.json`. You never mix role responsibilities: each role produces its specific markdown file, while you manage state transitions, worktrees, and git branches.

## The Loop

```
feature / issue → spec-writer → builder → [security, ux, ui, code] → WAIT FOR ALL
                                  ▲                                      │
                                  └──── any CHANGES: resume builder ◄────┤
                                                                         ▼ all PASS
                                            merge to main ◄─ APPROVE ─ approver ─ ESCALATE → needs-human
```

| Step | Persona | Output File |
|---|---|---|
| `spec` | `spec-writer` | `factory/jobs/<job-id>/spec.md` |
| `build` | `builder` | `factory/jobs/<job-id>/build.md` + commits on `factory/<job-id>` |
| `review` | `reviewer-security` | `factory/jobs/<job-id>/round-N/review-security.md` |
| | `reviewer-ux` | `factory/jobs/<job-id>/round-N/review-ux.md` |
| | `reviewer-ui` | `factory/jobs/<job-id>/round-N/review-ui.md` |
| | `reviewer-code` | `factory/jobs/<job-id>/round-N/review-code.md` |
| `approve` | `approver` | `factory/jobs/<job-id>/decision.md` |

`MAX_RESUMES = 2`: After round 1, the builder can be resumed at most twice for feedback, resulting in at most 3 review rounds.

---

## Workspace & Worktree Layout

Every job executes in its own isolated Git worktree:
- **Main repo:** `<repo>` (`git rev-parse --show-toplevel`)
- **Worktree path:** `<repo>/factory/worktrees/<job-id>/` (or `../<repo-name>-factory/<job-id>/`), on branch `factory/<job-id>`
- **Job state:** `<repo>/factory/jobs/<job-id>/` (persists in the main checkout, gitignored)


```
<repo>/
├── AGENTS.md                                  # Repo instructions (dev server, ports, tests, build)
├── factory/
│   ├── backlog.md                             # Queue for /factory next
│   ├── dashboard.html                         # Real-time visual Kanban board & Live Agent Console
│   └── jobs/<job-id>/
│       ├── job.json                           # Real-time state & token metrics read by dashboard
│       ├── logs/                              # Real-time streaming output from active agents
│       │   ├── <agent>.log                    # Output per agent (spec-writer, builder, reviewers, approver)
│       │   └── combined.log                   # Aggregated chronological stream
│       ├── spec.md                            # Produced by spec-writer
│       ├── build.md                           # Produced by builder
│       ├── round-<N>/
│       │   ├── review-security.md
│       │   ├── review-ux.md
│       │   ├── review-ui.md
│       │   └── review-code.md
│       ├── rework-<k>.md                      # (If rework requested)
│       └── decision.md                        # Produced by approver
```

### Structure of `job.json`

```json
{
  "id": "001-reading-time",
  "feature": "Display estimated blog reading time",
  "branch": "factory/001-reading-time",
  "worktree": "/Users/you/code/my-app-factory/001-reading-time",
  "stage": "review",
  "round": 1,
  "issue_number": 42,
  "active_agents": [
    { "name": "reviewer-security", "status": "running" },
    { "name": "reviewer-code", "status": "running" }
  ],
  "reviews": {
    "security": "PASS",
    "ux": "PASS",
    "ui": "CHANGES",
    "code": "PASS"
  },
  "tokens": {
    "prompt": 53200,
    "completion": 8940,
    "total": 62140,
    "by_agent": {
      "spec-writer": { "prompt": 12420, "completion": 1840, "total": 14260, "model": "gemini-3.8-flash" },
      "builder": { "prompt": 24150, "completion": 3920, "total": 28070, "model": "gemini-3.8-flash" },
      "reviewer-security": { "prompt": 4120, "completion": 650, "total": 4770, "model": "gemini-3.8-flash" }
    }
  }
}
```

- `stage`: `spec`, `build`, `review`, `approve`, `merged`, `needs-human`.
- `active_agents`: Array of agents currently executing; lights up live console indicators and tabs.
- `reviews`: Updated immediately as each review completes (`pending`, `PASS`, `CHANGES`).
- `tokens`: Prompt, completion, and total tokens tracked globally and per agent.


---

## Commands

### 1. `/factory <feature>`

1. **Job Creation**:
   - Locate highest existing 3-digit number in `<repo>/factory/jobs/` (`001` if empty).
   - Generate ID: `<num>-<slug>` (e.g. `001-reading-time`).
   - If feature starts with `Issue #<num>`, record `"issue_number": <num>` in `job.json`.
   - Worktree path: `<repo>/factory/worktrees/<job-id>` (ensure `mkdir -p factory/worktrees`).
   - Create directory `factory/jobs/<job-id>/` and `factory/jobs/<job-id>/logs/`.
   - Write initial `job.json` with `stage: "spec"`, `round: 0`, all reviews `pending`, `active_agents: [{"name": "spec-writer", "status": "running"}]`, and initial `tokens` object.

2. **Worktree Provisioning**:
   ```bash
   git worktree add -b factory/<job-id> <worktree> main
   ```
   Execute the fresh checkout setup command specified in `AGENTS.md` (e.g. `npm install`) inside `<worktree>`.

3. **Step 1: Spec**:
   - Update `job.json`: `active_agents: [{"name": "spec-writer", "status": "running"}]`.
   - Read persona instructions from `agents/spec-writer.md`.
   - Stream timestamped actions/progress to `factory/jobs/<job-id>/logs/spec-writer.log` and `factory/jobs/<job-id>/logs/combined.log`.
   - If `issue_number` is present, run `gh issue view <issue_number> --json title,body,comments`.
   - Adopt the `spec-writer` persona, explore codebase in `<worktree>`, and write `factory/jobs/<job-id>/spec.md`.
   - Record token usage in `job.json` under `tokens.by_agent["spec-writer"]`.
   - Confirm `spec.md` exists and contains acceptance criteria.

4. **Step 2: Build**:
   - Update `job.json`: `stage: "build"`, `active_agents: [{"name": "builder", "status": "running"}]`.
   - Allocate dev server port: `5100 + 10 * num` (e.g. for `001` -> 5110).
   - Read persona instructions from `agents/builder.md`.
   - Stream actions, test output, and commits to `factory/jobs/<job-id>/logs/builder.log` and `combined.log`.
   - Adopt `builder` persona in `<worktree>`, write code, run validation tests from `AGENTS.md`, test visually with `browser_subagent`, commit on `factory/<job-id>`, and write `factory/jobs/<job-id>/build.md`.
   - Record token usage under `tokens.by_agent["builder"]`.
   - Proceed to **Build Check**.

#### Build Check
Read first line of `build.md`:
- `STATUS: READY`: Proceed to **Review Round N** (N = 1).
- `STATUS: BLOCKED`: Update `job.json` to `stage: "needs-human"`, clear `active_agents`. Notify user with reason.

#### Review Round N
1. Update `job.json`: `stage: "review"`, `round: N`, all reviews `pending`, `active_agents: [{"name": "reviewer-security"}, {"name": "reviewer-code"}, {"name": "reviewer-ui"}, {"name": "reviewer-ux"}]`.
2. Create directory `factory/jobs/<job-id>/round-<N>/`.
3. Run the 4 review lenses:
   - `reviewer-security` -> writes `logs/reviewer-security.log` and `round-<N>/review-security.md`
   - `reviewer-code` -> writes `logs/reviewer-code.log` and `round-<N>/review-code.md`
   - `reviewer-ui` (port: `5101 + 10 * num`) -> writes `logs/reviewer-ui.log` and `round-<N>/review-ui.md`
   - `reviewer-ux` (port: `5102 + 10 * num`) -> writes `logs/reviewer-ux.log` and `round-<N>/review-ux.md`
   - Append each review activity to `logs/combined.log`.
4. As each review file is written, immediately read its first line (`VERDICT: PASS` or `VERDICT: CHANGES`), update tokens in `job.json`, remove completed agent from `active_agents`, and update `reviews` so the dashboard pills light up in real time.
5. Once all 4 review files exist:
   - **All PASS**: Proceed to **Approve**.
   - **Any CHANGES & resumes remaining (`< MAX_RESUMES`)**:
     - Update `job.json`: `stage: "build"`.
     - Re-invoke `builder` persona to address the findings in `round-<N>/`.
     - Builder commits fixes, updates `build.md` for round `N+1`.
     - Repeat **Build Check** and start **Review Round N+1**.
   - **Any CHANGES & resumes exhausted**:
     - Write `factory/jobs/<job-id>/decision.md` with:
       ```markdown
       ESCALATE

       Review rounds exhausted (3 rounds completed).
       Outstanding CHANGES in round-<N>/ require human review.
       ```
     - Update `job.json`: `stage: "needs-human"`. Notify user.

#### Approve
1. Update `job.json`: `stage: "approve"`.
2. Read persona instructions from `agents/approver.md`.
3. Adopt `approver` persona: inspect git diff, criteria evidence in `build.md`, and all review verdicts.
4. Write `factory/jobs/<job-id>/decision.md`.
5. Read first line of `decision.md`:
   - `APPROVE`: Proceed to **Merge**.
   - `ESCALATE`: Update `job.json`: `stage: "needs-human"`. Notify user.

#### Merge
1. Check that the main checkout is clean:
   ```bash
   git status --porcelain -- . ':!factory/backlog.md'
   ```
   If uncommitted changes exist, update `job.json` to `stage: "needs-human"` and instruct user to run `/factory approve <job-id>` once clean.
2. Execute merge:
   ```bash
   git merge --no-ff factory/<job-id> -m "Merge factory/<job-id>"
   git worktree remove <worktree>
   git branch -d factory/<job-id>
   ```
3. If an `issue_number` was associated:
   ```bash
   gh issue comment <issue_number> --body "✅ Factory job <job-id> completed successfully. Acceptance criteria verified. Merged to main in $(git rev-parse --short HEAD)."
   gh issue close <issue_number> --comment "Resolved by autonomous factory run <job-id>."
   ```
4. Update `job.json`: `stage: "merged"`. Notify user that the feature is live on `main`.

---

### 2. `/factory next`
1. Read `factory/backlog.md`.
2. Locate the first unchecked item: `- [ ] <task>`.
3. Atomically claim it by updating the line in `factory/backlog.md` to:
   `- [x] <task> → claimed`
4. Run `/factory <task>`. Once job ID is created, replace `claimed` with `<job-id>`.

---

### 3. `/factory sync-issues [label]`
1. Check if `gh` CLI is installed and authenticated (`gh auth status`).
2. Query open GitHub issues:
   ```bash
   gh issue list --state open ${label:+--label "$label"} --json number,title
   ```
3. For each issue not yet present in `factory/backlog.md`:
   Append `- [ ] Issue #<num>: <title>` to `factory/backlog.md`.
4. Report how many new issues were queued.

---

### 4. `/factory approve <job-id>`
Runs the **Merge** sequence for a job currently halted at `needs-human`.

---

### 5. `/factory rework <job-id> <note>`
1. Append note to `factory/jobs/<job-id>/rework-<k>.md`.
2. Reset resume counter.
3. Update `job.json`: `stage: "build"`.
4. Re-invoke builder to address the rework note, update `build.md`, and start a new review round.
