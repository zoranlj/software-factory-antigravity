# Level 4 Headless Pipeline — GitHub Repository Go-Live Guide

This guide walks through the exact GitHub repository configuration required to take **Software Factory for Google Antigravity** live in **Level 4 (Headless Pipeline Agents)** mode.

Once configured, labeling a validated Single-Responsibility Issue (SRI) with `factory-ready` will trigger `.github/workflows/factory-headless.yml`, run the factory in the background, and open a verified Pull Request that waits for human approval before merging to `main`.

---

## Checklist Overview

1. [Enable GitHub Actions Workflow & PR Permissions](#1-enable-github-actions-workflow--pr-permissions)
2. [Configure `FACTORY_AGENT_CMD` Variable & Runner Secrets](#2-configure-factory_agent_cmd-variable--runner-secrets)
3. [Create Issue Triage Labels (`factory-candidate` & `factory-ready`)](#3-create-issue-triage-labels-factory-candidate--factory-ready)
4. [Enforce Branch Protection on `main` (Level 4 Human Gate)](#4-enforce-branch-protection-on-main-level-4-human-gate)
5. [Run a Dry-Run Smoke Test](#5-run-a-dry-run-smoke-test)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Enable GitHub Actions Workflow & PR Permissions

The headless workflow (`.github/workflows/factory-headless.yml`) already declares scoped job permissions (`contents: write`, `issues: write`, `pull-requests: write`), but GitHub blocks Actions from creating pull requests unless explicitly enabled at the repository level.

### Via GitHub UI
1. Go to **Settings → Actions → General**.
2. Under **Workflow permissions**, select **Read and write permissions**.
3. Check **Allow GitHub Actions to create and approve pull requests**.
4. Click **Save**.

### Via `gh` CLI
```bash
gh api -X PUT repos/{owner}/{repo}/actions/permissions/workflow \
  -f default_workflow_permissions=write \
  -F can_approve_pull_request_reviews=true
```

---

## 2. Configure `FACTORY_AGENT_CMD` Variable & Runner Secrets

`factory/scripts/headless-run.sh` delegates the actual spec → build → review → approve loop to the shell command configured in the `FACTORY_AGENT_CMD` repository variable.

### Environment Variables Provided to `FACTORY_AGENT_CMD`
When `headless-run.sh` invokes your command, it automatically exports:

| Variable | Description |
|---|---|
| `FACTORY_MODE` | Always `"headless"` |
| `FACTORY_JOB_ID` | Generated job ID (e.g. `042-add-kpi-export`) |
| `FACTORY_JOB_DIR` | Absolute path to `factory/jobs/<job-id>` (where `job.json`, `spec.md`, `build.md`, `round-N/`, `decision.md`, and `logs/` live) |
| `FACTORY_WORKTREE` | Absolute path to the isolated git worktree (`factory/worktrees/<job-id>`) |
| `FACTORY_BRANCH` | Git branch checked out in the worktree (`factory/<job-id>`) |
| `FACTORY_ISSUE_FILE` | Path to the fetched issue body markdown file |
| `FACTORY_ISSUE_NUMBER` | Triggering GitHub issue number |

### Set the `FACTORY_AGENT_CMD` Variable
1. Go to **Settings → Secrets and variables → Actions → Variables** tab.
2. Click **New repository variable**.
3. **Name:** `FACTORY_AGENT_CMD`
4. **Value:** Your headless Antigravity CLI invocation (or wrapper script) that executes the `/factory` skill against `$FACTORY_WORKTREE` and writes artifacts into `$FACTORY_JOB_DIR`.

Example via `gh` CLI:
```bash
gh variable set FACTORY_AGENT_CMD \
  --body 'agy run --headless --cwd "$FACTORY_WORKTREE" --prompt "Execute /factory in headless mode for Issue #$FACTORY_ISSUE_NUMBER using job dir $FACTORY_JOB_DIR"'
```

### Add Model / CLI Authentication Secrets
If your headless runner requires an API key or service account token:
1. Go to **Settings → Secrets and variables → Actions → Secrets** tab.
2. Add the required secret (e.g., `GEMINI_API_KEY` or `AGY_AUTH_TOKEN`).
3. Expose it in the `env:` block of `.github/workflows/factory-headless.yml`:
   ```yaml
   env:
     GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
     FACTORY_AGENT_CMD: ${{ vars.FACTORY_AGENT_CMD }}
     GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
   ```

> **Security Note:** Never put API keys or tokens directly inside the `FACTORY_AGENT_CMD` variable (variables are visible in logs). Always store credentials in **Secrets** and reference them via `${{ secrets.<NAME> }}`.

---

## 3. Create Issue Triage Labels (`factory-candidate` & `factory-ready`)

To prevent unreviewed or vague issues from immediately consuming CI minutes and tokens, intake uses a two-label workflow:
- **`factory-candidate`**: Automatically applied when someone submits the [Factory Single-Responsibility Issue](.github/ISSUE_TEMPLATE/factory-sri.yml) form.
- **`factory-ready`**: Applied by a maintainer after confirming the issue is scoped to 1–3 files and has clear acceptance criteria. **Adding this label triggers `.github/workflows/factory-headless.yml`.**

### Create Labels via `gh` CLI
```bash
gh label create "factory-candidate" \
  --color "fbca04" \
  --description "SRI issue awaiting human triage before headless dispatch" \
  --force

gh label create "factory-ready" \
  --color "0e8a16" \
  --description "Approved for Level 4 headless Software Factory execution" \
  --force
```

---

## 4. Enforce Branch Protection on `main` (Level 4 Human Gate)

The defining boundary of **Level 4** is that headless agents deliver complete, test-passing Pull Requests that **must be approved by a human before merging**. Enforce this at the GitHub repository level so no script or agent can push or self-merge to `main`.

### Via GitHub UI (Branch Protection Rule or Ruleset)
1. Go to **Settings → Rules → Rulesets** (or **Settings → Branches → Add branch protection rule**).
2. Target branch: `main`.
3. Enable the following protections:
   - **Require a pull request before merging**
     - Required approvals: **1** (or higher per your team policy)
     - Check **Dismiss stale pull request approvals when new commits are pushed**
   - **Require status checks to pass before merging**
     - Check **Require branches to be up to date before merging**
     - Add required check: **`Software Factory Verification Suite`** (defined in `.github/workflows/ci-verify.yml`)
   - **Block force pushes** and **Restrict deletions**
4. Click **Create** / **Save changes**.

---

## 5. Run a Dry-Run Smoke Test

Before dispatching a live issue, verify your setup end-to-end without opening a PR or invoking your LLM runner.

### Option A: Local Dry-Run
```bash
./factory/scripts/headless-run.sh --issue <issue-number> --dry-run
```
This validates the SRI contract (`validate-issue.mjs`) and checks all `Depends-On` blockers (`check-dag.mjs`).

### Option B: GitHub Actions Manual Dry-Run
1. Open **Actions → Headless Software Factory (Level 4)**.
2. Click **Run workflow**.
3. Enter an existing SRI `issue_number` and check **`dry_run: true`**.
4. Confirm the workflow succeeds and check:
   - **Step Summary**: Displays the Level 4 KPI summary table generated by `factory/scripts/kpi-report.mjs`.
   - **Artifacts**: Confirms the `factory-job-<issue-number>` artifact upload step completes cleanly.

Once the dry-run passes, apply the `factory-ready` label to a small, low-risk SRI issue to observe your first end-to-end Level 4 Pull Request.

---

## 6. Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| `gh pr create` fails with `GitHub Actions is not permitted to create or approve pull requests` | Repo Actions PR permission is disabled | Enable **Allow GitHub Actions to create and approve pull requests** in Step 1. |
| Workflow exits cleanly with a comment: `Headless Factory paused: unresolved Depends-On dependencies` | Exit code `2` from `check-dag.mjs` — one or more referenced issues are still open | Close/merge the blocking issue(s), then remove and re-apply the `factory-ready` label. |
| Workflow fails at `Validating Level 4 SRI issue contract` | Issue body is missing `## Context`, executable `## Acceptance Criteria` (checklist or `Given/When/Then`), or `## Out of Scope` | Edit the issue to include all three sections (or recreate using the `Factory Single-Responsibility Issue` template). |
| Workflow fails with `FACTORY_AGENT_CMD is not set` | Repository variable missing or misspelled | Add `FACTORY_AGENT_CMD` under **Settings → Secrets and variables → Actions → Variables** (Step 2). |
| PR opened but `Software Factory Verification Suite` check is missing | `ci-verify.yml` hasn't run on `main` yet | Push a commit or open a test PR so GitHub registers the status check name, then select it in Branch Protection. |
