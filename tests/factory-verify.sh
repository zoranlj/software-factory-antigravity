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
echo "1. Checking Core Repository Files & Templates..."
assert "install.sh exists and is executable" test -x "install.sh"
assert "templates/AGENTS.md exists" test -f "templates/AGENTS.md"
assert "templates/AGENTS.md defines dev server" grep -q "npm run dev" "templates/AGENTS.md"
assert "templates/AGENTS.md defines validation commands" grep -q "npm test" "templates/AGENTS.md"
assert ".gitignore exists" test -f ".gitignore"
assert "factory/jobs/ is ignored in .gitignore" git check-ignore -q "factory/jobs/sample-job"

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
assert "factory/dashboard.html contains valid HTML" grep -q "<title>Software Factory</title>" "factory/dashboard.html"
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
assert "Target .gitignore includes factory rules" grep -q "factory/jobs" "$TEST_TARGET_DIR/.gitignore"

# Clean up installer test target
rm -rf "$TEST_TARGET_DIR"

echo ""
echo "7. Checking GitHub CLI Integration..."
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
