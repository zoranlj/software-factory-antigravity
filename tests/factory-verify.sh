#!/usr/bin/env bash
# End-to-End Verification Test Suite for Software Factory in Google Antigravity
set -euo pipefail

echo "========================================="
echo "🧪 Running Software Factory Verification"
echo "========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

PASSED=0
TOTAL=0

assert() {
  TOTAL=$((TOTAL + 1))
  local desc="$1"
  shift
  if "$@"; then
    echo "  ✅ PASS: $desc"
    PASSED=$((PASSED + 1))
  else
    echo "  ❌ FAIL: $desc"
    exit 1
  fi
}

echo ""
echo "1. Checking Core Repository Files & Level 4 Context Artifacts..."
assert "install.sh exists and is executable" test -x "install.sh"
assert "Root AGENTS.md exists" test -f "AGENTS.md"
assert "Root ARCHITECTURE.md exists" test -f "ARCHITECTURE.md"
assert "Root CONVENTIONS.md exists" test -f "CONVENTIONS.md"
assert "Root TESTING_HARNESS.md exists" test -f "TESTING_HARNESS.md"
assert "factory/schemas/job.schema.json is valid JSON" node -e "JSON.parse(require('fs').readFileSync('factory/schemas/job.schema.json', 'utf8'));"
assert "templates/AGENTS.md exists" test -f "templates/AGENTS.md"
assert "templates/ARCHITECTURE.md exists" test -f "templates/ARCHITECTURE.md"
assert "templates/CONVENTIONS.md exists" test -f "templates/CONVENTIONS.md"
assert "templates/TESTING_HARNESS.md exists" test -f "templates/TESTING_HARNESS.md"
assert "templates/AGENTS.md defines dev server" grep -q "npm run dev" "templates/AGENTS.md"
assert "templates/AGENTS.md defines validation commands" grep -q "npm test" "templates/AGENTS.md"
assert ".gitignore exists" test -f ".gitignore"
assert "factory/jobs/ is ignored in .gitignore" git check-ignore -q "factory/jobs/sample-job"
assert "Shell script syntax check passes" bash -n install.sh tests/factory-verify.sh factory/scripts/headless-run.sh
assert "Node script syntax check passes" bash -c "for f in factory/scripts/*.mjs; do node --check \"\$f\"; done"

echo ""
echo "2. Checking Agent Personas & Skill Definitions..."
LOCAL_SKILL=".agents/skills/factory"
assert "Workspace SKILL.md exists" test -f "$LOCAL_SKILL/SKILL.md"

AGENTS=("spec-writer" "builder" "reviewer-code" "reviewer-security" "reviewer-ui" "reviewer-ux" "approver")
for agent in "${AGENTS[@]}"; do
  assert "Agent persona file: $agent.md" test -f "$LOCAL_SKILL/agents/$agent.md"
done

echo ""
echo "3. Checking Backlog and Visual Dashboard..."
assert "factory/backlog.md exists" test -f "factory/backlog.md"
assert "factory/backlog.md has queue items" grep -q -- "- \[ \]" "factory/backlog.md"
assert "factory/dashboard.html exists" test -f "factory/dashboard.html"
assert "factory/dashboard.html contains valid HTML" grep -q "<title>Zoran's Software factory</title>" "factory/dashboard.html"
assert "factory/dashboard.html contains renamed heading" grep -q "<h1>Zoran's Software factory</h1>" "factory/dashboard.html"
assert "factory/dashboard.html contains Live Agent Output console" grep -q "Live Agent Output" "factory/dashboard.html"
assert "factory/dashboard.html contains token stats" grep -q "total-tokens" "factory/dashboard.html"
assert "factory/dashboard.html contains agent model badge" grep -q "tok-model" "factory/dashboard.html"
assert "factory/dashboard.html contains cost calculation" grep -q "calcCost" "factory/dashboard.html"

echo ""
echo "4. Testing job.json Serialization, Token Stats, and Agent Logs..."
TEST_JOB_DIR="factory/jobs/__test-verify-job__"
mkdir -p "$TEST_JOB_DIR/logs"

cat << 'JSON' > "$TEST_JOB_DIR/job.json"
{
  "id": "__test-verify-job__",
  "feature": "Verification Feature",
  "branch": "factory/__test-verify-job__",
  "worktree": "/tmp/test-worktree",
  "stage": "review",
  "round": 1,
  "active_agents": [
    { "name": "reviewer-security", "status": "running" }
  ],
  "reviews": {
    "security": "PASS",
    "ux": "PASS",
    "ui": "PASS",
    "code": "PASS"
  },
  "tokens": {
    "prompt": 12000,
    "completion": 2500,
    "total": 14500,
    "by_agent": {
      "builder": { "prompt": 8000, "completion": 1800, "total": 9800, "model": "gemini-3.8-flash" },
      "reviewer-security": { "prompt": 4000, "completion": 700, "total": 4700, "model": "gemini-3.8-flash" }
    }
  }
}
JSON

