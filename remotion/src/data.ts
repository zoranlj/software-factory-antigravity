import { AgentTokenStat } from './theme';

export interface TerminalLogEntry {
  appearFrame: number;
  time: string;
  agent: string;
  text: string;
  tone?: 'normal' | 'agent' | 'pass' | 'warn' | 'err' | 'tok';
}

export const HERO_AGENT_BREAKDOWN: AgentTokenStat[] = [
  { agent: 'spec-writer', prompt: 11200, completion: 1450, total: 12650, model: 'gemini-3.8-flash' },
  { agent: 'builder', prompt: 22100, completion: 3250, total: 25350, model: 'gemini-3.8-flash' },
  { agent: 'reviewer-security', prompt: 4100, completion: 580, total: 4680, model: 'gemini-3.8-flash' },
  { agent: 'reviewer-code', prompt: 4350, completion: 690, total: 5040, model: 'gemini-3.8-flash' },
  { agent: 'reviewer-ui', prompt: 4020, completion: 610, total: 4630, model: 'gemini-3.8-flash' },
  { agent: 'reviewer-ux', prompt: 4180, completion: 640, total: 4820, model: 'gemini-3.8-flash' },
  { agent: 'approver', prompt: 4200, completion: 510, total: 4710, model: 'gemini-3.8-flash' },
];

export const TERMINAL_LOGS: TerminalLogEntry[] = [
  {
    appearFrame: 310,
    time: '15:54:02',
    agent: 'spec-writer',
    text: 'Claimed backlog item #1 -> creating job 001-token-usage-refactor',
    tone: 'agent',
  },
  {
    appearFrame: 355,
    time: '15:54:04',
    agent: 'spec-writer',
    text: 'Reading AGENTS.md ground truth & inspecting factory/dashboard.html...',
    tone: 'normal',
  },
  {
    appearFrame: 415,
    time: '15:54:07',
    agent: 'spec-writer',
    text: 'Wrote factory/jobs/001-token-usage-refactor/spec.md (6 requirements, 4 AC)',
    tone: 'pass',
  },
  {
    appearFrame: 465,
    time: '15:54:08',
    agent: 'spec-writer',
    text: 'Tokens: prompt=11,200 completion=1,450 total=12,650 ($0.014)',
    tone: 'tok',
  },
  {
    appearFrame: 525,
    time: '15:54:10',
    agent: 'builder',
    text: 'git worktree add factory/worktrees/001-token-usage-refactor -b factory/001-token-usage-refactor',
    tone: 'agent',
  },
  {
    appearFrame: 590,
    time: '15:54:14',
    agent: 'builder',
    text: 'Updated #d-tok-widget in factory/dashboard.html with (in/out) & .tok-model badge',
    tone: 'normal',
  },
  {
    appearFrame: 660,
    time: '15:54:18',
    agent: 'builder',
    text: 'browser_subagent -> verified responsive drawer layout at http://localhost:8000',
    tone: 'pass',
  },
  {
    appearFrame: 735,
    time: '15:54:21',
    agent: 'builder',
    text: 'STATUS: READY · ./tests/factory-verify.sh (37/37 passing) · committed 36d40fa',
    tone: 'pass',
  },
  {
    appearFrame: 890,
    time: '15:54:23',
    agent: 'reviewer-security',
    text: '[Round 1] Auditing diff for XSS, innerHTML escaping, and secret exposure...',
    tone: 'normal',
  },
  {
    appearFrame: 940,
    time: '15:54:25',
    agent: 'reviewer-code',
    text: '[Round 1] VERDICT: PASS — Clean fallback handling in calcCost() & formatNum()',
    tone: 'pass',
  },
  {
    appearFrame: 990,
    time: '15:54:26',
    agent: 'reviewer-security',
    text: '[Round 1] VERDICT: PASS — All dynamic model names escaped via esc()',
    tone: 'pass',
  },
  {
    appearFrame: 1030,
    time: '15:54:27',
    agent: 'reviewer-ux',
    text: '[Round 1] VERDICT: PASS — Clear cost tooltip & zero-state fallback verified',
    tone: 'pass',
  },
  {
    appearFrame: 1075,
    time: '15:54:28',
    agent: 'reviewer-ui',
    text: '[Round 1] VERDICT: CHANGES — .tok-legend-item wraps awkwardly at 240px column width',
    tone: 'warn',
  },
  {
    appearFrame: 1200,
    time: '15:54:31',
    agent: 'builder',
    text: '[Rework R2] Adjusted .tok-legend grid minmax(260px, 1fr) & flex-shrink:0 on .tok-vals',
    tone: 'agent',
  },
  {
    appearFrame: 1295,
    time: '15:54:35',
    agent: 'reviewer-ui',
    text: '[Round 2] VERDICT: PASS — Legend alignment crisp across desktop & mobile drawers',
    tone: 'pass',
  },
  {
    appearFrame: 1350,
    time: '15:54:36',
    agent: 'reviewer-code',
    text: '[Round 2] All 4 review lenses returned PASS (4/4). Advancing to approver.',
    tone: 'pass',
  },
  {
    appearFrame: 1475,
    time: '15:54:39',
    agent: 'approver',
    text: 'DECISION: APPROVE — All 4 AC verified, 39/39 assertions passing. Merging to main.',
    tone: 'pass',
  },
];

