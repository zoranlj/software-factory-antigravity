#!/usr/bin/env bash
# Level 4 Headless Software Factory Runner
# Executes SRI validation, Depends-On DAG gating, isolated worktree setup,
# headless agent orchestration, and automated PR creation (stopping at human approval).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

ISSUE_NUMBER=""
ISSUE_FILE=""
DRY_RUN=false
BASE_BRANCH="main"
AGENT_CMD="${FACTORY_AGENT_CMD:-}"

show_help() {
  cat << 'HELP'
Software Factory Headless Runner (Level 4)

Usage:
  factory/scripts/headless-run.sh --issue <number> [--base main] [--dry-run]
  factory/scripts/headless-run.sh --issue-file <path> [--base main] [--dry-run]

Environment:
  FACTORY_AGENT_CMD   Headless agent CLI command to execute the factory loop
                      (receives FACTORY_JOB_DIR, FACTORY_WORKTREE, FACTORY_BRANCH, FACTORY_ISSUE_FILE).
  GH_TOKEN            GitHub token for fetching issues and opening pull requests.

Exit codes:
  0  Success (PR opened or dry-run passed)
  1  Validation or execution failure
  2  Blocked by unresolved Depends-On dependency
HELP
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --issue)
      ISSUE_NUMBER="${2:-}"
      shift 2
      ;;
    --issue-file)
      ISSUE_FILE="${2:-}"
      shift 2
      ;;
    --base)
      BASE_BRANCH="${2:-main}"
      shift 2
      ;;
    --agent-cmd)
      AGENT_CMD="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --help|-h)
      show_help
      exit 0
      ;;
    *)
      echo "❌ Unknown argument: $1" >&2
      show_help
      exit 1
      ;;
  esac
done

if [[ -z "$ISSUE_NUMBER" && -z "$ISSUE_FILE" ]]; then
  echo "❌ Must provide --issue <number> or --issue-file <path>" >&2
  exit 1
fi

TMP_ISSUE_FILE=""
cleanup() {
  if [[ -n "$TMP_ISSUE_FILE" && -f "$TMP_ISSUE_FILE" ]]; then
    rm -f "$TMP_ISSUE_FILE"
  fi
}
trap cleanup EXIT

ISSUE_TITLE="Headless Factory Job"
if [[ -n "$ISSUE_NUMBER" ]]; then
  TMP_ISSUE_FILE="$(mktemp)"
  ISSUE_TITLE="$(gh issue view "$ISSUE_NUMBER" --json title -q '.title')"
  gh issue view "$ISSUE_NUMBER" --json body -q '.body' > "$TMP_ISSUE_FILE"
  ISSUE_FILE="$TMP_ISSUE_FILE"
else
  if [[ ! -f "$ISSUE_FILE" ]]; then
    echo "❌ Issue file not found: $ISSUE_FILE" >&2
    exit 1
  fi
  ISSUE_TITLE="$(head -n 1 "$ISSUE_FILE" | sed 's/^#*[[:space:]]*//')"
fi

echo "1️⃣  Validating Level 4 SRI issue contract..."
node "$SCRIPT_DIR/validate-issue.mjs" --file "$ISSUE_FILE"

echo "2️⃣  Checking Depends-On DAG..."
DAG_EXIT=0
if [[ "$DRY_RUN" == "true" ]]; then
  # In dry-run mode, inspect dependencies without requiring network access if none exist
  node "$SCRIPT_DIR/check-dag.mjs" --file "$ISSUE_FILE" || DAG_EXIT=$?
else
  node "$SCRIPT_DIR/check-dag.mjs" --file "$ISSUE_FILE" || DAG_EXIT=$?
fi
if [[ "$DAG_EXIT" -eq 2 ]]; then
  echo "⏸️  Skipping dispatch: issue has unresolved Depends-On blockers."
  exit 2
elif [[ "$DAG_EXIT" -ne 0 ]]; then
  exit "$DAG_EXIT"
fi