cat << 'LOG' > "$TEST_JOB_DIR/logs/builder.log"
[16:00:00] [builder] Starting build verification
[16:00:05] [builder] STATUS: READY
LOG

cat << 'LOG' > "$TEST_JOB_DIR/logs/combined.log"
[16:00:00] [builder] Starting build verification
[16:00:10] [reviewer-security] VERDICT: PASS
LOG

cat << 'MD' > "$TEST_JOB_DIR/spec.md"
# Verification Spec
> Feature: Verification Feature
## Requirements
1. Must verify.
## Acceptance criteria
1. Check passes.
MD

cat << 'MD' > "$TEST_JOB_DIR/build.md"
STATUS: READY
# Build: Verification
## Summary
Verified.
MD

mkdir -p "$TEST_JOB_DIR/round-1"
for rev in "security" "ux" "ui" "code"; do
  echo "VERDICT: PASS" > "$TEST_JOB_DIR/round-1/review-$rev.md"
done

cat << 'MD' > "$TEST_JOB_DIR/decision.md"
APPROVE
# Decision
All checks pass.
MD

assert "job.json is valid JSON" node -e "const j = JSON.parse(require('fs').readFileSync('$TEST_JOB_DIR/job.json', 'utf8')); if (j.stage !== 'review') process.exit(1);"
assert "job.json contains token statistics" node -e "const j = JSON.parse(require('fs').readFileSync('$TEST_JOB_DIR/job.json', 'utf8')); if (!j.tokens || j.tokens.total !== 14500) process.exit(1);"
assert "job.json contains agent model" node -e "const j = JSON.parse(require('fs').readFileSync('$TEST_JOB_DIR/job.json', 'utf8')); if (!j.tokens.by_agent.builder.model) process.exit(1);"
assert "job.json contains active_agents array" node -e "const j = JSON.parse(require('fs').readFileSync('$TEST_JOB_DIR/job.json', 'utf8')); if (!Array.isArray(j.active_agents) || j.active_agents[0].name !== 'reviewer-security') process.exit(1);"
assert "agent logs directory and combined.log exist" test -f "$TEST_JOB_DIR/logs/combined.log"
assert "build.md first line is STATUS: READY" bash -c "head -n 1 '$TEST_JOB_DIR/build.md' | grep -q 'STATUS: READY'"
assert "decision.md first line is APPROVE" bash -c "head -n 1 '$TEST_JOB_DIR/decision.md' | grep -q 'APPROVE'"

# Clean up mock job
rm -rf "$TEST_JOB_DIR"

echo ""
echo "5. Testing Git Worktree Lifecycle..."
TEST_BRANCH="factory/__test_worktree_verify__"
TEST_WORKTREE="factory/worktrees/__test_worktree_verify__"

# Ensure cleanup in case of previous run
git branch -D "$TEST_BRANCH" 2>/dev/null || true
rm -rf "$TEST_WORKTREE" 2>/dev/null || true
mkdir -p "factory/worktrees"

# Create a temporary commit if repo is unborn so worktree can branch from HEAD
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  git add .gitignore
  git commit -m "chore: initial commit for worktree testing" >/dev/null
fi

assert "Git worktree creation" git worktree add -b "$TEST_BRANCH" "$TEST_WORKTREE" HEAD
assert "Git worktree exists on filesystem" test -d "$TEST_WORKTREE"
assert "Git worktree removal" git worktree remove "$TEST_WORKTREE"
assert "Git branch deletion" git branch -D "$TEST_BRANCH"

echo ""
echo "6. Testing install.sh Installer..."
TEST_TARGET_DIR="/tmp/__test_factory_install_target__"
rm -rf "$TEST_TARGET_DIR"
mkdir -p "$TEST_TARGET_DIR"

assert "install.sh runs with --help" ./install.sh --help >/dev/null
assert "install.sh installs to target" ./install.sh --target "$TEST_TARGET_DIR" >/dev/null
assert "Target contains .agents/skills/factory/SKILL.md" test -f "$TEST_TARGET_DIR/.agents/skills/factory/SKILL.md"
assert "Target contains factory/dashboard.html" test -f "$TEST_TARGET_DIR/factory/dashboard.html"
assert "Target contains AGENTS.md" test -f "$TEST_TARGET_DIR/AGENTS.md"
assert "Target contains ARCHITECTURE.md" test -f "$TEST_TARGET_DIR/ARCHITECTURE.md"
assert "Target contains CONVENTIONS.md" test -f "$TEST_TARGET_DIR/CONVENTIONS.md"
assert "Target contains TESTING_HARNESS.md" test -f "$TEST_TARGET_DIR/TESTING_HARNESS.md"
assert "Target contains factory/schemas/job.schema.json" test -f "$TEST_TARGET_DIR/factory/schemas/job.schema.json"
assert "Target contains .github/ISSUE_TEMPLATE/factory-sri.yml" test -f "$TEST_TARGET_DIR/.github/ISSUE_TEMPLATE/factory-sri.yml"
assert "Target contains .github/workflows/factory-headless.yml" test -f "$TEST_TARGET_DIR/.github/workflows/factory-headless.yml"
assert "Target .gitignore includes factory rules" grep -q "factory/jobs" "$TEST_TARGET_DIR/.gitignore"

