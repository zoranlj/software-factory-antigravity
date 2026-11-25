#!/usr/bin/env node
/**
 * Level 4 Dependency DAG Gate
 *
 * Parses `Depends-On: #N` and `Depends-On: owner/repo#N` references from an
 * issue body and verifies whether every dependency is closed/merged.
 *
 * Exit codes:
 *   0 - All dependencies satisfied (ready to dispatch)
 *   1 - Usage or runtime error
 *   2 - Blocked by one or more open dependencies
 *
 * Usage:
 *   node factory/scripts/check-dag.mjs --file <issue.md> [--closed "#41,org/repo#12"] [--repo owner/repo] [--json]
 */

import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
let filePath = null;
let closedOverride = null;
let defaultRepo = process.env.GITHUB_REPOSITORY || '';
let jsonMode = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--file' && args[i + 1]) {
    filePath = args[++i];
  } else if (args[i] === '--closed' && args[i + 1]) {
    closedOverride = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
  } else if (args[i] === '--repo' && args[i + 1]) {
    defaultRepo = args[++i];
  } else if (args[i] === '--json') {
    jsonMode = true;
  }
}

let body = '';
if (filePath) {
  body = fs.readFileSync(filePath, 'utf8');
} else if (process.env.ISSUE_BODY) {
  body = process.env.ISSUE_BODY;
} else {
  body = fs.readFileSync(0, 'utf8');
}

const deps = [];
const depRegex = /Depends-On:\s*([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+#\d+|#\d+)/gi;
let match;
while ((match = depRegex.exec(body)) !== null) {
  if (!deps.includes(match[1])) {
    deps.push(match[1]);
  }
}

const checkDepClosed = (ref) => {
  if (closedOverride !== null) {
    return closedOverride.includes(ref);
  }

  let repo = defaultRepo;
  let num = ref;
  if (ref.includes('#')) {
    const [r, n] = ref.split('#');
    if (r) repo = r;
    num = n;
  }

  const ghArgs = ['issue', 'view', num, '--json', 'state', '-q', '.state'];
  if (repo) {
    ghArgs.push('--repo', repo);
  }

  try {
    const state = execFileSync('gh', ghArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    return state === 'CLOSED';
  } catch {
    return false;
  }
};

const blockedBy = [];
for (const ref of deps) {
  if (!checkDepClosed(ref)) {
    blockedBy.push(ref);
  }
}

const result = {
  ready: blockedBy.length === 0,
  depends_on: deps,
  blocked_by: blockedBy,
};

if (jsonMode) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ready) {
  console.log(`✅ DAG ready (${deps.length} dependencies satisfied)`);
} else {
  console.log(`⏸️  DAG blocked by open dependencies: ${blockedBy.join(', ')}`);
}

process.exit(result.ready ? 0 : 2);
