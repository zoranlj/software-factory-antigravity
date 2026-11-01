import { interpolate } from 'remotion';
import { JobState, ReviewMap, Verdict } from '../theme';

export interface LogEntry {
  frame: number;
  time: string;
  jobNum: string;
  agent: string;
  message: string;
  tone?: 'normal' | 'pass' | 'warn' | 'err' | 'tok';
}

export interface ReviewerLaneState {
  id: 'reviewer-security' | 'reviewer-ux' | 'reviewer-ui' | 'reviewer-code';
  short: 'sec' | 'ux' | 'ui' | 'code';
  title: string;
  color: string;
  port?: number;
  progress: number; // 0..1
  verdict: Verdict;
  taskText: string;
  evidenceLines: string[];
  findingNote?: string;
}

export interface TimelineSnapshot {
  act: 1 | 2 | 3 | 4 | 5 | 6;
  actTitle: string;
  actSubtitle: string;
  pipelineStep: 'command' | 'spec' | 'build' | 'review-r1' | 'rework' | 'review-r2' | 'approve' | 'merged' | 'panorama';
  jobs: JobState[];
  logs: LogEntry[];
  reviewArena: {
    visible: boolean;
    round: 1 | 2;
    lanes: ReviewerLaneState[];
  };
  reworkBanner: {
    visible: boolean;
    progress: number;
  };
  drawer: {
    open: boolean;
    openProgress: number;
    selectedFile: 'decision.md' | 'round-2/review-ui.md' | 'spec.md';
  };
}

