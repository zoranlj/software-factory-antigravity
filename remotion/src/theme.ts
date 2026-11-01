export const THEME = {
  bg: '#14151b',
  panel: '#1a1c24',
  card: '#20222c',
  cardHover: '#252835',
  line: '#2b2e3b',
  text: '#e4e5ea',
  muted: '#868ba0',
  faint: '#5b6075',
  active: '#8be9fd',
  pass: '#50fa7b',
  changes: '#ffb86c',
  human: '#ff79c6',
  merged: '#bd93f9',
  tok: '#f1fa8c',
  terminalBg: '#0d0e14',
  terminalLine: '#1e202a',
  fontSans: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
  fontMono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
} as const;

export const AGENT_COLORS: Record<string, string> = {
  'spec-writer': '#bd93f9',
  builder: '#8be9fd',
  'reviewer-security': '#ff79c6',
  'reviewer-code': '#50fa7b',
  'reviewer-ui': '#ffb86c',
  'reviewer-ux': '#f1fa8c',
  approver: '#bd93f9',
};

export const STAGES = [
  { key: 'spec', label: 'Spec', who: 'spec-writer · opus' },
  { key: 'build', label: 'Build', who: 'builder · opus' },
  { key: 'review', label: 'Review', who: 'sec · ux · ui · code' },
  { key: 'approve', label: 'Approve', who: 'approver · opus' },
  { key: 'merged', label: 'Merged', who: 'main', cls: 'merged-col' },
  { key: 'needs-human', label: 'Needs human', who: 'approve · rework', cls: 'human' },
] as const;

export type StageKey = (typeof STAGES)[number]['key'];
export type Verdict = 'PASS' | 'CHANGES' | 'pending';

export interface ReviewRound {
  round: number;
  verdicts: {
    security: Verdict;
    ux: Verdict;
    ui: Verdict;
    code: Verdict;
  };
  waiting?: boolean;
}

export interface AgentTokenStat {
  agent: string;
  prompt: number;
  completion: number;
  total: number;
  model: string;
}

export interface JobCardData {
  id: string;
  feature: string;
  branch: string;
  stage: StageKey;
  activeAgents: string[];
  tokensTotal: number;
  promptTokens: number;
  completionTokens: number;
  rounds: ReviewRound[];
  hint?: string[];
  highlightRing?: boolean;
}

const INPUT_PRICE_PER_M = 0.75;
const OUTPUT_PRICE_PER_M = 3.75;

export function calcCost(promptTokens: number, completionTokens: number): number {
  return (promptTokens * INPUT_PRICE_PER_M + completionTokens * OUTPUT_PRICE_PER_M) / 1_000_000;
}

export function formatCost(cost: number): string {
  if (!cost || cost <= 0) return '$0.00';
  if (cost < 0.01) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

export function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(Math.round(n));
}

