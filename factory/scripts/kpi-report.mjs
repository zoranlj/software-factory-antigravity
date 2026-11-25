#!/usr/bin/env node
/**
 * Level 4 KPI Reporter
 *
 * Scans factory/jobs/<job-id>/job.json files and computes the Maturity Model
 * Level 4 KPIs:
 *  - Autonomous PR Generation Rate
 *  - Automated Test Pass Rate on AI PRs (first-pass & final)
 *  - Human Review Time per AI PR
 *
 * Usage:
 *   node factory/scripts/kpi-report.mjs <jobs-dir> [--json | --markdown]
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const jobsDir = args.find((a) => !a.startsWith('--')) || 'factory/jobs';
const jsonMode = args.includes('--json');
const mdMode = args.includes('--markdown') || !jsonMode;

const jobs = [];
if (fs.existsSync(jobsDir)) {
  for (const entry of fs.readdirSync(jobsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const jobFile = path.join(jobsDir, entry.name, 'job.json');
    if (!fs.existsSync(jobFile)) continue;
    try {
      jobs.push(JSON.parse(fs.readFileSync(jobFile, 'utf8')));
    } catch {
      // Ignore malformed runtime files
    }
  }
}

const totalJobs = jobs.length;
let prsGenerated = 0;
let firstTryPass = 0;
let finalPass = 0;
const reviewDurationsSec = [];

for (const job of jobs) {
  const kpi = job.kpi || {};
  const generated = Boolean(kpi.pr_generated || job.pr_number || job.stage === 'pr-open' || job.stage === 'merged');
  if (generated) prsGenerated += 1;

  if (kpi.tests_passed_first_try) firstTryPass += 1;
  if (kpi.tests_passed_final || job.stage === 'pr-open' || job.stage === 'merged') finalPass += 1;

  if (typeof kpi.human_review_seconds === 'number') {
    reviewDurationsSec.push(kpi.human_review_seconds);
  } else if (job.timestamps?.pr_opened_at && job.timestamps?.merged_at) {
    const deltaSec = (Date.parse(job.timestamps.merged_at) - Date.parse(job.timestamps.pr_opened_at)) / 1000;
    if (Number.isFinite(deltaSec) && deltaSec >= 0) {
      reviewDurationsSec.push(deltaSec);
    }
  }
}

const pct = (num, den) => (den === 0 ? 0 : Math.round((num / den) * 1000) / 10);
const avgReviewSec = reviewDurationsSec.length
  ? Math.round(reviewDurationsSec.reduce((a, b) => a + b, 0) / reviewDurationsSec.length)
  : null;

const summary = {
  total_jobs: totalJobs,
  autonomous_pr_generation_rate_pct: pct(prsGenerated, totalJobs),
  automated_test_pass_rate_first_try_pct: pct(firstTryPass, totalJobs),
  automated_test_pass_rate_final_pct: pct(finalPass, totalJobs),
  avg_human_review_seconds: avgReviewSec,
};

if (jsonMode) {
  console.log(JSON.stringify(summary, null, 2));
} else if (mdMode) {
  const reviewDisplay = avgReviewSec === null ? 'N/A' : `${Math.round((avgReviewSec / 60) * 10) / 10} min (${avgReviewSec}s)`;
  console.log('## Software Factory — Level 4 KPI Summary');
  console.log('');
  console.log('| KPI | Value |');
  console.log('|---|---|');
  console.log(`| Jobs Evaluated | ${summary.total_jobs} |`);
  console.log(`| Autonomous PR Generation Rate | ${summary.autonomous_pr_generation_rate_pct}% (${prsGenerated}/${totalJobs}) |`);
  console.log(`| Automated Test Pass Rate (First Try) | ${summary.automated_test_pass_rate_first_try_pct}% (${firstTryPass}/${totalJobs}) |`);
  console.log(`| Automated Test Pass Rate (Final) | ${summary.automated_test_pass_rate_final_pct}% (${finalPass}/${totalJobs}) |`);
  console.log(`| Avg Human Review Time per AI PR | ${reviewDisplay} |`);
}
