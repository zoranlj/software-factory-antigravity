#!/usr/bin/env node
/**
 * Level 4 Pull Request Body Generator
 *
 * Reads factory/jobs/<job-id>/ artifacts (job.json, spec.md, build.md,
 * round-N/review-*.md, decision.md) and outputs a structured PR description
 * with full audit evidence and the Level 4 human-approval gate notice.
 *
 * Usage:
 *   node factory/scripts/build-pr-body.mjs <job-dir>
 */

import fs from 'node:fs';
import path from 'node:path';

const jobDir = process.argv[2];
if (!jobDir || !fs.existsSync(jobDir)) {
  console.error('Usage: node factory/scripts/build-pr-body.mjs <job-dir>');
  process.exit(1);
}

const readSafe = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8').trim() : '');

const jobPath = path.join(jobDir, 'job.json');
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

const specMd = readSafe(path.join(jobDir, 'spec.md'));
const buildMd = readSafe(path.join(jobDir, 'build.md'));
const decisionMd = readSafe(path.join(jobDir, 'decision.md'));

const reviews = job.reviews || {};
const tokens = job.tokens || { prompt: 0, completion: 0, total: 0 };

const lines = [];

lines.push(`## Software Factory Automated PR (Level 4 Headless)`);
lines.push('');
lines.push('> **Human Approval Gate (Level 4):** This pull request was planned, implemented, and verified autonomously in a headless pipeline. **Human review and approval are required before merging.**');
lines.push('');

if (job.issue_number) {
  lines.push(`Closes #${job.issue_number}`);
  lines.push('');
}

lines.push('### Job Metadata');
lines.push(`- **Job ID:** \`${job.id}\``);
lines.push(`- **Mode:** \`${job.mode || 'headless'}\``);
lines.push(`- **Branch:** \`${job.branch}\``);
lines.push(`- **Review Rounds:** ${job.round ?? 0}`);
lines.push(`- **Total Tokens:** ${tokens.total ?? 0} (prompt: ${tokens.prompt ?? 0}, completion: ${tokens.completion ?? 0})`);
lines.push('');

lines.push('### Multi-Lens Review Verdicts');
lines.push('| Lens | Verdict |');
lines.push('|---|---|');
for (const lens of ['security', 'ux', 'ui', 'code']) {
  const verdict = reviews[lens] || 'pending';
  const badge = verdict === 'PASS' ? '✅ PASS' : verdict === 'CHANGES' ? '❌ CHANGES' : '⏳ pending';
  lines.push(`| ${lens} | ${badge} |`);
}
lines.push('');

if (decisionMd) {
  lines.push('### Approver Decision');
  lines.push('<details>');
  lines.push('<summary>View decision.md</summary>');
  lines.push('');
  lines.push(decisionMd);
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

if (buildMd) {
  lines.push('### Build & Verification Evidence');
  lines.push('<details>');
  lines.push('<summary>View build.md</summary>');
  lines.push('');
  lines.push(buildMd);
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

if (specMd) {
  lines.push('### Specification');
  lines.push('<details>');
  lines.push('<summary>View spec.md</summary>');
  lines.push('');
  lines.push(specMd);
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

console.log(lines.join('\n'));
