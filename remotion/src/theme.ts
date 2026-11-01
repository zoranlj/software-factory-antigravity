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
  fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

export const AGENT_COLORS: Record<string, string> = {
  'spec-writer': '#bd93f9',
  builder: '#8be9fd',
  'reviewer-security': '#ff79c6',
  'reviewer-code': '#50fa7b',
  'reviewer-ui': '#ffb86c',
  'reviewer-ux': '#f1fa8c',
  approver: '#bd93f9',
  factory: '#8be9fd',
};

export const STAGES = [
  { key: 'spec', label: 'Spec', who: 'spec-writer · flash' },
  { key: 'build', label: 'Build', who: 'builder · flash' },
  { key: 'review', label: 'Review', who: 'sec · ux · ui · code' },
  { key: 'approve', label: 'Approve', who: 'approver · flash' },
  { key: 'merged', label: 'Merged', who: 'main', cls: 'merged-col' },
  { key: 'needs-human', label: 'Needs human', who: 'approve · rework', cls: 'human' },
] as const;

export type StageKey = (typeof STAGES)[number]['key'];
export type Verdict = 'pending' | 'PASS' | 'CHANGES';

export interface ReviewMap {
  security: Verdict;
  ux: Verdict;
  ui: Verdict;
  code: Verdict;
}

export interface AgentTokenStat {
  prompt: number;
  completion: number;
  total: number;
  model: string;
}

export interface JobState {
  id: string;
  feature: string;
  branch: string;
  stage: StageKey;
  round: number;
  active_agents: string[];
  pastRounds: ReviewMap[];
  reviews: ReviewMap;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
    by_agent: Record<string, AgentTokenStat>;
  };
  highlight?: boolean;
  reworkPulse?: boolean;
}

export function formatNum(n: number): string {
  if (!n || n <= 0) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return String(Math.round(n));
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

