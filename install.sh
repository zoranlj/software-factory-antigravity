#!/usr/bin/env bash
# Software Factory for Google Antigravity - Installer Script
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GLOBAL_CONFIG_DIR="$HOME/.gemini/config/skills/factory"

show_help() {
  cat << 'HELP'
Software Factory for Google Antigravity - Installer

Usage:
  ./install.sh --global               Install skill globally to ~/.gemini/config/skills/factory
  ./install.sh --target <repo-path>   Install skill, dashboard, and scaffolding into target repo
  ./install.sh --all <repo-path>      Install both globally and into a target repo
  ./install.sh --help                 Show this help message

Interactive:
  Run ./install.sh without arguments for guided installation.
HELP
}

install_global() {
  echo "📦 Installing Software Factory globally..."
  mkdir -p "$GLOBAL_CONFIG_DIR"
  cp "$SCRIPT_DIR/.agents/skills/factory/SKILL.md" "$GLOBAL_CONFIG_DIR/"
  cp -r "$SCRIPT_DIR/.agents/skills/factory/agents" "$GLOBAL_CONFIG_DIR/"
  echo "✅ Global skill installed at: $GLOBAL_CONFIG_DIR"
  echo "   You can now use /factory in any project in Antigravity!"
}

install_target() {
  local target="$1"
  if [ ! -d "$target" ]; then
    echo "❌ Error: Target directory does not exist: $target" >&2
    exit 1
  fi

  local target_abs="$(cd "$target" && pwd)"
  echo "📦 Installing Software Factory into: $target_abs..."

  # 1. Install workspace skill
  mkdir -p "$target_abs/.agents/skills/factory"
  cp "$SCRIPT_DIR/.agents/skills/factory/SKILL.md" "$target_abs/.agents/skills/factory/"
  cp -r "$SCRIPT_DIR/.agents/skills/factory/agents" "$target_abs/.agents/skills/factory/"
  echo "  ✅ Installed .agents/skills/factory"

  # 2. Install factory dashboard, schemas, scripts, and backlog
  mkdir -p "$target_abs/factory/jobs" "$target_abs/factory/schemas" "$target_abs/factory/scripts"
  touch "$target_abs/factory/jobs/.gitkeep"
  cp "$SCRIPT_DIR/factory/dashboard.html" "$target_abs/factory/dashboard.html"
  cp "$SCRIPT_DIR/factory/schemas/job.schema.json" "$target_abs/factory/schemas/job.schema.json"
  cp "$SCRIPT_DIR/factory/scripts/"* "$target_abs/factory/scripts/"
  chmod +x "$target_abs/factory/scripts/headless-run.sh"
  echo "  ✅ Installed factory dashboard, schemas, and Level 4 scripts"
  if [ ! -f "$target_abs/factory/backlog.md" ]; then
    cp "$SCRIPT_DIR/factory/backlog.md" "$target_abs/factory/backlog.md"
    echo "  ✅ Created factory/backlog.md"
  else
    echo "  ℹ️  factory/backlog.md already exists, keeping existing"
  fi

  # 3. Ground truth & Level 4 machine-readable context docs
  for doc in AGENTS.md ARCHITECTURE.md CONVENTIONS.md TESTING_HARNESS.md; do
    if [ ! -f "$target_abs/$doc" ]; then
      cp "$SCRIPT_DIR/templates/$doc" "$target_abs/$doc"
      echo "  ✅ Created template $doc in repo root"
    else
      echo "  ℹ️  $doc already exists, keeping existing"
    fi
  done

  # 4. Level 4 GitHub Issue Templates & Headless Workflow
  mkdir -p "$target_abs/.github/ISSUE_TEMPLATE" "$target_abs/.github/workflows"
  if [ ! -f "$target_abs/.github/ISSUE_TEMPLATE/factory-sri.yml" ]; then
    cp "$SCRIPT_DIR/.github/ISSUE_TEMPLATE/factory-sri.yml" "$target_abs/.github/ISSUE_TEMPLATE/factory-sri.yml"
    echo "  ✅ Created .github/ISSUE_TEMPLATE/factory-sri.yml"
  fi
  if [ ! -f "$target_abs/.github/workflows/factory-headless.yml" ]; then
    cp "$SCRIPT_DIR/.github/workflows/factory-headless.yml" "$target_abs/.github/workflows/factory-headless.yml"
    echo "  ✅ Created .github/workflows/factory-headless.yml"
  fi

  # 4. Update .gitignore
  local gitignore="$target_abs/.gitignore"
  if [ -f "$gitignore" ]; then
    if ! grep -q "factory/jobs" "$gitignore" 2>/dev/null; then
      echo "" >> "$gitignore"
      echo "# Factory runtime artifacts" >> "$gitignore"
      echo "/factory/jobs/*" >> "$gitignore"
      echo "!/factory/jobs/.gitkeep" >> "$gitignore"
      echo "/factory/worktrees/" >> "$gitignore"
      echo "  ✅ Added factory ignore rules to .gitignore"
    fi
  else
    cat << 'GI' > "$gitignore"
# Factory runtime artifacts
/factory/jobs/*
!/factory/jobs/.gitkeep
/factory/worktrees/
GI
    echo "  ✅ Created .gitignore with factory ignore rules"
  fi

  echo "🎉 Successfully installed Software Factory into $target_abs"
  echo "   To launch dashboard: cd \"$target_abs/factory\" && python3 -m http.server 8000"
}

# Parse command line flags
if [ $# -gt 0 ]; then
  case "$1" in
    --global|-g)
      install_global
      exit 0
      ;;
    --target|-t|--project|-p)
      if [ -z "${2:-}" ]; then
        echo "❌ Error: Missing target directory path." >&2
        show_help
        exit 1
      fi
      install_target "$2"
      exit 0
      ;;
    --all|-a)
      if [ -z "${2:-}" ]; then
        echo "❌ Error: Missing target directory path." >&2
        show_help
        exit 1
      fi
      install_global
      install_target "$2"
      exit 0
      ;;
    --help|-h)
      show_help
      exit 0
      ;;
    *)
      echo "❌ Unknown option: $1" >&2
      show_help
      exit 1
      ;;
  esac
fi

# Interactive Mode
echo "========================================="
echo "🏭 Software Factory for Google Antigravity"
echo "========================================="
echo "Where would you like to install the factory?"
echo "  1) Global Skill only (~/.gemini/config/skills/factory)"
echo "  2) Target Project Repository (.agents + factory dashboard + AGENTS.md)"
echo "  3) Both Global and Target Project"
echo "  4) Cancel"
read -p "Select option [1-4]: " choice

case "$choice" in
  1)
    install_global
    ;;
  2)
    read -p "Enter path to target repository: " target_dir
    install_target "$target_dir"
    ;;
  3)
    read -p "Enter path to target repository: " target_dir
    install_global
    install_target "$target_dir"
    ;;
  *)
    echo "Installation cancelled."
    exit 0
    ;;
esac
