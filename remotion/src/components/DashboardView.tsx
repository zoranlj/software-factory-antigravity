import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { TERMINAL_LOGS } from '../data';
import {
  AGENT_COLORS,
  calcCost,
  formatCost,
  formatNum,
  JobCardData,
  ReviewRound,
  STAGES,
  THEME,
  Verdict,
} from '../theme';
import { CursorOverlay, CursorWaypoint } from './CursorOverlay';
import { DrawerModal } from './DrawerModal';

const REVIEW_COLS: Array<[keyof ReviewRound['verdicts'], string]> = [
  ['security', 'sec'],
  ['ux', 'ux'],
  ['ui', 'ui'],
  ['code', 'code'],
];

const COMMAND_ITEMS = [
  '/factory <feature>',
  '/factory next',
  '/factory approve <job-id>',
  '/factory rework <job-id> <note>',
];

const CONSOLE_TABS = [
  { id: 'all', label: 'All Active Logs' },
  { id: 'spec-writer', label: '001 · spec-writer' },
  { id: 'builder', label: '001 · builder' },
  { id: 'reviewer-ui', label: '001 · reviewer-ui' },
  { id: 'approver', label: '001 · approver' },
];

export const DashboardView: React.FC = () => {
  const frame = useCurrentFrame(); // Global frame in composition (Dashboard is visible 260..2200)
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [255, 285], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [2170, 2200], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---- Dynamic Hero Job State ("001-token-usage-refactor") ----
  const heroSpawned = frame >= 315;
  let heroStage: JobCardData['stage'] = 'spec';
  let heroActiveAgents: string[] = ['spec-writer'];
  let heroPromptTok = 11200;
  let heroCompTok = 1450;
  let heroRounds: ReviewRound[] = [];

  if (frame < 520) {
    // Stage 1: Spec
    heroStage = 'spec';
    heroActiveAgents = ['spec-writer'];
    const p = interpolate(frame, [315, 500], [0.15, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    heroPromptTok = Math.round(11200 * p);
    heroCompTok = Math.round(1450 * p);
  } else if (frame < 875) {
    // Stage 2: Build (isolated git worktree + browser_subagent)
    heroStage = 'build';
    heroActiveAgents = ['builder'];
    const p = interpolate(frame, [520, 840], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    heroPromptTok = Math.round(11200 + 22100 * p);
    heroCompTok = Math.round(1450 + 3250 * p);
  } else if (frame < 1185) {
    // Stage 3a: Review Round 1 (sec, ux, code PASS; ui CHANGES)
    heroStage = 'review';
    heroActiveAgents =
      frame < 1085
        ? ['reviewer-security', 'reviewer-ux', 'reviewer-ui', 'reviewer-code']
        : [];
    heroPromptTok = 49850;
    heroCompTok = 6610;
    heroRounds = [
      {
        round: 1,
        waiting: frame < 1085,
        verdicts: {
          security: frame >= 990 ? 'PASS' : 'pending',
          ux: frame >= 1030 ? 'PASS' : 'pending',
          ui: frame >= 1075 ? 'CHANGES' : 'pending',
          code: frame >= 940 ? 'PASS' : 'pending',
        },
      },
    ];
  } else if (frame < 1275) {
    // Stage 3b: Autonomous Rework in Build (Round 2 builder fix)
    heroStage = 'build';
    heroActiveAgents = ['builder'];
    heroPromptTok = 52100;
    heroCompTok = 7120;
    heroRounds = [
      {
        round: 1,
        verdicts: { security: 'PASS', ux: 'PASS', ui: 'CHANGES', code: 'PASS' },
      },
    ];
  } else if (frame < 1455) {
    // Stage 3c: Review Round 2 (all 4 PASS)
    heroStage = 'review';
    heroActiveAgents = frame < 1350 ? ['reviewer-ui', 'reviewer-code'] : [];
    heroPromptTok = 53200;
    heroCompTok = 7480;
    heroRounds = [
      {
        round: 1,
        verdicts: { security: 'PASS', ux: 'PASS', ui: 'CHANGES', code: 'PASS' },
      },
      {
        round: 2,
        waiting: frame < 1345,
        verdicts: {
          security: 'PASS',
          ux: 'PASS',
          ui: frame >= 1295 ? 'PASS' : 'pending',
          code: frame >= 1340 ? 'PASS' : 'pending',
        },
      },
    ];
  } else if (frame < 1940) {
    // Stage 4: Approve (approver audits & writes decision.md)
    heroStage = 'approve';
    heroActiveAgents = frame < 1510 ? ['approver'] : [];
    heroPromptTok = 54150;
    heroCompTok = 7730;
    heroRounds = [
      {
        round: 1,
        verdicts: { security: 'PASS', ux: 'PASS', ui: 'CHANGES', code: 'PASS' },
      },
      {
        round: 2,
        verdicts: { security: 'PASS', ux: 'PASS', ui: 'PASS', code: 'PASS' },
      },
    ];
  } else {
    // Stage 5: Cleanly Merged to main
    heroStage = 'merged';
    heroActiveAgents = [];
    heroPromptTok = 54150;
    heroCompTok = 7730;
    heroRounds = [
      {
        round: 1,
        verdicts: { security: 'PASS', ux: 'PASS', ui: 'CHANGES', code: 'PASS' },
      },
      {
        round: 2,
        verdicts: { security: 'PASS', ux: 'PASS', ui: 'PASS', code: 'PASS' },
      },
    ];
  }

  // Secondary Needs-Human job ("003-webhook-retry-queue") gets approved at frame 2085
  const webhookMerged = frame >= 2085;

  const jobs: JobCardData[] = [
    ...(heroSpawned
      ? [
          {
            id: '001-token-usage-refactor',
            feature: 'Issue #1: Token usage refactor',
            branch: 'factory/001-token-usage-refactor',
            stage: heroStage,
            activeAgents: heroActiveAgents,
            tokensTotal: heroPromptTok + heroCompTok,
            promptTokens: heroPromptTok,
            completionTokens: heroCompTok,
            rounds: heroRounds,
            highlightRing: true,
          },
        ]
      : []),
    {
      id: '005-dark-mode-contrast',
      feature: 'Issue #31: WCAG AAA contrast tokens for telemetry charts',
      branch: 'factory/005-dark-mode-contrast',
      stage: frame < 1420 ? 'review' : 'merged',
      activeAgents: frame < 1420 ? ['reviewer-ui'] : [],
      tokensTotal: 49700,
      promptTokens: 42800,
      completionTokens: 6900,
      rounds: [
        {
          round: 1,
          verdicts: {
            security: 'PASS',
            ux: 'PASS',
            ui: frame < 1400 ? 'pending' : 'PASS',
            code: 'PASS',
          },
        },
      ],
    },
    {
      id: '003-webhook-retry-queue',
      feature: 'Issue #19: Exponential backoff webhook dispatcher',
      branch: 'factory/003-webhook-retry-queue',
      stage: webhookMerged ? 'merged' : 'needs-human',
      activeAgents: [],
      tokensTotal: 131000,
      promptTokens: 112400,
      completionTokens: 18600,
      rounds: [
        {
          round: 1,
          verdicts: { security: 'CHANGES', ux: 'PASS', ui: 'PASS', code: 'CHANGES' },
        },
        {
          round: 2,
          verdicts: { security: 'CHANGES', ux: 'PASS', ui: 'PASS', code: 'PASS' },
        },
        {
          round: 3,
          verdicts: { security: 'CHANGES', ux: 'PASS', ui: 'PASS', code: 'PASS' },
        },
      ],
      hint: webhookMerged
        ? undefined
        : ['/factory approve 003-webhook-retry-queue', '/factory rework 003-webhook-retry-queue <note>'],
    },
    {
      id: '002-rate-limit-middleware',
      feature: 'Issue #14: Redis sliding-window rate limiter',
      branch: 'factory/002-rate-limit-middleware',
      stage: 'merged',
      activeAgents: [],
      tokensTotal: 70600,
      promptTokens: 61400,
      completionTokens: 9200,
      rounds: [
        {
          round: 1,
          verdicts: { security: 'PASS', ux: 'PASS', ui: 'PASS', code: 'PASS' },
        },
      ],
    },
  ];

  // Aggregate Header Metrics
  const totalPrompt = jobs.reduce((acc, j) => acc + j.promptTokens, 0);
  const totalComp = jobs.reduce((acc, j) => acc + j.completionTokens, 0);
  const totalTok = totalPrompt + totalComp;
  const totalUsd = calcCost(totalPrompt, totalComp);
  const activeAgentCount = jobs.reduce((acc, j) => acc + j.activeAgents.length, 0);

  // Command pill copied flash states
  const cmd0Copied = frame >= 300 && frame <= 385;
  const cmd2Copied = frame >= 2060 && frame <= 2150;

  // Console Tab Selection (switches to reviewer-ui during Round 1 UI inspection)
  const selectedConsoleTab =
    frame >= 1100 && frame <= 1185 ? 'reviewer-ui' : 'all';

  // Drawer Open State (frames 1560 to 1915)
  const drawerEnter = spring({
    frame: frame - 1560,
    fps,
    config: { damping: 20, stiffness: 120 },
  });
  const drawerExit = spring({
    frame: frame - 1900,
    fps,
    config: { damping: 20, stiffness: 130 },
  });
  const drawerProgress = Math.max(0, Math.min(1, drawerEnter - drawerExit));
  const selectedDrawerFile: 'spec.md' | 'decision.md' =
    frame >= 1755 ? 'decision.md' : 'spec.md';

  // Visible Terminal Logs
  const visibleLogs = TERMINAL_LOGS.filter((l) => {
    if (frame < l.appearFrame) return false;
    if (selectedConsoleTab === 'all') return true;
    return l.agent === selectedConsoleTab;
  }).slice(-7);

  // Cursor Waypoints across the walkthrough
  const waypoints: CursorWaypoint[] = [
    { frame: 270, x: 960, y: 460 },
    // Click "/factory <feature>" pill in header
    { frame: 300, x: 95, y: 66, click: true },
    // Hover over newly spawned "001-token-usage-refactor" card in Spec column
    { frame: 380, x: 170, y: 240 },
    // Follow card to Build column
    { frame: 555, x: 480, y: 240 },
    // Follow card to Review column
    { frame: 910, x: 780, y: 265 },
    // Click "001 · reviewer-ui" tab in Live Agent Console Dock when R1 UI flags CHANGES
    { frame: 1100, x: 645, y: 838, click: true },
    // Click back to "All Active Logs" tab
    { frame: 1185, x: 335, y: 838, click: true },
    // Watch R2 all PASS on Review column
    { frame: 1330, x: 780, y: 295 },
    // Follow card to Approve column and click to open Drawer
    { frame: 1555, x: 1090, y: 245, click: true },
    // Point at Token & Cost Breakdown widget inside Drawer
    { frame: 1650, x: 1470, y: 215 },
    // Click "decision.md" in Drawer left file tree
    { frame: 1755, x: 1045, y: 208, click: true },
    // Click Close button (×) on Drawer
    { frame: 1900, x: 1895, y: 32, click: true },
    // Highlight Needs-Human card ("003-webhook-retry-queue") in column 6
    { frame: 1995, x: 1730, y: 290 },
    // Click "/factory approve <job-id>" command pill in header to merge Needs-Human job
    { frame: 2060, x: 345, y: 66, click: true },
    // Rest over Merged column showing completed jobs
    { frame: 2135, x: 1410, y: 260 },
  ];

  // Contextual Founder Walkthrough Caption
  let caption: {
    step: string;
    title: string;
    detail: string;
    accentColor?: string;
  } | null = null;

  if (frame >= 285 && frame < 520) {
    caption = {
      step: 'Step 1 · Autonomous Spec Formulation',
      title: 'Trigger /factory — spec-writer drafts spec.md',
      detail:
        'Reads AGENTS.md ground truth and formulates numbered requirements and testable acceptance criteria.',
      accentColor: AGENT_COLORS['spec-writer'],
    };
  } else if (frame >= 520 && frame < 875) {
    caption = {
      step: 'Step 2 · Isolated Git Worktree & Browser Check',
      title: 'builder codes on factory/001-token-usage-refactor',
      detail:
        'Implements the feature in an isolated git worktree, runs ./tests/factory-verify.sh, and verifies UI via browser_subagent.',
      accentColor: THEME.active,
    };
  } else if (frame >= 875 && frame < 1275) {
    caption = {
      step: 'Step 3 · 4-Lens Parallel Review & Live Console',
      title: 'Round 1 catches a UI wrapping issue -> Auto-Rework',
      detail:
        'Security, UX, UI, and Code reviewers audit in parallel. reviewer-ui flags CHANGES, automatically resuming builder.',
      accentColor: THEME.changes,
    };
  } else if (frame >= 1275 && frame < 1555) {
    caption = {
      step: 'Step 4 · Round 2 All-PASS Verification',
      title: 'All 4 review lenses pass (4/4) -> Advancing to Approver',
      detail:
        'Round 2 verifies the CSS fix with zero regressions across Security, UX, UI, and Code.',
      accentColor: THEME.pass,
    };
  } else if (frame >= 1555 && frame < 1920) {
    caption = {
      step: 'Step 5 · Interactive File & Token/Cost Drawer',
      title: 'Granular Per-Agent Tokens, Model Badges & USD Cost',
      detail:
        'Inspect spec.md, review verdicts, and decision.md alongside input/output token counts ($0.07 total).',
      accentColor: THEME.tok,
    };
  } else if (frame >= 1920 && frame < 2175) {
    caption = {
      step: 'Step 6 · Clean Auto-Merge & Human-in-the-Loop Escalation',
      title: 'Auto-merged to main — or resolve Needs Human in 1 click',
      detail:
        'Approved jobs merge cleanly to main, while 3-round escalations pause safely at Needs human for /factory approve.',
      accentColor: THEME.human,
    };
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        color: THEME.text,
        fontFamily: THEME.fontSans,
        fontSize: 14,
        lineHeight: 1.5,
        opacity: enterOpacity * exitOpacity,
      }}
    >
      {/* Top Header matching factory/dashboard.html */}
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '18px 32px 14px',
          borderBottom: `1px solid ${THEME.line}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              Software factory
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Token & USD Cost Chip */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: THEME.fontMono,
                  fontSize: 11.5,
                  padding: '4px 10px',
                  backgroundColor: THEME.panel,
                  border: `1px solid rgba(241, 250, 140, 0.35)`,
                  borderRadius: 6,
                  color: THEME.text,
                }}
              >
                <span>🪙</span>
                <span>
                  Tokens: <strong style={{ color: THEME.tok }}>{formatNum(totalTok)}</strong>
                </span>
                <span style={{ color: THEME.faint, fontSize: 10.5 }}>
                  (in: {formatNum(totalPrompt)} · out: {formatNum(totalComp)})
                </span>
                <span style={{ opacity: 0.4, margin: '0 2px' }}>·</span>
                <span style={{ color: THEME.faint, fontSize: 10.5 }}>
                  Cost: <strong style={{ color: THEME.pass }}>{formatCost(totalUsd)}</strong>
                </span>
              </div>

              {/* Active Agents Chip */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: THEME.fontMono,
                  fontSize: 11.5,
                  padding: '4px 10px',
                  backgroundColor: THEME.panel,
                  border: `1px solid ${
                    activeAgentCount > 0 ? 'rgba(139, 233, 253, 0.35)' : THEME.line
                  }`,
                  borderRadius: 6,
                  color: activeAgentCount > 0 ? THEME.active : THEME.muted,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: activeAgentCount > 0 ? THEME.active : THEME.faint,
                    boxShadow: activeAgentCount > 0 ? `0 0 8px ${THEME.active}` : 'none',
                  }}
                />
                <span>
                  {activeAgentCount} {activeAgentCount === 1 ? 'agent' : 'agents'} active
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 12,
              color: THEME.muted,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: THEME.pass,
              }}
            />
            <span>live · polling 2s</span>
          </div>
        </div>

        {/* Header Command Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: THEME.fontMono,
            fontSize: 11,
          }}
        >
          {COMMAND_ITEMS.map((cmd, idx) => {
            const isCopied = (idx === 0 && cmd0Copied) || (idx === 2 && cmd2Copied);
            return (
              <span
                key={cmd}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: isCopied ? 'rgba(80, 250, 123, 0.14)' : THEME.panel,
                  border: `1px solid ${isCopied ? THEME.pass : THEME.line}`,
                  borderRadius: 6,
                  padding: '3px 9px',
                  color: isCopied ? THEME.pass : THEME.muted,
                }}
              >
                <code>{isCopied ? `✓ Copied: ${cmd}` : cmd}</code>
              </span>
            );
          })}
        </div>
      </header>

      {/* 6-Column Kanban Board */}
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gap: 12,
          padding: '18px 32px 32px',
          alignItems: 'start',
        }}
      >
        {STAGES.map((stage, colIdx) => {
          const colJobs = jobs.filter((j) => j.stage === stage.key);
          const isHumanCol = stage.key === 'needs-human';
          const isMergedCol = stage.key === 'merged';

          return (
            <div key={stage.key} style={{ minWidth: 0 }}>
              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0 2px 10px',
                  borderBottom: `1px solid ${
                    isHumanCol ? 'rgba(255, 121, 198, 0.55)' : THEME.line
                  }`,
                  marginBottom: 12,
                  position: 'relative',
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isHumanCol
                      ? THEME.human
                      : isMergedCol
                      ? THEME.merged
                      : THEME.text,
                  }}
                >
                  {stage.label}
                </h2>
                <span
                  style={{
                    fontSize: 11,
                    color: THEME.faint,
                    fontFamily: THEME.fontMono,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {stage.who}
                </span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontFamily: THEME.fontMono,
                    fontSize: 11,
                    color: THEME.muted,
                  }}
                >
                  {colJobs.length}
                </span>
                {colIdx < 4 && (
                  <span
                    style={{
                      position: 'absolute',
                      right: -10,
                      top: -2,
                      color: THEME.faint,
                      fontSize: 16,
                    }}
                  >
                    ›
                  </span>
                )}
              </div>

              {/* Column Cards */}
              {colJobs.length === 0 ? (
                <div style={{ color: THEME.faint, fontSize: 12, padding: '4px 2px' }}>—</div>
              ) : (
                colJobs.map((job) => {
                  const isLive = ['spec', 'build', 'review', 'approve'].includes(job.stage);
                  const isHuman = job.stage === 'needs-human';
                  const isMerged = job.stage === 'merged';
                  const jobCost = calcCost(job.promptTokens, job.completionTokens);
                  const pulseOpacity =
                    0.35 + 0.65 * Math.abs(Math.sin((frame / 30) * Math.PI));

                  return (
                    <div
                      key={job.id}
                      style={{
                        backgroundColor: THEME.card,
                        border: `1px solid ${
                          isHuman
                            ? THEME.human
                            : isLive
                            ? 'rgba(139, 233, 253, 0.42)'
                            : THEME.line
                        }`,
                        borderRadius: 10,
                        padding: '12px 12px 10px',
                        marginBottom: 10,
                        opacity: isMerged ? 0.85 : 1,
                        boxShadow: isHuman
                          ? '0 0 0 1px rgba(255, 121, 198, 0.4), 0 8px 24px -12px rgba(255, 121, 198, 0.6)'
                          : job.highlightRing && isLive
                          ? '0 6px 20px rgba(0, 0, 0, 0.35)'
                          : 'none',
                      }}
                    >
                      {/* Card Top */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          marginBottom: 4,
                        }}
                      >
                        {isLive && (
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              backgroundColor: THEME.active,
                              opacity: pulseOpacity,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontFamily: THEME.fontMono,
                            fontSize: 11.5,
                            color: THEME.muted,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {job.id}
                        </span>
                        {isHuman && (
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontSize: 9.5,
                              fontWeight: 600,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              color: THEME.human,
                            }}
                          >
                            NEEDS HUMAN
                          </span>
                        )}
                      </div>

                      {/* Feature Title */}
                      <div
                        style={{
                          fontSize: 13,
                          lineHeight: 1.38,
                          margin: '0 0 6px',
                          fontWeight: 500,
                          color: THEME.text,
                        }}
                      >
                        {job.feature}
                      </div>

                      {/* Branch & Token/Cost Badge */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 6,
                          marginTop: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: THEME.fontMono,
                            fontSize: 10.5,
                            color: THEME.faint,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {job.branch}
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontFamily: THEME.fontMono,
                            fontSize: 10,
                            color: THEME.tok,
                            backgroundColor: 'rgba(241, 250, 140, 0.12)',
                            padding: '1px 6px',
                            borderRadius: 4,
                            flexShrink: 0,
                          }}
                        >
                          🪙 {formatNum(job.tokensTotal)} ·{' '}
                          <strong style={{ color: THEME.pass }}>{formatCost(jobCost)}</strong>
                        </span>
                      </div>

                      {/* Active Agent Pills */}
                      {job.activeAgents.length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 4,
                            marginTop: 8,
                          }}
                        >
                          {job.activeAgents.map((ag) => (
                            <span
                              key={ag}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontFamily: THEME.fontMono,
                                fontSize: 10,
                                color: THEME.active,
                                backgroundColor: 'rgba(139, 233, 253, 0.12)',
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              <span
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: '50%',
                                  backgroundColor: THEME.active,
                                  opacity: pulseOpacity,
                                }}
                              />
                              {ag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Review Rounds Chips */}
                      {job.rounds.length > 0 && (
                        <div style={{ marginTop: 10, display: 'grid', gap: 5 }}>
                          {job.rounds.map((r) => (
                            <div
                              key={r.round}
                              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                              <span
                                style={{
                                  fontFamily: THEME.fontMono,
                                  fontSize: 10,
                                  color: THEME.faint,
                                  width: 20,
                                }}
                              >
                                r{r.round}
                              </span>
                              {REVIEW_COLS.map(([k, short]) => {
                                const v: Verdict = r.verdicts[k];
                                const isPass = v === 'PASS';
                                const isChanges = v === 'CHANGES';
                                return (
                                  <span
                                    key={k}
                                    style={{
                                      flex: 1,
                                      textAlign: 'center',
                                      fontFamily: THEME.fontMono,
                                      fontSize: 10,
                                      padding: '2px 0',
                                      borderRadius: 4,
                                      border:
                                        isPass || isChanges
                                          ? '1px solid transparent'
                                          : `1px dashed ${THEME.faint}`,
                                      color: isPass
                                        ? THEME.pass
                                        : isChanges
                                        ? THEME.changes
                                        : THEME.faint,
                                      backgroundColor: isPass
                                        ? 'rgba(80, 250, 123, 0.14)'
                                        : isChanges
                                        ? 'rgba(255, 184, 108, 0.16)'
                                        : 'transparent',
                                    }}
                                  >
                                    {short}
                                  </span>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Needs-Human Action Hints */}
                      {job.hint && (
                        <div
                          style={{
                            marginTop: 10,
                            paddingTop: 8,
                            borderTop: `1px solid ${THEME.line}`,
                            fontFamily: THEME.fontMono,
                            fontSize: 10,
                            color: THEME.muted,
                            lineHeight: 1.55,
                          }}
                        >
                          {job.hint.map((h) => (
                            <div key={h}>{h}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </main>

      {/* Persistent Live Agent Console Dock */}
      <aside
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: THEME.terminalBg,
          borderTop: `1px solid ${THEME.line}`,
          display: 'flex',
          flexDirection: 'column',
          height: 260,
          boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Dock Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '6px 16px',
            backgroundColor: THEME.panel,
            borderBottom: `1px solid ${THEME.terminalLine}`,
            minHeight: 38,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                color: THEME.text,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: activeAgentCount > 0 ? THEME.pass : THEME.faint,
                  boxShadow: activeAgentCount > 0 ? `0 0 8px ${THEME.pass}` : 'none',
                }}
              />
              Live Agent Output
            </span>
            <span
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 11,
                padding: '1px 7px',
                borderRadius: 4,
                color: activeAgentCount > 0 ? THEME.active : THEME.muted,
                backgroundColor:
                  activeAgentCount > 0 ? 'rgba(139, 233, 253, 0.15)' : THEME.card,
              }}
            >
              {activeAgentCount > 0 ? `Streaming (${activeAgentCount} active)` : 'Idle · Ready'}
            </span>
          </div>

          {/* Agent Console Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {CONSOLE_TABS.map((t) => {
              const isTabActive = selectedConsoleTab === t.id;
              return (
                <div
                  key={t.id}
                  style={{
                    fontFamily: THEME.fontMono,
                    fontSize: 11.5,
                    padding: '3px 9px',
                    borderRadius: 5,
                    backgroundColor: isTabActive ? THEME.cardHover : 'transparent',
                    border: `1px solid ${isTabActive ? THEME.line : 'transparent'}`,
                    color: isTabActive ? THEME.text : THEME.muted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: AGENT_COLORS[t.id] || THEME.pass,
                    }}
                  />
                  {t.label}
                </div>
              );
            })}
          </div>

          {/* Dock Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 11,
                color: THEME.muted,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              ☑ Auto-scroll
            </span>
            <span
              style={{
                border: `1px solid ${THEME.line}`,
                borderRadius: 5,
                padding: '2px 7px',
                fontFamily: THEME.fontMono,
                fontSize: 11,
                color: THEME.muted,
              }}
            >
              ▲
            </span>
            <span
              style={{
                border: `1px solid ${THEME.line}`,
                borderRadius: 5,
                padding: '2px 7px',
                fontFamily: THEME.fontMono,
                fontSize: 11,
                color: THEME.muted,
              }}
            >
              ⛶
            </span>
          </div>
        </div>

        {/* Terminal Stream */}
        <div
          style={{
            flex: 1,
            padding: '12px 18px',
            fontFamily: THEME.fontMono,
            fontSize: 12,
            lineHeight: 1.65,
            color: '#d6deeb',
            backgroundColor: THEME.terminalBg,
            overflow: 'hidden',
          }}
        >
          {visibleLogs.map((log, i) => {
            const tagColor = AGENT_COLORS[log.agent] || THEME.active;
            const textColor =
              log.tone === 'pass'
                ? THEME.pass
                : log.tone === 'warn'
                ? THEME.changes
                : log.tone === 'err'
                ? THEME.human
                : log.tone === 'tok'
                ? THEME.tok
                : log.tone === 'agent'
                ? THEME.active
                : '#d6deeb';

            return (
              <div key={`${log.time}-${i}`} style={{ marginBottom: 2 }}>
                <span style={{ color: THEME.faint, marginRight: 8 }}>{log.time}</span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0 5px',
                    borderRadius: 3,
                    fontSize: 11,
                    marginRight: 8,
                    color: tagColor,
                    backgroundColor: `${tagColor}24`,
                  }}
                >
                  [{log.agent}]
                </span>
                <span
                  style={{
                    color: textColor,
                    fontWeight: log.tone === 'agent' || log.tone === 'warn' ? 600 : 400,
                  }}
                >
                  {log.text}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Slide-out Job Details & Token Drawer */}
      <DrawerModal openProgress={drawerProgress} selectedFile={selectedDrawerFile} />

      {/* Smooth Cursor + Founder Walkthrough Caption */}
      <CursorOverlay waypoints={waypoints} caption={caption} />
    </AbsoluteFill>
  );
};