SLUG="$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' | cut -c1-32)"
PREFIX="${ISSUE_NUMBER:-000}"
JOB_ID="$(printf "%03d-%s" "$((10#$PREFIX))" "${SLUG:-job}")"
BRANCH="factory/$JOB_ID"
JOB_DIR="$REPO_ROOT/factory/jobs/$JOB_ID"
WORKTREE="$REPO_ROOT/factory/worktrees/$JOB_ID"
STARTED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "3️⃣  Preparing headless job: $JOB_ID (branch: $BRANCH)"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "✅ Dry-run preflight passed for job $JOB_ID (mode: headless, base: $BASE_BRANCH)"
  exit 0
fi

mkdir -p "$JOB_DIR/logs" "$REPO_ROOT/factory/worktrees"
cp "$ISSUE_FILE" "$JOB_DIR/issue.md"
ISSUE_FILE="$JOB_DIR/issue.md"

cat << JSON > "$JOB_DIR/job.json"
{
  "id": "$JOB_ID",
  "feature": $(node -e "console.log(JSON.stringify(process.argv[1]))" "$ISSUE_TITLE"),
  "mode": "headless",
  "branch": "$BRANCH",
  "worktree": "$WORKTREE",
  "stage": "spec",
  "round": 0,
  "issue_number": ${ISSUE_NUMBER:-null},
  "pr_number": null,
  "pr_url": null,
  "depends_on": [],
  "active_agents": [],
  "reviews": {
    "security": "pending",
    "ux": "pending",
    "ui": "pending",
    "code": "pending"
  },
  "tokens": {
    "prompt": 0,
    "completion": 0,
    "total": 0,
    "by_agent": {}
  },
  "timestamps": {
    "started_at": "$STARTED_AT",
    "pr_opened_at": null,
    "merged_at": null
  },
  "kpi": {
    "tests_passed_first_try": false,
    "tests_passed_final": false,
    "pr_generated": false,
    "human_review_seconds": null
  }
}
JSON

git worktree add -b "$BRANCH" "$WORKTREE" "$BASE_BRANCH"

echo "4️⃣  Executing headless agent orchestrator..."
if [[ -z "$AGENT_CMD" ]]; then
  echo "⚠️  FACTORY_AGENT_CMD is not set. Configure your headless Antigravity CLI runner to execute the /factory loop." >&2
  exit 1
fi

export FACTORY_MODE="headless"
export FACTORY_REPO_ROOT="$REPO_ROOT"
export FACTORY_JOB_ID="$JOB_ID"
export FACTORY_JOB_DIR="$JOB_DIR"
export FACTORY_WORKTREE="$WORKTREE"
export FACTORY_BRANCH="$BRANCH"
export FACTORY_ISSUE_FILE="$ISSUE_FILE"
export FACTORY_ISSUE_NUMBER="${ISSUE_NUMBER:-}"

bash -c "$AGENT_CMD"

COMMIT_COUNT="$(git -C "$WORKTREE" rev-list --count "$BASE_BRANCH..HEAD")"
if [[ "$COMMIT_COUNT" -eq 0 ]]; then
  echo "❌ Headless agent exited without creating any commits on $BRANCH (ahead of $BASE_BRANCH)." >&2
  exit 1
fi

echo "5️⃣  Opening Level 4 Pull Request (awaiting human approval)..."
PR_BODY_FILE="$(mktemp)"
node "$SCRIPT_DIR/build-pr-body.mjs" "$JOB_DIR" > "$PR_BODY_FILE"

git -C "$WORKTREE" push -u origin "$BRANCH"
PR_URL="$(gh pr create \
  --base "$BASE_BRANCH" \
  --head "$BRANCH" \
  --title "feat(factory): $ISSUE_TITLE" \
  --body-file "$PR_BODY_FILE")"
rm -f "$PR_BODY_FILE"

PR_NUM="$(echo "$PR_URL" | grep -Eo '[0-9]+$' || true)"
PR_OPENED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

node -e '
const fs = require("fs");
const p = process.argv[1];
const j = JSON.parse(fs.readFileSync(p, "utf8"));
j.stage = "pr-open";
j.pr_url = process.argv[2];
j.pr_number = process.argv[3] ? Number(process.argv[3]) : null;
j.timestamps = j.timestamps || {};
j.timestamps.pr_opened_at = process.argv[4];
j.kpi = j.kpi || {};
j.kpi.pr_generated = true;
fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
' "$JOB_DIR/job.json" "$PR_URL" "$PR_NUM" "$PR_OPENED_AT"

echo "✅ Level 4 PR created and awaiting human approval: $PR_URL"
