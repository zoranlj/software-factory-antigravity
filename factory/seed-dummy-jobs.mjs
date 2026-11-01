#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jobsRoot = path.join(__dirname, 'jobs');
const repoRoot = path.resolve(__dirname, '..');

function writeJobFiles(jobId, data) {
  const dir = path.join(jobsRoot, jobId);
  fs.mkdirSync(path.join(dir, 'logs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'job.json'), JSON.stringify(data.job, null, 2) + '\n');

  if (data.spec) fs.writeFileSync(path.join(dir, 'spec.md'), data.spec);
  if (data.build) fs.writeFileSync(path.join(dir, 'build.md'), data.build);
  if (data.decision) fs.writeFileSync(path.join(dir, 'decision.md'), data.decision);

  if (data.rounds) {
    for (const [roundNum, reviews] of Object.entries(data.rounds)) {
      const rDir = path.join(dir, `round-${roundNum}`);
      fs.mkdirSync(rDir, { recursive: true });
      for (const [lens, content] of Object.entries(reviews)) {
        fs.writeFileSync(path.join(rDir, `review-${lens}.md`), content);
      }
    }
  }

  if (data.logs) {
    for (const [logName, content] of Object.entries(data.logs)) {
      fs.writeFileSync(path.join(dir, 'logs', `${logName}.log`), content);
    }
  }
}

// 002-rate-limit-middleware (Merged)
writeJobFiles('002-rate-limit-middleware', {
  job: {
    id: '002-rate-limit-middleware',
    feature: 'Issue #14: Redis sliding-window rate limiter',
    branch: 'factory/002-rate-limit-middleware',
    worktree: `${repoRoot}/factory/worktrees/002-rate-limit-middleware`,
    stage: 'merged',
    round: 1,
    issue_number: 14,
    active_agents: [],
    reviews: { security: 'PASS', ux: 'PASS', ui: 'PASS', code: 'PASS' },
    tokens: {
      prompt: 61400,
      completion: 9200,
      total: 70600,
      by_agent: {
        'spec-writer': { prompt: 12100, completion: 1800, total: 13900, model: 'gemini-3.8-flash' },
        'builder': { prompt: 26800, completion: 4300, total: 31100, model: 'gemini-3.8-flash' },
        'reviewer-security': { prompt: 4800, completion: 720, total: 5520, model: 'gemini-3.8-flash' },
        'reviewer-code': { prompt: 4600, completion: 690, total: 5290, model: 'gemini-3.8-flash' },
        'reviewer-ui': { prompt: 4200, completion: 580, total: 4780, model: 'gemini-3.8-flash' },
        'reviewer-ux': { prompt: 4400, completion: 610, total: 5010, model: 'gemini-3.8-flash' },
        'approver': { prompt: 4500, completion: 500, total: 5000, model: 'gemini-3.8-flash' }
      }
    }
  },
  spec: `# Redis Sliding-Window Rate Limiter\n\n> Feature: Issue #14: Redis sliding-window rate limiter\n\n## Requirements\n1. Enforce per-IP and per-token sliding-window limits using atomic Lua scripts.\n2. Return RFC 6585 \`429 Too Many Requests\` with \`Retry-After\` header.\n\n## Acceptance criteria\n1. Burst traffic above 120 req/min returns 429 with accurate reset headers.\n2. Fallback in-memory bucket engages cleanly if Redis connection drops.\n`,
  build: `STATUS: READY\n\n# Build: Redis Sliding-Window Rate Limiter\n\n## Summary\nImplemented atomic Lua sliding-window middleware and 429 response headers.\n\n## Validation\n- Tests: PASS (44/44 unit & integration tests)\n`,
  decision: `APPROVE\n\n# Decision: 002-rate-limit-middleware\n\nAll 4 review lenses passed on Round 1. Merged cleanly into \`main\`.\n`,
  rounds: {
    1: {
      security: `VERDICT: PASS\n\n# Security Review: Round 1\nAtomic Lua execution prevents race conditions under concurrent burst load.\n`,
      ux: `VERDICT: PASS\n\n# UX Review: Round 1\nClear Retry-After countdown message shown in toast banner.\n`,
      ui: `VERDICT: PASS\n\n# UI Review: Round 1\nRate-limit warning badge matches design system tokens.\n`,
      code: `VERDICT: PASS\n\n# Code Review: Round 1\nClean middleware composition and 100% branch coverage.\n`
    }
  },
  logs: {
    combined: `[18:20:04] [spec-writer] Wrote spec.md for Issue #14\n[18:22:19] [builder] Implemented Redis Lua sliding window + fallback\n[18:22:45] [builder] STATUS: READY\n[18:23:12] [reviewer-security] VERDICT: PASS\n[18:23:18] [reviewer-code] VERDICT: PASS\n[18:23:24] [reviewer-ui] VERDICT: PASS\n[18:23:29] [reviewer-ux] VERDICT: PASS\n[18:23:50] [approver] Decision: APPROVE\n[18:24:02] [factory] Merged factory/002-rate-limit-middleware into main\n`
  }
});

// 003-webhook-retry-queue (Needs Human after 3 rounds)
writeJobFiles('003-webhook-retry-queue', {
  job: {
    id: '003-webhook-retry-queue',
    feature: 'Issue #19: Exponential backoff webhook dispatcher',
    branch: 'factory/003-webhook-retry-queue',
    worktree: `${repoRoot}/factory/worktrees/003-webhook-retry-queue`,
    stage: 'needs-human',
    round: 3,
    issue_number: 19,
    active_agents: [],
    reviews: { security: 'CHANGES', ux: 'PASS', ui: 'PASS', code: 'PASS' },
    tokens: {
      prompt: 112400,
      completion: 18600,
      total: 131000,
      by_agent: {
        'spec-writer': { prompt: 13400, completion: 2100, total: 15500, model: 'gemini-3.8-flash' },
        'builder': { prompt: 58200, completion: 9800, total: 68000, model: 'gemini-3.8-flash' },
        'reviewer-security': { prompt: 12400, completion: 2200, total: 14600, model: 'gemini-3.8-flash' },
        'reviewer-code': { prompt: 9800, completion: 1600, total: 11400, model: 'gemini-3.8-flash' },
        'reviewer-ui': { prompt: 9200, completion: 1400, total: 10600, model: 'gemini-3.8-flash' },
        'reviewer-ux': { prompt: 9400, completion: 1500, total: 10900, model: 'gemini-3.8-flash' }
      }
    }
  },
  spec: `# Exponential Backoff Webhook Dispatcher\n\n> Feature: Issue #19: Exponential backoff webhook dispatcher\n\n## Requirements\n1. Retry failed outbound webhooks up to 5 times with jittered exponential backoff.\n2. Sign payloads with HMAC-SHA256 and guard against SSRF targets.\n`,
  build: `STATUS: READY\n\n# Build: Exponential Backoff Webhook Dispatcher\n\n## Summary\nImplemented dead-letter queue, jittered backoff worker, and HMAC signing.\n`,
  decision: `ESCALATE\n\nReview rounds exhausted (3 rounds completed).\nOutstanding CHANGES in round-3/review-security.md require human review (DNS rebinding guard needs VPC CIDR allowlist decision).\n`,
  rounds: {
    1: {
      security: `VERDICT: CHANGES\n\n# Security Review: Round 1\nOutbound webhook URLs must block RFC 1918 private network ranges.\n`,
      ux: `VERDICT: PASS\n\n# UX Review: Round 1\nRetry timeline clearly displays next attempt timestamp.\n`,
      ui: `VERDICT: PASS\n\n# UI Review: Round 1\nStatus pills align with design tokens.\n`,
      code: `VERDICT: CHANGES\n\n# Code Review: Round 1\nExtract backoff jitter calculation into a pure helper for deterministic testing.\n`
    },
    2: {
      security: `VERDICT: CHANGES\n\n# Security Review: Round 2\nStatic IP parsing added, but custom DNS resolver hook is still vulnerable to DNS rebinding.\n`,
      ux: `VERDICT: PASS\n\n# UX Review: Round 2\nPASS.\n`,
      ui: `VERDICT: PASS\n\n# UI Review: Round 2\nPASS.\n`,
      code: `VERDICT: PASS\n\n# Code Review: Round 2\nJitter helper extracted and covered by unit tests.\n`
    },
    3: {
      security: `VERDICT: CHANGES\n\n# Security Review: Round 3\nRequires architectural decision on whether internal staging subnets (10.20.0.0/16) are permitted targets.\n`,
      ux: `VERDICT: PASS\n\n# UX Review: Round 3\nPASS.\n`,
      ui: `VERDICT: PASS\n\n# UI Review: Round 3\nPASS.\n`,
      code: `VERDICT: PASS\n\n# Code Review: Round 3\nPASS.\n`
    }
  },
  logs: {
    combined: `[18:31:10] [spec-writer] Drafted spec.md for Issue #19\n[18:35:02] [builder] Round 1 build complete -> STATUS: READY\n[18:36:14] [reviewer-security] VERDICT: CHANGES (block RFC 1918 ranges)\n[18:36:20] [reviewer-code] VERDICT: CHANGES (extract jitter helper)\n[18:40:11] [builder] Round 2 build complete -> STATUS: READY\n[18:41:09] [reviewer-security] VERDICT: CHANGES (DNS rebinding check)\n[18:45:30] [builder] Round 3 build complete -> STATUS: READY\n[18:46:42] [reviewer-security] VERDICT: CHANGES (needs human subnet policy decision)\n[18:46:45] [factory] ESCALATE: Max review rounds (3) reached -> stage: needs-human\n`
  }
});

// 004-oauth-pkce-flow (Hero Job - Merged after Round 1 CHANGES -> Round 2 PASS)
writeJobFiles('004-oauth-pkce-flow', {
  job: {
    id: '004-oauth-pkce-flow',
    feature: 'Issue #27: OAuth 2.1 PKCE login + session vault',
    branch: 'factory/004-oauth-pkce-flow',
    worktree: `${repoRoot}/factory/worktrees/004-oauth-pkce-flow`,
    stage: 'merged',
    round: 2,
    issue_number: 27,
    active_agents: [],
    reviews: { security: 'PASS', ux: 'PASS', ui: 'PASS', code: 'PASS' },
    tokens: {
      prompt: 84600,
      completion: 13800,
      total: 98400,
      by_agent: {
        'spec-writer': { prompt: 13200, completion: 2100, total: 15300, model: 'gemini-3.8-flash' },
        'builder': { prompt: 38400, completion: 6400, total: 44800, model: 'gemini-3.8-flash' },
        'reviewer-security': { prompt: 8200, completion: 1350, total: 9550, model: 'gemini-3.8-flash' },
        'reviewer-code': { prompt: 7900, completion: 1250, total: 9150, model: 'gemini-3.8-flash' },
        'reviewer-ui': { prompt: 6400, completion: 1100, total: 7500, model: 'gemini-3.8-flash' },
        'reviewer-ux': { prompt: 6100, completion: 980, total: 7080, model: 'gemini-3.8-flash' },
        'approver': { prompt: 4400, completion: 620, total: 5020, model: 'gemini-3.8-flash' }
      }
    }
  },
  spec: `# OAuth 2.1 PKCE Login + Session Vault\n\n> Feature: Issue #27: OAuth 2.1 PKCE login + session vault\n\n## Requirements\n1. Generate cryptographic \`code_verifier\` and S256 \`code_challenge\` per RFC 7636.\n2. Store rotating refresh tokens in HttpOnly SameSite=Strict encrypted vault cookies.\n3. Provide accessible keyboard focus states and loading spinners during provider redirect.\n`,
  build: `STATUS: READY\n\n# Build: OAuth 2.1 PKCE Login + Session Vault\n\n## Summary\nImplemented PKCE S256 challenge generator, encrypted session vault, and fixed keyboard focus-visible ring in Round 2.\n\n## Validation\n- Tests: PASS (52/52 assertions passing)\n`,
  decision: `APPROVE\n\n# Decision: 004-oauth-pkce-flow\n\nRound 1 UI focus-ring feedback was resolved cleanly by \`builder\` in Round 2. All 4 review lenses report PASS. Merged to \`main\`.\n`,
  rounds: {
    1: {
      security: `VERDICT: PASS\n\n# Security Review: Round 1\n256-bit entropy on code_verifier, state parameter bound to session nonce, HttpOnly cookie flags verified.\n`,
      ux: `VERDICT: PASS\n\n# UX Review: Round 1\nError states for expired authorization codes and cancelled prompts are clear and actionable.\n`,
      ui: `VERDICT: CHANGES\n\n# UI Review: Round 1\nOAuth provider button is missing \`outline: 2px solid var(--active)\` on \`:focus-visible\` at mobile viewport (375px).\n`,
      code: `VERDICT: PASS\n\n# Code Review: Round 1\nClean PKCE crypto module with zero external dependencies.\n`
    },
    2: {
      security: `VERDICT: PASS\n\n# Security Review: Round 2\nNo security regressions introduced by CSS focus-ring update.\n`,
      ux: `VERDICT: PASS\n\n# UX Review: Round 2\nKeyboard tab navigation order verified across login modal.\n`,
      ui: `VERDICT: PASS\n\n# UI Review: Round 2\nFocus ring token \`--active\` (#8be9fd) renders crisply at 1440px and 375px.\n`,
      code: `VERDICT: PASS\n\n# Code Review: Round 2\nSnapshot and E2E tests updated and passing.\n`
    }
  },
  logs: {
    combined: `[18:50:01] [spec-writer] Formulating PKCE & session vault acceptance criteria\n[18:51:14] [builder] Implementing S256 PKCE flow on branch factory/004-oauth-pkce-flow\n[18:52:40] [builder] STATUS: READY (Round 1)\n[18:53:05] [reviewer-security] VERDICT: PASS (S256 entropy & cookie flags verified)\n[18:53:12] [reviewer-ux] VERDICT: PASS (redirect & error states verified)\n[18:53:19] [reviewer-code] VERDICT: PASS (52/52 unit tests pass)\n[18:53:28] [reviewer-ui] VERDICT: CHANGES (missing :focus-visible ring at 375px)\n[18:53:30] [factory] Resuming builder (1 of 2 max resumes) to address Round 1 UI feedback\n[18:54:15] [builder] Patched .oauth-btn:focus-visible token + verified on port 5140\n[18:54:22] [builder] STATUS: READY (Round 2)\n[18:54:48] [reviewer-security] VERDICT: PASS\n[18:54:51] [reviewer-ux] VERDICT: PASS\n[18:54:55] [reviewer-ui] VERDICT: PASS\n[18:54:58] [reviewer-code] VERDICT: PASS\n[18:55:12] [approver] Decision: APPROVE\n[18:55:20] [factory] Merged factory/004-oauth-pkce-flow into main\n`
  }
});

// 005-dark-mode-contrast (Currently in Review Round 1 - 2 PASS, 2 running)
writeJobFiles('005-dark-mode-contrast', {
  job: {
    id: '005-dark-mode-contrast',
    feature: 'Issue #31: WCAG AAA contrast tokens for telemetry charts',
    branch: 'factory/005-dark-mode-contrast',
    worktree: `${repoRoot}/factory/worktrees/005-dark-mode-contrast`,
    stage: 'review',
    round: 1,
    issue_number: 31,
    active_agents: [
      { name: 'reviewer-ui', status: 'running' },
      { name: 'reviewer-ux', status: 'running' }
    ],
    reviews: { security: 'PASS', ux: 'pending', ui: 'pending', code: 'PASS' },
    tokens: {
      prompt: 42800,
      completion: 6900,
      total: 49700,
      by_agent: {
        'spec-writer': { prompt: 10800, completion: 1650, total: 12450, model: 'gemini-3.8-flash' },
        'builder': { prompt: 23400, completion: 3950, total: 27350, model: 'gemini-3.8-flash' },
        'reviewer-security': { prompt: 4100, completion: 620, total: 4720, model: 'gemini-3.8-flash' },
        'reviewer-code': { prompt: 4500, completion: 680, total: 5180, model: 'gemini-3.8-flash' }
      }
    }
  },
  spec: `# WCAG AAA Contrast Tokens for Telemetry Charts\n\n> Feature: Issue #31: WCAG AAA contrast tokens for telemetry charts\n\n## Requirements\n1. Ensure all chart series and axis labels meet >= 7:1 contrast ratio against \`#14151b\`.\n`,
  build: `STATUS: READY\n\n# Build: WCAG AAA Contrast Tokens\n\nUpdated chart palette and SVG stroke dash patterns for colorblind accessibility.\n`,
  rounds: {
    1: {
      security: `VERDICT: PASS\n\n# Security Review: Round 1\nCSS token updates only; no security surface impacted.\n`,
      code: `VERDICT: PASS\n\n# Code Review: Round 1\nClean CSS custom properties and unit contrast assertions.\n`
    }
  },
  logs: {
    'reviewer-ui': `[19:01:12] [reviewer-ui] Launching browser_subagent on http://localhost:5151/dashboard.html\n[19:01:18] [reviewer-ui] Measuring luminance ratios across 6 telemetry series at 1440x900...\n`,
    'reviewer-ux': `[19:01:14] [reviewer-ux] Auditing screen-reader aria-labels and keyboard legend toggles on port 5152...\n`,
    combined: `[18:58:10] [spec-writer] Spec completed for Issue #31\n[19:00:45] [builder] Build completed on factory/005-dark-mode-contrast -> STATUS: READY\n[19:01:05] [reviewer-security] VERDICT: PASS\n[19:01:09] [reviewer-code] VERDICT: PASS\n[19:01:12] [reviewer-ui] Inspecting responsive chart contrast on port 5151...\n[19:01:14] [reviewer-ux] Testing tooltip keyboard navigation on port 5152...\n`
  }
});

// 006-audit-log-export (Currently in Build)
writeJobFiles('006-audit-log-export', {
  job: {
    id: '006-audit-log-export',
    feature: 'Issue #35: Streaming CSV/JSON audit log export',
    branch: 'factory/006-audit-log-export',
    worktree: `${repoRoot}/factory/worktrees/006-audit-log-export`,
    stage: 'build',
    round: 0,
    issue_number: 35,
    active_agents: [
      { name: 'builder', status: 'running' }
    ],
    reviews: { security: 'pending', ux: 'pending', ui: 'pending', code: 'pending' },
    tokens: {
      prompt: 29400,
      completion: 4800,
      total: 34200,
      by_agent: {
        'spec-writer': { prompt: 11400, completion: 1750, total: 13150, model: 'gemini-3.8-flash' },
        'builder': { prompt: 18000, completion: 3050, total: 21050, model: 'gemini-3.8-flash' }
      }
    }
  },
  spec: `# Streaming CSV/JSON Audit Log Export\n\n> Feature: Issue #35: Streaming CSV/JSON audit log export\n\n## Requirements\n1. Stream NDJSON and RFC 4180 CSV exports without buffering full dataset in memory.\n2. Sanitize formula-injection prefixes (\`=\`, \`+\`, \`-\`, \`@\`) in CSV cells.\n`,
  logs: {
    builder: `[19:01:02] [builder] Checked out worktree factory/worktrees/006-audit-log-export\n[19:01:10] [builder] Implementing ReadableStream CSV serializer with formula-injection guard\n[19:01:22] [builder] Running vitest suite on port 5160 (18/18 passing)...\n`,
    combined: `[18:59:50] [spec-writer] Spec written to factory/jobs/006-audit-log-export/spec.md\n[19:01:02] [builder] Implementing streaming CSV/JSON endpoint in worktree...\n[19:01:22] [builder] Running validation tests from AGENTS.md...\n`
  }
});

console.log('✅ Seeded 5 realistic dummy jobs (002..006) in factory/jobs/');

