#!/usr/bin/env node
/**
 * Level 4 Structured Requirements Validator (SRI Contract)
 *
 * Validates that an issue body contains:
 *  - Context section
 *  - Executable Acceptance Criteria (checkboxes or Given/When/Then)
 *  - Explicit Out-of-Scope boundary constraints
 * Also extracts `Depends-On:` DAG metadata.
 *
 * Usage:
 *   node factory/scripts/validate-issue.mjs --file <path> [--json]
 *   ISSUE_BODY="..." node factory/scripts/validate-issue.mjs [--json]
 */

import fs from 'node:fs';

const args = process.argv.slice(2);
let filePath = null;
let jsonMode = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--file' && args[i + 1]) {
    filePath = args[++i];
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

const errors = [];

const hasSection = (pattern) => new RegExp(`^#{1,3}\\s+${pattern}\\b`, 'im').test(body);

if (!hasSection('Context')) {
  errors.push('Missing required section: Context');
}

if (!hasSection('Acceptance\\s+Criteria')) {
  errors.push('Missing required section: Acceptance Criteria');
} else {
  const hasChecklist = /^\s*[-*]\s+\[[ xX]\]\s+.+/m.test(body);
  const hasGherkin = /\bGiven\b[\s\S]+\bWhen\b[\s\S]+\bThen\b/i.test(body);
  if (!hasChecklist && !hasGherkin) {
    errors.push('Acceptance Criteria must include executable checklist items (- [ ] ...) or Gherkin (Given/When/Then)');
  }
}

if (!hasSection('Out[-\\s]of[-\\s]Scope')) {
  errors.push('Missing required section: Out of Scope');
}

// Extract Depends-On references (#123 or org/repo#123)
const dependsOn = [];
const depRegex = /Depends-On:\s*([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+#\d+|#\d+)/gi;
let match;
while ((match = depRegex.exec(body)) !== null) {
  if (!dependsOn.includes(match[1])) {
    dependsOn.push(match[1]);
  }
}

const result = {
  valid: errors.length === 0,
  errors,
  depends_on: dependsOn,
};

if (jsonMode) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.valid) {
  console.log(`✅ Issue satisfies Level 4 SRI contract (Depends-On: ${dependsOn.length ? dependsOn.join(', ') : 'none'})`);
} else {
  console.error('❌ Issue failed Level 4 SRI validation:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
}

process.exit(result.valid ? 0 : 1);
