import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { HERO_AGENT_BREAKDOWN } from '../data';
import { AGENT_COLORS, calcCost, formatCost, formatNum, THEME } from '../theme';

interface DrawerModalProps {
  openProgress: number; // 0 to 1
  selectedFile: 'spec.md' | 'decision.md';
}

const FILES_LIST = [
  { group: 'Artifacts', items: [
    { name: 'spec.md', status: 'good' },
    { name: 'build.md', status: 'good' },
    { name: 'decision.md', status: 'good' },
  ]},
  { group: 'Round 2 (PASS)', items: [
    { name: 'r2/review-security.md', status: 'good' },
    { name: 'r2/review-ux.md', status: 'good' },
    { name: 'r2/review-ui.md', status: 'good' },
    { name: 'r2/review-code.md', status: 'good' },
  ]},
  { group: 'Round 1 (CHANGES)', items: [
    { name: 'r1/review-security.md', status: 'good' },
    { name: 'r1/review-ux.md', status: 'good' },
    { name: 'r1/review-ui.md', status: 'warn' },
    { name: 'r1/review-code.md', status: 'good' },
  ]},
  { group: 'Agent Logs', items: [
    { name: 'logs/combined.log', status: 'log' },
    { name: 'logs/builder.log', status: 'log' },
  ]},
] as const;

