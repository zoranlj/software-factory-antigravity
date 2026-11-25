# Headless Testing Harness

This document specifies how headless agents and CI runners execute tests, seed fixtures, and verify changes without human intervention.

---

## 1. Primary Verification Suite

Run the complete end-to-end verification suite from the repository root:

```bash
./tests/factory-verify.sh
```

What it verifies headlessly (zero network calls required):
1. **Repository & Template Integrity**: `AGENTS.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`, `TESTING_HARNESS.md`, `install.sh`, `.gitignore`, and `templates/`.
2. **Skill & Persona Contracts**: `SKILL.md` and all 7 persona definitions.
3. **Structured Issue & DAG Intake**: `.github/ISSUE_TEMPLATE/` forms, `factory/scripts/validate-issue.mjs`, and `factory/scripts/check-dag.mjs` against valid, invalid, and blocked fixtures.
4. **Schema & State Serialization**: `factory/schemas/job.schema.json` validation against mock `job.json` fixtures and agent logs.
5. **Headless PR & KPI Generation**: `factory/scripts/build-pr-body.mjs` and `factory/scripts/kpi-report.mjs` executed against seeded temporary jobs.
6. **Git Worktree Lifecycle**: Creation, verification, removal, and branch cleanup.
7. **Installer Smoke Test**: `./install.sh --target /tmp/...` verifying all Level 3 + Level 4 files are copied cleanly.

---

## 2. Seeding a Local Fixture for Manual or Headless Testing

To seed a mock job under `factory/jobs/` (gitignored) for testing the dashboard or PR/KPI scripts:

```bash
JOB_DIR="factory/jobs/999-fixture-demo"
mkdir -p "$JOB_DIR/logs" "$JOB_DIR/round-1"
```

Create `$JOB_DIR/job.json` conforming to [factory/schemas/job.schema.json](factory/schemas/job.schema.json), then run:

```bash
# Generate PR body markdown from fixture
node factory/scripts/build-pr-body.mjs "$JOB_DIR"

# Compute Level 4 KPI summary across jobs
node factory/scripts/kpi-report.mjs factory/jobs
```

Clean up when finished:
```bash
rm -rf "$JOB_DIR"
```

---

## 3. Headless Dashboard Verification

When UI changes touch `factory/dashboard.html`:
1. Start the static server on an ephemeral port:
   ```bash
   python3 -m http.server 5199 --directory factory &
   SERVER_PID=$!
   ```
2. Verify HTTP 200 and expected DOM markers (or run headless browser checks via `browser_subagent` / Playwright):
   ```bash
   curl -fsS http://localhost:5199/dashboard.html | grep -q "<title>Software Factory</title>"
   ```
3. Always terminate the background server before exiting:
   ```bash
   kill "$SERVER_PID" 2>/dev/null || true
   ```

---

## 4. CI Workflow Dry-Run

GitHub Actions workflows in `.github/workflows/` are validated automatically on every push and pull request by `.github/workflows/ci-verify.yml`. You can dry-run the headless orchestrator preflight locally without calling an LLM or opening a PR:

```bash
factory/scripts/headless-run.sh --dry-run --issue-file <path-to-issue.md>
```