const ALL_LOGS: LogEntry[] = [
  { frame: 30, time: '18:50:01', jobNum: '004', agent: 'factory', message: 'Claimed Issue #27 -> provisioning isolated git worktree factory/worktrees/004-oauth-pkce-flow' },
  { frame: 95, time: '18:50:03', jobNum: '004', agent: 'factory', message: 'git worktree add -b factory/004-oauth-pkce-flow ./factory/worktrees/004-oauth-pkce-flow main' },
  { frame: 185, time: '18:50:05', jobNum: '004', agent: 'spec-writer', message: 'Initializing spec-writer persona for 004-oauth-pkce-flow' },
  { frame: 230, time: '18:50:12', jobNum: '004', agent: 'spec-writer', message: 'Inspecting auth routes & session middleware in worktree...' },
  { frame: 280, time: '18:50:28', jobNum: '004', agent: 'spec-writer', message: 'Wrote factory/jobs/004-oauth-pkce-flow/spec.md (6 testable acceptance criteria)', tone: 'pass' },
  { frame: 315, time: '18:50:30', jobNum: '004', agent: 'spec-writer', message: 'Token usage: 13,200 prompt, 2,100 completion (Total: 15,300)', tone: 'tok' },
  { frame: 355, time: '18:50:42', jobNum: '002', agent: 'factory', message: 'Merged factory/002-rate-limit-middleware into main (44/44 tests pass)', tone: 'pass' },
  { frame: 375, time: '18:50:48', jobNum: '004', agent: 'builder', message: 'Allocated dev server port 5140 · Implementing RFC 7636 S256 PKCE challenge & session vault' },
  { frame: 440, time: '18:51:35', jobNum: '004', agent: 'builder', message: 'Running validation suite from AGENTS.md: 50/50 unit & integration tests passing', tone: 'pass' },
  { frame: 490, time: '18:52:10', jobNum: '004', agent: 'builder', message: 'Visual check via browser_subagent on http://localhost:5140/login -> committed 8f3a91c' },
  { frame: 525, time: '18:52:40', jobNum: '004', agent: 'builder', message: 'Wrote build.md -> STATUS: READY (Round 1)', tone: 'pass' },
  { frame: 550, time: '18:52:42', jobNum: '004', agent: 'factory', message: 'Dispatching 4 parallel review agents for Round 1: [security, ux, ui, code]' },
  { frame: 610, time: '18:52:55', jobNum: '004', agent: 'reviewer-security', message: 'Auditing PKCE code_verifier entropy (256-bit) & HttpOnly SameSite=Strict cookie flags...' },
  { frame: 635, time: '18:52:58', jobNum: '004', agent: 'reviewer-ux', message: 'Testing OAuth error states, loading spinner & keyboard flow on port 5142...' },
  { frame: 660, time: '18:53:01', jobNum: '004', agent: 'reviewer-ui', message: 'Inspecting responsive layout at 1440x900 and 375x812 on port 5141...' },
  { frame: 685, time: '18:53:04', jobNum: '004', agent: 'reviewer-code', message: 'Checking cyclomatic complexity, TypeScript strictness, and PKCE test coverage...' },
  { frame: 770, time: '18:53:12', jobNum: '004', agent: 'reviewer-security', message: 'round-1/review-security.md -> VERDICT: PASS', tone: 'pass' },
  { frame: 810, time: '18:53:18', jobNum: '004', agent: 'reviewer-ux', message: 'round-1/review-ux.md -> VERDICT: PASS', tone: 'pass' },
  { frame: 845, time: '18:53:22', jobNum: '004', agent: 'reviewer-code', message: 'round-1/review-code.md -> VERDICT: PASS', tone: 'pass' },
  { frame: 890, time: '18:53:28', jobNum: '004', agent: 'reviewer-ui', message: 'round-1/review-ui.md -> VERDICT: CHANGES (missing :focus-visible ring at 375px)', tone: 'warn' },
  { frame: 995, time: '18:53:30', jobNum: '004', agent: 'factory', message: 'Round 1 has CHANGES -> Auto-resuming builder (resume 1 of MAX_RESUMES=2)', tone: 'warn' },
  { frame: 1055, time: '18:53:55', jobNum: '004', agent: 'builder', message: 'Reading round-1/review-ui.md · Adding outline: 2px solid var(--active) to .oauth-btn:focus-visible' },
  { frame: 1125, time: '18:54:18', jobNum: '004', agent: 'builder', message: 'Verified 375px mobile focus ring via browser_subagent · 52/52 tests pass -> STATUS: READY', tone: 'pass' },
  { frame: 1170, time: '18:54:24', jobNum: '004', agent: 'factory', message: 'Starting Review Round 2 across all 4 parallel lenses...' },
  { frame: 1230, time: '18:54:48', jobNum: '004', agent: 'reviewer-security', message: 'round-2/review-security.md -> VERDICT: PASS', tone: 'pass' },
  { frame: 1250, time: '18:54:51', jobNum: '004', agent: 'reviewer-ux', message: 'round-2/review-ux.md -> VERDICT: PASS', tone: 'pass' },
  { frame: 1275, time: '18:54:55', jobNum: '004', agent: 'reviewer-ui', message: 'round-2/review-ui.md -> VERDICT: PASS (focus-visible token verified)', tone: 'pass' },
  { frame: 1295, time: '18:54:58', jobNum: '004', agent: 'reviewer-code', message: 'round-2/review-code.md -> VERDICT: PASS', tone: 'pass' },
  { frame: 1335, time: '18:55:04', jobNum: '004', agent: 'approver', message: 'Inspecting git diff main...factory/004-oauth-pkce-flow, build.md, and Round 2 verdicts' },
  { frame: 1395, time: '18:55:12', jobNum: '004', agent: 'approver', message: 'Wrote decision.md -> APPROVE (all 6 acceptance criteria verified)', tone: 'pass' },
  { frame: 1450, time: '18:55:20', jobNum: '004', agent: 'factory', message: 'git merge --no-ff factory/004-oauth-pkce-flow · Removed worktree · Closed Issue #27', tone: 'pass' },
  { frame: 1640, time: '18:55:30', jobNum: '005', agent: 'reviewer-ui', message: 'Auditing WCAG AAA contrast ratios across 6 telemetry chart series...' },
  { frame: 1690, time: '18:55:42', jobNum: '006', agent: 'builder', message: 'Streaming CSV export benchmark: 100k rows serialized with zero heap spike', tone: 'pass' },
];