export const DrawerModal: React.FC<DrawerModalProps> = ({ openProgress, selectedFile }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (openProgress <= 0.001) return null;

  const translateX = interpolate(openProgress, [0, 1], [980, 0]);
  const scrimOpacity = interpolate(openProgress, [0, 1], [0, 0.62]);

  const totalTokens = 61880;
  const totalCost = calcCost(54150, 7730);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, pointerEvents: 'none' }}>
      {/* Scrim */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 6, 10, 0.85)',
          opacity: scrimOpacity,
        }}
      />

      {/* Right-hand 960px drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 960,
          backgroundColor: THEME.panel,
          borderLeft: `1px solid ${THEME.line}`,
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          transform: `translateX(${translateX}px)`,
          boxShadow: '-16px 0 48px rgba(0, 0, 0, 0.55)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '18px 24px 14px',
            borderBottom: `1px solid ${THEME.line}`,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontFamily: THEME.fontMono, fontSize: 13, color: THEME.muted }}>
              001-token-usage-refactor
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontFamily: THEME.fontMono,
                fontSize: 11.5,
                color: THEME.tok,
                backgroundColor: 'rgba(241, 250, 140, 0.12)',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              🪙 61.9k tokens (in: 54.2k · out: 7.7k) ·{' '}
              <strong style={{ color: THEME.pass }}>{formatCost(totalCost)}</strong>
            </span>
          </div>
          <h3
            style={{
              margin: '2px 40px 6px 0',
              fontSize: 18,
              fontWeight: 600,
              color: THEME.text,
            }}
          >
            Issue #1: Token usage refactor
          </h3>
          <div style={{ fontFamily: THEME.fontMono, fontSize: 12, color: THEME.faint }}>
            branch: factory/001-token-usage-refactor · worktree: factory/worktrees/001-token-usage-refactor
          </div>
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 8,
              border: `1px solid ${THEME.line}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: THEME.muted,
              fontSize: 18,
            }}
          >
            ×
          </div>
        </div>

        {/* Drawer Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '225px 1fr', minHeight: 0 }}>
          {/* Left File Navigation */}
          <nav
            style={{
              borderRight: `1px solid ${THEME.line}`,
              padding: '14px 10px',
              overflowY: 'hidden',
            }}
          >
            {FILES_LIST.map((grp, gi) => (
              <div key={grp.group}>
                <div
                  style={{
                    fontSize: 10.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: THEME.faint,
                    margin: gi === 0 ? '0 8px 6px' : '14px 8px 6px',
                  }}
                >
                  {grp.group}
                </div>
                {grp.items.map((item) => {
                  const isSelected = item.name === selectedFile;
                  const dotColor =
                    item.status === 'good'
                      ? THEME.pass
                      : item.status === 'warn'
                      ? THEME.changes
                      : THEME.tok;
                  return (
                    <div
                      key={item.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 8px',
                        borderRadius: 6,
                        fontFamily: THEME.fontMono,
                        fontSize: 12,
                        backgroundColor: isSelected ? THEME.cardHover : 'transparent',
                        color: isSelected ? THEME.text : THEME.muted,
                        border: isSelected ? `1px solid ${THEME.active}55` : '1px solid transparent',
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: dotColor,
                          flexShrink: 0,
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Right Document & Token Breakdown */}
          <article style={{ padding: '20px 28px', overflowY: 'hidden' }}>
            {/* Token Usage Breakdown Widget (#d-tok-widget) */}
            <div
              style={{
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.line}`,
                borderRadius: 8,
                padding: '14px 16px',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: THEME.muted,
                  }}
                >
                  Token & Cost Breakdown by Agent
                </h4>
                <div style={{ fontFamily: THEME.fontMono, fontSize: 14, fontWeight: 600, color: THEME.tok }}>
                  61.9k total <span style={{ opacity: 0.4, margin: '0 4px' }}>·</span>
                  <span style={{ color: THEME.pass }}>{formatCost(totalCost)}</span>
                </div>
              </div>

              {/* Segmented Horizontal Bar */}
              <div
                style={{
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: THEME.line,
                  display: 'flex',
                  overflow: 'hidden',
                  marginBottom: 12,
                }}
              >
                {HERO_AGENT_BREAKDOWN.map((stat) => {
                  const pct = (stat.total / totalTokens) * 100;
                  return (
                    <div
                      key={stat.agent}
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: AGENT_COLORS[stat.agent] || THEME.active,
                      }}
                    />
                  );
                })}
              </div>

              {/* Agent Legend Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '7px 18px',
                  fontFamily: THEME.fontMono,
                  fontSize: 11,
                  color: THEME.muted,
                }}
              >
                {HERO_AGENT_BREAKDOWN.map((stat) => {
                  const agentCost = calcCost(stat.prompt, stat.completion);
                  return (
                    <div
                      key={stat.agent}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        padding: '2px 0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 2,
                            backgroundColor: AGENT_COLORS[stat.agent] || THEME.active,
                          }}
                        />
                        <span style={{ color: THEME.text }}>{stat.agent}</span>
                        <span
                          style={{
                            fontSize: 9.5,
                            padding: '1px 5px',
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: `1px solid ${THEME.line}`,
                            color: THEME.active,
                          }}
                        >
                          {stat.model}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                        <strong style={{ color: THEME.text }}>{formatNum(stat.total)}</strong>
                        <span style={{ fontSize: 10, color: THEME.muted }}>
                          (in:{formatNum(stat.prompt)} · out:{formatNum(stat.completion)})
                        </span>
                        <span style={{ fontSize: 10, color: THEME.pass, fontWeight: 600 }}>
                          {formatCost(agentCost)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rendered Markdown Content */}
            {selectedFile === 'spec.md' ? (
              <div style={{ lineHeight: 1.6, fontSize: 13.5, color: THEME.text }}>
                <h1 style={{ fontSize: 19, margin: '0 0 8px' }}># Token Usage Breakdown Refactor</h1>
                <blockquote
                  style={{
                    margin: '0 0 12px',
                    borderLeft: `2px solid ${THEME.line}`,
                    paddingLeft: 12,
                    color: THEME.muted,
                  }}
                >
                  Feature: Issue #1: Token usage refactor
                </blockquote>
                <h2 style={{ fontSize: 14.5, margin: '12px 0 6px', color: THEME.active }}>
                  ## Requirements
                </h2>
                <ul style={{ margin: '0 0 12px', paddingLeft: 18 }}>
                  <li style={{ marginBottom: 4 }}>
                    <strong>1. Granular Token Metrics</strong>: Display prompt (input) and completion (output) counts per agent in{' '}
                    <code style={{ backgroundColor: THEME.card, padding: '1px 5px', borderRadius: 4, fontFamily: THEME.fontMono, fontSize: 12 }}>
                      #d-tok-widget
                    </code>.
                  </li>
                  <li style={{ marginBottom: 4 }}>
                    <strong>2. Model Tag Display</strong>: Render{' '}
                    <code style={{ backgroundColor: THEME.card, padding: '1px 5px', borderRadius: 4, fontFamily: THEME.fontMono, fontSize: 12 }}>
                      .tok-model
                    </code>{' '}
                    badge next to each agent persona.
                  </li>
                  <li style={{ marginBottom: 4 }}>
                    <strong>3. USD Cost Estimation</strong>: Compute real-time input/output token cost in header and drawer.
                  </li>
                </ul>
                <h2 style={{ fontSize: 14.5, margin: '12px 0 6px', color: THEME.pass }}>
                  ## Acceptance Criteria (Verified)
                </h2>
                <div style={{ fontFamily: THEME.fontMono, fontSize: 12, color: THEME.text }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ color: THEME.pass }}>☑</span> 1. tests/factory-verify.sh passes 100% of assertions (39/39)
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ color: THEME.pass }}>☑</span> 2. Renders (in: &lt;in&gt; · out: &lt;out&gt;) and .tok-model badge cleanly
                  </div>
                  <div>
                    <span style={{ color: THEME.pass }}>☑</span> 3. Visual UI layout verified via browser_subagent
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ lineHeight: 1.65, fontSize: 14, color: THEME.text }}>
                <div
                  style={{
                    display: 'inline-block',
                    fontFamily: THEME.fontMono,
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: 6,
                    marginBottom: 14,
                    color: THEME.pass,
                    backgroundColor: 'rgba(80, 250, 123, 0.14)',
                    border: `1px solid ${THEME.pass}55`,
                  }}
                >
                  DECISION: APPROVE
                </div>
                <h1 style={{ fontSize: 19, margin: '0 0 10px' }}>
                  # Decision: 001-token-usage-refactor
                </h1>
                <h2 style={{ fontSize: 15, margin: '12px 0 6px', color: THEME.muted }}>
                  ## Rationale
                </h2>
                <p style={{ margin: '0 0 10px' }}>
                  All 4 review lenses (<strong>Security, Code, UI, UX</strong>) passed in Round 2 with zero blocking issues after resolving the R1 UI legend width feedback.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  All acceptance criteria defined in{' '}
                  <code style={{ backgroundColor: THEME.card, padding: '1px 5px', borderRadius: 4, fontFamily: THEME.fontMono }}>
                    spec.md
                  </code>{' '}
                  are satisfied with verified test suite evidence (<strong>39/39 tests passed</strong> in{' '}
                  <code style={{ backgroundColor: THEME.card, padding: '1px 5px', borderRadius: 4, fontFamily: THEME.fontMono }}>
                    ./tests/factory-verify.sh
                  </code>
                  ). Safe to merge cleanly to <code style={{ color: THEME.merged, fontFamily: THEME.fontMono }}>main</code>.
                </p>
              </div>
            )}
          </article>
        </div>
      </aside>
    </div>
  );
};