# Clean up installer test target
rm -rf "$TEST_TARGET_DIR"

echo ""
echo "7. Testing Level 4 Headless Pipeline, SRI Validator, DAG Gate, PR & KPI Scripts..."
assert ".github/ISSUE_TEMPLATE/factory-sri.yml exists" test -f ".github/ISSUE_TEMPLATE/factory-sri.yml"
assert ".github/workflows/ci-verify.yml exists" test -f ".github/workflows/ci-verify.yml"
assert ".github/workflows/factory-headless.yml exists" test -f ".github/workflows/factory-headless.yml"
assert "factory/scripts/headless-run.sh is executable" test -x "factory/scripts/headless-run.sh"

TMP_L4_DIR="$(mktemp -d)"
cat << 'MD' > "$TMP_L4_DIR/valid-issue.md"
# Add headless KPI reporter

## Context
Adds KPI reporting for Level 4 pipelines.

## Acceptance Criteria
- [ ] Given a jobs directory, when `kpi-report.mjs` runs, then it outputs JSON metrics.

## Out of Scope
- Do not modify `factory/dashboard.html`

Depends-On: #41
MD

cat << 'MD' > "$TMP_L4_DIR/invalid-issue.md"
# Vague issue
Please make it better.
MD

assert "validate-issue.mjs passes on valid SRI issue" node factory/scripts/validate-issue.mjs --file "$TMP_L4_DIR/valid-issue.md" >/dev/null
assert "validate-issue.mjs fails on invalid issue" bash -c "! node factory/scripts/validate-issue.mjs --file '$TMP_L4_DIR/invalid-issue.md' >/dev/null 2>&1"
assert "check-dag.mjs passes when Depends-On is closed" node factory/scripts/check-dag.mjs --file "$TMP_L4_DIR/valid-issue.md" --closed "#41" >/dev/null
assert "check-dag.mjs returns exit code 2 when Depends-On is open" bash -c "set +e; node factory/scripts/check-dag.mjs --file '$TMP_L4_DIR/valid-issue.md' --closed '' >/dev/null 2>&1; test \$? -eq 2"

# Dry-run headless orchestrator on a dependency-free valid issue
sed '/Depends-On:/d' "$TMP_L4_DIR/valid-issue.md" > "$TMP_L4_DIR/ready-issue.md"
assert "headless-run.sh --dry-run passes preflight" ./factory/scripts/headless-run.sh --issue-file "$TMP_L4_DIR/ready-issue.md" --dry-run >/dev/null

# Seed mock Level 4 job for PR body & KPI tests
mkdir -p "$TMP_L4_DIR/jobs/002-headless-demo/round-1"
cat << 'JSON' > "$TMP_L4_DIR/jobs/002-headless-demo/job.json"
{
  "id": "002-headless-demo",
  "feature": "Headless KPI demo",
  "mode": "headless",
  "branch": "factory/002-headless-demo",
  "stage": "pr-open",
  "round": 1,
  "issue_number": 42,
  "pr_number": 99,
  "reviews": { "security": "PASS", "ux": "PASS", "ui": "PASS", "code": "PASS" },
  "tokens": { "prompt": 5000, "completion": 1000, "total": 6000 },
  "timestamps": {
    "started_at": "2026-11-25T10:00:00Z",
    "pr_opened_at": "2026-11-25T10:05:00Z",
    "merged_at": "2026-11-25T10:20:00Z"
  },
  "kpi": {
    "tests_passed_first_try": true,
    "tests_passed_final": true,
    "pr_generated": true,
    "human_review_seconds": 900
  }
}
JSON
echo "STATUS: READY" > "$TMP_L4_DIR/jobs/002-headless-demo/build.md"
echo "APPROVE" > "$TMP_L4_DIR/jobs/002-headless-demo/decision.md"

assert "build-pr-body.mjs generates Level 4 PR body with human gate" bash -c "node factory/scripts/build-pr-body.mjs '$TMP_L4_DIR/jobs/002-headless-demo' | grep -q 'Human Approval Gate'"
assert "kpi-report.mjs computes 100% PR rate and 900s review time" node -e "const r = JSON.parse(require('child_process').execFileSync('node', ['factory/scripts/kpi-report.mjs', '$TMP_L4_DIR/jobs', '--json'], {encoding:'utf8'})); if (r.autonomous_pr_generation_rate_pct !== 100 || r.avg_human_review_seconds !== 900) process.exit(1);"

rm -rf "$TMP_L4_DIR"

echo ""
echo "8. Checking GitHub CLI Integration..."
if command -v gh >/dev/null 2>&1; then
  echo "  ℹ️  gh CLI is installed: $(gh --version | head -n 1)"
  assert "gh CLI executable" command -v gh
else
  echo "  ⚠️  gh CLI is not installed (optional, needed for /factory sync-issues)"
fi

echo ""
echo "========================================="
echo "🎉 ALL TESTS PASSED: $PASSED / $TOTAL"
echo "========================================="