export function getFactoryStateAtFrame(frame: number): TimelineSnapshot {
  // Determine Act & Chapter
  let act: 1 | 2 | 3 | 4 | 5 | 6 = 1;
  let actTitle = 'Act 1 · Trigger & Isolated Git Worktree';
  let actSubtitle = 'Slash command spawns a dedicated branch & worktree without touching main';
  let pipelineStep: TimelineSnapshot['pipelineStep'] = 'command';

  if (frame < 180) {
    act = 1;
    actTitle = 'Act 1 · Command Trigger & Git Worktree Isolation';
    actSubtitle = '/factory claims Issue #27 and provisions an isolated worktree on factory/004-oauth-pkce-flow';
    pipelineStep = 'command';
  } else if (frame < 540) {
    act = 2;
    if (frame < 340) {
      actTitle = 'Act 2 · Spec Writer Persona';
      actSubtitle = 'Explores the worktree codebase and formulates numbered, testable acceptance criteria in spec.md';
      pipelineStep = 'spec';
    } else {
      actTitle = 'Act 2 · Builder Persona & Visual Browser Verification';
      actSubtitle = 'Implements OAuth 2.1 PKCE in the worktree, runs tests, and verifies UI on port 5140';
      pipelineStep = 'build';
    }
  } else if (frame < 990) {
    act = 3;
    actTitle = 'Act 3 · 4x Parallel Review Lenses (Round 1)';
    actSubtitle = 'Security, UX, UI, and Code reviewers audit the build concurrently; UI flags a missing focus ring';
    pipelineStep = 'review-r1';
  } else if (frame < 1320) {
    act = 4;
    if (frame < 1160) {
      actTitle = 'Act 4 · Autonomous Rework Loop (Resume 1 of 2)';
      actSubtitle = 'Any CHANGES verdict routes the job back to Builder to patch findings without human intervention';
      pipelineStep = 'rework';
    } else {
      actTitle = 'Act 4 · Review Round 2 — All 4 Lenses PASS';
      actSubtitle = 'All 4 reviewers re-audit the updated commit in parallel and flip to green PASS';
      pipelineStep = 'review-r2';
    }
  } else if (frame < 1620) {
    act = 5;
    actTitle = 'Act 5 · Approver Gate, Token Breakdown & Merge to Main';
    actSubtitle = 'Approver audits criteria evidence & review verdicts, merges --no-ff to main, and cleans up worktree';
    pipelineStep = frame < 1445 ? 'approve' : 'merged';
  } else {
    act = 6;
    actTitle = 'Act 6 · Autonomous Multi-Agent Software Factory';
    actSubtitle = '7 specialized personas · Isolated Git worktrees · Live console & granular token telemetry';
    pipelineStep = 'panorama';
  }

  // Hero Job 004 progression
  const r1Sec: Verdict = frame >= 770 ? 'PASS' : 'pending';
  const r1Ux: Verdict = frame >= 810 ? 'PASS' : 'pending';
  const r1Code: Verdict = frame >= 845 ? 'PASS' : 'pending';
  const r1Ui: Verdict = frame >= 890 ? 'CHANGES' : 'pending';

  const r2Sec: Verdict = frame >= 1230 ? 'PASS' : 'pending';
  const r2Ux: Verdict = frame >= 1250 ? 'PASS' : 'pending';
  const r2Ui: Verdict = frame >= 1275 ? 'PASS' : 'pending';
  const r2Code: Verdict = frame >= 1295 ? 'PASS' : 'pending';

  let heroStage: JobState['stage'] = 'spec';
  let heroRound = 0;
  let heroActiveAgents: string[] = ['spec-writer'];
  let heroPastRounds: ReviewMap[] = [];
  let heroReviews: ReviewMap = { security: 'pending', ux: 'pending', ui: 'pending', code: 'pending' };

  if (frame < 340) {
    heroStage = 'spec';
    heroRound = 0;
    heroActiveAgents = ['spec-writer'];
  } else if (frame < 540) {
    heroStage = 'build';
    heroRound = 0;
    heroActiveAgents = ['builder'];
  } else if (frame < 990) {
    heroStage = 'review';
    heroRound = 1;
    heroReviews = { security: r1Sec, ux: r1Ux, ui: r1Ui, code: r1Code };
    heroActiveAgents = [
      ...(r1Sec === 'pending' ? ['reviewer-security'] : []),
      ...(r1Ux === 'pending' ? ['reviewer-ux'] : []),
      ...(r1Ui === 'pending' ? ['reviewer-ui'] : []),
      ...(r1Code === 'pending' ? ['reviewer-code'] : []),
    ];
  } else if (frame < 1160) {
    heroStage = 'build';
    heroRound = 1;
    heroPastRounds = [];
    heroReviews = { security: 'PASS', ux: 'PASS', ui: 'CHANGES', code: 'PASS' };
    heroActiveAgents = ['builder'];
  } else if (frame < 1320) {
    heroStage = 'review';
    heroRound = 2;
    heroPastRounds = [{ security: 'PASS', ux: 'PASS', ui: 'CHANGES', code: 'PASS' }];
    heroReviews = { security: r2Sec, ux: r2Ux, ui: r2Ui, code: r2Code };
    heroActiveAgents = [
      ...(r2Sec === 'pending' ? ['reviewer-security'] : []),
      ...(r2Ux === 'pending' ? ['reviewer-ux'] : []),
      ...(r2Ui === 'pending' ? ['reviewer-ui'] : []),
      ...(r2Code === 'pending' ? ['reviewer-code'] : []),
    ];
  } else if (frame < 1445) {
    heroStage = 'approve';
    heroRound = 2;
    heroPastRounds = [{ security: 'PASS', ux: 'PASS', ui: 'CHANGES', code: 'PASS' }];
    heroReviews = { security: 'PASS', ux: 'PASS', ui: 'PASS', code: 'PASS' };
    heroActiveAgents = ['approver'];
  } else {
    heroStage = 'merged';
    heroRound = 2;
    heroPastRounds = [{ security: 'PASS', ux: 'PASS', ui: 'CHANGES', code: 'PASS' }];
    heroReviews = { security: 'PASS', ux: 'PASS', ui: 'PASS', code: 'PASS' };
    heroActiveAgents = [];
  }

  // Smoothly interpolate Hero 004 token usage across the timeline
  const specPrompt = Math.round(interpolate(frame, [180, 320], [1200, 13200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const specComp = Math.round(interpolate(frame, [180, 320], [180, 2100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const buildR1Prompt = Math.round(interpolate(frame, [340, 530], [0, 26400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const buildR1Comp = Math.round(interpolate(frame, [340, 530], [0, 4300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const buildR2Prompt = Math.round(interpolate(frame, [995, 1150], [0, 12000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const buildR2Comp = Math.round(interpolate(frame, [995, 1150], [0, 2100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const revR1Scale = interpolate(frame, [540, 890], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const revR2Scale = interpolate(frame, [1160, 1295], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const revFactor = (revR1Scale * 0.55) + (revR2Scale * 0.45);

  const secPrompt = Math.round(8200 * revFactor);
  const secComp = Math.round(1350 * revFactor);
  const codePrompt = Math.round(7900 * revFactor);
  const codeComp = Math.round(1250 * revFactor);
  const uiPrompt = Math.round(6400 * revFactor);
  const uiComp = Math.round(1100 * revFactor);
  const uxPrompt = Math.round(6100 * revFactor);
  const uxComp = Math.round(980 * revFactor);

  const appPrompt = Math.round(interpolate(frame, [1320, 1420], [0, 4400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const appComp = Math.round(interpolate(frame, [1320, 1420], [0, 620], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const heroPrompt = specPrompt + buildR1Prompt + buildR2Prompt + secPrompt + codePrompt + uiPrompt + uxPrompt + appPrompt;
  const heroComp = specComp + buildR1Comp + buildR2Comp + secComp + codeComp + uiComp + uxComp + appComp;

  const heroByAgent: Record<string, { prompt: number; completion: number; total: number; model: string }> = {
    'spec-writer': { prompt: specPrompt, completion: specComp, total: specPrompt + specComp, model: 'gemini-3.8-flash' },
  };
  if (frame >= 340) {
    const bp = buildR1Prompt + buildR2Prompt;
    const bc = buildR1Comp + buildR2Comp;
    heroByAgent.builder = { prompt: bp, completion: bc, total: bp + bc, model: 'gemini-3.8-flash' };
  }
  if (frame >= 540) {
    heroByAgent['reviewer-security'] = { prompt: secPrompt, completion: secComp, total: secPrompt + secComp, model: 'gemini-3.8-flash' };
    heroByAgent['reviewer-code'] = { prompt: codePrompt, completion: codeComp, total: codePrompt + codeComp, model: 'gemini-3.8-flash' };
    heroByAgent['reviewer-ui'] = { prompt: uiPrompt, completion: uiComp, total: uiPrompt + uiComp, model: 'gemini-3.8-flash' };
    heroByAgent['reviewer-ux'] = { prompt: uxPrompt, completion: uxComp, total: uxPrompt + uxComp, model: 'gemini-3.8-flash' };
  }
  if (frame >= 1320) {
    heroByAgent.approver = { prompt: appPrompt, completion: appComp, total: appPrompt + appComp, model: 'gemini-3.8-flash' };
  }

  // Background Job 002 (Approve -> Merged at frame 355)
  const job002Stage: JobState['stage'] = frame < 355 ? 'approve' : 'merged';
  const job002Active = frame < 355 ? ['approver'] : [];

  // Background Job 005 (Build -> Review at frame 420)
  const job005Stage: JobState['stage'] = frame < 420 ? 'build' : 'review';
  const job005Round = frame < 420 ? 0 : 1;
  const job005Reviews: ReviewMap = {
    security: frame >= 620 ? 'PASS' : 'pending',
    ux: 'pending',
    ui: 'pending',
    code: frame >= 700 ? 'PASS' : 'pending',
  };
  const job005Active =
    frame < 420
      ? ['builder']
      : [
          ...(job005Reviews.security === 'pending' ? ['reviewer-security'] : []),
          ...(job005Reviews.ux === 'pending' ? ['reviewer-ux'] : []),
          ...(job005Reviews.ui === 'pending' ? ['reviewer-ui'] : []),
          ...(job005Reviews.code === 'pending' ? ['reviewer-code'] : []),
        ];

  // Background Job 006 (Spec -> Build at frame 640)
  const job006Stage: JobState['stage'] = frame < 640 ? 'spec' : 'build';
  const job006Active = frame < 640 ? ['spec-writer'] : ['builder'];
  const job006Tokens = Math.round(interpolate(frame, [0, 1800], [11200, 34200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const jobs: JobState[] = [
    {
      id: '001-token-usage-refactor',
      feature: 'Issue #1: Token usage refactor',
      branch: 'factory/001-token-usage-refactor',
      stage: 'merged',
      round: 1,
      active_agents: [],
      pastRounds: [],
      reviews: { security: 'PASS', ux: 'PASS', ui: 'PASS', code: 'PASS' },
      tokens: {
        prompt: 54150,
        completion: 7730,
        total: 61880,
        by_agent: {},
      },
    },
    {
      id: '002-rate-limit-middleware',
      feature: 'Issue #14: Redis sliding-window rate limiter',
      branch: 'factory/002-rate-limit-middleware',
      stage: job002Stage,
      round: 1,
      active_agents: job002Active,
      pastRounds: [],
      reviews: { security: 'PASS', ux: 'PASS', ui: 'PASS', code: 'PASS' },
      tokens: {
        prompt: 61400,
        completion: 9200,
        total: 70600,
        by_agent: {},
      },
    },
    {
      id: '003-webhook-retry-queue',
      feature: 'Issue #19: Exponential backoff webhook dispatcher',
      branch: 'factory/003-webhook-retry-queue',
      stage: 'needs-human',
      round: 3,
      active_agents: [],
      pastRounds: [
        { security: 'CHANGES', ux: 'PASS', ui: 'PASS', code: 'CHANGES' },
        { security: 'CHANGES', ux: 'PASS', ui: 'PASS', code: 'PASS' },
      ],
      reviews: { security: 'CHANGES', ux: 'PASS', ui: 'PASS', code: 'PASS' },
      tokens: {
        prompt: 112400,
        completion: 18600,
        total: 131000,
        by_agent: {},
      },
    },
    {
      id: '005-dark-mode-contrast',
      feature: 'Issue #31: WCAG AAA contrast tokens for charts',
      branch: 'factory/005-dark-mode-contrast',
      stage: job005Stage,
      round: job005Round,
      active_agents: job005Active,
      pastRounds: [],
      reviews: job005Reviews,
      tokens: {
        prompt: 42800,
        completion: 6900,
        total: 49700,
        by_agent: {},
      },
    },
    {
      id: '006-audit-log-export',
      feature: 'Issue #35: Streaming CSV/JSON audit log export',
      branch: 'factory/006-audit-log-export',
      stage: job006Stage,
      round: 0,
      active_agents: job006Active,
      pastRounds: [],
      reviews: { security: 'pending', ux: 'pending', ui: 'pending', code: 'pending' },
      tokens: {
        prompt: Math.round(job006Tokens * 0.85),
        completion: Math.round(job006Tokens * 0.15),
        total: job006Tokens,
        by_agent: {},
      },
    },
    {
      id: '004-oauth-pkce-flow',
      feature: 'Issue #27: OAuth 2.1 PKCE login + session vault',
      branch: 'factory/004-oauth-pkce-flow',
      stage: heroStage,
      round: heroRound,
      active_agents: heroActiveAgents,
      pastRounds: heroPastRounds,
      reviews: heroReviews,
      tokens: {
        prompt: heroPrompt,
        completion: heroComp,
        total: heroPrompt + heroComp,
        by_agent: heroByAgent,
      },
      highlight: true,
      reworkPulse: frame >= 990 && frame < 1160,
    },
  ];

  // Parallel Review Arena state (Act 3 Round 1 & Act 4 Round 2)
  const isRound1Arena = frame >= 555 && frame < 980;
  const isRound2Arena = frame >= 1170 && frame < 1315;
  const arenaRound: 1 | 2 = isRound2Arena ? 2 : 1;

  const lanes: ReviewerLaneState[] = [
    {
      id: 'reviewer-security',
      short: 'sec',
      title: 'Security Lens',
      color: '#ff79c6',
      progress: isRound1Arena
        ? interpolate(frame, [565, 770], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : interpolate(frame, [1175, 1230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      verdict: isRound1Arena ? r1Sec : r2Sec,
      taskText: 'OWASP · PKCE S256 entropy · Cookie flags',
      evidenceLines: [
        '✓ code_verifier: 32 bytes CSPRNG (256-bit)',
        '✓ code_challenge_method: S256 enforced',
        '✓ Set-Cookie: HttpOnly; Secure; SameSite=Strict',
      ],
    },
    {
      id: 'reviewer-ux',
      short: 'ux',
      title: 'UX Lens',
      color: '#f1fa8c',
      port: 5142,
      progress: isRound1Arena
        ? interpolate(frame, [575, 810], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : interpolate(frame, [1180, 1250], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      verdict: isRound1Arena ? r1Ux : r2Ux,
      taskText: 'Loading states · Error recovery · A11y labels',
      evidenceLines: [
        '✓ aria-busy="true" during PKCE token exchange',
        '✓ Actionable retry banner on expired state code',
        '✓ Screen-reader announce on provider redirect',
      ],
    },
    {
      id: 'reviewer-ui',
      short: 'ui',
      title: 'UI Lens',
      color: '#ffb86c',
      port: 5141,
      progress: isRound1Arena
        ? interpolate(frame, [585, 890], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : interpolate(frame, [1185, 1275], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      verdict: isRound1Arena ? r1Ui : r2Ui,
      taskText: 'Responsive viewports (1440px & 375px) · Tokens',
      evidenceLines: isRound1Arena
        ? [
            '✓ Desktop 1440×900 button alignment verified',
            '✗ Mobile 375×812: .oauth-btn:focus-visible missing ring',
            '→ Requires 2px solid var(--active) focus outline',
          ]
        : [
            '✓ Desktop 1440×900 layout & spacing verified',
            '✓ Mobile 375×812 :focus-visible ring (#8be9fd) verified',
            '✓ Zero layout shift across breakpoints',
          ],
      findingNote: isRound1Arena && frame >= 890 ? 'Missing :focus-visible ring at 375px' : undefined,
    },
    {
      id: 'reviewer-code',
      short: 'code',
      title: 'Code Lens',
      color: '#50fa7b',
      progress: isRound1Arena
        ? interpolate(frame, [595, 845], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : interpolate(frame, [1190, 1295], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      verdict: isRound1Arena ? r1Code : r2Code,
      taskText: 'Idioms · Cyclomatic complexity · Test suite',
      evidenceLines: [
        '✓ Pure WebCrypto SHA-256 base64url helper',
        '✓ Max function complexity: 4 (threshold <= 10)',
        '✓ 52/52 vitest assertions passing',
      ],
    },
  ];

  // Drawer open during Act 5 (frames 1465..1610)
  const drawerOpen = frame >= 1465 && frame < 1615;
  const drawerProgress =
    frame < 1540
      ? interpolate(frame, [1465, 1495], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : interpolate(frame, [1590, 1615], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return {
    act,
    actTitle,
    actSubtitle,
    pipelineStep,
    jobs,
    logs: ALL_LOGS.filter((l) => l.frame <= frame),
    reviewArena: {
      visible: isRound1Arena || isRound2Arena,
      round: arenaRound,
      lanes,
    },
    reworkBanner: {
      visible: frame >= 990 && frame < 1165,
      progress: interpolate(frame, [990, 1150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    },
    drawer: {
      open: drawerOpen,
      openProgress: drawerProgress,
      selectedFile: 'decision.md',
    },
  };
}
